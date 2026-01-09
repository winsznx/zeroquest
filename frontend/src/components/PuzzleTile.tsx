import { motion } from 'framer-motion';
import { sdk } from '@farcaster/miniapp-sdk';

interface PuzzleTileProps {
  value: number;
  isRevealed: boolean;
  isCorrect: boolean | null;
  onClick: () => void;
  disabled: boolean;
}

const PuzzleTile: React.FC<PuzzleTileProps> = ({
  value,
  isRevealed,
  isCorrect,
  onClick,
  disabled
}) => {
  const getBackgroundColor = () => {
    if (!isRevealed) return 'bg-blue-600';
    if (isCorrect === true) return 'bg-green-500';
    if (isCorrect === false) return 'bg-red-500';
    return 'bg-purple-600';
  };

  const handleClick = () => {
    // Add haptic feedback for mini app
    try {
      sdk.actions.haptic('light');
    } catch {
      // Not in mini app context, ignore
    }
    onClick();
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled || isRevealed}
      className={`puzzle-tile ${getBackgroundColor()} text-white text-2xl font-bold rounded-lg shadow-lg border-4 border-opacity-50 ${disabled || isRevealed ? 'cursor-not-allowed opacity-75' : 'hover:scale-105'
        }`}
      whileHover={!disabled && !isRevealed ? { scale: 1.05 } : {}}
      whileTap={!disabled && !isRevealed ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {isRevealed ? value : '?'}
    </motion.button>
  );
};

export default PuzzleTile;
