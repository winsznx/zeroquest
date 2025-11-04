import { motion } from 'framer-motion';

interface GameOverModalProps {
  score: number;
  onClaim: () => void;
  isClaiming: boolean;
  isConfirming: boolean;
  isClaimed: boolean;
  claimError: string | null;
  claimResult: { rewardTokenSymbol: string; rewardTokenAmount: string } | null;
  onResetError: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  onClaim,
  isClaiming,
  isConfirming,
  isClaimed,
  claimError,
  claimResult,
  onResetError,
}) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border-2 border-blue-500"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15 }}
      >
        <h2 className="text-4xl font-bold text-center text-white mb-6">
          Puzzle Complete! 🎉
        </h2>

        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl p-6 mb-6 text-center">
          <p className="text-gray-800 text-lg font-semibold mb-2">Your Score</p>
          <p className="text-5xl font-bold text-white">{score}</p>
        </div>

        {!isClaimed && !claimError && (
          <button
            onClick={onClaim}
            disabled={isClaiming || isConfirming}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4 shadow-lg"
          >
            {isClaiming || isConfirming ? 'Processing...' : 'Claim Rewards'}
          </button>
        )}

        {isClaimed && claimResult && (
          <div className="bg-green-600 bg-opacity-20 border border-green-500 rounded-xl p-4 mb-4">
            <p className="text-green-400 font-semibold text-center mb-2">
              ✅ Rewards Claimed Successfully!
            </p>
            <div className="text-white text-center space-y-1">
              <p>🪙 {score} ZQT</p>
              <p>🎁 {claimResult.rewardTokenAmount} {claimResult.rewardTokenSymbol}</p>
            </div>
          </div>
        )}

        {claimError && (
          <div className="bg-red-600 bg-opacity-20 border border-red-500 rounded-xl p-4 mb-4">
            <p className="text-red-400 font-semibold mb-2">❌ Error</p>
            <p className="text-white text-sm">{claimError}</p>
            <button
              onClick={onResetError}
              className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        <button
          onClick={() => window.location.reload()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
        >
          Play Again
        </button>
      </motion.div>
    </motion.div>
  );
};

export default GameOverModal;
