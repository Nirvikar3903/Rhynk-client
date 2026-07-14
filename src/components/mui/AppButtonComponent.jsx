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
      sx={sx}
      {...props}
    >
      {loading ? 'Loading…' : children}
    </MuiButton>
  )
}

export default memo(AppButtonComponent)
