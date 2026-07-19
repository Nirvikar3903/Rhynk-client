import { useMemo } from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
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
      <ToastContainer position="top-right" theme={isDarkMode ? 'dark' : 'light'} />
    </ThemeProvider>
  )
}

export default App
