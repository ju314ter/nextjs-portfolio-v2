import {createContext, useContext } from 'react'

export type ThemeContent = {
    isActive: boolean,
    theme: {backgroundColor: string, contentColor: string}
    setTheme:(c: object) => void
    setIsActive:(c: boolean) => void
  }

export const theme = {
    dark : {
        backgroundColor: '#C8C8C8',
        contentColor: '#2c2c2c'
    },
    light : {
        backgroundColor : '#2c2c2c',
        contentColor : '#F7F7F7',
    }
}

export const ThemeContext = createContext<ThemeContent>({
    isActive: false,
    theme: theme.light,
    setTheme: () => {},
    setIsActive: () => {}
    })

export const useThemeContext = () => useContext(ThemeContext)