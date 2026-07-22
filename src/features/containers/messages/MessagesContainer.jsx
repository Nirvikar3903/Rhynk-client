import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import ChatThreadPanel from 'components/messages/ChatThreadPanel'
import ForwardMessageModal from 'components/messages/ForwardMessageModal'
import ContactInfoPanel from 'components/messages/ContactInfoPanel'

// Hardcoded for now — there's no messages RTK Query endpoint yet (see
// [[05-state-data-layer]]); once one exists this becomes
// `useGetMessagesQuery(conversation.id)` and this map goes away. Keyed by
// the conversation id from ConversationsContainer's own mock data.
const SEED_MESSAGES = {
  1: [
    { id: 'm1', sender: 'them', senderInitials: 'ER', text: "Hey! Did you get a chance to listen to the demo I sent over this morning? I think the bassline needs some work.", timestamp: '10:30 AM' },
    { id: 'm2', sender: 'me', text: "Just finished listening to it. You're right about the low-end. It's a bit muddy around 200Hz.", timestamp: '10:35 AM', seen: true },
    { id: 'm3', sender: 'them', senderInitials: 'ER', text: "Exactly! I'll try cleaning that up. Want to hop in a Music Room to iterate together live?", timestamp: '10:38 AM', replyTo: { senderName: 'You', text: "Just finished listening to it. You're right about the low-end. It's a bit muddy around 200Hz." } },
    { id: 'm4', sender: 'me', text: "Perfect. Let's do it. I'll join in 5 mins!", timestamp: '10:41 AM', seen: true },
    { id: 'm5', sender: 'them', senderInitials: 'ER', text: 'That new track is incredible!', timestamp: '10:42 AM', reactions: ['👍'] },
  ],
}

// Hardcoded for now — there's no contacts/groups RTK Query endpoint yet
// (see [[05-state-data-layer]]); once one exists these become queries and
// this data goes away.
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

// Owns the active thread for whichever conversation ConversationsContainer
// has selected — matches the "opening a thread is the messages domain's
// job" split already noted in ConversationsContainer.
const MessagesContainer = ({ conversation, onToggleStarMessage, onConversationMenuAction }) => {
  const [messagesByConversation, setMessagesByConversation] = useState(SEED_MESSAGES)
  const [draft, setDraft] = useState('')

  const [forwardingMessage, setForwardingMessage] = useState(null)
  const [forwardSearch, setForwardSearch] = useState('')
  const [forwardSelectedIds, setForwardSelectedIds] = useState([])
  const [forwardNote, setForwardNote] = useState('')
  const [replyingToMessage, setReplyingToMessage] = useState(null)
  const [activeEffect, setActiveEffect] = useState(null)
  const [isInfoOpen, setIsInfoOpen] = useState(false)

  const messages = messagesByConversation[conversation.id] ?? []

  // effectId is only set when the message was sent via the long-press
  // "send with effect" menu (see ChatThreadPanel/SendEffectMenu) — a plain
  // Enter/click send calls this with no argument. There's no backend/socket
  // layer yet (see [[07-realtime-sockets]]), so there's no real recipient
  // session to trigger playback for; the effect plays once, immediately, in
  // the sender's own view.
  const handleSend = (effectId) => {
    const text = draft.trim()
    if (!text) return

    const replyTo = replyingToMessage
      ? {
          senderName: replyingToMessage.sender === 'me' ? 'You' : conversation.name,
          text: replyingToMessage.text,
        }
      : undefined

    const newMessage = { id: `local-${Date.now()}`, sender: 'me', text, timestamp: 'Just now', seen: false, replyTo, effect: effectId }
    setMessagesByConversation((prev) => ({
      ...prev,
      [conversation.id]: [...(prev[conversation.id] ?? []), newMessage],
    }))
    setDraft('')
    if (effectId) setActiveEffect(effectId)
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
    setForwardSelectedIds((prev) => (prev.includes(id) ? prev.filter((existingId) => existingId !== id) : [...prev, id]))
  }

  const filteredForwardContacts = useMemo(() => {
    const query = forwardSearch.trim().toLowerCase()
    if (!query) return ALL_FORWARD_TARGETS
    return ALL_FORWARD_TARGETS.filter((target) => target.name.toLowerCase().includes(query))
  }, [forwardSearch])

  const selectedForwardTargets = useMemo(
    () => [...RECENT_FORWARD_TARGETS, ...ALL_FORWARD_TARGETS].filter((target) => forwardSelectedIds.includes(target.id)),
    [forwardSelectedIds],
  )

  const handleSendForward = () => {
    const count = selectedForwardTargets.length
    toast.success(`Forwarded to ${count} recipient${count === 1 ? '' : 's'}.`)
    setForwardingMessage(null)
  }

  const handleReactMessage = (message, emoji) => {
    setMessagesByConversation((prev) => {
      const list = prev[conversation.id] ?? []
      const updated = list.map((msg) => {
        if (msg.id === message.id) {
          const currentReactions = msg.reactions || []
          const exists = currentReactions.includes(emoji)
          const newReactions = exists
            ? currentReactions.filter((r) => r !== emoji)
            : [...currentReactions, emoji]
          return { ...msg, reactions: newReactions }
        }
        return msg
      })
      return {
        ...prev,
        [conversation.id]: updated,
      }
    })
  }

  const handleDeleteMessage = (message) => {
    setMessagesByConversation((prev) => ({
      ...prev,
      [conversation.id]: (prev[conversation.id] ?? []).filter((existing) => existing.id !== message.id),
    }))
  }

  const handleToggleStarMessage = (message) => {
    const isStarred = !message.isStarred
    setMessagesByConversation((prev) => ({
      ...prev,
      [conversation.id]: (prev[conversation.id] ?? []).map((msg) => (msg.id === message.id ? { ...msg, isStarred } : msg)),
    }))
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

  return (
    <>
      <ChatThreadPanel
        conversation={conversation}
        draft={draft}
        messages={messages}
        onCall={() => handleNotImplemented('Voice call')}
        onDraftChange={setDraft}
        onForwardMessage={handleOpenForward}
        onInfo={() => setIsInfoOpen(true)}
        onMessageMenuAction={handleMessageMenuAction}
        onReactMessage={handleReactMessage}
        onSend={handleSend}
        onVideoCall={() => handleNotImplemented('Video call')}
        replyingToMessage={replyingToMessage}
        onCancelReply={() => setReplyingToMessage(null)}
        activeEffect={activeEffect}
        onEffectComplete={handleEffectComplete}
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
