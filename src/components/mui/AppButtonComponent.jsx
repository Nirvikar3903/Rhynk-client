import { memo } from 'react'
import { Button as MuiButton } from '@mui/material'

const AppButtonComponent = ({
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  children,
  sx = {},
  ...props
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      disabled={disabled || loading}
      sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 500, ...sx }}
      {...props}
    >
      {loading ? 'Loading…' : children}
    </MuiButton>
  )
}

export default memo(AppButtonComponent)
