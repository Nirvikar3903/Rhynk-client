import { useState } from 'react'
import {
  Avatar,
  Box,
  Dialog,
  Divider,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  alpha,
} from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import CloseIcon from '@mui/icons-material/Close'
import GraphicEqIcon from '@mui/icons-material/GraphicEq'
import ChatIcon from '@mui/icons-material/Chat'
import ExploreIcon from '@mui/icons-material/Explore'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import HistoryIcon from '@mui/icons-material/History'
import SettingsIcon from '@mui/icons-material/Settings'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined'
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import KeyboardOutlinedIcon from '@mui/icons-material/KeyboardOutlined'
import HelpOutlineIcon from '@mui/icons-material/HelpOutlineOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import AppButtonComponent from 'components/mui/AppButtonComponent'
import { useLogoutMutation } from 'store/api/auth.apislice'
import { selectUser } from 'store/slices/auth.slice'

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

// Opened from the Profile trigger at the bottom of the rail. Every entry
// other than Log out is a stub toast, matching the same "not implemented
// yet" pattern the rest of this file already uses for unbuilt routes — see
// [[00-overview]].
const PROFILE_MENU_ITEMS = [
  { label: 'Profile', icon: PersonOutlineIcon },
  { label: 'Account', icon: VpnKeyOutlinedIcon },
  { label: 'Privacy', icon: ShieldOutlinedIcon },
  { label: 'Chats', icon: ChatBubbleOutlineIcon },
  { label: 'Notifications', icon: NotificationsNoneOutlinedIcon },
  { label: 'Keyboard shortcuts', icon: KeyboardOutlinedIcon },
  { label: 'Help and feedback', icon: HelpOutlineIcon },
]

// Shared left nav for every post-login screen — lives alongside AppLayout
// (not components/common/) since it's structural chrome specific to that
// layout, not a reusable domain-agnostic primitive.
const SideNavBar = ({ collapsed, onToggleCollapse }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation()

  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null)
  const isProfileMenuOpen = Boolean(profileMenuAnchor)
  const displayName = user?.username ?? user?.email ?? 'Your account'

  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)

  const handleNavClick = (item) => {
    if (item.to) {
      navigate(item.to)
      return
    }
    toast.info(`${item.label} is not implemented yet.`)
  }

  const handleProfileMenuOpen = (event) => setProfileMenuAnchor(event.currentTarget)
  const handleProfileMenuClose = () => setProfileMenuAnchor(null)

  const handleProfileMenuItemClick = (label) => {
    handleProfileMenuClose()
    toast.info(`${label} is not implemented yet.`)
  }

  const handleLogoutClick = () => {
    handleProfileMenuClose()
    setIsLogoutConfirmOpen(true)
  }

  const handleLogoutCancel = () => setIsLogoutConfirmOpen(false)

  const handleLogoutConfirm = async () => {
    try {
      await logout().unwrap()
      setIsLogoutConfirmOpen(false)
      toast.success('Logged out successfully.')
      navigate('/login')
    } catch (err) {
      setIsLogoutConfirmOpen(false)
      toast.error(err?.data?.code ?? 'Something went wrong. Please try again.')
    }
  }

  const renderNavButton = (item) => {
    const isActive = item.to === location.pathname
    const button = (
      <ListItemButton
        key={item.label}
        onClick={() => handleNavClick(item)}
        selected={isActive}
        sx={{
          flexGrow: 0,
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
        <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 1.5, color: 'inherit' }}>
          <item.icon sx={{ fontSize: 18 }} />
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
        {(() => {
          const trigger = (
            <ListItemButton
              onClick={handleProfileMenuOpen}
              sx={{
                borderRadius: 2,
                justifyContent: collapsed ? 'center' : 'flex-start',
                px: collapsed ? 1.5 : 2,
                gap: collapsed ? 0 : 1.5,
              }}
            >
              <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>{displayName.charAt(0).toUpperCase()}</Avatar>
              {!collapsed && (
                <ListItemText
                  primary={displayName}
                  secondary="View profile"
                  slotProps={{ primary: { fontWeight: 600, noWrap: true }, secondary: { noWrap: true, fontSize: 12 } }}
                />
              )}
            </ListItemButton>
          )
          return collapsed ? (
            <Tooltip placement="right" title="Profile">
              {trigger}
            </Tooltip>
          ) : (
            trigger
          )
        })()}
      </Box>

      <Menu
        anchorEl={profileMenuAnchor}
        anchorOrigin={{ vertical: 'top', horizontal: collapsed ? 'right' : 'center' }}
        onClose={handleProfileMenuClose}
        open={isProfileMenuOpen}
        slotProps={{ paper: { sx: { minWidth: 240 } } }}
        transformOrigin={{ vertical: 'bottom', horizontal: collapsed ? 'left' : 'center' }}
      >
        {PROFILE_MENU_ITEMS.map((item) => (
          <MenuItem key={item.label} onClick={() => handleProfileMenuItemClick(item.label)}>
            <ListItemIcon>
              <item.icon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleLogoutClick} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Log out" />
        </MenuItem>
      </Menu>

      <Dialog
        fullWidth
        maxWidth="xs"
        onClose={handleLogoutCancel}
        open={isLogoutConfirmOpen}
        slotProps={{
          paper: {
            sx: {
              position: 'relative',
              borderRadius: 2,
              p: { xs: 3, sm: 4 },
              bgcolor: (t) => alpha(t.palette.background.paper, 0.95),
              backdropFilter: 'blur(12px)',
            },
          },
        }}
      >
        <IconButton
          aria-label="Close"
          onClick={handleLogoutCancel}
          size="small"
          sx={{ position: 'absolute', top: 12, right: 12 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              bgcolor: (t) => alpha(t.palette.error.main, 0.1),
              color: 'error.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <LogoutIcon />
          </Box>

          <Typography sx={{ textAlign: 'center', letterSpacing: '-0.02em', mb: 1 }} variant="h2">
            Log out?
          </Typography>

          <Typography color="text.secondary" sx={{ textAlign: 'center', maxWidth: 320, mb: 4 }} variant="body1">
            You'll need to log in again to access your account.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, width: '100%' }}>
            <AppButtonComponent color="inherit" disabled={isLoggingOut} onClick={handleLogoutCancel} variant="outlined">
              Cancel
            </AppButtonComponent>
            <AppButtonComponent color="error" loading={isLoggingOut} onClick={handleLogoutConfirm}>
              Log out
            </AppButtonComponent>
          </Box>
        </Box>
      </Dialog>
    </Box>
  )
}

export default SideNavBar
