import { useState } from 'react'
import { Avatar, Badge, Box, IconButton, Menu, MenuItem, Popover, TextField, Typography, alpha } from '@mui/material'
import CallIcon from '@mui/icons-material/Call'
import VideocamIcon from '@mui/icons-material/Videocam'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined'
import MoodOutlinedIcon from '@mui/icons-material/MoodOutlined'
import SendIcon from '@mui/icons-material/Send'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import ReplyIcon from '@mui/icons-material/Reply'
import ForwardIcon from '@mui/icons-material/Forward'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import CloseIcon from '@mui/icons-material/Close'
import DoodleBackground from 'components/common/DoodleBackground'

const getSenderColor = (name) => {
  if (!name) return '#5B4FE9'
  if (name === 'You') return '#8A7FFF'
  const colors = ['#E28B5C', '#5C9DE2', '#5CE29D', '#D95CE2', '#E25C5C']
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

const REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏']

// One message bubble — received bubbles show the sender's avatar and lean
// left, sent bubbles lean right and use the theme's bubble.sent colors.
// Hovering a row reveals a quick-react emoji button and a dropdown (reply,
// forward, copy, delete) next to the bubble.
const MessageBubble = ({ message, onForward, onReact, onMenuAction, conversation }) => {
  const isMine = message.sender === 'me'
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [emojiAnchor, setEmojiAnchor] = useState(null)

  const handleMenuAction = (action) => {
    setMenuAnchor(null)
    if (action === 'forward') return onForward(message)
    onMenuAction(action, message)
  }

  const handleReact = (emoji) => {
    setEmojiAnchor(null)
    onReact(message, emoji)
  }

  const emojiButton = (
    <Box
      className="message-emoji-button"
      sx={{
        opacity: 0,
        transition: 'opacity 0.15s ease',
        alignSelf: 'center',
        flexShrink: 0,
      }}
    >
      <IconButton
        aria-label="React"
        onClick={(event) => setEmojiAnchor(event.currentTarget)}
        size="small"
        sx={{ color: 'text.secondary' }}
      >
        <MoodOutlinedIcon fontSize="small" />
      </IconButton>
    </Box>
  )

  const hasReactions = message.reactions && message.reactions.length > 0

  const reactionsElement = hasReactions && (
    <Box
      sx={{
        position: 'absolute',
        bottom: -10,
        left: isMine ? 'unset' : 16,
        right: isMine ? 16 : 'unset',
        display: 'flex',
        alignItems: 'center',
        gap: 0.25,
        bgcolor: (t) => (t.palette.mode === 'dark' ? '#2A2A31' : '#FFFFFF'),
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '12px',
        px: 0.75,
        py: 0.25,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 5,
      }}
    >
      {message.reactions.map((react, idx) => (
        <Typography key={idx} sx={{ fontSize: '0.75rem', lineHeight: 1 }}>
          {react}
        </Typography>
      ))}
    </Box>
  )

  const bubbleHeader = (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5, gap: 2 }}>
      <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: isMine ? 'primary.contrastText' : getSenderColor(message.senderName || conversation.name) }}>
        {isMine ? 'You' : (message.senderName || conversation.name)}
      </Typography>
      <IconButton
        className="bubble-chevron"
        onClick={(event) => setMenuAnchor(event.currentTarget)}
        size="small"
        sx={{
          p: 0,
          color: isMine ? 'rgba(255,255,255,0.8)' : 'text.secondary',
          opacity: 0,
          transition: 'opacity 0.15s ease',
          '&:hover': { opacity: '1 !important' },
        }}
      >
        <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  )

  const replyCard = message.replyTo && (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '3px solid',
        borderColor: getSenderColor(message.replyTo.senderName),
        bgcolor: isMine ? 'rgba(255, 255, 255, 0.1)' : (t) => alpha(t.palette.text.primary, 0.05),
        p: 1,
        mb: 1,
        borderRadius: 1,
      }}
    >
      <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: isMine ? '#FFFFFF' : getSenderColor(message.replyTo.senderName) }}>
        {message.replyTo.senderName}
      </Typography>
      <Typography variant="body2" sx={{ color: isMine ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary', fontSize: '0.85rem' }} noWrap>
        {message.replyTo.text}
      </Typography>
    </Box>
  )

  const menus = (
    <>
      <Popover
        anchorEl={emojiAnchor}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setEmojiAnchor(null)}
        open={Boolean(emojiAnchor)}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Box sx={{ display: 'flex', gap: 0.25, p: 0.75 }}>
          {REACTION_EMOJIS.map((emoji) => (
            <IconButton aria-label={`React with ${emoji}`} key={emoji} onClick={() => handleReact(emoji)} size="small">
              <Box component="span" sx={{ fontSize: 18, lineHeight: 1 }}>
                {emoji}
              </Box>
            </IconButton>
          ))}
        </Box>
      </Popover>

      <Menu anchorEl={menuAnchor} onClose={() => setMenuAnchor(null)} open={Boolean(menuAnchor)}>
        <MenuItem onClick={() => handleMenuAction('reply')}>
          <ReplyIcon fontSize="small" sx={{ mr: 1.5 }} />
          Reply
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('forward')}>
          <ForwardIcon fontSize="small" sx={{ mr: 1.5 }} />
          Forward
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('copy')}>
          <ContentCopyIcon fontSize="small" sx={{ mr: 1.5 }} />
          Copy text
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')} sx={{ color: 'error.main' }}>
          <DeleteOutlineIcon fontSize="small" sx={{ mr: 1.5 }} />
          Delete
        </MenuItem>
      </Menu>
    </>
  )

  if (isMine) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center', // Vertically center emoji button with the bubble
          gap: 1.5,
          mb: hasReactions ? '12px' : '0px',
          width: '100%',
          '&:hover .message-emoji-button': { opacity: 1 },
        }}
      >
        {emojiButton}
        <Box
          className="bubble-box"
          sx={{
            maxWidth: '70%',
            px: 2.25,
            py: 1.25,
            borderRadius: '16px',
            borderBottomRightRadius: 0,
            bgcolor: 'custom.bubble.sent.background',
            color: 'custom.bubble.sent.text',
            position: 'relative',
            '&:hover .bubble-chevron': { opacity: 0.7 },
            // Custom CSS tail for sent bubble
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              right: -6,
              width: 6,
              height: 8,
              bgcolor: 'custom.bubble.sent.background',
              clipPath: 'polygon(0 0, 0 100%, 100% 100%)',
            },
          }}
        >
          {bubbleHeader}
          {replyCard}
          <Typography variant="body1" sx={{ wordBreak: 'break-word', lineHeight: 1.4 }}>
            {message.text}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
            <Typography sx={{ opacity: 0.7, fontSize: '0.75rem' }} variant="caption">
              {message.timestamp}
            </Typography>
            <DoneAllIcon sx={{ fontSize: 14, color: message.seen ? 'custom.accent' : 'inherit', opacity: message.seen ? 1 : 0.7 }} />
          </Box>
          {reactionsElement}
        </Box>
        {menus}
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 1.5, mb: hasReactions ? '12px' : '0px' }}>
      <Avatar
        sx={{
          width: 28,
          height: 28,
          fontSize: 12,
          mb: hasReactions ? '32px' : '22px', // Align avatar bottom with bottom of bubble instead of timestamp
        }}
      >
        {message.senderInitials}
      </Avatar>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5, maxWidth: '70%', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', '&:hover .message-emoji-button': { opacity: 1 } }}>
          <Box
            className="bubble-box"
            sx={{
              flex: 1,
              px: 2.25,
              py: 1.25,
              borderRadius: '16px',
              borderBottomLeftRadius: 0,
              bgcolor: 'custom.bubble.received.background',
              color: 'custom.bubble.received.text',
              position: 'relative',
              '&:hover .bubble-chevron': { opacity: 0.7 },
              // Custom CSS tail for received bubble
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: -6,
                width: 6,
                height: 8,
                bgcolor: 'custom.bubble.received.background',
                clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
              },
            }}
          >
            {bubbleHeader}
            {replyCard}
            <Typography variant="body1" sx={{ wordBreak: 'break-word', lineHeight: 1.4 }}>
              {message.text}
            </Typography>
            {reactionsElement}
          </Box>
          {emojiButton}
        </Box>
        <Typography color="text.secondary" sx={{ fontSize: '0.75rem', pl: 0.5, mt: hasReactions ? '14px' : '4px' }} variant="caption">
          {message.timestamp}
        </Typography>
      </Box>
      {menus}
    </Box>
  )
}

