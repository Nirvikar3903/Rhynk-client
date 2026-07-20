import { Avatar, Badge, Box, IconButton, TextField, Typography, alpha } from '@mui/material'
import CallIcon from '@mui/icons-material/Call'
import VideocamIcon from '@mui/icons-material/Videocam'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined'
import MoodOutlinedIcon from '@mui/icons-material/MoodOutlined'
import SendIcon from '@mui/icons-material/Send'
import DoneAllIcon from '@mui/icons-material/DoneAll'

// One message bubble — received bubbles show the sender's avatar and lean
// left, sent bubbles lean right and use the theme's bubble.sent colors.
const MessageBubble = ({ message }) => {
  const isMine = message.sender === 'me'

  if (isMine) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', gap: 1 }}>
        <Box
          sx={{
            maxWidth: '70%',
            px: 2.25,
            py: 1.25,
            borderRadius: '16px',
            borderBottomRightRadius: 0,
            bgcolor: 'custom.bubble.sent.background',
            color: 'custom.bubble.sent.text',
            position: 'relative',
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
          <Typography variant="body1" sx={{ wordBreak: 'break-word', lineHeight: 1.4 }}>
            {message.text}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
            <Typography sx={{ opacity: 0.7, fontSize: '0.75rem' }} variant="caption">
              {message.timestamp}
            </Typography>
            <DoneAllIcon sx={{ fontSize: 14, color: message.seen ? 'custom.accent' : 'inherit', opacity: message.seen ? 1 : 0.7 }} />
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 1.5 }}>
      <Avatar
        sx={{
          width: 28,
          height: 28,
          fontSize: 12,
          mb: '22px', // Align avatar bottom with bottom of bubble instead of timestamp
        }}
      >
        {message.senderInitials}
      </Avatar>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5, maxWidth: '70%' }}>
        <Box
          sx={{
            px: 2.25,
            py: 1.25,
            borderRadius: '16px',
            borderBottomLeftRadius: 0,
            bgcolor: 'custom.bubble.received.background',
            color: 'custom.bubble.received.text',
            position: 'relative',
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
          <Typography variant="body1" sx={{ wordBreak: 'break-word', lineHeight: 1.4 }}>
            {message.text}
          </Typography>
        </Box>
        <Typography color="text.secondary" sx={{ fontSize: '0.75rem', pl: 0.5 }} variant="caption">
          {message.timestamp}
        </Typography>
      </Box>
    </Box>
  )
}

// Right-hand column shown once a conversation is selected — header, message
// thread, composer. Props-only (see [[create-component]]); the container
// owns the conversation/messages/draft state and what each action does.
const ChatThreadPanel = ({ conversation, messages, draft, onDraftChange, onSend, onCall, onVideoCall, onInfo }) => {
  const handleComposerKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSend()
    }
  }

  return (
    <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
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

      <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {messages.length === 0 ? (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary" variant="body2">
              No messages yet — say hi to {conversation.name.split(' ')[0]}!
            </Typography>
          </Box>
        ) : (
          messages.map((message) => <MessageBubble key={message.id} message={message} />)
        )}
      </Box>

      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
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
