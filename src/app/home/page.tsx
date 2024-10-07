'use client'
import { useState, useEffect } from 'react'
import { parseUnits, formatUnits } from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
import { Box, TextField, Typography } from '@mui/material'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useWalletClient } from 'wagmi'
import { toast } from 'react-toastify'

import LoadingButton from '@mui/lab/LoadingButton'
import { useStakeContract } from '../../hooks/useContract'
import { Pid } from '../../utils/index'
const Home = () => {
  const stakeContract = useStakeContract()
  const [amount, setAmount] = useState('0')
  const [stakedAmount, setStakedAmount] = useState('0')
  const [loading, setLoading] = useState(false)
  const { address, isConnected } = useAccount()
  const { data } = useWalletClient()

  const handleStake = async () => {
    if (!stakeContract || !data) return
    try {
      const tx = stakeContract.write.depositETH([], { value: parseUnits(amount, 18) })
      console.log(tx, '-----tx')
      const res = await waitForTransactionReceipt(data, { hash: tx })
      console.log(res, '-----res')
      toast.success('Transaction receipt!')
      setLoading(false)
      getStakeAmount()
    } catch (err) {
      setLoading(false)
      console.log(err, 'stake-error')
    }
  }
  const getStakeAmount = async () => {
    if (address && stakeContract) {
      const res = await stakeContract.read.stakingBalance([Pid, address])
      // console.log(res, '--res--')
      setStakedAmount(formatUnits(res as bigint, 18))
    }
  }
  useEffect(() => {
    if (stakeContract && address) {
      getStakeAmount()
    }
  }, [stakeContract, address])
  return (
    <Box display={'flex'}>
      <Typography variant="h1">KK Stake 🫥</Typography>
      <Typography variant="h3">Stake ETH to earn tokens.</Typography>
      <Box sx={{ border: '1px solid #eee', borderRadius: '12px', p: '20px', width: '600px', mt: '30px' }}>
        <Box display={'flex'} alignItems={'center'} gap={'5px'} mb="10px">
          <Box>Staked Amount: </Box>
          <Box>{stakedAmount} ETH</Box>
        </Box>
        <TextField
          onChange={(e) => {
            setAmount(e.target.value)
          }}
          sx={{ minWidth: '300px' }}
          label="Amount"
          variant="outlined"
        />
        <Box mt="30px">
          {!isConnected ? (
            <ConnectButton />
          ) : (
            <LoadingButton variant="contained" loading={loading} onClick={handleStake}>
              Stake
            </LoadingButton>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default Home
