'use client'
import { useState, useEffect, useMemo } from 'react'
import { parseUnits, formatUnits } from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
import { Box, TextField, Typography } from '@mui/material'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useWalletClient } from 'wagmi'
import { toast } from 'react-toastify'

import LoadingButton from '@mui/lab/LoadingButton'
import { useStakeContract } from '../../hooks/useContract'
import { Pid } from '../../utils/index'

type UserStakeData = {
  staked: string
  withdrawPending: string
  withdrawable: string
}
const InitData = {
  staked: '0',
  withdrawPending: '0',
  withdrawable: '0',
}
const WithDraw = () => {
  const stakeContract = useStakeContract()
  const [amount, setAmount] = useState('0')
  const { address, isConnected } = useAccount()
  const { data } = useWalletClient()
  const [userData, setUserData] = useState<UserStakeData>(InitData)
  const [withdrawLoading, setWithdrawLoading] = useState(false)
  const [unstakeLoading, setUnstakeLoading] = useState(false)

  const isWithdrawable = useMemo(() => {
    return Number(userData.withdrawable) > 0 && isConnected
  }, [userData, isConnected])
  const handleUnStake = async () => {
    if (!stakeContract || !data) return
    try {
      setUnstakeLoading(true)
      const tx = await stakeContract.write.unstake([Pid, parseUnits(amount, 18)])
      const res = await waitForTransactionReceipt(data, { hash: tx })
      console.log(res, 'unstake-res')
      toast.success('Transaction receipt !')
      setUnstakeLoading(false)
      getUserData
    } catch (err) {
      setUnstakeLoading(false)
    }
  }
  const handleWithdraw = async () => {
    if (!stakeContract || !data || !isWithdrawable) return
    try {
      setWithdrawLoading(true)

      const tx = await stakeContract.write.withdraw([Pid])
      const res = await waitForTransactionReceipt(data, { hash: tx })
      console.log(res, 'withdraw-res')
      toast.success('Transaction receipt !')
      setWithdrawLoading(false)
      getUserData()
    } catch (err) {
      setWithdrawLoading(false)
    }
  }
  const getUserData = async () => {
    if (!stakeContract || !address) return
    const staked = await stakeContract.read.stakingBalance([Pid, address])
    const [requestAmount, pendingWithdrawAmount]: unknown = await stakeContract.read.withdrawAmount([Pid, address])
    const p = Number(formatUnits(requestAmount, 18))
    const ava = Number(formatUnits(pendingWithdrawAmount, 18))
    console.log(ava, p, '----ava,p')
    setUserData({
      staked: formatUnits(staked as bigint, 18),
      withdrawPending: (p - ava).toFixed(4),
      withdrawable: ava.toFixed(4),
    })
  }

  useEffect(() => {
    console.log(stakeContract, address, '-s-s-s-')
    if (stakeContract && address) {
      getUserData()
    }
  }, [stakeContract, address])
  return (
    <Box display={'flex'}>
      <Typography variant="h1">KK Stake 🫥</Typography>
      <Typography variant="h3">Stake ETH to earn tokens.</Typography>
      <Box sx={{ border: '1px solid #eee', borderRadius: '12px', p: '20px', width: '600px', mt: '30px' }}>
        <Box display={'flex'} alignItems={'center'} gap={'5px'} mb="10px">
          <Box>
            <Box>Staked Amount: </Box>
            <Box>{userData.staked} ETH</Box>
          </Box>
          <Box>
            <Box>Available to withdraw: </Box>
            <Box>{userData.withdrawable} ETH</Box>
          </Box>
          <Box>
            <Box>Pending WithDraw: </Box>
            <Box>{userData.withdrawPending} ETH</Box>
          </Box>
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
            <LoadingButton variant="contained" loading={unstakeLoading} onClick={handleUnStake}>
              UnStake
            </LoadingButton>
          )}
        </Box>
        <Box sx={{ fontSize: '20px', mb: '10px', mt: '40px' }}>Withdraw</Box>
        <Box>Ready Amount: {userData.withdrawable} ETH</Box>
        <Typography>After unstaking, you need to wait 20 minutes to withdraw.</Typography>
        <LoadingButton sx={{ mt: '20px' }} disabled={!isWithdrawable} variant="contained" loading={withdrawLoading} onClick={handleWithdraw}>
          Withdraw
        </LoadingButton>
      </Box>
    </Box>
  )
}

export default WithDraw
