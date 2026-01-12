import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';

const HomePage = () => {
  const { address } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex flex-col items-center justify-center p-6 pb-24 animate-fade-in leading-relaxed">
      <div className="text-center max-w-2xl">
        <div className="text-8xl mb-6">🧩</div>
        <h1 className="text-6xl font-bold text-white mb-4">Zero Quest</h1>
        <p className="text-2xl text-gray-300 mb-8">
          World Puzzle Game • Play to Earn
        </p>

        <div className="bg-gray-800 rounded-2xl p-8 mb-8 shadow-2xl border border-blue-500">
          <h2 className="text-3xl font-bold text-white mb-6">How to Play</h2>
          <div className="text-left text-gray-300 space-y-4">
            <p className="flex items-start">
              <span className="text-2xl mr-3">🎯</span>
              <span>Select tiles that sum to the target number</span>
            </p>
            <p className="flex items-start">
              <span className="text-2xl mr-3">⏱️</span>
              <span>Complete puzzles within 60 seconds</span>
            </p>
            <p className="flex items-start">
              <span className="text-2xl mr-3">🪙</span>
              <span>Earn ZQT tokens based on your score</span>
            </p>
            <p className="flex items-start">
              <span className="text-2xl mr-3">🎁</span>
              <span>Get bonus rewards with each claim</span>
            </p>
            <p className="flex items-start">
              <span className="text-2xl mr-3">🔄</span>
              <span>Play up to 4 times every 12 hours</span>
            </p>
          </div>
        </div>

        <Link to="/game">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-6 px-16 rounded-full text-3xl transition-all transform hover:scale-110 shadow-2xl">
            PLAY NOW
          </button>
        </Link>

        {address && (
          <p className="mt-6 text-gray-400 text-sm">
            Connected: {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
