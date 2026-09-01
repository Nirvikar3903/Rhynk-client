import { useEffect, useMemo, useState } from 'react'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import ConversationListPanel from 'components/conversations/ConversationListPanel'
import EmptyConversationPanel from 'components/conversations/EmptyConversationPanel'
import MessagesContainer from 'features/containers/messages/MessagesContainer'
import NewChatModal from 'components/conversations/NewChatModal'
import { selectUser, selectAccessToken, selectCurrentUserId } from 'store/slices/auth.slice'
import { connectSocket, getSocket } from 'services/socket'
import {
  useGetConversationsQuery,
  useGetStarredMessagesQuery,
  useGetDirectConversationMutation,
  useCreateGroupConversationMutation,
  useUpdateConversationSettingsMutation,
  useMarkConversationReadMutation,
} from 'store/api/messaging.apislice'
import {
  parseConversationsResponse,
  parseSingleConversationResponse,
  parseMessagesResponse,
} from 'store/parsers/messaging.parsers'

// Mock conversations data — commented out, kept for local testing/reference
// const MOCK_CONVERSATIONS = [
//   {
//     id: '1',
//     name: 'Elena Rodriguez',
//     initials: 'ER',
//     avatarColor: 'primary.main',
//     timestamp: '10:42 AM',
//     preview: "The new mix sounds incredible! Let's discuss the bass levels.",
//     isOnline: true,
//     isPinned: true,
//     bio: 'Creative Director & Sound Designer. Exploring the intersection of digital landscapes and nostalgic synth-wave textures. Always up for a collab on new tracks. 🎹✨',
//     phone: '+1 555 0182',
//     sharedMedia: [
//       { id: 'media-1', color: 'secondary.main' },
//       { id: 'media-2', color: 'primary.main' },
//       { id: 'media-3', color: 'warning.main' },
//     ],
//     sharedMediaCount: 42,
//     mutualGroups: [{ id: 'group-swc', name: 'Synth Wave Collab', memberCount: 128 }],
//   },
//   {
//     id: '2',
//     name: 'Sarah Jenkins',
//     initials: 'SJ',
//     avatarColor: 'info.main',
//     timestamp: '2:15 PM',
//     preview: 'Sent a new playlist link!',
//     unreadCount: 2,
//   },
//   {
//     id: '3',
//     name: 'Marcus Thorne',
//     initials: 'MT',
//     avatarColor: 'warning.main',
//     timestamp: 'Monday',
//     preview: 'Thanks for the feedback on the track.',
//   },
//   {
//     id: '4',
//     name: 'Synth Wave Collab',
//     initials: 'SW',
//     avatarColor: 'success.main',
//     timestamp: '11:21 AM',
//     preview: 'Gopal Menon: Can’t wait, let’s do a listening session in the room after.',
//     isGroup: true,
//     isMusicRoom: true,
//     members: [
//       { id: 'm1', name: 'Elena Rodriguez', initials: 'ER', avatarColor: 'primary.main' },
//       { id: 'm2', name: 'Gopal Menon', initials: 'GM', avatarColor: 'info.main' },
//       { id: 'm3', name: 'Priya Nair', initials: 'PN', avatarColor: 'secondary.main' },
//     ],
//   },
// ]

