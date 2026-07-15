import { useState } from 'react'
import { Avatar, Box, Chip, Typography, alpha } from '@mui/material'
import { motion } from 'framer-motion'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import PersonIcon from '@mui/icons-material/Person'

// Procedurally-generated placeholder avatars (api.dicebear.com) — a
// documented public API for exactly this purpose, not photos of real people,
// so safe to reference directly rather than hotlinking stock photography.
const AVATAR_SEEDS = ['rhynk-listener-1', 'rhynk-listener-2']
const avatarUrl = (seed) => `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}`

// Only the two quote bubbles drift toward the cursor, matching the source
// mock's mousemove script (it only ever selected its `.bubble-float`
// elements — the node/chip/avatars were never part of that parallax).
const BUBBLE_PARALLAX_STRENGTH = 24

// Recreates the marketing landing mock's hero visual: a pulsing music node,
// two floating + cursor-parallax chat bubbles, and a "LIVE NOW" chip. The
// mock's animated SVG waveform paths are intentionally not reproduced here —
// pure decorative flourish beyond the core visual identity already
// established elsewhere (see .claude/workflows/convert-stitch-design.md).
const LandingHero = () => {
  const [pointer, setPointer] = useState({ x: 0, y: 0 })

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setPointer({
      x: (event.clientX - rect.left) / rect.width - 0.5,
      y: (event.clientY - rect.top) / rect.height - 0.5,
    })
  }

  const handleMouseLeave = () => setPointer({ x: 0, y: 0 })

  return (
    <Box
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: { xs: 420, md: '100%' },
        bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <Chip
        icon={<Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', ml: '10px !important' }} />}
        label="LIVE NOW"
        size="small"
        sx={{
          position: 'absolute',
          top: { xs: 24, md: 56 },
          right: { xs: 24, md: 64 },
          bgcolor: (t) => alpha(t.palette.success.main, 0.15),
          color: 'success.main',
          fontWeight: 700,
        }}
      />

      <Box
        animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
        component={motion.div}
        sx={{
          position: 'relative',
          width: 96,
          height: 96,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: (t) => `0 0 40px 10px ${alpha(t.palette.primary.main, 0.3)}`,
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <MusicNoteIcon sx={{ fontSize: 40 }} />
        <Box
          sx={{
            position: 'absolute',
            top: -4,
            right: -4,
            width: 24,
            height: 24,
            borderRadius: '50%',
            bgcolor: 'success.main',
            border: '4px solid',
            borderColor: 'background.paper',
          }}
        />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: '18%',
          left: '8%',
          transform: `translate(${pointer.x * BUBBLE_PARALLAX_STRENGTH}px, ${pointer.y * BUBBLE_PARALLAX_STRENGTH}px)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        <Box
          animate={{ y: [0, -12, 0] }}
          component={motion.div}
          sx={{
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            boxShadow: 1,
            px: 2,
            py: 1,
            maxWidth: 180,
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Typography sx={{ fontWeight: 500 }} variant="caption">
            &quot;This drop is insane! 🔥&quot;
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          right: '12%',
          transform: `translate(${pointer.x * BUBBLE_PARALLAX_STRENGTH * 1.5}px, ${pointer.y * BUBBLE_PARALLAX_STRENGTH * 1.5}px)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        <Box
          animate={{ y: [0, -12, 0] }}
          component={motion.div}
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            borderRadius: 2,
            boxShadow: 2,
            px: 2,
            py: 1,
            maxWidth: 200,
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        >
          <Typography sx={{ fontWeight: 500 }} variant="caption">
            &quot;Synchronized at 0:42. Vibe check passed.&quot;
          </Typography>
        </Box>
      </Box>

      <Avatar
        src={avatarUrl(AVATAR_SEEDS[0])}
        sx={{
          position: 'absolute',
          top: '30%',
          right: '10%',
          width: 48,
          height: 48,
          border: '2px solid',
          borderColor: 'background.paper',
          boxShadow: 2,
        }}
      >
        <PersonIcon />
      </Avatar>
      <Avatar
        src={avatarUrl(AVATAR_SEEDS[1])}
        sx={{
          position: 'absolute',
          bottom: '32%',
          left: '12%',
          width: 56,
          height: 56,
          border: '2px solid',
          borderColor: 'background.paper',
          boxShadow: 2,
        }}
      >
        <PersonIcon />
      </Avatar>
    </Box>
  )
}

export default LandingHero
