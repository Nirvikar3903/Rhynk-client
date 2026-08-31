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
    bio: 'Creative Director & Sound Designer. Exploring the intersection of digital landscapes and nostalgic synth-wave textures. Always up for a collab on new tracks. 🎹✨',
    phone: '+1 555 0182',
    sharedMedia: [
      { id: 'media-1', color: 'secondary.main' },
      { id: 'media-2', color: 'primary.main' },
      { id: 'media-3', color: 'warning.main' },
    ],
    sharedMediaCount: 42,
    mutualGroups: [{ id: 'group-swc', name: 'Synth Wave Collab', memberCount: 128 }],
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
  {
    id: '4',
    name: 'Synth Wave Collab',
    initials: 'SW',
    avatarColor: 'success.main',
    timestamp: '11:21 AM',
    preview: 'Gopal Menon: Can’t wait, let’s do a listening session in the room after.',
    isGroup: true,
    isMusicRoom: true,
    members: [
      { id: 'm1', name: 'Elena Rodriguez', initials: 'ER', avatarColor: 'primary.main' },
      { id: 'm2', name: 'Gopal Menon', initials: 'GM', avatarColor: 'info.main' },
      { id: 'm3', name: 'Priya Nair', initials: 'PN', avatarColor: 'secondary.main' },
    ],
  },
]

const MOCK_STARRED_MESSAGES = [
  {
    id: 'star-1',
    conversationId: '1',
    conversationName: 'Elena Rodriguez',
    senderName: 'Elena Rodriguez',
    initials: 'ER',
    avatarColor: 'primary.main',
    text: "The new mix sounds incredible! Let's discuss the bass levels.",
    timestamp: '10:42 AM',
  },
  {
    id: 'star-2',
    conversationId: '2',
    conversationName: 'Sarah Jenkins',
    senderName: 'Sarah Jenkins',
    initials: 'SJ',
    avatarColor: 'info.main',
    attachment: { label: 'Summer_Playlist_Cover.png', sizeLabel: '21 kB' },
    timestamp: '2:15 PM',
  },
  {
    id: 'star-3',
    conversationId: '3',
    conversationName: 'Marcus Thorne',
    senderName: 'You',
    initials: 'MT',
    avatarColor: 'warning.main',
    text: 'Thanks for the feedback on the track — really appreciate the detailed notes!',
    timestamp: '9:05 AM',
  },
]

const ConversationsContainer = () => {
  const navigate = useNavigate()
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS)
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConversationId, setSelectedConversationId] = useState(null)
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)
  const [isViewingArchived, setIsViewingArchived] = useState(false)
  const [isViewingStarred, setIsViewingStarred] = useState(false)
  const [starredMessages, setStarredMessages] = useState(MOCK_STARRED_MESSAGES)

  const handleNotImplemented = (label) => toast.info(`${label} is not implemented yet.`)

  const handleQuickAction = (key) => {
    if (key === 'group') {
      setIsNewChatOpen(true)
    } else if (key === 'room') {
      handleNotImplemented('Start Room')
    }
  }

  const handleMarkAllAsRead = () => {
    setConversations((prev) =>
      prev.map((c) => ({ ...c, unreadCount: 0, isUnread: false })),
    )
    toast.success('All messages marked as read.')
  }

  const handleMenuOptionClick = (actionKey) => {
    if (actionKey === 'newGroup') {
      setIsNewChatOpen(true)
    } else if (actionKey === 'markAllRead') {
      handleMarkAllAsRead()
    } else if (actionKey === 'starred') {
      setIsViewingArchived(false)
      setIsViewingStarred(true)
    } else if (actionKey === 'selectChats') {
      handleNotImplemented('Select chats')
    } else if (actionKey === 'appLock') {
      handleNotImplemented('App lock')
    } else if (actionKey === 'logout') {
      handleNotImplemented('Log out')
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

  // Filter conversations based on current sidebar filter and search query
  const filteredConversations = sortPinnedFirst(
    conversations.filter((conversation) => {
      if (conversation.isArchived) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const nameMatches = conversation.name?.toLowerCase().includes(q)
        const previewMatches = conversation.preview?.toLowerCase().includes(q)
        if (!nameMatches && !previewMatches) return false
      }
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

  const handleSelectStarredMessage = (message) => {
    setIsViewingStarred(false)
    setSelectedConversationId(message.conversationId)
  }

  const handleToggleStarMessage = (conversation, message) => {
    setStarredMessages((prev) => {
      const withoutMessage = prev.filter((m) => !(m.id === message.id && m.conversationId === conversation.id))
      if (!message.isStarred) return withoutMessage

      return [
        ...withoutMessage,
        {
          id: message.id,
          conversationId: conversation.id,
          conversationName: conversation.name,
          senderName: message.sender === 'me' ? 'You' : message.senderName || conversation.name,
          initials: message.sender === 'me' ? 'Y' : message.senderInitials || conversation.initials,
          avatarColor: conversation.avatarColor,
          text: message.text,
          attachment: message.attachment,
          timestamp: message.timestamp,
        },
      ]
    })
  }

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
        onMarkAllAsRead={handleMarkAllAsRead}
        onMenuOptionClick={handleMenuOptionClick}
        onNewGroup={() => setIsNewChatOpen(true)}
        onNewMessage={() => setIsNewChatOpen(true)}
        onSearchChange={setSearchQuery}
        onSelectConversation={(conversation) => setSelectedConversationId(conversation.id)}
        searchQuery={searchQuery}
        isShowingStarred={isViewingStarred}
        onBackFromStarred={() => setIsViewingStarred(false)}
        starredMessages={starredMessages}
        onSelectStarredMessage={handleSelectStarredMessage}
      />
      {selectedConversation ? (
        <MessagesContainer conversation={selectedConversation} onConversationMenuAction={handleConversationMenuAction} onToggleStarMessage={handleToggleStarMessage} />
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
