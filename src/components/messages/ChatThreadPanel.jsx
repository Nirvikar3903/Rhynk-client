import { useRef, useState } from 'react'
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
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import CloseIcon from '@mui/icons-material/Close'
import DoodleBackground from 'components/common/DoodleBackground'
import EmojiPicker from 'components/messages/EmojiPicker'
import AnimatedEmojiMessage from 'components/messages/AnimatedEmojiMessage'
import SendEffectMenu from 'components/messages/SendEffectMenu'
import MessageEffectOverlay from 'components/messages/MessageEffectOverlay'

// Matches a message that is exactly ONE emoji "unit" and nothing else — a
// single Extended_Pictographic codepoint, a flag (two regional-indicator
// codepoints), or a ZWJ/skin-tone sequence (family emoji, 👍🏽, etc). The
// naive `/^\p{Extended_Pictographic}$/u` the spec called for actually fails
// on very common emoji like ❤️ (base heart + a trailing U+FE0F variation
// selector is 2 codepoints, not 1) — this covers those cases too.
const SINGLE_EMOJI_REGEX =
  /^(\p{Regional_Indicator}{2}|\p{Extended_Pictographic}(️|\p{Emoji_Modifier})?(‍\p{Extended_Pictographic}(️|\p{Emoji_Modifier})?)*)$/u

const isSingleEmojiMessage = (text) => typeof text === 'string' && SINGLE_EMOJI_REGEX.test(text.trim())

