import { memo } from 'react'
import { Avatar, Box, Typography } from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import StarIcon from '@mui/icons-material/Star'

// One card in the Starred messages view — props-only, no fetching/selection
// state of its own, matching ConversationListItem's dumb-component contract.
const StarredMessageListItem = ({ message, onClick }) => {
  const { senderName, initials, avatarColor = 'primary.main', text, attachment, timestamp } = message

  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        width: '100%',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        p: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '12px',
        bgcolor: 'transparent',
        cursor: 'pointer',
        font: 'inherit',
        color: 'inherit',
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: avatarColor }}>{initials}</Avatar>
        <Typography noWrap sx={{ fontWeight: 700 }} variant="body2">
          {senderName}
        </Typography>
      </Box>

      {attachment ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'action.hover', borderRadius: '8px', p: 1 }}>
          <AttachFileIcon color="action" fontSize="small" />
          <Typography color="text.secondary" noWrap sx={{ flex: 1 }} variant="caption">
            {attachment.label}
          </Typography>
          <Typography color="text.secondary" sx={{ flexShrink: 0 }} variant="caption">
            {attachment.sizeLabel}
          </Typography>
        </Box>
      ) : (
        <Typography
          color="text.secondary"
          sx={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}
          variant="body2"
        >
          {text}
        </Typography>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
        <StarIcon color="warning" sx={{ fontSize: 14 }} />
        <Typography color="text.secondary" variant="caption">
          {timestamp}
        </Typography>
      </Box>
    </Box>
  )
}

export default memo(StarredMessageListItem)
