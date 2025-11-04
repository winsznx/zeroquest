import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import farcasterMiniAppConnector from '@farcaster/miniapp-wagmi-connector'

export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    farcasterMiniAppConnector() as any,
  ],
  transports: {
    [base.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
