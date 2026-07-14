import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// Signature Rhynk background: thin-line musical notes / speech bubbles /
// waveforms / dots tiled at 4-6% opacity (see DESIGN.md). Reads its
// color/opacity from theme.palette.custom.doodle (src/theme/index.js) rather
// than hardcoding them here.
const DoodleBackground = () => {
  const theme = useTheme()
  const doodle = theme.palette.custom?.doodle ?? { color: theme.palette.primary.main, opacity: 0.05 }

  return (
    <Box
      aria-hidden
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: doodle.opacity,
      }}
    >
      <svg height="100%" width="100%">
        <defs>
          <pattern height="100" id="rhynk-doodle" patternUnits="userSpaceOnUse" width="100" x="0" y="0">
            <path d="M10 10 Q 20 5, 30 15 T 50 10" fill="none" stroke={doodle.color} strokeWidth="2" />
            <circle cx="70" cy="40" fill={doodle.color} r="3" />
            <path d="M20 70 L 40 70 M 30 60 L 30 80" stroke={doodle.color} strokeWidth="2" />
            <rect fill={doodle.color} height="6" rx="2" width="6" x="80" y="80" />
          </pattern>
        </defs>
        <rect fill="url(#rhynk-doodle)" height="100%" width="100%" />
      </svg>
    </Box>
  )
}

export default DoodleBackground
