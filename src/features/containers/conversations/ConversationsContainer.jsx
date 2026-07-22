import { useState } from 'react'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ConversationListPanel from 'components/conversations/ConversationListPanel'
import EmptyConversationPanel from 'components/conversations/EmptyConversationPanel'
import MessagesContainer from 'features/containers/messages/MessagesContainer'
import NewChatModal from 'components/conversations/NewChatModal'

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

const ConversationsContainer = () => {
  const navigate = useNavigate()
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS)
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedConversationId, setSelectedConversationId] = useState(null)
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)
  const [isViewingArchived, setIsViewingArchived] = useState(false)

  const handleNotImplemented = (label) => toast.info(`${label} is not implemented yet.`)

  const handleQuickAction = (key) => {
    if (key === 'group') {
      setIsNewChatOpen(true)
    } else if (key === 'room') {
      handleNotImplemented('Start Room')
    }
  }

  const handleCreateGroup = (groupName, selectedMembers, isMusicRoom) => {
    const initials = groupName
      .split(' ')
      .map((word) => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'GP'

    const newGroup = {
      id: `group-${Date.now()}`,
      name: groupName,
      initials,
      avatarColor: isMusicRoom ? 'success.main' : 'primary.main',
      timestamp: 'Just now',
      preview: `Group created with ${selectedMembers.map((m) => m.name.split(' ')[0]).join(', ')}`,
      isGroup: true,
      isMusicRoom,
      members: selectedMembers,
    }

    setConversations((prev) => [newGroup, ...prev])
    setActiveFilter('Groups') // Switch to Groups tab immediately so it's visible!
    setSelectedConversationId(newGroup.id) // Automatically select the new group
    toast.success(`Group "${groupName}" created successfully!`)
  }

  const handleStartDirectChat = (contact) => {
    // Check if direct chat already exists with this person
    const existing = conversations.find((c) => !c.isGroup && c.name === contact.name)
    if (existing) {
      setSelectedConversationId(existing.id)
      return
    }

    const initials = contact.name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()

    const newDirect = {
      id: `direct-${Date.now()}`,
      name: contact.name,
      initials,
      avatarColor: 'info.main',
      timestamp: 'Just now',
      preview: 'Conversation started',
      isOnline: contact.isOnline || contact.isLive,
    }

    setConversations((prev) => [newDirect, ...prev])
    setActiveFilter('All')
    setSelectedConversationId(newDirect.id)
  }

  const handleConversationMenuAction = (action, conversation) => {
    if (action === 'delete') {
      setConversations((prev) => prev.filter((c) => c.id !== conversation.id))
      if (selectedConversationId === conversation.id) setSelectedConversationId(null)
      toast.success(`Chat with ${conversation.name} deleted.`)
      return
    }

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversation.id) return c
        switch (action) {
          case 'markRead':
            return { ...c, unreadCount: 0, isUnread: false }
          case 'markUnread':
            return { ...c, isUnread: true }
          case 'pin':
            return { ...c, isPinned: true }
          case 'unpin':
            return { ...c, isPinned: false }
          case 'mute':
            return { ...c, isMuted: true }
          case 'unmute':
            return { ...c, isMuted: false }
          case 'archive':
            return { ...c, isArchived: true }
          case 'unarchive':
            return { ...c, isArchived: false }
          default:
            return c
        }
      }),
    )

    if (action === 'archive') toast.success(`Chat with ${conversation.name} archived.`)
    if (action === 'unarchive') toast.success(`Chat with ${conversation.name} unarchived.`)
  }

  // Pinned conversations float to the top, mock order preserved otherwise.
  const sortPinnedFirst = (list) => [...list].sort((a, b) => (b.isPinned === true) - (a.isPinned === true))

  // Filter conversations based on current sidebar filter
  const filteredConversations = sortPinnedFirst(
    conversations.filter((conversation) => {
      if (conversation.isArchived) return false
      if (activeFilter === 'Unread') return conversation.unreadCount > 0 || conversation.isUnread === true
      if (activeFilter === 'Favourites') return conversation.isPinned === true
      if (activeFilter === 'Groups') return conversation.isGroup === true
      return true // 'All'
    }),
  )

  const archivedConversations = sortPinnedFirst(conversations.filter((conversation) => conversation.isArchived))
  const archivedCount = archivedConversations.length
  const visibleConversations = isViewingArchived ? archivedConversations : filteredConversations

  const selectedConversation = conversations.find((conversation) => conversation.id === selectedConversationId)

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <ConversationListPanel
        activeConversationId={selectedConversationId}
        activeFilter={activeFilter}
        archivedCount={archivedCount}
        conversations={visibleConversations}
        isShowingArchived={isViewingArchived}
        onArchivedClick={() => setIsViewingArchived(true)}
        onBackFromArchived={() => setIsViewingArchived(false)}
        onConversationMenuAction={handleConversationMenuAction}
        onFilterChange={setActiveFilter}
        onNewMessage={() => setIsNewChatOpen(true)}
        onSearchClick={() => handleNotImplemented('Search')}
        onSelectConversation={(conversation) => setSelectedConversationId(conversation.id)}
      />
      {selectedConversation ? (
        <MessagesContainer conversation={selectedConversation} />
      ) : (
        <EmptyConversationPanel onNewMessage={() => setIsNewChatOpen(true)} onQuickAction={handleQuickAction} />
      )}

      <NewChatModal
        onCreateGroup={handleCreateGroup}
        onClose={() => setIsNewChatOpen(false)}
        onStartDirectChat={handleStartDirectChat}
        open={isNewChatOpen}
      />
    </Box>
  )
}

export default ConversationsContainer
