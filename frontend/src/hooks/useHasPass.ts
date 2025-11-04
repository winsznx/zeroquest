// Custom hook to check if user has Zero Quest Pass NFT

import { useAccount, useReadContract } from 'wagmi';
import { nftContractAddress, nftAbi } from '../config/nft';

export const useHasPass = () => {
  const { address, isConnected } = useAccount();

  const { data: hasMinted, isLoading } = useReadContract({
    address: nftContractAddress,
    abi: nftAbi,
    functionName: 'hasMinted',
    args: [address!],
    query: { enabled: isConnected && !!address },
  });

  const hasPass = !!hasMinted;

  return { hasPass, isLoading };
};
