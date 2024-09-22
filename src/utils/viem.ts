import { PublicClient, createPublicClient, createWalletClient, http, custom } from 'viem'
import { sepolia } from 'viem/chains'

export const viemClient = (chainId: number): PublicClient => {
  const clients: {
    [key: number]: PublicClient
  } = {
    [sepolia.id]: createPublicClient({
      chain: sepolia,
      transport: http(),
    }),
  }
  return clients[chainId]
}

export const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum!),
})
