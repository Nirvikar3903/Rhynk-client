import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  mode: 'dark',
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload
    },
    toggleMode: (state) => {
      state.mode = state.mode === 'dark' ? 'light' : 'dark'
    },
  },
})

export const { setMode, toggleMode } = themeSlice.actions
export const selectThemeMode = (state) => state.theme.mode
export const selectIsDarkMode = (state) => state.theme.mode === 'dark'
export default themeSlice.reducer
