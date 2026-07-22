import { useState } from 'react'
import { Box, Paper } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ChatIcon from '@mui/icons-material/Chat'
import GraphicEqIcon from '@mui/icons-material/GraphicEq'
import ExploreIcon from '@mui/icons-material/Explore'
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'
import SettingsIcon from '@mui/icons-material/Settings'
import DoodleBackground from 'components/common/DoodleBackground'
import SideNavBar, { COLLAPSED_WIDTH, EXPANDED_WIDTH } from 'layouts/SideNavBar'

// Mobile-only bottom bar (< md) mirroring the desktop rail's top items —
// the rail itself is hidden below md rather than squeezed, same breakpoint
// switch as the source design's own `lg:hidden` bottom nav.
const MOBILE_NAV_ITEMS = [
  { label: 'Home', icon: ChatIcon, to: '/home' },
  { label: 'Music', icon: GraphicEqIcon },
  { label: 'Discover', icon: ExploreIcon },
  // { label: 'Playlists', icon: LibraryMusicIcon },
  { label: 'Settings', icon: SettingsIcon },
]

// Shared shell for every post-login screen: the collapsible SideNavBar plus
// a content area, per [[create-page]]'s AppLayout precedent. New pages
// compose `<AppLayout><YourContainer /></AppLayout>` rather than
// reimplementing this chrome.
const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleMobileNavClick = (item) => {
    if (item.to) {
      navigate(item.to)
      return
    }
    toast.info(`${item.label} is not implemented yet.`)
  }

  const railWidth = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: 'background.default', overflowX: 'hidden' }}>
      <DoodleBackground />

      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <SideNavBar collapsed={collapsed} onToggleCollapse={() => setCollapsed((prev) => !prev)} />
      </Box>

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          ml: { xs: 0, md: `${railWidth}px` },
          pb: { xs: 8, md: 0 },
          transition: 'margin-left 0.2s ease',
          minHeight: '100vh',
          display: 'flex',
        }}
      >
        {children}
      </Box>

      <Paper
        elevation={0}
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          justifyContent: 'space-around',
          alignItems: 'center',
          height: 64,
          zIndex: (t) => t.zIndex.drawer,
          borderTop: '1px solid',
          borderColor: 'divider',
          borderRadius: 0,
        }}
      >
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive = item.to === location.pathname
          return (
            <Box
              component="button"
              key={item.label}
              onClick={() => handleMobileNavClick(item)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.25,
                border: 0,
                bgcolor: 'transparent',
                color: isActive ? 'primary.main' : 'text.secondary',
                cursor: 'pointer',
              }}
            >
              <item.icon fontSize="small" />
              <Box component="span" sx={{ fontSize: 10, fontWeight: 600 }}>
                {item.label}
              </Box>
            </Box>
          )
        })}
      </Paper>
    </Box>
  )
}

export default AppLayout
