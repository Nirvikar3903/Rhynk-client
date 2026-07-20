import { Box, Chip, IconButton, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import ArchiveIcon from '@mui/icons-material/Archive'
import ConversationListItem from 'components/conversations/ConversationListItem'

const FILTERS = ['All', 'Unread', 'Favourites', 'Groups']

// Middle column: header, filter chips, archived-chats row, conversation
// list. Props-only — the container owns `conversations`/`activeFilter`
// (see [[create-component]]).
const ConversationListPanel = ({
  conversations,
  activeConversationId,
  activeFilter,
  onFilterChange,
  onSearchClick,
  onNewMessage,
  onArchivedClick,
  onSelectConversation,
  archivedCount = 0,
}) => {
  return (
    <Box
      sx={{
        width: { xs: '100%', md: 360 },
        flexShrink: 0,
        height: '100vh',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 800, letterSpacing: '-0.02em' }} variant="h2">
            Rhynk
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton aria-label="Search" onClick={onSearchClick} size="small">
              <SearchIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="New message"
              onClick={onNewMessage}
              size="small"
              sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
          {FILTERS.map((filter) => (
            <Chip
              key={filter}
              color={activeFilter === filter ? 'primary' : 'default'}
              label={filter}
              onClick={() => onFilterChange(filter)}
              sx={{ fontWeight: 600 }}
              variant={activeFilter === filter ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', pl: 1.5, pr: 0, pb: 3 }}>
        <Box
          component="button"
          onClick={onArchivedClick}
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 1.5,
            py: 1.5,
            mb: 0.5,
            border: 0,
            borderRadius: '12px 0 0 12px',
            bgcolor: 'transparent',
            color: 'text.secondary',
            cursor: 'pointer',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <ArchiveIcon fontSize="small" />
          <Typography variant="body2">Archived Chats</Typography>
          <Typography color="text.secondary" sx={{ ml: 'auto' }} variant="caption">
            {archivedCount}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {conversations.map((conversation) => (
            <ConversationListItem
              conversation={conversation}
              isActive={conversation.id === activeConversationId}
              key={conversation.id}
              onClick={() => onSelectConversation(conversation)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default ConversationListPanel
