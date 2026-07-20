import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import doodleImg from 'assets/doodle.jpg'

// Signature Rhynk background: thin-line musical notes / speech bubbles /
// waveforms / dots tiled at a very light, professional opacity.
const DoodleBackground = ({ position = 'fixed' }) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  // Keep it extremely subtle and light so text stays highly readable
  const opacity = isDark ? 0.08 : 0.20

  return (
    <Box
      aria-hidden
      sx={{
        position: position,
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        backgroundImage: `url(${doodleImg})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '360px 360px', // Tile scale
        opacity: opacity,
        filter: isDark ? 'invert(1) hue-rotate(180deg)' : 'none',
        mixBlendMode: isDark ? 'screen' : 'multiply', // Hide background color and preserve lines
      }}
    />
  )
}

export default DoodleBackground
