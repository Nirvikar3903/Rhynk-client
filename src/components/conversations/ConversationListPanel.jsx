import { useState } from 'react'
import {
  Box,
  Chip,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import ArchiveIcon from '@mui/icons-material/Archive'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import CloseIcon from '@mui/icons-material/Close'
import ConversationListItem from 'components/conversations/ConversationListItem'
import StarredMessageListItem from 'components/conversations/StarredMessageListItem'

const FILTERS = ['All', 'Unread', 'Favourites', 'Groups']

// Middle column: header, search bar, filter chips, archived-chats row,
// conversation list.
const ConversationListPanel = ({
  conversations,
  activeConversationId,
  activeFilter,
  searchQuery = '',
  onSearchChange,
  onFilterChange,
  onNewMessage,
  onNewGroup,
  onMarkAllAsRead,
  onMenuOptionClick,
  onArchivedClick,
  onBackFromArchived,
  onSelectConversation,
  onConversationMenuAction,
  archivedCount = 0,
  isShowingArchived = false,
  isShowingStarred = false,
  starredMessages = [],
  onBackFromStarred,
  onSelectStarredMessage,
}) => {
  const [menuAnchor, setMenuAnchor] = useState(null)

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  // Group starred messages by conversation for section headers, preserving
  // first-seen order (purely a rendering concern, not business logic).
  const starredGroups = starredMessages.reduce((groups, message) => {
    const group = groups.find((g) => g.conversationId === message.conversationId)
    if (group) {
      group.messages.push(message)
    } else {
      groups.push({ conversationId: message.conversationId, conversationName: message.conversationName, messages: [message] })
    }
    return groups
  }, [])

  const handleAction = (actionKey) => {
    handleMenuClose()
    if (onMenuOptionClick) {
      onMenuOptionClick(actionKey)
    } else {
      if (actionKey === 'newGroup' && onNewGroup) onNewGroup()
      else if (actionKey === 'newGroup' && onNewMessage) onNewMessage()
      else if (actionKey === 'markAllRead' && onMarkAllAsRead) onMarkAllAsRead()
    }
  }

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
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {isShowingArchived ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton aria-label="Back" onClick={onBackFromArchived} size="small">
                <ArrowBackIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ fontWeight: 800, letterSpacing: '-0.02em' }} variant="h2">
                Archived Chats
              </Typography>
            </Box>
          ) : isShowingStarred ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton aria-label="Back" onClick={onBackFromStarred} size="small">
                <ArrowBackIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ fontWeight: 800, letterSpacing: '-0.02em' }} variant="h2">
                Starred messages
              </Typography>
            </Box>
          ) : (
            <Typography sx={{ fontWeight: 800, letterSpacing: '-0.02em' }} variant="h2">
              Rhynk
            </Typography>
          )}
          {!isShowingArchived && !isShowingStarred && (
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              <IconButton
                aria-label="New message"
                onClick={onNewMessage}
                size="small"
                sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
              <IconButton aria-label="More options" onClick={handleMenuOpen} size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>

        {!isShowingArchived && !isShowingStarred && (
          <TextField
            fullWidth
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search or start a new chat"
            size="small"
            value={searchQuery}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <IconButton onClick={() => onSearchChange && onSearchChange('')} size="small">
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null,
              sx: {
                borderRadius: '12px',
                bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'),
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: 'divider' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              },
            }}
          />
        )}

        {!isShowingArchived && !isShowingStarred && (
          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', py: 0.5 }}>
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
        )}
      </Box>

      <Menu
        anchorEl={menuAnchor}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        onClose={handleMenuClose}
        open={Boolean(menuAnchor)}
        PaperProps={{
          elevation: 4,
          sx: {
            borderRadius: '16px',
            minWidth: 200,
            mt: 1,
            py: 0.5,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
          },
        }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => handleAction('newGroup')}>
          <ListItemIcon>
            <GroupAddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="New group" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} />
        </MenuItem>
        <MenuItem onClick={() => handleAction('starred')}>
          <ListItemIcon>
            <StarBorderIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Starred messages" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} />
        </MenuItem>
        <MenuItem onClick={() => handleAction('selectChats')}>
          <ListItemIcon>
            <CheckBoxIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Select chats" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} />
        </MenuItem>
        <MenuItem onClick={() => handleAction('markAllRead')}>
          <ListItemIcon>
            <DoneAllIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Mark all as read" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} />
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={() => handleAction('appLock')}>
          <ListItemIcon>
            <LockOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="App lock" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} />
        </MenuItem>
        <MenuItem onClick={() => handleAction('logout')}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Log out" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} />
        </MenuItem>
      </Menu>

      <Box sx={{ flex: 1, overflowY: 'auto', pl: 1.5, pr: isShowingStarred ? 1.5 : 0, pb: 3 }}>
        {isShowingStarred ? (
          starredGroups.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }} variant="body2">
              No starred messages yet
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {starredGroups.map((group) => (
                <Box key={group.conversationId}>
                  <Typography color="text.secondary" sx={{ px: 0.5, mb: 1, fontWeight: 700 }} variant="caption">
                    {group.conversationName}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {group.messages.map((message) => (
                      <StarredMessageListItem
                        key={message.id}
                        message={message}
                        onClick={() => onSelectStarredMessage(message)}
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          )
        ) : (
          <>
            {!isShowingArchived && (
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
            )}

            {isShowingArchived && conversations.length === 0 && (
              <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }} variant="body2">
                No archived chats
              </Typography>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {conversations.map((conversation) => (
                <ConversationListItem
                  conversation={conversation}
                  isActive={conversation.id === activeConversationId}
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation)}
                  onMenuAction={onConversationMenuAction}
                />
              ))}
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}

export default ConversationListPanel
