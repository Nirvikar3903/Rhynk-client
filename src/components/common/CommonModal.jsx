import { Box, Dialog, IconButton, Typography, alpha } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AppButtonComponent from 'components/mui/AppButtonComponent'

// Shared chrome for every auth modal (Dialog paper, close button, icon
// avatar, heading/subheading, form wrapper, CTA button) — each specific
// modal keeps deciding its own fields (children), CTA copy/state, and an
// optional footer (divider + link/trust-note), rather than duplicating this
// markup per modal.
const CommonModal = ({
  open,
  onClose,
  icon,
  heading,
  subheading,
  onSubmit,
  children,
  formSx,
  ctaLabel,
  ctaLoading = false,
  ctaDisabled = false,
  ctaIcon,
  ctaSx,
  footer,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      onClose={onClose}
      open={open}
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
        onClick={onClose}
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
            bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          {icon}
        </Box>

        <Typography sx={{ textAlign: 'center', letterSpacing: '-0.02em', mb: 1 }} variant="h2">
          {heading}
        </Typography>

        {subheading && (
          <Typography color="text.secondary" sx={{ textAlign: 'center', maxWidth: 320, mb: 4 }} variant="body1">
            {subheading}
          </Typography>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3, ...formSx }}
        >
          {children}

          <AppButtonComponent
            disabled={ctaDisabled}
            endIcon={ctaIcon}
            fullWidth
            loading={ctaLoading}
            size="large"
            sx={ctaSx}
            type="submit"
          >
            {ctaLabel}
          </AppButtonComponent>
        </Box>

        {footer}
      </Box>
    </Dialog>
  )
}

export default CommonModal
