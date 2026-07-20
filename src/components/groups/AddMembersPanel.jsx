import { Avatar, Box, Checkbox, Chip, Stack, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AppButtonComponent from 'components/mui/AppButtonComponent'

// Step 1 of the New Group flow (see NewGroupContainer) — props-only list +
// search + selection UI, no state of its own (see [[create-component]]).
const AddMembersPanel = ({
  contacts,
  selectedIds,
  selectedMembers,
  searchQuery,
  onSearchChange,
  onToggleMember,
  onRemoveMember,
  onNextStep,
  canProceed,
}) => (
  <Box sx={{ width: '100%', p: { xs: 3, md: 5 } }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 3 }}>
      <Box>
        <Typography sx={{ fontWeight: 800, letterSpacing: '-0.02em' }} variant="h1">
          New group &middot; Add members
        </Typography>
        <Typography color="text.secondary" variant="body1">
          Select up to 100 members to join your new group.
        </Typography>
      </Box>
      <AppButtonComponent disabled={!canProceed} onClick={onNextStep} size="large">
        Next Step
      </AppButtonComponent>
    </Box>

    <Box sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      {selectedMembers.length > 0 && (
        <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap', mb: 2 }}>
          {selectedMembers.map((member) => (
            <Chip
              color="primary"
              key={member.id}
              label={member.name}
              onDelete={() => onRemoveMember(member.id)}
              variant="outlined"
            />
          ))}
        </Stack>
      )}

      <TextField
        fullWidth
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search for people by name or email..."
        slotProps={{ input: { startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> } }}
        value={searchQuery}
      />
    </Box>

    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
      {contacts.map((contact) => {
        const isSelected = selectedIds.includes(contact.id)
        return (
          <Box
            component="label"
            key={contact.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderRadius: 3,
              border: '1px solid',
              borderColor: isSelected ? 'primary.main' : 'divider',
              bgcolor: isSelected ? 'action.hover' : 'background.paper',
              cursor: contact.isSelf ? 'default' : 'pointer',
              opacity: contact.isSelf ? 0.6 : 1,
              transition: 'border-color 0.15s ease, background-color 0.15s ease',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
              <Avatar sx={{ bgcolor: contact.avatarColor, width: 48, height: 48 }}>{contact.initials}</Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography noWrap sx={{ fontWeight: 700 }} variant="body1">
                  {contact.name}
                </Typography>
                <Typography color="text.secondary" noWrap variant="caption">
                  {contact.username}
                </Typography>
              </Box>
            </Box>
            <Checkbox checked={isSelected} disabled={contact.isSelf} onChange={() => onToggleMember(contact)} />
          </Box>
        )
      })}
    </Box>
  </Box>
)

export default AddMembersPanel
