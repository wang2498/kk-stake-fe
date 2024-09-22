import { useMemo } from 'react'
import { Abi, Address } from 'viem'
import { useChainId, useWalletClient } from 'wagmi'
import { StakeContractAddress } from '../utils/env'
import { getContract } from '../utils/contractHelper'
import stakeAbi from '../assets/stake.ts'
import {} from 'viem'

type UseContractOptions = {
  chainId?: number
}
export function useContract<TAbi extends Abi>(
  addressOrAddressMap?: Address | { [chainId: number]: Address },
  abi?: TAbi,
  options?: UseContractOptions
) {
  const currentChainId = useChainId()
  const chainId = options?.chainId ?? currentChainId
  const { data: walletClient } = useWalletClient()

  return useMemo(() => {
    if (!addressOrAddressMap || !abi || !chainId) return null
    let address: Address | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return getContract({ address, abi, chainId, signer: walletClient ?? undefined })
    } catch (err) {
      console.log('Fail to create contract', err)
      return null
    }
  }, [addressOrAddressMap, abi, chainId, walletClient])
}
export function useStakeContract() {
  return useContract(StakeContractAddress, stakeAbi as Abi)
}
