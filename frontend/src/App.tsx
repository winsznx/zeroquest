import { useAccount } from "wagmi";
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { base } from "wagmi/chains";
import { sdk } from "@farcaster/miniapp-sdk";

import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import PuzzleGame from "./pages/PuzzleGame";
import InfoPage from "./pages/InfoPage";
import { UserPage } from "./pages/UserPage";
import { ConnectWalletPage } from "./pages/ConnectWalletPage";
import { WrongNetworkPage } from "./pages/WrongNetworkPage";
import MintPage from "./pages/MintPage";
import MintPromptPage from "./pages/MintPromptPage";
import { useHasPass } from "./hooks/useHasPass";
import "./index.css";
import "./App.css";

function App() {
  useEffect(() => {
    sdk.actions
      .ready()
      .then(() => sdk.actions.addMiniApp())
      .catch((e) => console.warn("SDK ready error:", e));
  }, []);

  const { isConnected, chain } = useAccount();
  const { hasPass, isLoading: isLoadingPass } = useHasPass();

  if (!isConnected) {
    return <ConnectWalletPage />;
  }

  if (chain?.id !== base.id) {
    return <WrongNetworkPage />;
  }

  if (isLoadingPass) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900 text-white">
        <p className="text-2xl">Loading your pass...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {hasPass ? (
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="game" element={<PuzzleGame />} />
            <Route path="info" element={<InfoPage />} />
            <Route path="user" element={<UserPage />} />
            <Route path="mint" element={<Navigate to="/game" />} />
          </Route>
        ) : (
          <>
            <Route path="/" element={<MintPromptPage />} />
            <Route path="mint" element={<MintPage />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
