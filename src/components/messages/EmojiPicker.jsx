import { Popover } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import EmojiPickerReact, { Theme } from 'emoji-picker-react'

// Thin MUI Popover wrapper around emoji-picker-react's own picker grid
// (categories, search, recents) — see [[create-mui-component]]. Positioned
// above the composer via anchorOrigin/transformOrigin so it opens upward
// like WhatsApp/Telegram's picker.
const EmojiPicker = ({ anchorEl, open, onClose, onEmojiClick }) => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      disableAutoFocus
      disableEnforceFocus
      disableRestoreFocus
      onClose={onClose}
      open={open}
      transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      slotProps={{ paper: { sx: { mb: 1, borderRadius: 3, overflow: 'hidden' } } }}
    >
      <EmojiPickerReact
        autoFocusSearch={false}
        onEmojiClick={(emojiData, event) => onEmojiClick(emojiData, event)}
        theme={isDarkMode ? Theme.DARK : Theme.LIGHT}
      />
    </Popover>
  )
}

export default EmojiPicker
