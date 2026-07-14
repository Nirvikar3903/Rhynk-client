import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMode as setThemeMode, selectThemeMode, selectIsDarkMode } from 'store/slices/theme.slice'

const STORAGE_KEY = 'rhynk_theme'

// Narrow, deliberate exception to create-redux-slice.md's "don't hand-roll a
// localStorage sync" guidance — that's aimed at skipping a real persistence
// decision for complex state (auth tokens); a single UI-preference string is
// the standard lightweight case a library like redux-persist would be
// overkill for.
//
// Persistence only happens from the explicit setMode/toggleMode calls below,
// not from a `mode`-keyed effect — an effect that both reads localStorage on
// mount AND writes it on every `mode` change fires in the same passive-effect
// pass with the stale pre-dispatch `mode`, so the write clobbers the read
// before the store update ever takes visual effect.
const useTheme = () => {
  const dispatch = useDispatch()
  const mode = useSelector(selectThemeMode)
  const isDarkMode = useSelector(selectIsDarkMode)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') {
      dispatch(setThemeMode(stored))
      return
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    dispatch(setThemeMode(prefersDark ? 'dark' : 'light'))
  }, [dispatch])

  const setMode = (value) => {
    dispatch(setThemeMode(value))
    localStorage.setItem(STORAGE_KEY, value)
  }

  const toggleMode = () => {
    const next = mode === 'dark' ? 'light' : 'dark'
    dispatch(setThemeMode(next))
    localStorage.setItem(STORAGE_KEY, next)
  }

  return { mode, isDarkMode, setMode, toggleMode }
}

export default useTheme
