import { AppBar, Toolbar, Box, IconButton, Avatar, Typography, Link as MuiLink, alpha } from '@mui/material'
import { Link } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import PersonIcon from '@mui/icons-material/Person'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import GroupsIcon from '@mui/icons-material/Groups'
import BoltIcon from '@mui/icons-material/Bolt'
import AppButtonComponent from 'components/mui/AppButtonComponent'
import LandingHero from 'components/common/LandingHero'

const FEATURES = [
  { Icon: GroupsIcon, color: 'primary.main', title: 'Group Rooms', description: 'Unlimited listeners, one shared beat.' },
  { Icon: BoltIcon, color: 'success.main', title: 'Zero Latency', description: 'Perfect sync across all devices.' },
]

const LandingPage = () => (
  <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
    <AppBar
      color="transparent"
      elevation={0}
      position="fixed"
      sx={{
        bgcolor: (t) => alpha(t.palette.background.default, 0.8),
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography color="primary.main" sx={{ letterSpacing: '-0.02em' }} variant="h2">
          Rhynk
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton aria-label="Search" sx={{ color: 'primary.main' }}>
            <SearchIcon />
          </IconButton>
          <Avatar sx={{ width: 32, height: 32, border: '1px solid', borderColor: 'divider' }}>
            <PersonIcon fontSize="small" />
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>

    <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, mt: 8 }}>
      <Box sx={{ width: { xs: '100%', md: '50%' } }}>
        <LandingHero />
      </Box>

      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 3, md: 8 },
          py: { xs: 6, md: 8 },
        }}
      >
        <Box sx={{ maxWidth: 420, width: '100%' }}>
          <Typography sx={{ letterSpacing: '-0.02em', mb: 2 }} variant="h1">
            Chat and vibe,{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              in sync.
            </Box>
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }} variant="body1">
            Message your people — and listen to the same track, together, in real time.
            Experience music rooms built for the modern connection.
          </Typography>

          <AppButtonComponent
            component={Link}
            endIcon={<ArrowForwardIcon />}
            fullWidth
            size="large"
            sx={{ py: 1.5, boxShadow: 3 }}
            to="/signup"
          >
            Get Started
          </AppButtonComponent>

          <Typography sx={{ textAlign: 'center', mt: 2 }} variant="body2">
            Already have an account?{' '}
            <MuiLink component={Link} sx={{ fontWeight: 700 }} to="/login" underline="hover">
              Log in.
            </MuiLink>
          </Typography>

          <Box sx={{ display: 'flex', gap: 4, mt: 6, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
            {FEATURES.map(({ Icon, color, title, description }) => (
              <Box key={title} sx={{ flex: 1 }}>
                <Icon sx={{ color, mb: 1 }} />
                <Typography sx={{ fontWeight: 700 }} variant="body2">
                  {title}
                </Typography>
                <Typography color="text.secondary" variant="caption">
                  {description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>

    <Box
      component="footer"
      sx={{
        display: { xs: 'none', md: 'flex' },
        justifyContent: 'space-between',
        px: 4,
        py: 2,
        color: 'text.secondary',
      }}
    >
      <Typography variant="caption">© 2024 Rhynk Interactive</Typography>
      <Box sx={{ display: 'flex', gap: 3 }}>
        <MuiLink color="inherit" href="/terms" underline="hover" variant="caption">
          Terms
        </MuiLink>
        <MuiLink color="inherit" href="/privacy" underline="hover" variant="caption">
          Privacy
        </MuiLink>
        <MuiLink color="inherit" href="/contact" underline="hover" variant="caption">
          Contact
        </MuiLink>
      </Box>
    </Box>
  </Box>
)

export default LandingPage
