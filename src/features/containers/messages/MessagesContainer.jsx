import { useState } from 'react'
import { toast } from 'react-toastify'
import ChatThreadPanel from 'components/messages/ChatThreadPanel'

// Hardcoded for now — there's no messages RTK Query endpoint yet (see
// [[05-state-data-layer]]); once one exists this becomes
// `useGetMessagesQuery(conversation.id)` and this map goes away. Keyed by
// the conversation id from ConversationsContainer's own mock data.
const SEED_MESSAGES = {
  1: [
    { id: 'm1', sender: 'them', senderInitials: 'ER', text: "Hey! Did you get a chance to listen to the demo I sent over this morning? I think the bassline needs some work.", timestamp: '10:30 AM' },
    { id: 'm2', sender: 'me', text: "Just finished listening to it. You're right about the low-end. It's a bit muddy around 200Hz.", timestamp: '10:35 AM', seen: true },
    { id: 'm3', sender: 'them', senderInitials: 'ER', text: "Exactly! I'll try cleaning that up. Want to hop in a Music Room to iterate together live?", timestamp: '10:38 AM' },
    { id: 'm4', sender: 'me', text: "Perfect. Let's do it. I'll join in 5 mins!", timestamp: '10:41 AM', seen: true },
    { id: 'm5', sender: 'them', senderInitials: 'ER', text: 'That new track is incredible!', timestamp: '10:42 AM' },
  ],
}

// Owns the active thread for whichever conversation ConversationsContainer
// has selected — matches the "opening a thread is the messages domain's
// job" split already noted in ConversationsContainer.
const MessagesContainer = ({ conversation }) => {
  const [messagesByConversation, setMessagesByConversation] = useState(SEED_MESSAGES)
  const [draft, setDraft] = useState('')

  const messages = messagesByConversation[conversation.id] ?? []

  const handleSend = () => {
    const text = draft.trim()
    if (!text) return

    const newMessage = { id: `local-${Date.now()}`, sender: 'me', text, timestamp: 'Just now', seen: false }
    setMessagesByConversation((prev) => ({
      ...prev,
      [conversation.id]: [...(prev[conversation.id] ?? []), newMessage],
    }))
    setDraft('')
  }

  const handleNotImplemented = (label) => toast.info(`${label} is not implemented yet.`)

  return (
    <ChatThreadPanel
      conversation={conversation}
      draft={draft}
      messages={messages}
      onCall={() => handleNotImplemented('Voice call')}
      onDraftChange={setDraft}
      onInfo={() => handleNotImplemented('Conversation info')}
      onSend={handleSend}
      onVideoCall={() => handleNotImplemented('Video call')}
    />
  )
}

export default MessagesContainer
