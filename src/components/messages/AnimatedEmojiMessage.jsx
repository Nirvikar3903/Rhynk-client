import { useState } from 'react'
import { Box, keyframes } from '@mui/material'

// Telegram/WhatsApp-style single-emoji rendering: a large glyph that pops in
// once on arrival and can be tapped to replay. No Lottie/external asset
// dependency (see [[00-overview]] on not building against an asset source
// that doesn't actually exist) — the "animation" is a CSS keyframe applied
// to the plain Unicode glyph itself, so it works for any emoji, not just a
// pre-rendered subset.
const popIn = keyframes`
  0% { transform: scale(0.3); opacity: 0; }
  60% { transform: scale(1.15); opacity: 1; }
  80% { transform: scale(0.95); }
  100% { transform: scale(1); }
`

const AnimatedEmojiMessage = ({ emoji, size = 64 }) => {
  // Bumping this key remounts the span, which restarts the CSS animation —
  // simpler and more reliable than toggling animation-play-state on tap.
  const [playCount, setPlayCount] = useState(0)

  return (
    <Box
      aria-label={`Emoji message: ${emoji}`}
      component="span"
      key={playCount}
      onClick={() => setPlayCount((count) => count + 1)}
      role="button"
      sx={{
        display: 'inline-block',
        fontSize: size,
        lineHeight: 1,
        cursor: 'pointer',
        userSelect: 'none',
        animation: `${popIn} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)`,
      }}
    >
      {emoji}
    </Box>
  )
}

export default AnimatedEmojiMessage
