import { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import ChatThreadPanel from 'components/messages/ChatThreadPanel'
import ForwardMessageModal from 'components/messages/ForwardMessageModal'
import ContactInfoPanel from 'components/messages/ContactInfoPanel'
import { selectUser, selectAccessToken, selectCurrentUserId } from 'store/slices/auth.slice'
import {
  emitSendMessage,
  emitTypingStart,
  emitTypingStop,
  emitReactMessage,
  emitMarkRead,
  emitJoinConversation,
  getSocket,
} from 'services/socket'
import {
  useGetMessagesQuery,
  useSendMessageHttpMutation,
  useMarkConversationReadMutation,
  useToggleReactionMutation,
  useToggleStarMessageMutation,
} from 'store/api/messaging.apislice'
import { parseMessagesResponse } from 'store/parsers/messaging.parsers'

// Seed messages data — commented out, kept for local testing/reference
// const SEED_MESSAGES = {
//   1: [
//     { id: 'm1', sender: 'them', senderInitials: 'ER', text: "Hey! Did you get a chance to listen to the demo I sent over this morning? I think the bassline needs some work.", timestamp: '10:30 AM' },
//     { id: 'm2', sender: 'me', text: "Just finished listening to it. You're right about the low-end. It's a bit muddy around 200Hz.", timestamp: '10:35 AM', seen: true },
//     { id: 'm3', sender: 'them', senderInitials: 'ER', text: "Exactly! I'll try cleaning that up. Want to hop in a Music Room to iterate together live?", timestamp: '10:38 AM', replyTo: { senderName: 'You', text: "Just finished listening to it. You're right about the low-end. It's a bit muddy around 200Hz." } },
//     { id: 'm4', sender: 'me', text: "Perfect. Let's do it. I'll join in 5 mins!", timestamp: '10:41 AM', seen: true },
//     { id: 'm5', sender: 'them', senderInitials: 'ER', text: 'That new track is incredible!', timestamp: '10:42 AM', reactions: ['👍'] },
//   ],
//   4: [
//     { id: 'g1', sender: 'them', senderName: 'Gopal Menon', senderInitials: 'GM', text: "Yo! Who's got the stems for the bridge section?", timestamp: '11:02 AM' },
//     { id: 'g2', sender: 'them', senderName: 'Priya Nair', senderInitials: 'PN', text: "I've got them — uploading to the shared drive now.", timestamp: '11:05 AM' },
//     { id: 'g3', sender: 'me', text: "Nice, I'll start layering the pads once it's up.", timestamp: '11:07 AM', seen: true },
//     { id: 'g4', sender: 'them', senderName: 'Elena Rodriguez', senderInitials: 'ER', text: 'Dropping the new mix in 10 mins 🔥', timestamp: '11:20 AM' },
//     { id: 'g5', sender: 'them', senderName: 'Gopal Menon', senderInitials: 'GM', text: "Can't wait, let's do a listening session in the room after.", timestamp: '11:21 AM' },
//   ],
// }

const RECENT_FORWARD_TARGETS = [
  { id: 'sarah', name: 'Sarah', initials: 'S', avatarColor: 'primary.main' },
  { id: 'marcus', name: 'Marcus', initials: 'M', avatarColor: 'text.disabled' },
  { id: 'alex', name: 'Alex', initials: 'A', avatarColor: 'info.main' },
  { id: 'elena', name: 'Elena', initials: 'E', avatarColor: 'warning.main' },
  { id: 'james', name: 'James', initials: 'JC', avatarColor: 'success.main' },
]

const ALL_FORWARD_TARGETS = [
  { id: 'daniel', name: 'Daniel Chen', subtitle: 'Online', initials: 'DC', avatarColor: 'secondary.main', isOnline: true },
  { id: 'synthwave', name: 'Synth Wave Community', subtitle: '1,240 members', initials: 'SW', avatarColor: 'warning.main' },
  { id: 'maya', name: 'Maya Ishikawa', subtitle: 'Last seen 5m ago', initials: 'MI', avatarColor: 'info.main' },
  { id: 'leo', name: 'Leo Rodriguez', subtitle: 'Recording...', initials: 'LR', avatarColor: 'error.main' },
]

const MessagesContainer = ({ conversation, onConversationMenuAction, onToggleStarMessage, onMessageSent }) => {
  const user = useSelector(selectUser)
  const accessToken = useSelector(selectAccessToken)
  const currentUserId = useSelector(selectCurrentUserId)

  const { data: messagesApiData } = useGetMessagesQuery(
    { conversationId: conversation.id },
    { skip: !accessToken || !conversation.id },
  )

  const [sendMessageHttp] = useSendMessageHttpMutation()
  const [markReadHttp] = useMarkConversationReadMutation()
  const [toggleReactionHttp] = useToggleReactionMutation()
  const [toggleStarHttp] = useToggleStarMessageMutation()

  const [localMessages, setLocalMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const [forwardingMessage, setForwardingMessage] = useState(null)
  const [forwardSearch, setForwardSearch] = useState('')
  const [forwardSelectedIds, setForwardSelectedIds] = useState([])
  const [forwardNote, setForwardNote] = useState('')
  const [replyingToMessage, setReplyingToMessage] = useState(null)
  const [activeEffect, setActiveEffect] = useState(null)
  const [isInfoOpen, setIsInfoOpen] = useState(false)

  const typingTimerRef = useRef(null)

  // Mark conversation as read & join socket room on mount / opening thread
  useEffect(() => {
    if (conversation?.id) {
      emitJoinConversation(conversation.id)
      emitMarkRead(conversation.id)
      if (accessToken) {
        markReadHttp({ conversationId: conversation.id }).catch(() => { })
      }
    }
  }, [conversation?.id, accessToken, markReadHttp])

  // Sync API messages into local state
  useEffect(() => {
    const parsed = parseMessagesResponse(messagesApiData, currentUserId)
    setLocalMessages(parsed || [])
  }, [messagesApiData, currentUserId])

  // Subscribe to real-time socket events
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handleNewMessage = (msg) => {
      if (msg.conversationId === conversation.id) {
        const parsed = parseMessagesResponse({ data: [msg] }, currentUserId)
        if (parsed.length > 0) {
          setLocalMessages((prev) => {
            if (prev.some((existing) => existing.id === parsed[0].id)) return prev
            return [...prev, parsed[0]]
          })
        }
      }
    }

    const handleMessageReacted = ({ messageId, conversationId, reactions }) => {
      if (conversationId === conversation.id) {
        const reactionEmojis = Array.isArray(reactions)
          ? reactions.map((r) => (typeof r === 'string' ? r : r.emoji))
          : []

        setLocalMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, reactions: reactionEmojis } : msg,
          ),
        )
      }
    }

    const handleUserTyping = ({ conversationId }) => {
      if (conversationId === conversation.id) {
        setIsTyping(true)
      }
    }

    const handleUserStoppedTyping = ({ conversationId }) => {
      if (conversationId === conversation.id) {
        setIsTyping(false)
      }
    }

    socket.on('new_message', handleNewMessage)
    socket.on('message_reacted', handleMessageReacted)
    socket.on('user_typing', handleUserTyping)
    socket.on('user_stopped_typing', handleUserStoppedTyping)

    return () => {
      socket.off('new_message', handleNewMessage)
      socket.off('message_reacted', handleMessageReacted)
      socket.off('user_typing', handleUserTyping)
      socket.off('user_stopped_typing', handleUserStoppedTyping)
    }
  }, [conversation.id, currentUserId])

  // Typing indicator emission
  const handleDraftChange = (newDraft) => {
    setDraft(newDraft)

    if (conversation?.id) {
      emitTypingStart(conversation.id)

      if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
      typingTimerRef.current = setTimeout(() => {
        emitTypingStop(conversation.id)
      }, 1500)
    }
  }

  const handleSend = async (effectId) => {
    const text = draft.trim()
    if (!text) return

    emitTypingStop(conversation.id)

    const metadata = {}
    if (replyingToMessage) {
      metadata.replyToId = replyingToMessage.id
      metadata.replyToText = replyingToMessage.text
      metadata.replyToSender = replyingToMessage.sender === 'me' ? 'You' : conversation.name
    }
    if (effectId) {
      metadata.effect = effectId
      setActiveEffect(effectId)
    }

    const payload = {
      conversationId: conversation.id,
      content: text,
      type: 'TEXT',
      metadata,
    }

    // 1. Broadcast via WebSockets for instant peer delivery
    emitSendMessage(payload)

    // 2. Persist message to MongoDB database via HTTP REST endpoint
    try {
      await sendMessageHttp(payload).unwrap()
      refetch()
    } catch {
      // Fallback
    }

    // Optimistic UI append
    const replyTo = replyingToMessage
      ? {
        senderName: replyingToMessage.sender === 'me' ? 'You' : conversation.name,
        text: replyingToMessage.text,
      }
      : null

    const optimisticMsg = {
      id: `local-${Date.now()}`,
      conversationId: conversation.id,
      sender: 'me',
      senderId: currentUserId,
      text,
      timestamp: 'Just now',
      seen: false,
      replyTo,
      effect: effectId || null,
      reactions: [],
      isStarred: false,
    }

    setLocalMessages((prev) => {
      if (prev.some((m) => m.text === text && m.timestamp === 'Just now')) return prev
      return [...prev, optimisticMsg]
    })
    onMessageSent?.({ conversationId: conversation.id, text, timestamp: 'Just now' })
    setDraft('')
    setReplyingToMessage(null)
  }

  const handleEffectComplete = () => setActiveEffect(null)

  const handleNotImplemented = (label) => toast.info(`${label} is not implemented yet.`)

  const handleOpenForward = (message) => {
    setForwardingMessage(message)
    setForwardSearch('')
    setForwardSelectedIds([])
    setForwardNote('')
  }

  const handleCloseForward = () => setForwardingMessage(null)

  const handleToggleForwardTarget = (id) => {
    setForwardSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((existingId) => existingId !== id) : [...prev, id],
    )
  }

  const filteredForwardContacts = useMemo(() => {
    const query = forwardSearch.trim().toLowerCase()
    if (!query) return ALL_FORWARD_TARGETS
    return ALL_FORWARD_TARGETS.filter((target) => target.name.toLowerCase().includes(query))
  }, [forwardSearch])

  const selectedForwardTargets = useMemo(
    () =>
      [...RECENT_FORWARD_TARGETS, ...ALL_FORWARD_TARGETS].filter((target) =>
        forwardSelectedIds.includes(target.id),
      ),
    [forwardSelectedIds],
  )

  const handleSendForward = () => {
    const count = selectedForwardTargets.length
    toast.success(`Forwarded to ${count} recipient${count === 1 ? '' : 's'}.`)
    setForwardingMessage(null)
  }

  const handleReactMessage = (message, emoji) => {
    const messageId = message.id

    // Optimistic UI update
    setLocalMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const currentReactions = msg.reactions || []
          const exists = currentReactions.includes(emoji)
          const newReactions = exists
            ? currentReactions.filter((r) => r !== emoji)
            : [...currentReactions, emoji]
          return { ...msg, reactions: newReactions }
        }
        return msg
      }),
    )

    // Emit Socket reaction & HTTP fallback
    emitReactMessage({ messageId, emoji }, (ack) => {
      if (!ack?.success) {
        toggleReactionHttp({ messageId, emoji }).catch(() => { })
      }
    })
  }

  const handleDeleteMessage = (message) => {
    setLocalMessages((prev) => prev.filter((msg) => msg.id !== message.id))
  }

  const handleToggleStarMessage = (message) => {
    const isStarred = !message.isStarred
    setLocalMessages((prev) =>
      prev.map((msg) => (msg.id === message.id ? { ...msg, isStarred } : msg)),
    )
    if (message.id && !message.id.startsWith('local-')) {
      toggleStarHttp({ messageId: message.id }).catch(() => { })
    }
    onToggleStarMessage?.(conversation, { ...message, isStarred })
    toast.success(isStarred ? 'Message starred.' : 'Message unstarred.')
  }

  const handleToggleMute = () => {
    onConversationMenuAction?.(conversation.isMuted ? 'unmute' : 'mute', conversation)
  }

  const handleMessageMenuAction = (action, message) => {
    if (action === 'copy') {
      navigator.clipboard
        .writeText(message.text)
        .then(() => toast.success('Copied to clipboard.'))
        .catch(() => toast.error('Could not copy message.'))
      return
    }
    if (action === 'delete') return handleDeleteMessage(message)
    if (action === 'reply') {
      setReplyingToMessage(message)
      return
    }
    if (action === 'star' || action === 'unstar') return handleToggleStarMessage(message)
    handleNotImplemented(action)
  }

  const activeConversationWithTyping = useMemo(
    () => ({
      ...conversation,
      isTyping,
    }),
    [conversation, isTyping],
  )

  return (
    <>
      <ChatThreadPanel
        activeEffect={activeEffect}
        conversation={activeConversationWithTyping}
        draft={draft}
        messages={localMessages}
        onCall={() => handleNotImplemented('Voice call')}
        onCancelReply={() => setReplyingToMessage(null)}
        onDraftChange={handleDraftChange}
        onEffectComplete={handleEffectComplete}
        onForwardMessage={handleOpenForward}
        onInfo={() => setIsInfoOpen(true)}
        onMessageMenuAction={handleMessageMenuAction}
        onReactMessage={handleReactMessage}
        onSend={handleSend}
        onVideoCall={() => handleNotImplemented('Video call')}
        replyingToMessage={replyingToMessage}
      />

      <ContactInfoPanel
        conversation={conversation}
        onBlock={() => handleNotImplemented(`Block ${conversation.name}`)}
        onCall={() => handleNotImplemented('Voice call')}
        onClose={() => setIsInfoOpen(false)}
        onReport={() => handleNotImplemented('Report contact')}
        onSearchInChat={() => handleNotImplemented('Search in chat')}
        onToggleMute={handleToggleMute}
        onVideoCall={() => handleNotImplemented('Video call')}
        onWallpaperClick={() => handleNotImplemented('Wallpaper & sound')}
        open={isInfoOpen}
      />

      <ForwardMessageModal
        canSubmit={selectedForwardTargets.length > 0}
        contacts={filteredForwardContacts}
        draftMessage={forwardNote}
        messagePreview={forwardingMessage?.text ?? ''}
        onClose={handleCloseForward}
        onDraftMessageChange={setForwardNote}
        onSearchChange={setForwardSearch}
        onSubmit={handleSendForward}
        onToggleTarget={handleToggleForwardTarget}
        open={Boolean(forwardingMessage)}
        recentContacts={RECENT_FORWARD_TARGETS}
        searchQuery={forwardSearch}
        selectedIds={forwardSelectedIds}
        selectedTargets={selectedForwardTargets}
      />
    </>
  )
}

export default MessagesContainer
