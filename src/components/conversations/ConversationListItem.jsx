import { memo } from 'react'
import { Avatar, Badge, Box, Typography } from '@mui/material'
import PushPinIcon from '@mui/icons-material/PushPin'

// One row in the conversation list — props-only, no fetching/selection
// state of its own (see [[create-component]]).
const ConversationListItem = ({ conversation, onClick }) => {
  const { name, initials, avatarColor, timestamp, preview, isOnline, isPinned, unreadCount = 0 } = conversation
  const hasUnread = unreadCount > 0

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.5,
        borderRadius: 3,
        cursor: 'pointer',
        bgcolor: isPinned ? 'action.hover' : 'transparent',
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <Badge
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        invisible={!isOnline}
        overlap="circular"
        sx={{ '& .MuiBadge-badge': { bgcolor: 'success.main', border: '2px solid', borderColor: 'background.paper', width: 14, height: 14, borderRadius: '50%' } }}
        variant="dot"
      >
        <Avatar sx={{ width: 48, height: 48, bgcolor: avatarColor }}>{initials}</Avatar>
      </Badge>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.25 }}>
          <Typography noWrap sx={{ fontWeight: hasUnread ? 700 : 500 }} variant="body2">
            {name}
          </Typography>
          <Typography color={hasUnread ? 'primary.main' : 'text.secondary'} sx={{ fontWeight: hasUnread ? 700 : 400, flexShrink: 0, ml: 1 }} variant="caption">
            {timestamp}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
            {isPinned && <PushPinIcon sx={{ fontSize: 14, color: 'primary.main', flexShrink: 0 }} />}
            <Typography color={hasUnread ? 'text.primary' : 'text.secondary'} noWrap sx={{ fontWeight: hasUnread ? 700 : 400 }} variant="body2">
              {preview}
            </Typography>
          </Box>
          {hasUnread && (
            <Box
              sx={{
                bgcolor: 'success.main',
                color: 'success.contrastText',
                fontSize: 11,
                fontWeight: 700,
                width: 20,
                height: 20,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {unreadCount}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default memo(ConversationListItem)
