import { useAccount, useReadContract, useDisconnect } from 'wagmi';
import { gameContractAddress, gameContractAbi } from '../config/game';
import { nftContractAddress, nftAbi } from '../config/nft';

export const UserPage = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const { data: playerData } = useReadContract({
    address: gameContractAddress,
    abi: gameContractAbi,
    functionName: 'players',
    args: [address!],
    query: { enabled: isConnected && !!address }
  });

  const { data: dailyClaimLimit } = useReadContract({
    address: gameContractAddress,
    abi: gameContractAbi,
    functionName: 'dailyClaimLimit',
  });

  const { data: hasPass } = useReadContract({
    address: nftContractAddress,
    abi: nftAbi,
    functionName: 'hasMinted',
    args: [address!],
    query: { enabled: isConnected && !!address }
  });

  const playsLeft = dailyClaimLimit !== undefined && playerData !== undefined
    ? Number(dailyClaimLimit) - Number(playerData[0])
    : 0;

  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center pb-24">
        <p className="text-xl">Please connect your wallet</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">👤 Profile</h1>

        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-blue-500">
            <h2 className="text-lg font-semibold text-gray-400 mb-2">Wallet Address</h2>
            <p className="text-white text-sm font-mono break-all">{address}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">🎫 Zero Quest Pass</h2>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Status:</span>
              <span className={`font-bold ${hasPass ? 'text-green-400' : 'text-red-400'}`}>
                {hasPass ? '✅ Owned' : '❌ Not Owned'}
              </span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">🎮 Game Stats</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Daily Plays Used:</span>
                <span className="font-bold text-white">
                  {playerData ? Number(playerData[0]) : 0} / {dailyClaimLimit ? Number(dailyClaimLimit) : 4}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Plays Remaining:</span>
                <span className="font-bold text-green-400">{playsLeft}</span>
              </div>
              {playerData && Number(playerData[1]) > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Period Resets:</span>
                  <span className="font-bold text-yellow-400">
                    {new Date(Number(playerData[1]) * 1000 + 12 * 60 * 60 * 1000).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">⚙️ Actions</h2>
            <button
              onClick={() => disconnect()}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              Disconnect Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
