import { Box, Typography, alpha } from '@mui/material'
import ForumIcon from '@mui/icons-material/Forum'
import EditIcon from '@mui/icons-material/Edit'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import PodcastsIcon from '@mui/icons-material/Podcasts'
import AppButtonComponent from 'components/mui/AppButtonComponent'

const QUICK_ACTIONS = [
  { key: 'group', icon: GroupAddIcon, label: 'Create Group', caption: 'Chat with multiple artists', color: 'primary.main' },
  { key: 'room', icon: PodcastsIcon, label: 'Start Room', caption: 'Live audio session', color: 'success.main' },
]

// Right-hand column shown when no conversation is selected yet. Props-only
// (see [[create-component]]) — the container decides what each action does.
const EmptyConversationPanel = ({ onNewMessage, onQuickAction }) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
      }}
    >
      <Box sx={{ maxWidth: 360, width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box
          sx={{
            width: 200,
            height: 200,
            mb: 3,
            borderRadius: '50%',
            bgcolor: 'background.paper',
            border: '2px dashed',
            borderColor: (t) => alpha(t.palette.primary.main, 0.2),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ForumIcon sx={{ fontSize: 72, color: (t) => alpha(t.palette.primary.main, 0.4) }} />
        </Box>

        <Typography sx={{ fontWeight: 700, mb: 1 }} variant="h2">
          Your conversation starts here.
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }} variant="body1">
          Select a chat to start messaging or discover new rooms in the music lounge.
        </Typography>

        <AppButtonComponent endIcon={<EditIcon fontSize="small" />} onClick={onNewMessage} size="large" sx={{ mb: 4 }}>
          New Message
        </AppButtonComponent>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: '100%' }}>
          {QUICK_ACTIONS.map((action) => (
            <Box
              key={action.key}
              onClick={() => onQuickAction(action.key)}
              sx={{
                p: 2.5,
                textAlign: 'left',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                boxShadow: 1,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'grey.100' },
              }}
            >
              <action.icon sx={{ color: action.color, mb: 1 }} />
              <Typography sx={{ fontWeight: 700, display: 'block' }} variant="body2">
                {action.label}
              </Typography>
              <Typography color="text.secondary" variant="caption">
                {action.caption}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default EmptyConversationPanel
