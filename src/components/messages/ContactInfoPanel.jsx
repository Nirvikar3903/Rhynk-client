import { Avatar, Badge, Box, Drawer, IconButton, Switch, Typography, alpha } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import CallIcon from '@mui/icons-material/Call'
import VideocamIcon from '@mui/icons-material/Videocam'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsOffOutlinedIcon from '@mui/icons-material/NotificationsOffOutlined'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import WallpaperIcon from '@mui/icons-material/Wallpaper'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import GraphicEqIcon from '@mui/icons-material/GraphicEq'
import BlockIcon from '@mui/icons-material/Block'
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined'

const PANEL_WIDTH = 380

// Card/tile radius matches theme.shape.borderRadius (12px, DESIGN.md's card
// radius — see src/theme/index.js); the panel's own outer corners go a
// notch softer (1.5x) so the floating panel reads as a level above the
// cards nested inside it.
const cardRadius = (t) => `${t.shape.borderRadius}px`
const panelRadius = (t) => `${t.shape.borderRadius * 1.5}px`

// Slide-in panel opened from the info icon in ChatThreadPanel's header —
// shows the info Rhynk actually has about the person/group in the open
// thread. Props-only (see [[create-component]]); MessagesContainer owns
// the open/close state since this has exactly one caller (see
// [[11-modal-flow-pattern]]).
const ContactInfoPanel = ({ open, conversation, onClose, onCall, onVideoCall, onSearchInChat, onToggleMute, onWallpaperClick, onBlock, onReport }) => {
  if (!conversation) return null

  const isMuted = Boolean(conversation.isMuted)
  const sharedMedia = conversation.sharedMedia ?? []
  const extraMediaCount = Math.max((conversation.sharedMediaCount ?? sharedMedia.length) - sharedMedia.length, 0)

  const quickActions = [
    { key: 'message', icon: ChatBubbleOutlineIcon, label: 'Message', onClick: onClose },
    { key: 'call', icon: CallIcon, label: 'Voice', onClick: onCall },
    { key: 'video', icon: VideocamIcon, label: 'Video', onClick: onVideoCall },
    { key: 'search', icon: SearchIcon, label: 'Search', onClick: onSearchInChat },
    { key: 'mute', icon: NotificationsOffOutlinedIcon, label: isMuted ? 'Unmute' : 'Mute', onClick: onToggleMute },
  ]

  return (
    <Drawer
      anchor="right"
      onClose={onClose}
      open={open}
      slotProps={{
        paper: {
          sx: {
            width: PANEL_WIDTH,
            bgcolor: 'background.default',
            borderTopLeftRadius: panelRadius,
            borderBottomLeftRadius: panelRadius,
            boxShadow: '-16px 0 40px rgba(20, 20, 26, 0.14)',
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1.5 }}>
        <IconButton aria-label="Close" onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ px: 3.5, pb: 5, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 0.75 }}>
          <Box sx={{ position: 'relative', mb: 1.25 }}>
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                bgcolor: conversation.avatarColor,
                opacity: 0.2,
                filter: 'blur(24px)',
                transform: 'scale(1.3)',
              }}
            />
            <Badge
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              invisible={!conversation.isOnline}
              overlap="circular"
              sx={{ position: 'relative', '& .MuiBadge-badge': { bgcolor: (t) => t.palette.custom.accent, border: '3px solid', borderColor: 'background.paper', width: 16, height: 16, borderRadius: '50%' } }}
              variant="dot"
            >
              <Avatar sx={{ width: 112, height: 112, fontSize: 36, bgcolor: conversation.avatarColor, border: '4px solid', borderColor: 'background.paper', boxShadow: 3 }}>
                {conversation.initials}
              </Avatar>
            </Badge>
          </Box>
          <Typography sx={{ fontWeight: 700 }} variant="h2">
            {conversation.name}
          </Typography>
          <Typography color={conversation.isOnline ? undefined : 'text.secondary'} sx={{ fontWeight: 500, color: conversation.isOnline ? (t) => t.palette.custom.accent : undefined }} variant="body2">
            {conversation.isOnline ? 'Online' : 'Offline'}
          </Typography>
          {conversation.phone && (
            <Typography color="text.secondary" variant="body2">
              {conversation.phone}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
          {quickActions.map((action) => (
            <Box key={action.key} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75 }}>
              <IconButton
                onClick={action.onClick}
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: 'background.paper',
                  color: 'primary.main',
                  boxShadow: 1,
                  '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText' },
                }}
              >
                <action.icon fontSize="small" />
              </IconButton>
              <Typography color="text.secondary" sx={{ fontSize: 11, fontWeight: 500 }}>
                {action.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {conversation.bio && (
          <Box component="section" sx={{ bgcolor: 'background.paper', borderRadius: cardRadius, p: 2.5, boxShadow: 1, border: '1px solid', borderColor: (t) => alpha(t.palette.divider, 0.6) }}>
            <Typography color="text.secondary" sx={{ fontWeight: 700, letterSpacing: '0.05em', mb: 1.25, display: 'block' }} variant="caption">
              ABOUT
            </Typography>
            <Typography sx={{ lineHeight: 1.7 }} variant="body2">
              {conversation.bio}
            </Typography>
          </Box>
        )}

        {sharedMedia.length > 0 && (
          <Box component="section">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography color="text.secondary" sx={{ fontWeight: 700, letterSpacing: '0.05em' }} variant="caption">
                SHARED MEDIA
              </Typography>
              <Typography color="primary.main" sx={{ fontWeight: 600, fontSize: 12, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                View All ({conversation.sharedMediaCount ?? sharedMedia.length})
              </Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
              {sharedMedia.map((item, index) => {
                const isLast = index === sharedMedia.length - 1 && extraMediaCount > 0
                return (
                  <Box
                    key={item.id}
                    sx={{
                      position: 'relative',
                      aspectRatio: '1 / 1',
                      borderRadius: cardRadius,
                      bgcolor: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      '&:hover': { opacity: 0.9 },
                    }}
                  >
                    <GraphicEqIcon sx={{ color: 'rgba(255,255,255,0.85)' }} />
                    {isLast && (
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: cardRadius,
                          bgcolor: 'rgba(0,0,0,0.5)',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: 14,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        +{extraMediaCount}
                      </Box>
                    )}
                  </Box>
                )
              })}
            </Box>
          </Box>
        )}

        {conversation.mutualGroups?.length > 0 && (
          <Box component="section">
            <Typography color="text.secondary" sx={{ fontWeight: 700, letterSpacing: '0.05em', mb: 2, display: 'block' }} variant="caption">
              MUTUAL GROUPS
            </Typography>
            {conversation.mutualGroups.map((group) => (
              <Box
                key={group.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: cardRadius,
                  border: '1px solid',
                  borderColor: (t) => alpha(t.palette.divider, 0.6),
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Box sx={{ width: 40, height: 40, borderRadius: cardRadius, bgcolor: 'primary.main', color: 'primary.contrastText', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <GraphicEqIcon fontSize="small" />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography noWrap sx={{ fontWeight: 600 }} variant="body2">
                    {group.name}
                  </Typography>
                  <Typography color="text.secondary" variant="caption">
                    {group.memberCount} members
                  </Typography>
                </Box>
                <ChevronRightIcon fontSize="small" sx={{ color: 'text.disabled' }} />
              </Box>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.25 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <NotificationsOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography variant="body2">Mute notifications</Typography>
            </Box>
            <Switch checked={isMuted} onChange={onToggleMute} size="small" />
          </Box>

          <Box
            onClick={onWallpaperClick}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.25, px: 1, mx: -1, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' }, borderRadius: cardRadius }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <WallpaperIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography variant="body2">Wallpaper &amp; sound</Typography>
            </Box>
            <ChevronRightIcon fontSize="small" sx={{ color: 'text.disabled' }} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.25 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <LockOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography variant="body2">Encryption</Typography>
            </Box>
            <Typography color="text.disabled" variant="caption">
              Not enabled
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pt: 2, borderTop: '1px solid', borderColor: (t) => alpha(t.palette.divider, 0.6) }}>
          <Box
            onClick={onBlock}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.25, px: 1, mx: -1, cursor: 'pointer', color: 'error.main', '&:hover': { bgcolor: 'action.hover' }, borderRadius: cardRadius }}
          >
            <BlockIcon fontSize="small" />
            <Typography variant="body2">Block {conversation.name}</Typography>
          </Box>
          <Box
            onClick={onReport}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.25, px: 1, mx: -1, cursor: 'pointer', color: 'error.main', '&:hover': { bgcolor: 'action.hover' }, borderRadius: cardRadius }}
          >
            <ReportOutlinedIcon fontSize="small" />
            <Typography variant="body2">Report contact</Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  )
}

export default ContactInfoPanel
