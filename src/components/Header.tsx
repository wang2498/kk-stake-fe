import Link from 'next/link'
import { Box, Typography } from '@mui/material'
import { usePathname } from 'next/navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit'
function Header() {
  const Links = [
    {
      name: 'Stake',
      path: '/',
    },
    {
      name: 'Withdraw',
      path: '/withdraw',
    },
  ]
  const pathname = usePathname()
  return (
    <Box component="section" className="flex justify-between align-center px-10 py-40 border-b-1 border-b-neutral-500">
      <Box>KK Stake</Box>
      <Box className="flex align-center gap-4">
        <Box className="flex">
          {Links.map((link) => {
            const active = pathname === link.path || pathname === link.path + '/'
            return (
              <Typography key={link.name} className="text-8xl">
                <Link href={link.path} className={active ? 'cursor-pointer' : 'cursor-not-allowed'}>
                  {link.name}
                </Link>
              </Typography>
            )
          })}
        </Box>
        <ConnectButton />
      </Box>
    </Box>
  )
}

export default Header
