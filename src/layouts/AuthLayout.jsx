import { Box, IconButton, Tooltip } from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import DoodleBackground from 'components/common/DoodleBackground'
import useTheme from 'hooks/useTheme.hook'

const AuthLayout = ({ children }) => {
  const { isDarkMode, toggleMode } = useTheme()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 4 },
        position: 'relative',
        overflowX: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      <DoodleBackground />

      <Tooltip placement="left" title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
        <IconButton
          aria-label="Toggle theme"
          onClick={toggleMode}
          sx={{
            position: 'absolute',
            top: { xs: 16, md: 24 },
            right: { xs: 16, md: 24 },
            zIndex: 2,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            '&:hover': { bgcolor: 'background.paper' },
          }}
        >
          {isDarkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
        </IconButton>
      </Tooltip>

      <Box sx={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 480 }}>{children}</Box>
    </Box>
  )
}

export default AuthLayout