const ConversationsContainer = () => {
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const accessToken = useSelector(selectAccessToken)
  const currentUserId = useSelector(selectCurrentUserId)

  // Connect WebSockets when authenticated
  useEffect(() => {
    if (accessToken) {
      connectSocket(accessToken)
    }
  }, [accessToken])

  // API Queries
  const { data: conversationsData, refetch: refetchConversations } = useGetConversationsQuery(undefined, {
    skip: !accessToken,
  })
  const { data: starredData } = useGetStarredMessagesQuery(undefined, { skip: !accessToken })

  const [getDirectConv] = useGetDirectConversationMutation()
  const [createGroupConv] = useCreateGroupConversationMutation()
  const [updateSettings] = useUpdateConversationSettingsMutation()
  const [markRead] = useMarkConversationReadMutation()

  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConversationId, setSelectedConversationId] = useState(null)
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)
  const [isViewingArchived, setIsViewingArchived] = useState(false)
  const [isViewingStarred, setIsViewingStarred] = useState(false)

  // Listen for socket real-time events to refresh conversations list
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handleNewMessage = () => {
      refetchConversations()
    }

    socket.on('new_message', handleNewMessage)
    socket.on('read_receipt', handleNewMessage)

    return () => {
      socket.off('new_message', handleNewMessage)
      socket.off('read_receipt', handleNewMessage)
    }
  }, [refetchConversations])

  const [localCreatedConvs, setLocalCreatedConvs] = useState([])
  const [sentPreviews, setSentPreviews] = useState({})

  // Process live conversation list from API and merge locally created chats & sent previews
  const conversations = useMemo(() => {
    const apiConvs = parseConversationsResponse(conversationsData, currentUserId) || []
    const mergedMap = new Map()
    localCreatedConvs.forEach((c) => mergedMap.set(c.id, c))
    apiConvs.forEach((c) => mergedMap.set(c.id, c))

    return Array.from(mergedMap.values()).map((conv) => {
      const sent = sentPreviews[conv.id]
      if (sent && (conv.preview === 'No messages yet' || conv.preview === 'Conversation started')) {
        return {
          ...conv,
          preview: sent.preview,
          timestamp: sent.timestamp,
        }
      }
      return conv
    })
  }, [conversationsData, localCreatedConvs, sentPreviews, currentUserId])

  const starredMessages = useMemo(() => {
    const parsed = parseMessagesResponse(starredData, currentUserId)
    if (parsed && parsed.length > 0) return parsed
    return []
  }, [starredData, currentUserId])

  const handleMessageSent = ({ conversationId, text, timestamp }) => {
    setSentPreviews((prev) => ({
      ...prev,
      [conversationId]: { preview: text, timestamp: timestamp || 'Just now' },
    }))
    refetchConversations()
  }

  const handleNotImplemented = (label) => toast.info(`${label} is not implemented yet.`)

  const handleQuickAction = (key) => {
    if (key === 'group') {
      setIsNewChatOpen(true)
    } else if (key === 'room') {
      handleNotImplemented('Start Room')
    }
  }

  const handleMarkAllAsRead = async () => {
    if (selectedConversationId) {
      try {
        await markRead({ conversationId: selectedConversationId }).unwrap()
      } catch {
        // Ignored
      }
    }
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

  const handleCreateGroup = async (groupName, selectedMembers, isMusicRoom) => {
    try {
      const memberUserIds = selectedMembers.map((m) => m.id || m.userId).filter(Boolean)
      const res = await createGroupConv({ name: groupName, memberUserIds }).unwrap()
      const newId = res.data?.id
      toast.success(`Group "${groupName}" created successfully!`)
      await refetchConversations()
      setActiveFilter('Groups')
      if (newId) setSelectedConversationId(newId)
    } catch (err) {
      toast.error(err?.data?.error?.message || err?.data?.message || 'Could not create group.')
    }
  }

  const handleStartDirectChat = async (contact) => {
    try {
      const recipient = typeof contact === 'string' ? contact : (contact.recipient || contact.id || contact.userId || contact.name)
      if (!recipient) {
        toast.warning('Please enter a valid Username, Email, or User ID.')
        return
      }
      const res = await getDirectConv({ recipient }).unwrap()
      if (res.data) {
        const parsed = parseSingleConversationResponse(res, currentUserId)
        if (parsed) {
          setLocalCreatedConvs((prev) => [parsed, ...prev.filter((c) => c.id !== parsed.id)])
          setSelectedConversationId(parsed.id)
          setActiveFilter('All')
        }
      }
      refetchConversations()
    } catch (err) {
      const errMsg = err?.data?.error?.message || err?.data?.message || 'Could not start direct chat.'
      toast.error(errMsg)
    }
  }

  const handleConversationMenuAction = async (action, conversation) => {
    if (action === 'delete') {
      if (selectedConversationId === conversation.id) setSelectedConversationId(null)
      toast.success(`Chat with ${conversation.name} deleted.`)
      return
    }

    try {
      let isPinned = conversation.isPinned
      let isMuted = conversation.isMuted
      let isArchived = conversation.isArchived

      if (action === 'pin') isPinned = true
      if (action === 'unpin') isPinned = false
      if (action === 'mute') isMuted = true
      if (action === 'unmute') isMuted = false
      if (action === 'archive') isArchived = true
      if (action === 'unarchive') isArchived = false

      await updateSettings({ conversationId: conversation.id, isPinned, isMuted, isArchived }).unwrap()

      if (action === 'archive') toast.success(`Chat with ${conversation.name} archived.`)
      if (action === 'unarchive') toast.success(`Chat with ${conversation.name} unarchived.`)
    } catch {
      // Fallback
    }
  }

  const sortPinnedFirst = (list) => [...list].sort((a, b) => (b.isPinned === true) - (a.isPinned === true))

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
      return true
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
        <MessagesContainer
          conversation={selectedConversation}
          onConversationMenuAction={handleConversationMenuAction}
          onMessageSent={handleMessageSent}
        />
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
