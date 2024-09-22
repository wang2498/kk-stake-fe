import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia } from 'wagmi/chains'
const PROJECT_ID = 'e3242412afd6123ce1dda1de23a8c016'
export const config = getDefaultConfig({
  appName: 'KK stake',
  projectId: PROJECT_ID,
  chains: [sepolia],
  ssr: true,
})

export const defaultChainId: number = sepolia.id
