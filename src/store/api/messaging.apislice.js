import { baseApi } from './baseApi'
import {
  parseConversationsResponse,
  parseSingleConversationResponse,
  parseMessagesResponse,
} from '../parsers/messaging.parsers'

export const messagingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => '/messaging/conversations',
      transformResponse: (response, _meta, _arg) => response,
      providesTags: ['Conversation'],
    }),

    getConversationById: builder.query({
      query: (id) => `/messaging/conversations/${id}`,
      transformResponse: (response) => response,
    }),

    getDirectConversation: builder.mutation({
      query: (arg) => {
        const recipient = typeof arg === 'string'
          ? arg
          : (arg?.recipient || arg?.recipientUserId || arg?.id)
        return {
          url: '/messaging/conversations/direct',
          method: 'POST',
          body: { recipient },
        }
      },
      invalidatesTags: ['Conversation'],
    }),

    createGroupConversation: builder.mutation({
      query: ({ name, memberUserIds, avatarUrl }) => ({
        url: '/messaging/conversations/group',
        method: 'POST',
        body: { name, memberUserIds, avatarUrl },
      }),
      invalidatesTags: ['Conversation'],
    }),

    updateConversationSettings: builder.mutation({
      query: ({ conversationId, isPinned, isMuted, isArchived }) => ({
        url: `/messaging/conversations/${conversationId}/settings`,
        method: 'PATCH',
        body: { isPinned, isMuted, isArchived },
      }),
      invalidatesTags: ['Conversation'],
    }),

    getMessages: builder.query({
      query: ({ conversationId, limit = 30, before }) => ({
        url: `/messaging/conversations/${conversationId}/messages`,
        params: { limit, before },
      }),
      providesTags: (_result, _error, { conversationId }) => [
        { type: 'Message', id: conversationId },
      ],
    }),

    sendMessageHttp: builder.mutation({
      query: ({ conversationId, content, type = 'TEXT', metadata = {} }) => ({
        url: `/messaging/conversations/${conversationId}/messages`,
        method: 'POST',
        body: { content, type, metadata },
      }),
      invalidatesTags: (_result, _error, { conversationId }) => [
        { type: 'Message', id: conversationId },
        'Conversation',
      ],
    }),

    markConversationRead: builder.mutation({
      query: ({ conversationId }) => ({
        url: `/messaging/conversations/${conversationId}/read`,
        method: 'POST',
      }),
      invalidatesTags: ['Conversation'],
    }),

    toggleReaction: builder.mutation({
      query: ({ messageId, emoji }) => ({
        url: `/messaging/messages/${messageId}/react`,
        method: 'POST',
        body: { emoji },
      }),
    }),

    toggleStarMessage: builder.mutation({
      query: ({ messageId }) => ({
        url: `/messaging/messages/${messageId}/star`,
        method: 'POST',
      }),
    }),

    getStarredMessages: builder.query({
      query: () => '/messaging/starred',
    }),
  }),
})

export const {
  useGetConversationsQuery,
  useGetConversationByIdQuery,
  useGetDirectConversationMutation,
  useCreateGroupConversationMutation,
  useUpdateConversationSettingsMutation,
  useGetMessagesQuery,
  useSendMessageHttpMutation,
  useMarkConversationReadMutation,
  useToggleReactionMutation,
  useToggleStarMessageMutation,
  useGetStarredMessagesQuery,
} = messagingApi
