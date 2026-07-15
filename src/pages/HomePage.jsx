import { useSelector } from 'react-redux'
import { Box, Typography } from '@mui/material'
import { selectUser } from 'store/slices/auth.slice'

// Blank placeholder landing spot post-login — replace with the real home/
// conversations screen once that feature is built.
const HomePage = () => {
  const user = useSelector(selectUser)

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Typography sx={{ letterSpacing: '-0.02em' }} variant="h1">
        Welcome, {user?.username}.
      </Typography>
    </Box>
  )
}

export default HomePage
