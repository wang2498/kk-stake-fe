import { getContract as viemGetContract, Address, Abi, PublicClient, GetContractReturnType, WalletClient } from 'viem'
import { defaultChainId } from './wagmi'
import { viemClients } from './viem'

export const getContract = <TAbi extends Abi | readonly unknown[], TWalletClient extends WalletClient>({
  address,
  abi,
  chainId = defaultChainId,
  signer,
}: {
  address: Address
  abi: TAbi | readonly TAbi[]
  chainId?: number
  signer?: TWalletClient
}) => {
  const client = viemGetContract({
    address,
    abi,
    client: {
      public: viemClients(chainId),
      wallet: signer,
    },
  }) as unknown as GetContractReturnType<TAbi, PublicClient, Address>
  return {
    ...client,
    chain: signer?.chain,
    account: signer?.account,
  }
}
