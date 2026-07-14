import { useMemo } from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { createDynamicTheme } from 'theme'
import useTheme from 'hooks/useTheme.hook'
import AppRouter from 'router'

const App = () => {
  const { isDarkMode } = useTheme()
  const currentTheme = useMemo(() => createDynamicTheme(isDarkMode), [isDarkMode])

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </ThemeProvider>
  )
}

export default App
