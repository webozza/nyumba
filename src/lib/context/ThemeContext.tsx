import * as React from 'react'
import { ThemeOptions } from '@mui/material'
import { nyumba_theme, nyumba_light, nyumba_dark } from '../theme'

interface Props {
  children?: React.ReactNode
}

export type ThemeContextType = {
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>
  theme: ThemeOptions | undefined
}

const initialState = {
  setDarkMode: () => { return },
  theme: undefined
}

export const ThemeContext = React.createContext<ThemeContextType>(initialState)

const ThemeProvider = ({ children }: Props) => {
  const [dark, setDarkMode] = React.useState<boolean>(localStorage.getItem("darkMode") === "false" ? false : true)

  return (
    <ThemeContext.Provider value={{
      theme: {
        ...nyumba_theme,
        palette: {
          ...nyumba_theme.palette,
          mode: dark ? "dark" : "light",
          ...(dark && { ...nyumba_dark.palette }),
          ...(!dark && { ...nyumba_light.palette }),
        },
      },
      setDarkMode,
    }}>
      {children}
    </ThemeContext.Provider >
  );
}

export function useThemeContext() {
  return React.useContext(ThemeContext);
}

export default ThemeProvider