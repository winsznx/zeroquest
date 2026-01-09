import { useAccount, useReadContract, useDisconnect } from 'wagmi';
import { gameContractAddress, gameContractAbi } from '../config/game';
import { nftContractAddress, nftAbi } from '../config/nft';
import { useQuickAuth } from '../hooks/useQuickAuth';
import { sdk } from '@farcaster/miniapp-sdk';

export const UserPage = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const {
    fid,
    username,
    displayName,
    pfpUrl,
    bio,
    location,
    isAuthenticated,
    isLoading,
    error,
    authenticate,
    logout
  } = useQuickAuth();

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* Personalized Greeting */}
        <h1 className="text-4xl font-bold mb-2 text-center">
          👤 {displayName || username ? `Welcome, ${displayName || username}!` : 'Profile'}
        </h1>
        {location && (
          <p className="text-center text-gray-400 mb-8">📍 {location}</p>
        )}

        <div className="space-y-6">
          {/* Farcaster Profile Section */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-purple-500">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">
              🟣 Farcaster Profile
            </h2>

            {isAuthenticated ? (
              <div className="space-y-4">
                {/* Profile Picture */}
                {pfpUrl && (
                  <div className="flex justify-center mb-4">
                    <img
                      src={pfpUrl}
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-4 border-purple-500 shadow-lg"
                    />
                  </div>
                )}

                {/* User Info */}
                <div className="space-y-2">
                  {displayName && (
                    <p className="text-white">
                      <span className="text-gray-400">Display Name:</span>{" "}
                      <span className="font-semibold">{displayName}</span>
                    </p>
                  )}
                  {username && (
                    <p className="text-white">
                      <span className="text-gray-400">Username:</span>{" "}
                      <span className="font-mono text-purple-300">@{username}</span>
                    </p>
                  )}
                  {fid && (
                    <p className="text-white">
                      <span className="text-gray-400">FID:</span>{" "}
                      <span className="font-mono text-purple-300">{fid}</span>
                    </p>
                  )}
                  {bio && (
                    <p className="text-white">
                      <span className="text-gray-400">Bio:</span>{" "}
                      <span className="text-sm text-gray-300">{bio}</span>
                    </p>
                  )}
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
                >
                  Sign Out from Farcaster
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-gray-300">
                  Sign in with Farcaster to personalize your experience and unlock social features
                </p>

                {error && (
                  <p className="text-red-400 text-sm bg-red-900/30 p-3 rounded-lg">{error}</p>
                )}

                <button
                  onClick={authenticate}
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    "🟣 Sign In with Farcaster"
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Wallet Section */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-blue-500">
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">💼 Wallet</h2>
            <div className="space-y-3">
              <p className="text-white break-all">
                <span className="text-gray-400">Address:</span>{" "}
                <span className="font-mono text-sm text-blue-300">{address}</span>
              </p>
            </div>
          </div>

          {/* Zero Quest Pass */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-green-500">
            <h2 className="text-2xl font-bold mb-4 text-green-400">🎫 Zero Quest Pass</h2>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Status:</span>
              <span className={`font-bold text-lg ${hasPass ? 'text-green-400' : 'text-red-400'}`}>
                {hasPass ? '✅ Owned' : '❌ Not Owned'}
              </span>
            </div>
          </div>

          {/* Game Stats */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-yellow-500">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">🎮 Game Stats</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Daily Plays Used:</span>
                <span className="font-bold text-white">
                  {playerData ? Number(playerData[0]) : 0} / {dailyClaimLimit ? Number(dailyClaimLimit) : 4}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Plays Remaining:</span>
                <span className="font-bold text-green-400 text-xl">{playsLeft}</span>
              </div>
              {playerData && Number(playerData[1]) > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Period Resets:</span>
                  <span className="font-bold text-yellow-400 text-sm">
                    {new Date(Number(playerData[1]) * 1000 + 12 * 60 * 60 * 1000).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-red-500">
            <h2 className="text-2xl font-bold mb-4 text-red-400">⚙️ Actions</h2>
            <button
              onClick={() => disconnect()}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
            >
              Disconnect Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
