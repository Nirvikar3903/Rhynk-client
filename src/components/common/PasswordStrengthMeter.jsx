import { Box, Typography } from '@mui/material'

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Medium', 'Strong']

const getStrengthScore = (password) => {
  let score = 0
  if (password.length > 0) score = 1
  if (password.length > 5) score = 2
  if (password.length > 8) score = 3
  if (password.length > 12) score = 4
  return score
}

const PasswordStrengthMeter = ({ password = '' }) => {
  const score = getStrengthScore(password)

  return (
    <Box sx={{ px: 0.5, pt: 1 }}>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {[1, 2, 3, 4].map((segment) => (
          <Box
            key={segment}
            sx={{
              height: 4,
              flex: 1,
              borderRadius: 1,
              bgcolor: segment <= score ? 'primary.main' : 'divider',
              transition: 'background-color 0.2s ease',
            }}
          />
        ))}
      </Box>
      {password && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          Strength: {STRENGTH_LABELS[score]}
        </Typography>
      )}
    </Box>
  )
}

export default PasswordStrengthMeter
