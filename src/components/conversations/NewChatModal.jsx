import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Avatar,
  Checkbox,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  alpha,
  Badge,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import GraphicEqIcon from '@mui/icons-material/GraphicEq'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { toast } from 'react-toastify'

// Mock contacts data — commented out, kept for local testing/reference
// const CONTACTS = [
//   { id: 'c1', name: 'Abigail Chen', initials: 'AC', avatar: 'https://lh3.googleusercontent.com/aida-public/...', status: "Listening to 'Midnight City'", isOnline: true },
//   { id: 'c2', name: 'Arthur Vance', initials: 'AV', avatar: 'https://lh3.googleusercontent.com/aida-public/...', status: "Hey there! I'm using Rhynk." },
//   { id: 'c3', name: 'Beatrix Potter', initials: 'BP', avatar: 'https://lh3.googleusercontent.com/aida-public/...', status: 'Digital storyteller & audiophile', isLive: true },
//   { id: 'c4', name: 'Brendan Fraser', initials: 'BF', avatar: 'https://lh3.googleusercontent.com/aida-public/...', status: 'Busy today' },
//   { id: 'c5', name: 'Catherine Zeta', initials: 'CZ', avatar: 'https://lh3.googleusercontent.com/aida-public/...', status: 'Designing the future of sound.' }
// ]
const CONTACTS = []

