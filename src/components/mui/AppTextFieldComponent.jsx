import { memo } from 'react'
import { TextField } from '@mui/material'

const AppTextFieldComponent = ({ sx = {}, ...props }) => {
  return <TextField fullWidth variant="outlined" sx={sx} {...props} />
}

export default memo(AppTextFieldComponent)
