import { Avatar, Box, Switch, Typography, alpha } from '@mui/material'
import GroupsIcon from '@mui/icons-material/Groups'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import GraphicEqIcon from '@mui/icons-material/GraphicEq'
import CommonModal from 'components/common/CommonModal'
import AppTextFieldComponent from 'components/mui/AppTextFieldComponent'

// Step 2 of the New Group flow (see NewGroupContainer) — built on the shared
// CommonModal chrome per [[11-modal-flow-pattern]]; the avatar picker,
// fields, and Music Room toggle below are this modal's own children.
const GroupDetailsModal = ({
  open,
  onClose,
  groupName,
  onGroupNameChange,
  description,
  onDescriptionChange,
  musicRoomEnabled,
  onMusicRoomToggle,
  onSubmit,
  canSubmit,
}) => (
  <CommonModal
    ctaDisabled={!canSubmit}
    ctaLabel="Create group"
    heading="Group details"
    icon={<GroupsIcon />}
    onClose={onClose}
    onSubmit={onSubmit}
    open={open}
    subheading="Give your group a name, description, and photo."
  >
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <Avatar sx={{ width: 96, height: 96, bgcolor: (t) => alpha(t.palette.primary.main, 0.1), color: 'primary.main' }}>
          <GroupsIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid',
            borderColor: 'background.paper',
          }}
        >
          <PhotoCameraIcon sx={{ fontSize: 16 }} />
        </Box>
      </Box>
    </Box>

    <AppTextFieldComponent
      label="Group name"
      onChange={(event) => onGroupNameChange(event.target.value)}
      placeholder="e.g. Design Sync Room"
      value={groupName}
    />

    <AppTextFieldComponent
      label="Description (optional)"
      minRows={3}
      multiline
      onChange={(event) => onDescriptionChange(event.target.value)}
      placeholder="What is this group about?"
      value={description}
    />

    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.default',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <GraphicEqIcon color="success" />
        <Box>
          <Typography sx={{ fontWeight: 700 }} variant="body2">
            Enable Music Room
          </Typography>
          <Typography color="text.secondary" variant="caption">
            Real-time collaborative audio sharing
          </Typography>
        </Box>
      </Box>
      <Switch checked={musicRoomEnabled} color="success" onChange={(event) => onMusicRoomToggle(event.target.checked)} />
    </Box>
  </CommonModal>
)

export default GroupDetailsModal
