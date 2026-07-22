import { memo, useState } from 'react'
import { Avatar, Badge, Box, Menu, MenuItem, Typography, alpha } from '@mui/material'
import PushPinIcon from '@mui/icons-material/PushPin'
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread'
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead'
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff'
import ArchiveIcon from '@mui/icons-material/Archive'
import UnarchiveIcon from '@mui/icons-material/Unarchive'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'

// One row in the conversation list — props-only, no fetching/selection
// state of its own (see [[create-component]]). Right-click context-menu
// open/close is purely presentational UI state, kept local like
// MessageBubble's own `menuAnchor` (see components/messages/ChatThreadPanel.jsx).
const ConversationListItem = ({ conversation, isActive = false, onClick, onMenuAction }) => {
  const { name, initials, avatarColor, timestamp, preview, isOnline, isPinned, isMuted, isArchived, isUnread, unreadCount = 0 } = conversation
  // "mark as unread" is a manual flag distinct from a real unread count — it
  // shows a plain dot (see the badge below), not a numbered bubble.
  const hasUnread = unreadCount > 0 || isUnread === true
  const [contextMenu, setContextMenu] = useState(null)

  const handleContextMenu = (event) => {
    event.preventDefault()
    setContextMenu(contextMenu === null ? { mouseX: event.clientX + 2, mouseY: event.clientY - 6 } : null)
  }

  const closeContextMenu = () => setContextMenu(null)

  const handleMenuAction = (action) => {
    closeContextMenu()
    onMenuAction?.(action, conversation)
  }

  return (
    <Box
      onClick={onClick}
      onContextMenu={handleContextMenu}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.5,
        borderRadius: '12px 0 0 12px',
        cursor: 'pointer',
        bgcolor: isActive ? (t) => alpha(t.palette.primary.main, 0.08) : isPinned ? 'action.hover' : 'transparent',
        borderRight: '3px solid',
        borderRightColor: isActive ? 'primary.main' : 'transparent',
        '&:hover': { bgcolor: isActive ? undefined : 'action.hover' },
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
          {unreadCount > 0 ? (
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
          ) : (
            isUnread && <Box sx={{ bgcolor: 'success.main', width: 10, height: 10, borderRadius: '50%', flexShrink: 0 }} />
          )}
        </Box>
      </Box>

      <Menu
        anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
        anchorReference="anchorPosition"
        onClose={closeContextMenu}
        open={contextMenu !== null}
      >
        <MenuItem onClick={() => handleMenuAction(hasUnread ? 'markRead' : 'markUnread')}>
          {hasUnread ? <MarkChatReadIcon fontSize="small" sx={{ mr: 1.5 }} /> : <MarkChatUnreadIcon fontSize="small" sx={{ mr: 1.5 }} />}
          {hasUnread ? 'Mark as read' : 'Mark as unread'}
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction(isPinned ? 'unpin' : 'pin')}>
          <PushPinIcon fontSize="small" sx={{ mr: 1.5 }} />
          {isPinned ? 'Unpin' : 'Pin'}
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction(isMuted ? 'unmute' : 'mute')}>
          <NotificationsOffIcon fontSize="small" sx={{ mr: 1.5 }} />
          {isMuted ? 'Unmute' : 'Mute'}
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction(isArchived ? 'unarchive' : 'archive')}>
          {isArchived ? <UnarchiveIcon fontSize="small" sx={{ mr: 1.5 }} /> : <ArchiveIcon fontSize="small" sx={{ mr: 1.5 }} />}
          {isArchived ? 'Unarchive' : 'Archive'}
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')} sx={{ color: 'error.main' }}>
          <DeleteOutlineIcon fontSize="small" sx={{ mr: 1.5 }} />
          Delete Chat
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default memo(ConversationListItem)