const NewChatModal = ({ open, onClose, onCreateGroup, onStartDirectChat }) => {
  const [mode, setMode] = useState('chat') // 'chat' | 'createGroup' | 'createMusicGroup' | 'addContact'
  const [searchQuery, setSearchQuery] = useState('')
  const [groupName, setGroupName] = useState('')
  const [selectedMemberIds, setSelectedMemberIds] = useState([])
  const [contactIdInput, setContactIdInput] = useState('')
  const [contactNameInput, setContactNameInput] = useState('')

  const handleClose = () => {
    setMode('chat')
    setSearchQuery('')
    setGroupName('')
    setSelectedMemberIds([])
    setContactIdInput('')
    setContactNameInput('')
    onClose()
  }

  const handleToggleMember = (id) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id]
    )
  }

  const handleStartDirectWithQuery = () => {
    if (!searchQuery.trim()) {
      toast.warning('Please enter a Username, Email, or User ID.')
      return
    }
    onStartDirectChat({ recipient: searchQuery.trim(), name: searchQuery.trim() })
    handleClose()
  }

  const handleAddContactSubmit = () => {
    if (!contactIdInput.trim()) {
      toast.warning('Please enter a Username, Email, or User ID.')
      return
    }
    onStartDirectChat({
      recipient: contactIdInput.trim(),
      name: contactIdInput.trim(),
    })
    handleClose()
  }

  const handleCreateGroupSubmit = () => {
    if (!groupName.trim()) {
      toast.warning('Please enter a group name.')
      return
    }
    if (selectedMemberIds.length === 0 && !searchQuery.trim()) {
      toast.warning('Please select at least one member or enter member User IDs.')
      return
    }
    const selectedMembers = selectedMemberIds.map((id) => ({ id, name: id }))
    if (searchQuery.trim() && !selectedMemberIds.includes(searchQuery.trim())) {
      selectedMembers.push({ id: searchQuery.trim(), name: searchQuery.trim() })
    }
    onCreateGroup(groupName.trim(), selectedMembers, mode === 'createMusicGroup')
    handleClose()
  }

  // Filter contacts by search query
  const filteredContacts = CONTACTS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Group contacts alphabetically by first letter of their name
  const groupedContacts = {}
  filteredContacts.forEach((contact) => {
    const firstLetter = contact.name.charAt(0).toUpperCase()
    if (!groupedContacts[firstLetter]) {
      groupedContacts[firstLetter] = []
    }
    groupedContacts[firstLetter].push(contact)
  })
  const sortedLetters = Object.keys(groupedContacts).sort()

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      onClose={handleClose}
      open={open}
      PaperProps={{
        sx: {
          borderRadius: '24px',
          height: '640px',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: (t) => alpha(t.palette.background.paper, 0.85),
          backdropFilter: 'blur(16px)',
          border: '1px solid',
          borderColor: 'divider',
          backgroundImage: 'none',
        },
      }}
    >
      {/* Header section */}
      <Box sx={{ p: 3, pb: 1.5, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifySpace: 'space-between', mb: 2, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {mode !== 'chat' && (
              <IconButton onClick={() => setMode('chat')} size="small" sx={{ mr: 0.5 }}>
                <ArrowBackIcon fontSize="small" />
              </IconButton>
            )}
            <Typography sx={{ fontWeight: 800, letterSpacing: '-0.02em' }} variant="h5">
              {mode === 'chat' && 'New chat'}
              {mode === 'addContact' && 'Add contact'}
              {mode === 'createGroup' && 'New group'}
              {mode === 'createMusicGroup' && 'New Music Room group'}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ color: 'text.secondary' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {mode === 'chat' ? (
          <TextField
            fullWidth
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleStartDirectWithQuery()
            }}
            placeholder="Enter Username, Email, or User ID..."
            size="small"
            value={searchQuery}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: searchQuery.trim() && (
                <InputAdornment position="end">
                  <Button size="small" variant="contained" onClick={handleStartDirectWithQuery} sx={{ borderRadius: '8px', textTransform: 'none', py: 0.5 }}>
                    Chat
                  </Button>
                </InputAdornment>
              ),
              sx: { borderRadius: '12px', bgcolor: (t) => alpha(t.palette.action.hover, 0.05) },
            }}
          />
        ) : (
          <TextField
            fullWidth
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group Name"
            size="small"
            value={groupName}
            InputProps={{
              sx: { borderRadius: '12px', bgcolor: (t) => alpha(t.palette.action.hover, 0.05) },
            }}
          />
        )}
      </Box>

      {/* Content scroll area */}
      <DialogContent sx={{ flex: 1, overflowY: 'auto', p: 0, borderBottom: 0, borderTop: '1px solid', borderColor: 'divider' }}>
        {mode === 'chat' ? (
          <Box>
            {/* Quick Actions */}
            <List disablePadding sx={{ p: 2, pt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <ListItem disablePadding>
                <ListItemButton onClick={() => setMode('createGroup')} sx={{ borderRadius: '12px', gap: 2, py: 1.25 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44 }}>
                    <GroupAddIcon />
                  </Avatar>
                  <ListItemText primary="New group" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton onClick={() => setMode('createMusicGroup')} sx={{ borderRadius: '12px', gap: 2, py: 1.25 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44 }}>
                    <GraphicEqIcon />
                  </Avatar>
                  <ListItemText primary="New Music Room group" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton onClick={() => setMode('addContact')} sx={{ borderRadius: '12px', gap: 2, py: 1.25 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44 }}>
                    <PersonAddIcon />
                  </Avatar>
                  <ListItemText primary="New contact" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
            </List>

            {/* Contacts list with letter grouping */}
            <Box sx={{ px: 2, pb: 4 }}>
              {sortedLetters.map((letter) => (
                <Box key={letter} sx={{ mb: 2 }}>
                  {/* Letter Divider */}
                  <Typography
                    sx={{
                      position: 'sticky',
                      top: 0,
                      bgcolor: (t) => alpha(t.palette.background.paper, 0.9),
                      py: 0.5,
                      px: 1,
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      color: 'primary.main',
                      zIndex: 2,
                    }}
                  >
                    {letter}
                  </Typography>
                  <List disablePadding>
                    {groupedContacts[letter].map((contact) => (
                      <ListItem disablePadding key={contact.id}>
                        <ListItemButton
                          onClick={() => {
                            onStartDirectChat(contact)
                            handleClose()
                          }}
                          sx={{ borderRadius: '12px', gap: 2, py: 1, px: 1 }}
                        >
                          <ListItemAvatar>
                            <Avatar src={contact.avatar} sx={{ width: 44, height: 44 }}>
                              {contact.initials}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={contact.name}
                            primaryTypographyProps={{ fontWeight: 700, fontSize: '0.85rem' }}
                            secondary={contact.status}
                            secondaryTypographyProps={{ fontSize: '0.75rem', noWrap: true }}
                          />
                          {contact.isOnline && (
                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main', ml: 'auto', mr: 1 }} />
                          )}
                          {contact.isLive && (
                            <Badge
                              badgeContent="LIVE"
                              sx={{
                                '& .MuiBadge-badge': {
                                  bgcolor: 'success.light',
                                  color: 'success.dark',
                                  fontWeight: 700,
                                  fontSize: '0.65rem',
                                  position: 'relative',
                                  transform: 'none',
                                },
                                ml: 'auto',
                                mr: 1,
                              }}
                            />
                          )}
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))}
            </Box>
          </Box>
        ) : mode === 'addContact' ? (
          /* Add Contact Form Mode - Single clean input box */
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Enter the Username, Email, or User ID of the registered person you would like to connect with.
            </Typography>
            <TextField
              fullWidth
              autoFocus
              label="Username, Email, or User ID *"
              value={contactIdInput}
              onChange={(e) => setContactIdInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddContactSubmit()
              }}
              placeholder="e.g. john_doe, john@gmail.com, or c6239129..."
              size="small"
              InputProps={{
                sx: { borderRadius: '12px' },
              }}
            />
          </Box>
        ) : (
          /* Group Creation Mode - Checkboxes list */
          <Box sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: 'text.secondary', px: 1, mb: 1.5 }}>
              SELECT GROUP MEMBERS ({selectedMemberIds.length})
            </Typography>
            <List disablePadding>
              {CONTACTS.map((contact) => (
                <ListItem
                  disablePadding
                  key={contact.id}
                  secondaryAction={
                    <Checkbox
                      checked={selectedMemberIds.includes(contact.id)}
                      edge="end"
                      onChange={() => handleToggleMember(contact.id)}
                    />
                  }
                >
                  <ListItemButton onClick={() => handleToggleMember(contact.id)} sx={{ borderRadius: '12px', gap: 2, py: 1, px: 1 }}>
                    <ListItemAvatar>
                      <Avatar src={contact.avatar} sx={{ width: 44, height: 44 }}>
                        {contact.initials}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={contact.name}
                      primaryTypographyProps={{ fontWeight: 700, fontSize: '0.85rem' }}
                      secondary={contact.status}
                      secondaryTypographyProps={{ fontSize: '0.75rem', noWrap: true }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>

      {/* Footer section for non-chat modes */}
      {mode !== 'chat' && (
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 2, flexShrink: 0 }}>
          <Button fullWidth onClick={() => setMode('chat')} variant="outlined" sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          {mode === 'addContact' ? (
            <Button
              color="primary"
              disabled={!contactIdInput.trim()}
              fullWidth
              onClick={handleAddContactSubmit}
              variant="contained"
              sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600 }}
            >
              Add & Start Chat
            </Button>
          ) : (
            <Button
              color="primary"
              disabled={!groupName.trim() || (selectedMemberIds.length === 0 && !searchQuery.trim())}
              fullWidth
              onClick={handleCreateGroupSubmit}
              variant="contained"
              sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600 }}
            >
              Create Group
            </Button>
          )}
        </Box>
      )}
    </Dialog>
  )
}

export default NewChatModal
