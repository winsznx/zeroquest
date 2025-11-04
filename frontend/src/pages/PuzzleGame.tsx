import { useState, useEffect, useCallback } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { BaseError } from 'viem';
import { IoHeart } from 'react-icons/io5';
import PuzzleTile from '../components/PuzzleTile';
import GameOverModal from '../components/GameOverModal';
import { useHasPass } from '../hooks/useHasPass';
import { gameContractAddress, gameContractAbi } from '../config/game';

interface ClaimResult {
  rewardTokenSymbol: string;
  rewardTokenAmount: string;
}

// Generate a random puzzle pattern (numbers 1-9)
const generatePuzzle = () => {
  const puzzle = [];
  for (let i = 0; i < 16; i++) {
    puzzle.push(Math.floor(Math.random() * 9) + 1);
  }
  return puzzle;
};

// Calculate the target sum for the puzzle
const calculateTarget = (puzzle: number[]) => {
  const sum = puzzle.reduce((a, b) => a + b, 0);
  return Math.floor(sum * 0.6); // Target is 60% of total sum
};

const PuzzleGame = () => {
  const { address: walletAddress } = useAccount();
  const { hasPass, isLoading: isLoadingPass } = useHasPass();

  const [gameState, setGameState] = useState<'READY' | 'PLAYING' | 'GAME_OVER'>('READY');
  const [puzzle, setPuzzle] = useState<number[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>(Array(16).fill(false));
  const [correctness, setCorrectness] = useState<(boolean | null)[]>(Array(16).fill(null));
  const [targetSum, setTargetSum] = useState(0);
  const [currentSum, setCurrentSum] = useState(0);
  const [selectedCount, setSelectedCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claimResult, setClaimResult] = useState<ClaimResult | null>(null);

  const { data: claimTxHash, error: claimContractError, isPending: isClaiming, writeContract: claimContract } = useWriteContract();
  const { isLoading: isConfirmingClaim, isSuccess: isClaimed } = useWaitForTransactionReceipt({ hash: claimTxHash });

  const { data: playerData, refetch: refetchPlayerData } = useReadContract({
    address: gameContractAddress,
    abi: gameContractAbi,
    functionName: 'players',
    args: [walletAddress!],
    query: { enabled: !!walletAddress, staleTime: 5000 }
  });

  const { data: dailyClaimLimit } = useReadContract({
    address: gameContractAddress,
    abi: gameContractAbi,
    functionName: 'dailyClaimLimit',
  });

  const playsLeft = dailyClaimLimit !== undefined && playerData !== undefined
    ? Number(dailyClaimLimit) - Number(playerData[0])
    : 0;

  useEffect(() => {
    if (gameState === 'PLAYING') {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState]);

  const startGame = () => {
    if (playsLeft > 0) {
      const newPuzzle = generatePuzzle();
      const target = calculateTarget(newPuzzle);
      setPuzzle(newPuzzle);
      setTargetSum(target);
      setRevealed(Array(16).fill(false));
      setCorrectness(Array(16).fill(null));
      setCurrentSum(0);
      setSelectedCount(0);
      setTimeLeft(60);
      setScore(0);
      setGameState('PLAYING');
    }
  };

  const endGame = () => {
    // Calculate score based on accuracy
    const accuracy = currentSum === targetSum ? 100 : Math.max(0, 100 - Math.abs(targetSum - currentSum) * 5);
    const timeBonus = Math.floor(timeLeft * 2);
    const finalScore = Math.floor(accuracy + timeBonus);
    setScore(finalScore);
    setGameState('GAME_OVER');
  };

  const handleTileClick = (index: number) => {
    if (revealed[index] || gameState !== 'PLAYING') return;

    const newRevealed = [...revealed];
    const newCorrectness = [...correctness];
    newRevealed[index] = true;

    const newSum = currentSum + puzzle[index];
    setCurrentSum(newSum);
    setSelectedCount(selectedCount + 1);

    // Check if we've reached or exceeded the target
    if (newSum === targetSum) {
      newCorrectness[index] = true;
      setCorrectness(newCorrectness);
      setTimeout(endGame, 500);
    } else if (newSum > targetSum) {
      newCorrectness[index] = false;
      setCorrectness(newCorrectness);
      setTimeout(endGame, 500);
    } else {
      newCorrectness[index] = null;
      setCorrectness(newCorrectness);
    }

    setRevealed(newRevealed);
  };

  const handleClaim = async () => {
    if (!walletAddress) {
      setClaimError("Please connect wallet.");
      return;
    }
    if (score <= 0) {
      setClaimError("You can't claim 0 points.");
      return;
    }
    setClaimError(null);
    setClaimResult(null);

    try {
      const response = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress: walletAddress, score }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to get signature from backend.');
      }

      const { databytes, v, r, s, rewardTokenSymbol, rewardTokenAmount } = responseData;

      setClaimResult({ rewardTokenSymbol, rewardTokenAmount });

      claimContract({
        address: gameContractAddress,
        abi: gameContractAbi,
        functionName: 'claim',
        args: [databytes, v, r, s],
      });

    } catch (error) {
      setClaimError(error instanceof Error ? error.message : 'An unknown error occurred.');
    }
  };

  useEffect(() => {
    if (claimContractError) {
      setClaimError(claimContractError instanceof BaseError ? claimContractError.shortMessage : claimContractError.message);
    }
  }, [claimContractError]);

  useEffect(() => {
    if (isClaimed) {
      refetchPlayerData();
    }
  }, [isClaimed, refetchPlayerData]);

  const handleResetError = () => {
    setClaimError(null);
  };

  if (isLoadingPass) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900 text-white">
        <p className="text-2xl">Loading...</p>
      </div>
    );
  }

  if (!hasPass) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4 bg-gray-800 text-white text-center">
        <h1 className="text-4xl font-bold mb-4">No Pass Found!</h1>
        <p className="text-xl mb-8">To play the game, you need to mint a pass first.</p>
        <a href="/mint">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-10 rounded-full text-2xl transition-all">
            Go to Mint Page
          </button>
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col items-center justify-center p-4 pb-20">
      {gameState === 'READY' && (
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">🧩 Zero Quest</h1>
          <p className="text-xl mb-8">Select tiles that sum to the target!</p>

          <h2 className="text-2xl font-bold mb-4">Daily Plays Left</h2>
          <div className="flex justify-center gap-x-3 mb-8">
            {Array.from({ length: playsLeft > 0 ? playsLeft : 0 }).map((_, i) => (
              <IoHeart key={i} size={40} className="text-red-500" />
            ))}
            {playsLeft <= 0 && <p className="text-xl">None</p>}
          </div>

          <button
            onClick={startGame}
            disabled={playsLeft <= 0}
            className="bg-blue-600 text-white font-bold py-5 px-16 rounded-full text-3xl transition-all transform hover:scale-110 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-2xl"
          >
            {playsLeft > 0 ? 'START' : 'NO PLAYS LEFT'}
          </button>
          {playsLeft <= 0 && <p className="mt-4 text-lg">Come back later for more plays!</p>}
        </div>
      )}

      {gameState === 'PLAYING' && (
        <>
          <div className="w-full max-w-2xl mb-6 flex justify-between items-center">
            <div className="bg-yellow-500 text-white py-3 px-6 rounded-xl font-bold text-xl shadow-lg">
              Target: {targetSum}
            </div>
            <div className="bg-blue-500 text-white py-3 px-6 rounded-xl font-bold text-xl shadow-lg">
              Current: {currentSum}
            </div>
            <div className="bg-red-500 text-white py-3 px-6 rounded-xl font-bold text-xl shadow-lg">
              Time: {timeLeft}s
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 w-full max-w-md">
            {puzzle.map((value, index) => (
              <PuzzleTile
                key={index}
                value={value}
                isRevealed={revealed[index]}
                isCorrect={correctness[index]}
                onClick={() => handleTileClick(index)}
                disabled={revealed[index]}
              />
            ))}
          </div>
        </>
      )}

      {gameState === 'GAME_OVER' && (
        <GameOverModal
          score={score}
          onClaim={handleClaim}
          isClaiming={isClaiming}
          isConfirming={isConfirmingClaim}
          isClaimed={isClaimed}
          claimError={claimError}
          claimResult={claimResult}
          onResetError={handleResetError}
        />
      )}
    </div>
  );
};

export default PuzzleGame;
