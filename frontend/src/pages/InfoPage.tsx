const InfoPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pb-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">📖 About Zero Quest</h1>

        <div className="space-y-6">
          <section className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">🎮 Game Mechanics</h2>
            <p className="text-gray-300 leading-relaxed">
              Zero Quest is a puzzle game where you select tiles that add up to a target sum.
              The faster and more accurate you are, the higher your score! Each game lasts 60 seconds,
              and you earn rewards based on your performance.
            </p>
          </section>

          <section className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">🪙 Token Economy</h2>
            <div className="text-gray-300 space-y-3">
              <p>• <strong>ZQT (Zero Quest Token)</strong> - Main reward token, earned based on your score</p>
              <p>• <strong>Bonus Tokens</strong> - Random rewards in WCT or DEGEN tokens</p>
              <p>• <strong>Max Rewards</strong> - Up to 500 ZQT per game</p>
            </div>
          </section>

          <section className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-green-400">⚡ Play Limits</h2>
            <p className="text-gray-300 leading-relaxed">
              You can play and claim rewards up to 4 times every 12 hours.
              This ensures fair distribution and sustainable token economics.
            </p>
          </section>

          <section className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">🎯 Scoring System</h2>
            <div className="text-gray-300 space-y-2">
              <p>• <strong>Accuracy Bonus</strong> - Hit the exact target for 100 points</p>
              <p>• <strong>Time Bonus</strong> - 2 points per second remaining</p>
              <p>• <strong>Perfect Game</strong> - Exact match + fast time = max rewards</p>
            </div>
          </section>

          <section className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-red-400">🔐 NFT Pass</h2>
            <p className="text-gray-300 leading-relaxed">
              A Zero Quest Pass NFT is required to play. Mint yours for 0.00003 ETH
              and get lifetime access to the game and rewards.
            </p>
          </section>

          <section className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-pink-400">🌐 Network</h2>
            <p className="text-gray-300 leading-relaxed">
              Zero Quest runs on the <strong>Base</strong> network - fast, cheap, and secure.
              Make sure your wallet is connected to Base to play.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
