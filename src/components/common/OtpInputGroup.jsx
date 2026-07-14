import { useRef } from 'react'
import { Box } from '@mui/material'
import AppTextFieldComponent from 'components/mui/AppTextFieldComponent'

// Unset boxes are tracked as a literal space so `value` stays a fixed-length
// string with each digit at its real index — join()-ing a sparse array would
// silently collapse gaps (e.g. ['1', '', '3'] -> "13"), losing box position
// if a user clicks ahead instead of typing sequentially.
const EMPTY_SLOT = ' '

const OtpInputGroup = ({ length = 6, value = '', onChange, disabled = false }) => {
  const inputRefs = useRef([])
  const chars = value.padEnd(length, EMPTY_SLOT).slice(0, length).split('')

  const setChar = (index, char) => {
    const next = [...chars]
    next[index] = char
    onChange(next.join('').replace(/\s+$/, ''))
  }

  const handleChange = (index) => (event) => {
    const digit = event.target.value.replace(/\D/g, '').slice(-1)
    if (!digit) return
    setChar(index, digit)
    if (index < length - 1) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index) => (event) => {
    if (event.key !== 'Backspace') return
    event.preventDefault()
    if (chars[index] !== EMPTY_SLOT) {
      setChar(index, EMPTY_SLOT)
    } else if (index > 0) {
      setChar(index - 1, EMPTY_SLOT)
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (event) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    onChange(pasted)
    inputRefs.current[Math.min(pasted.length, length - 1)]?.focus()
  }

  return (
    <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1.5 } }}>
      {chars.map((char, index) => (
        <AppTextFieldComponent
          key={index}
          disabled={disabled}
          fullWidth={false}
          inputRef={(el) => {
            inputRefs.current[index] = el
          }}
          onChange={handleChange(index)}
          onKeyDown={handleKeyDown(index)}
          onPaste={handlePaste}
          slotProps={{
            htmlInput: {
              inputMode: 'numeric',
              maxLength: 1,
              pattern: '[0-9]*',
              'aria-label': `Digit ${index + 1}`,
              sx: { textAlign: 'center', px: 0 },
            },
          }}
          sx={{ width: { xs: 44, sm: 56 } }}
          value={char === EMPTY_SLOT ? '' : char}
        />
      ))}
    </Box>
  )
}

export default OtpInputGroup
