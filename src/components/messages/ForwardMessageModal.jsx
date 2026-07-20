import { Avatar, Badge, Box, Chip, Stack, TextField, Typography, alpha } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FormatQuoteIcon from '@mui/icons-material/FormatQuoteOutlined'
import ForwardIcon from '@mui/icons-material/Forward'
import SendIcon from '@mui/icons-material/Send'
import CheckIcon from '@mui/icons-material/Check'
import CommonModal from 'components/common/CommonModal'
import AppTextFieldComponent from 'components/mui/AppTextFieldComponent'

// A round selection indicator (filled + check when selected, outline
// otherwise) — matches the recent-avatars ring styling below it instead of
// a standard square checkbox, per the reference design.
const SelectionDot = ({ isSelected }) => (
  <Box
    sx={{
      width: 24,
      height: 24,
      flexShrink: 0,
      borderRadius: '50%',
      border: '2px solid',
      borderColor: isSelected ? 'primary.main' : 'divider',
      bgcolor: isSelected ? 'primary.main' : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {isSelected && <CheckIcon sx={{ fontSize: 16, color: 'primary.contrastText' }} />}
  </Box>
)

// One row in the "All Contacts" list — whole row is the click target
// (matches the reference's cursor-pointer row), not just the indicator.
const ForwardTargetRow = ({ target, isSelected, onToggle }) => (
  <Box
    onClick={() => onToggle(target.id)}
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 1.5,
      p: 1.5,
      borderRadius: 3,
      cursor: 'pointer',
      bgcolor: isSelected ? (t) => alpha(t.palette.primary.main, 0.06) : 'transparent',
      '&:hover': { bgcolor: isSelected ? undefined : 'action.hover' },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
      <Badge
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        invisible={!target.isOnline}
        overlap="circular"
        sx={{ '& .MuiBadge-badge': { bgcolor: 'success.main', border: '2px solid', borderColor: 'background.paper', width: 10, height: 10, borderRadius: '50%' } }}
        variant="dot"
      >
        <Avatar sx={{ bgcolor: target.avatarColor, width: 44, height: 44 }}>{target.initials}</Avatar>
      </Badge>
      <Box sx={{ minWidth: 0 }}>
        <Typography noWrap sx={{ fontWeight: 600 }} variant="body2">
          {target.name}
        </Typography>
        <Typography color="text.secondary" noWrap variant="caption">
          {target.subtitle}
        </Typography>
      </Box>
    </Box>
    <SelectionDot isSelected={isSelected} />
  </Box>
)

// Forward-a-message flow — built on the shared CommonModal chrome per
// [[11-modal-flow-pattern]]; the quoted preview, search, recent/all-contacts
// lists, selected chips, and optional note are this modal's own children.
// Single caller (MessagesContainer), so its state lives there directly
// rather than in a dedicated container file.
const ForwardMessageModal = ({
  open,
  onClose,
  messagePreview,
  searchQuery,
  onSearchChange,
  recentContacts,
  contacts,
  selectedIds,
  selectedTargets,
  onToggleTarget,
  draftMessage,
  onDraftMessageChange,
  onSubmit,
  canSubmit,
}) => (
  <CommonModal
    ctaDisabled={!canSubmit}
    ctaIcon={<SendIcon fontSize="small" />}
    ctaLabel="Send Message"
    formSx={{ gap: 2 }}
    heading="Forward to..."
    icon={<ForwardIcon />}
    onClose={onClose}
    onSubmit={onSubmit}
    open={open}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.5, borderRadius: 3, bgcolor: 'action.hover' }}>
      <FormatQuoteIcon color="primary" fontSize="small" />
      <Typography color="text.secondary" noWrap variant="body2">
        {messagePreview}
      </Typography>
    </Box>

    <TextField
      fullWidth
      onChange={(event) => onSearchChange(event.target.value)}
      placeholder="Search people or groups"
      size="small"
      slotProps={{ input: { startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> } }}
      value={searchQuery}
    />

    <Box sx={{ maxHeight: 280, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box>
        <Typography color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', mb: 1 }} variant="caption">
          Recent
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 0.5 }}>
          {recentContacts.map((contact) => {
            const isSelected = selectedIds.includes(contact.id)
            return (
              <Box
                key={contact.id}
                onClick={() => onToggleTarget(contact.id)}
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, cursor: 'pointer', flexShrink: 0 }}
              >
                <Avatar
                  sx={{
                    width: 52,
                    height: 52,
                    bgcolor: contact.avatarColor,
                    border: '2px solid',
                    borderColor: isSelected ? 'primary.main' : 'transparent',
                  }}
                >
                  {contact.initials}
                </Avatar>
                <Typography noWrap sx={{ maxWidth: 60 }} variant="caption">
                  {contact.name}
                </Typography>
              </Box>
            )
          })}
        </Box>
      </Box>

      <Box>
        <Typography color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', mb: 1 }} variant="caption">
          All Contacts
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {contacts.map((target) => (
            <ForwardTargetRow isSelected={selectedIds.includes(target.id)} key={target.id} onToggle={onToggleTarget} target={target} />
          ))}
        </Box>
      </Box>
    </Box>

    {selectedTargets.length > 0 && (
      <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>
        {selectedTargets.map((target) => (
          <Chip color="primary" key={target.id} label={target.name} onDelete={() => onToggleTarget(target.id)} />
        ))}
      </Stack>
    )}

    <AppTextFieldComponent
      onChange={(event) => onDraftMessageChange(event.target.value)}
      placeholder="Add a message..."
      value={draftMessage}
    />

    <Typography color="text.secondary" variant="body2">
      <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>
        {selectedTargets.length}
      </Box>{' '}
      selected
    </Typography>
  </CommonModal>
)

export default ForwardMessageModal
