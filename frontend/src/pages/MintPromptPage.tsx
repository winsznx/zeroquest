import { Link } from 'react-router-dom';

const MintPromptPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-md text-center shadow-2xl border border-purple-500">
        <div className="text-6xl mb-4">🎫</div>
        <h1 className="text-4xl font-bold text-white mb-4">Pass Required</h1>
        <p className="text-xl text-gray-300 mb-8">
          You need a Zero Quest Pass to start playing and earning rewards.
        </p>
        <Link to="/mint">
          <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-10 rounded-xl text-xl transition-all transform hover:scale-105 shadow-lg">
            Mint Pass Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MintPromptPage;
