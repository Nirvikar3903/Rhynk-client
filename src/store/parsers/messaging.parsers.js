const formatTime = (isoString) => {
  if (!isoString) return ''
  try {
    const date = new Date(isoString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

export const parseConversationsResponse = (response, currentUserId) => {
  if (!response?.data || !Array.isArray(response.data)) return []

  return response.data.map((conv) => {
    const isGroup = conv.type === 'GROUP'
    const myMember =
      conv.members?.find(
        (m) => currentUserId && (m.userId === currentUserId || m.user?.id === currentUserId),
      ) ||
      conv.members?.[0] ||
      {}

    const otherMember = isGroup
      ? null
      : conv.members?.find((m) => m.userId !== myMember.userId && m.id !== myMember.id) ||
        conv.members?.[1] ||
        conv.members?.[0]

    const otherUser = otherMember?.user || {}

    const name = isGroup
      ? conv.name || 'Group Chat'
      : otherUser.name || otherUser.username || 'User'

    const initials = getInitials(name)
    const avatarUrl = isGroup
      ? conv.avatarUrl
      : otherUser.profile?.avatarUrl || conv.avatarUrl

    const lastMsgContent = conv.lastMessage?.content
    const preview = lastMsgContent || 'No messages yet'

    return {
      id: conv.id,
      type: conv.type,
      name,
      initials,
      avatarUrl,
      avatarColor: isGroup ? 'success.main' : 'primary.main',
      timestamp: formatTime(conv.lastMessage?.createdAt || conv.createdAt),
      preview,
      isGroup,
      isPinned: Boolean(myMember.isPinned),
      isMuted: Boolean(myMember.isMuted),
      isArchived: Boolean(myMember.isArchived),
      unreadCount: conv.unreadCount || 0,
      isOnline: Boolean(otherUser.isOnline),
      members: conv.members || [],
      otherUserId: otherUser.id,
    }
  })
}

export const parseSingleConversationResponse = (response, currentUserId) => {
  if (!response?.data) return null
  const parsed = parseConversationsResponse({ data: [response.data] }, currentUserId)
  return parsed[0] || null
}

export const parseMessagesResponse = (response, currentUserId) => {
  if (!response?.data || !Array.isArray(response.data)) return []

  return response.data.map((msg) => {
    const senderId = typeof msg.senderId === 'object' ? msg.senderId?.id || msg.senderId?._id : msg.senderId
    const isMine = msg.sender === 'me' || (Boolean(currentUserId) && String(senderId) === String(currentUserId))
    const senderName = isMine
      ? 'You'
      : msg.senderName || msg.sender?.name || msg.sender?.username || 'User'

    // Extract unique emoji strings from reactions array
    const reactions = Array.isArray(msg.reactions)
      ? msg.reactions.map((r) => (typeof r === 'string' ? r : r.emoji))
      : []

    const replyTo = msg.metadata?.replyToId
      ? {
          senderName: msg.metadata.replyToSender || 'User',
          text: msg.metadata.replyToText || '',
        }
      : null

    return {
      id: msg._id || msg.id,
      conversationId: msg.conversationId,
      sender: isMine ? 'me' : 'them',
      senderId,
      senderName,
      senderInitials: getInitials(senderName),
      text: msg.content || '',
      type: msg.type || 'TEXT',
      timestamp: formatTime(msg.createdAt),
      createdAtISO: msg.createdAt,
      seen: Boolean(msg.seen),
      replyTo,
      effect: msg.metadata?.effect || null,
      reactions,
      isStarred: Boolean(msg.isStarred),
    }
  })
}
