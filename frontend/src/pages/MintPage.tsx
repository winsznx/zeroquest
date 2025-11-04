import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther } from 'viem';
import { nftContractAddress, nftAbi } from '../config/nft';

const MintPage = () => {
  const { address } = useAccount();
  const [error, setError] = useState<string | null>(null);

  const { data: mintPrice } = useReadContract({
    address: nftContractAddress,
    abi: nftAbi,
    functionName: 'mintPrice',
  });

  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleMint = async () => {
    try {
      setError(null);
      writeContract({
        address: nftContractAddress,
        abi: nftAbi,
        functionName: 'mint',
        value: mintPrice || parseEther('0.00003'),
      });
    } catch (err: any) {
      setError(err.message || 'Failed to mint');
    }
  };

  if (isSuccess) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-900 via-gray-900 to-green-900 p-6">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md text-center shadow-2xl border-2 border-green-500">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-white mb-4">Pass Minted!</h2>
          <p className="text-gray-300 mb-6">
            You now have access to Zero Quest. Start solving puzzles!
          </p>
          <button
            onClick={() => window.location.href = '/game'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all"
          >
            Start Playing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-gray-900 to-blue-900 p-6">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-purple-500">
        <h1 className="text-4xl font-bold text-white text-center mb-6">
          Mint Zero Quest Pass
        </h1>

        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 mb-6 text-center">
          <p className="text-white text-lg mb-2">Price</p>
          <p className="text-4xl font-bold text-white">
            {mintPrice ? (Number(mintPrice) / 1e18).toFixed(5) : '0.00003'} ETH
          </p>
        </div>

        <div className="space-y-3 mb-6 text-gray-300">
          <p>🎮 Lifetime access to play</p>
          <p>🪙 Earn ZQT tokens</p>
          <p>🎁 Get bonus rewards</p>
          <p>🏆 Compete on leaderboard</p>
        </div>

        {error && (
          <div className="bg-red-600 bg-opacity-20 border border-red-500 rounded-lg p-4 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleMint}
          disabled={isPending || isConfirming || !address}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending || isConfirming ? 'Minting...' : 'Mint Pass'}
        </button>
      </div>
    </div>
  );
};

export default MintPage;