const LONG_PRESS_MS = 450

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
  // A lone emoji renders as a large animated glyph with no bubble chrome
  // around it (Telegram/WhatsApp pattern), so header/timestamp text that
  // normally contrasts against the colored bubble background needs a
  // theme-adaptive color instead once that background goes away.
  const isEmojiOnly = isSingleEmojiMessage(message.text)
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

  const isGroup = Boolean(conversation?.isGroup)

  const bubbleHeader = isGroup && (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5, gap: 2 }}>
      <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: isMine ? (isEmojiOnly ? 'text.secondary' : 'primary.contrastText') : getSenderColor(message.senderName || conversation.name) }}>
        {isMine ? 'You' : (message.senderName || conversation.name)}
      </Typography>
      <IconButton
        className="bubble-chevron"
        onClick={(event) => setMenuAnchor(event.currentTarget)}
        size="small"
        sx={{
          p: 0,
          color: isMine ? (isEmojiOnly ? 'text.secondary' : 'rgba(255,255,255,0.8)') : 'text.secondary',
          opacity: 0,
          transition: 'opacity 0.15s ease',
          '&:hover': { opacity: '1 !important' },
        }}
      >
        <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  )

  const absoluteChevron = !isGroup && (
    <IconButton
      className="bubble-chevron"
      onClick={(event) => setMenuAnchor(event.currentTarget)}
      size="small"
      sx={{
        position: 'absolute',
        top: 6,
        right: 8,
        p: 0,
        color: isMine ? (isEmojiOnly ? 'text.secondary' : 'rgba(255,255,255,0.8)') : 'text.secondary',
        opacity: 0,
        transition: 'opacity 0.15s ease',
        '&:hover': { opacity: '1 !important' },
        zIndex: 2,
      }}
    >
      <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
    </IconButton>
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
        <MenuItem onClick={() => handleMenuAction(message.isStarred ? 'unstar' : 'star')}>
          {message.isStarred ? (
            <StarIcon fontSize="small" sx={{ mr: 1.5, color: 'warning.main' }} />
          ) : (
            <StarBorderIcon fontSize="small" sx={{ mr: 1.5 }} />
          )}
          {message.isStarred ? 'Unstar message' : 'Star message'}
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

  const messageContent = isEmojiOnly ? (
    <Box sx={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', my: 0.5 }}>
      <AnimatedEmojiMessage emoji={message.text.trim()} />
    </Box>
  ) : (
    <Typography variant="body1" sx={{ wordBreak: 'break-word', lineHeight: 1.4 }}>
      {message.text}
    </Typography>
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
            px: isEmojiOnly ? 0 : 2.25,
            py: isEmojiOnly ? 0 : 1.25,
            borderRadius: isEmojiOnly ? 0 : '16px',
            borderBottomRightRadius: 0,
            bgcolor: isEmojiOnly ? 'transparent' : 'custom.bubble.sent.background',
            color: isEmojiOnly ? 'text.primary' : 'custom.bubble.sent.text',
            position: 'relative',
            '&:hover .bubble-chevron': { opacity: 0.7 },
            // Custom CSS tail for sent bubble
            '&::after': isEmojiOnly
              ? undefined
              : {
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
          {absoluteChevron}
          {replyCard}
          {messageContent}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
            <Typography color={isEmojiOnly ? 'text.secondary' : undefined} sx={{ opacity: isEmojiOnly ? 1 : 0.7, fontSize: '0.75rem' }} variant="caption">
              {message.timestamp}
            </Typography>
            <DoneAllIcon
              sx={{
                fontSize: 14,
                color: message.seen ? 'custom.accent' : isEmojiOnly ? 'text.secondary' : 'inherit',
                opacity: message.seen || isEmojiOnly ? 1 : 0.7,
              }}
            />
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
              px: isEmojiOnly ? 0 : 2.25,
              py: isEmojiOnly ? 0 : 1.25,
              borderRadius: isEmojiOnly ? 0 : '16px',
              borderBottomLeftRadius: 0,
              bgcolor: isEmojiOnly ? 'transparent' : 'custom.bubble.received.background',
              color: isEmojiOnly ? 'text.primary' : 'custom.bubble.received.text',
              position: 'relative',
              '&:hover .bubble-chevron': { opacity: 0.7 },
              // Custom CSS tail for received bubble
              '&::after': isEmojiOnly
                ? undefined
                : {
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
            {absoluteChevron}
            {replyCard}
            {messageContent}
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
  activeEffect,
  onEffectComplete,
}) => {
  const composerInputRef = useRef(null)
  const [emojiAnchor, setEmojiAnchor] = useState(null)
  const [effectMenuAnchor, setEffectMenuAnchor] = useState(null)
  const longPressTimerRef = useRef(null)
  const longPressTriggeredRef = useRef(false)

  const handleComposerKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSend()
    }
  }

  const handleEmojiButtonClick = (event) => {
    setEmojiAnchor((current) => (current ? null : event.currentTarget))
  }

  // Inserts at the current cursor position (or replaces the selection) so
  // multiple emoji + typed text can be mixed together, then restores the
  // caret right after the inserted emoji instead of jumping to the end.
  const handleEmojiPick = (emojiData) => {
    const inputEl = composerInputRef.current
    const start = inputEl?.selectionStart ?? draft.length
    const end = inputEl?.selectionEnd ?? draft.length
    const nextDraft = draft.slice(0, start) + emojiData.emoji + draft.slice(end)
    onDraftChange(nextDraft)

    const nextCursor = start + emojiData.emoji.length
    // emoji-picker-react schedules its own requestAnimationFrame(() =>
    // element.focus()) on the clicked emoji button for grid keyboard-nav
    // accessibility, racing with the refocus below. Nesting one frame
    // deeper guarantees this one wins so typing resumes in the composer,
    // not on the emoji button.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        inputEl?.focus()
        inputEl?.setSelectionRange(nextCursor, nextCursor)
      })
    })
  }

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
  }

  // Telegram's "press and hold send" pattern: a short press still sends
  // normally (via handleSendClick below); holding past LONG_PRESS_MS opens
  // the effect picker instead and suppresses the click-triggered send that
  // follows the eventual mouseup/touchend.
  const handleSendPressStart = (event) => {
    if (!draft.trim()) return
    longPressTriggeredRef.current = false
    const anchor = event.currentTarget
    clearLongPressTimer()
    longPressTimerRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true
      setEffectMenuAnchor(anchor)
    }, LONG_PRESS_MS)
  }

  const handleSendPressEnd = () => {
    clearLongPressTimer()
  }

  const handleSendClick = () => {
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false
      return
    }
    onSend()
  }

  const handlePickEffect = (effectId) => {
    setEffectMenuAnchor(null)
    onSend(effectId)
  }

  return (
    <Box sx={{ flex: 1, minWidth: 0, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', height: '100vh', bgcolor: (t) => t.palette.mode === 'dark' ? 'background.default' : '#FAF9FF', position: 'relative' }}>
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
          <IconButton aria-label="Emoji" color="inherit" onClick={handleEmojiButtonClick} size="small">
            <MoodOutlinedIcon />
          </IconButton>
          <TextField
            fullWidth
            inputRef={composerInputRef}
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
            onClick={handleSendClick}
            onContextMenu={(event) => event.preventDefault()}
            onMouseDown={handleSendPressStart}
            onMouseLeave={handleSendPressEnd}
            onMouseUp={handleSendPressEnd}
            onTouchEnd={handleSendPressEnd}
            onTouchStart={handleSendPressStart}
            sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' }, '&.Mui-disabled': { bgcolor: 'action.disabledBackground' } }}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </Box>

        <EmojiPicker anchorEl={emojiAnchor} onClose={() => setEmojiAnchor(null)} onEmojiClick={handleEmojiPick} open={Boolean(emojiAnchor)} />
        <SendEffectMenu anchorEl={effectMenuAnchor} onClose={() => setEffectMenuAnchor(null)} onSelect={handlePickEffect} open={Boolean(effectMenuAnchor)} />
      </Box>

      <MessageEffectOverlay effect={activeEffect} onComplete={onEffectComplete} />
    </Box>
  )
}

export default ChatThreadPanel
