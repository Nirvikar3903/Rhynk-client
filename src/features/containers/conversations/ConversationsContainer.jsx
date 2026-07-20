import { useState } from 'react'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ConversationListPanel from 'components/conversations/ConversationListPanel'
import EmptyConversationPanel from 'components/conversations/EmptyConversationPanel'
import MessagesContainer from 'features/containers/messages/MessagesContainer'

// Hardcoded for now — there's no conversations RTK Query endpoint yet (see
// [[05-state-data-layer]]); once `store/api/conversations.apislice.js`
// exists, this becomes `useGetConversationsQuery()` and this array goes
// away. Kept intentionally small (3) rather than matching a full inbox.
const MOCK_CONVERSATIONS = [
  {
    id: '1',
    name: 'Elena Rodriguez',
    initials: 'ER',
    avatarColor: 'primary.main',
    timestamp: '10:42 AM',
    preview: "The new mix sounds incredible! Let's discuss the bass levels.",
    isOnline: true,
    isPinned: true,
  },
  {
    id: '2',
    name: 'Sarah Jenkins',
    initials: 'SJ',
    avatarColor: 'info.main',
    timestamp: '2:15 PM',
    preview: 'Sent a new playlist link!',
    unreadCount: 2,
  },
  {
    id: '3',
    name: 'Marcus Thorne',
    initials: 'MT',
    avatarColor: 'warning.main',
    timestamp: 'Monday',
    preview: 'Thanks for the feedback on the track.',
  },
]

// Owns the conversation list + which filter/conversation is active; renders
// the list panel and, once a conversation is selected, hands the right-hand
// panel off to MessagesContainer — opening a thread is the `messages`
// domain's job, not the conversations domain's.
const ConversationsContainer = () => {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedConversationId, setSelectedConversationId] = useState(null)

  const handleNotImplemented = (label) => toast.info(`${label} is not implemented yet.`)

  const handleQuickAction = (key) => {
    if (key === 'group') return navigate('/groups/new')
    if (key === 'room') return handleNotImplemented('Start Room')
  }

  const selectedConversation = MOCK_CONVERSATIONS.find((conversation) => conversation.id === selectedConversationId)

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <ConversationListPanel
        activeConversationId={selectedConversationId}
        activeFilter={activeFilter}
        archivedCount={12}
        conversations={MOCK_CONVERSATIONS}
        onArchivedClick={() => handleNotImplemented('Archived Chats')}
        onFilterChange={setActiveFilter}
        onNewMessage={() => handleNotImplemented('New Message')}
        onSearchClick={() => handleNotImplemented('Search')}
        onSelectConversation={(conversation) => setSelectedConversationId(conversation.id)}
      />
      {selectedConversation ? (
        <MessagesContainer conversation={selectedConversation} />
      ) : (
        <EmptyConversationPanel onNewMessage={() => handleNotImplemented('New Message')} onQuickAction={handleQuickAction} />
      )}
    </Box>
  )
}

export default ConversationsContainer
