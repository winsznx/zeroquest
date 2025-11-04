import { useSwitchChain } from 'wagmi';
import { base } from 'wagmi/chains';

export const WrongNetworkPage = () => {
  const { switchChain } = useSwitchChain();

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-red-900 via-gray-900 to-red-900 p-6">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-md shadow-2xl border-2 border-red-500">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-3xl font-bold text-white mb-4">Wrong Network</h2>
          <p className="text-gray-300 mb-6">
            Zero Quest runs on the Base network. Please switch to continue.
          </p>
          <button
            onClick={() => switchChain({ chainId: base.id })}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105"
          >
            Switch to Base Network
          </button>
        </div>
      </div>
    </div>
  );
};
