import { zeroAddress, Address } from 'viem'

export const StakeContractAddress = (process.env.NEXT_PUBLIC_STAKE_ADDRESS as Address) || zeroAddress
