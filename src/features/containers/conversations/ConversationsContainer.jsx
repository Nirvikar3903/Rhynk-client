import { useState } from 'react'
import { Box } from '@mui/material'
import { toast } from 'react-toastify'
import ConversationListPanel from 'components/conversations/ConversationListPanel'
import EmptyConversationPanel from 'components/conversations/EmptyConversationPanel'

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
// the list panel and the (currently always-empty, since opening a thread is
// the `messages` domain's job, not built yet) right-hand panel.
const ConversationsContainer = () => {
  const [activeFilter, setActiveFilter] = useState('All')

  const handleNotImplemented = (label) => toast.info(`${label} is not implemented yet.`)

  const handleQuickAction = (key) => {
    if (key === 'group') return handleNotImplemented('Create Group')
    if (key === 'room') return handleNotImplemented('Start Room')
  }

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <ConversationListPanel
        activeFilter={activeFilter}
        archivedCount={12}
        conversations={MOCK_CONVERSATIONS}
        onArchivedClick={() => handleNotImplemented('Archived Chats')}
        onFilterChange={setActiveFilter}
        onNewMessage={() => handleNotImplemented('New Message')}
        onSearchClick={() => handleNotImplemented('Search')}
        onSelectConversation={(conversation) => handleNotImplemented(`Opening ${conversation.name}`)}
      />
      <EmptyConversationPanel onNewMessage={() => handleNotImplemented('New Message')} onQuickAction={handleQuickAction} />
    </Box>
  )
}

export default ConversationsContainer
