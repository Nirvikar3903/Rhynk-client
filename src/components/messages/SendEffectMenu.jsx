import { Box, ListSubheader, Menu, MenuItem, Typography } from '@mui/material'

// The curated set of send-with-effect animations (Telegram's "press and
// hold send" pattern) — see [[create-mui-component]]. Kept small and
// CSS/canvas-only, no external Lottie/image assets (same call made for the
// animated-emoji feature).
const SEND_EFFECTS = [
  { id: 'confetti', label: 'Confetti', icon: '🎉' },
  { id: 'fireworks', label: 'Fireworks', icon: '🎆' },
  { id: 'hearts', label: 'Hearts', icon: '❤️' },
  { id: 'fire', label: 'Fire', icon: '🔥' },
]

// Menu (not a bare Popover) — MenuItem requires the MenuList context that
// only Menu provides; a Popover wrapping MenuItems directly throws at
// render time. Matches the reply/forward/copy/delete dropdown elsewhere in
// ChatThreadPanel.
const SendEffectMenu = ({ anchorEl, open, onClose, onSelect }) => (
  <Menu
    anchorEl={anchorEl}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    onClose={onClose}
    open={open}
    transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    slotProps={{ paper: { sx: { mb: 1, borderRadius: 2, minWidth: 180 } } }}
  >
    <ListSubheader sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', lineHeight: 2.5 }}>Send with effect</ListSubheader>
    {SEND_EFFECTS.map((effect) => (
      <MenuItem key={effect.id} onClick={() => onSelect(effect.id)} sx={{ gap: 1.5, py: 1 }}>
        <Box component="span" sx={{ fontSize: 20, lineHeight: 1 }}>
          {effect.icon}
        </Box>
        <Typography variant="body2">{effect.label}</Typography>
      </MenuItem>
    ))}
  </Menu>
)

export default SendEffectMenu