// Right-hand column shown once a conversation is selected — header, message
// thread, composer. Props-only (see [[create-component]]); the container
// owns the conversation/messages/draft state and what each action does.
const ChatThreadPanel = ({
  conversation,
  messages,
  draft,
  onDraftChange,
  onSend,
  onCall,
  onVideoCall,
  onInfo,
  onForwardMessage,
  onReactMessage,
  onMessageMenuAction,
  replyingToMessage,
  onCancelReply,
}) => {
  const handleComposerKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSend()
    }
  }

  return (
    <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', height: '100vh', bgcolor: (t) => t.palette.mode === 'dark' ? 'background.default' : '#FAF9FF', position: 'relative' }}>
      <DoodleBackground position="absolute" />
      <Box
        sx={{
          height: 64,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Badge
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            invisible={!conversation.isOnline}
            overlap="circular"
            sx={{ '& .MuiBadge-badge': { bgcolor: 'success.main', border: '2px solid', borderColor: 'background.paper', width: 10, height: 10, borderRadius: '50%' } }}
            variant="dot"
          >
            <Avatar sx={{ width: 40, height: 40, bgcolor: conversation.avatarColor }}>{conversation.initials}</Avatar>
          </Badge>
          <Box>
            <Typography sx={{ fontWeight: 700, lineHeight: 1.2 }} variant="body1">
              {conversation.name}
            </Typography>
            <Typography color={conversation.isOnline ? 'success.main' : 'text.secondary'} sx={{ fontWeight: 500 }} variant="caption">
              {conversation.isOnline ? 'online' : 'offline'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton aria-label="Voice call" color="primary" onClick={onCall}>
            <CallIcon fontSize="small" />
          </IconButton>
          <IconButton aria-label="Video call" color="primary" onClick={onVideoCall}>
            <VideocamIcon fontSize="small" />
          </IconButton>
          <IconButton aria-label="Conversation info" onClick={onInfo}>
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2, position: 'relative', zIndex: 1 }}>
        {messages.length === 0 ? (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary" variant="body2">
              No messages yet — say hi to {conversation.name.split(' ')[0]}!
            </Typography>
          </Box>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} onForward={onForwardMessage} onMenuAction={onMessageMenuAction} onReact={onReactMessage} conversation={conversation} />
          ))
        )}
      </Box>

      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', position: 'relative', zIndex: 2 }}>
        {replyingToMessage && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: (t) => alpha(t.palette.background.default, 0.8),
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              p: 1.5,
              mb: 1.5,
              borderRadius: '8px 4px 4px 8px',
            }}
          >
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: 'primary.main', mb: 0.25 }}>
                Replying to {replyingToMessage.sender === 'me' ? 'You' : conversation.name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, fontSize: '0.85rem' }} noWrap>
                {replyingToMessage.text}
              </Typography>
            </Box>
            <IconButton onClick={onCancelReply} size="small" sx={{ ml: 1 }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 0.5,
            p: 0.5,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: (t) => alpha(t.palette.background.default, 0.6),
          }}
        >
          <IconButton aria-label="Attach" color="inherit" size="small">
            <AddCircleOutlineIcon />
          </IconButton>
          <IconButton aria-label="Emoji" color="inherit" size="small">
            <MoodOutlinedIcon />
          </IconButton>
          <TextField
            fullWidth
            maxRows={4}
            multiline
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={handleComposerKeyDown}
            placeholder="Type a message..."
            size="small"
            slotProps={{ input: { disableUnderline: true } }}
            value={draft}
            variant="standard"
          />
          <IconButton
            aria-label="Send"
            disabled={!draft.trim()}
            onClick={onSend}
            sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' }, '&.Mui-disabled': { bgcolor: 'action.disabledBackground' } }}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

export default ChatThreadPanel
