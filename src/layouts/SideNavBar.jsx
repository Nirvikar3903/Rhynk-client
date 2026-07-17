import { Box, IconButton, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography, alpha } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import GraphicEqIcon from '@mui/icons-material/GraphicEq'
import ChatIcon from '@mui/icons-material/Chat'
import ExploreIcon from '@mui/icons-material/Explore'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import HistoryIcon from '@mui/icons-material/History'
import SettingsIcon from '@mui/icons-material/Settings'
import HelpOutlineIcon from '@mui/icons-material/HelpOutlineOutlined'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import AppButtonComponent from 'components/mui/AppButtonComponent'

export const EXPANDED_WIDTH = 260
export const COLLAPSED_WIDTH = 88

// Every route below other than Home isn't built yet (see [[00-overview]] —
// most feature folders are still empty) — clicking one is a stub toast
// rather than a fabricated route, matching the same "not implemented yet"
// pattern already used for Google auth in LoginContainer/SignUpContainer.
const NAV_ITEMS = [
  { label: 'Home', icon: ChatIcon, to: '/home' },
  { label: 'Music Room', icon: GraphicEqIcon },
  { label: 'Discover', icon: ExploreIcon },
  { label: 'Playlist', icon: QueueMusicIcon },
  { label: 'History', icon: HistoryIcon },
  { label: 'Settings', icon: SettingsIcon },
]

const FOOTER_ITEMS = [
  { label: 'Help', icon: HelpOutlineIcon },
  { label: 'Privacy', icon: ShieldOutlinedIcon },
]

// Shared left nav for every post-login screen — lives alongside AppLayout
// (not components/common/) since it's structural chrome specific to that
// layout, not a reusable domain-agnostic primitive.
const SideNavBar = ({ collapsed, onToggleCollapse }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavClick = (item) => {
    if (item.to) {
      navigate(item.to)
      return
    }
    toast.info(`${item.label} is not implemented yet.`)
  }

  const renderNavButton = (item) => {
    const isActive = item.to === location.pathname
    const button = (
      <ListItemButton
        key={item.label}
        onClick={() => handleNavClick(item)}
        selected={isActive}
        sx={{
          borderRadius: 2,
          justifyContent: collapsed ? 'center' : 'flex-start',
          px: collapsed ? 1.5 : 2,
          '&.Mui-selected': {
            bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
            color: 'primary.main',
            '&:hover': { bgcolor: (t) => alpha(t.palette.primary.main, 0.12) },
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, color: 'inherit' }}>
          <item.icon fontSize="small" />
        </ListItemIcon>
        {!collapsed && <ListItemText primary={item.label} slotProps={{ primary: { fontWeight: isActive ? 700 : 500 } }} />}
      </ListItemButton>
    )

    return collapsed ? (
      <Tooltip key={item.label} placement="right" title={item.label}>
        {button}
      </Tooltip>
    ) : (
      button
    )
  }

  return (
    <Box
      component="aside"
      sx={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
        transition: 'width 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        py: 3,
        px: collapsed ? 1 : 2,
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        zIndex: (t) => t.zIndex.drawer,
        overflowX: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', px: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              flexShrink: 0,
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <GraphicEqIcon />
          </Box>
          {!collapsed && (
            <Box sx={{ minWidth: 0 }}>
              <Typography noWrap sx={{ letterSpacing: '-0.02em', fontWeight: 800, lineHeight: 1.1 }} variant="h2">
                Rhynk
              </Typography>
              <Typography color="text.secondary" noWrap sx={{ textTransform: 'uppercase', letterSpacing: 2, fontSize: 10 }}>
                Premium Audio
              </Typography>
            </Box>
          )}
        </Box>
        {!collapsed && (
          <IconButton aria-label="Collapse navigation" onClick={onToggleCollapse} size="small">
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {collapsed && (
        <IconButton aria-label="Expand navigation" onClick={onToggleCollapse} size="small" sx={{ alignSelf: 'center' }}>
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      )}

      <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1 }}>
        {NAV_ITEMS.map(renderNavButton)}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <AppButtonComponent
          fullWidth
          onClick={() => toast.info('Go Live is not implemented yet.')}
          size={collapsed ? 'small' : 'medium'}
          sx={{ px: collapsed ? 1 : undefined }}
        >
          {collapsed ? 'Live' : 'Go Live'}
        </AppButtonComponent>
        {FOOTER_ITEMS.map(renderNavButton)}
      </Box>
    </Box>
  )
}

export default SideNavBar
