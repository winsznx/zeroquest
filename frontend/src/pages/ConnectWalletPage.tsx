import { useConnect } from 'wagmi';

export const ConnectWalletPage = () => {
  const { connectors, connect } = useConnect();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-bold text-white mb-4">🧩 Zero Quest</h1>
        <p className="text-xl text-gray-300 mb-8">
          World Puzzle Game • Play to Earn
        </p>

        <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700">
          <p className="text-white mb-6">Connect your wallet to start playing</p>
          <div className="space-y-3">
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
              >
                Connect {connector.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
