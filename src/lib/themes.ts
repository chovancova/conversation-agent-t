export type ThemeOption = 'dark' | 'light' | 'commerzbank'

export interface ThemeColors {
  background: string
  foreground: string
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  destructive: string
  destructiveForeground: string
  border: string
  input: string
  ring: string
}

export const themes: Record<ThemeOption, { name: string; description: string; colors: ThemeColors }> = {
  dark: {
    name: 'Dark',
    description: 'Modern dark theme with high contrast',
    colors: {
      background: 'oklch(0.145 0 0)',
      foreground: 'oklch(0.985 0 0)',
      card: 'oklch(0.205 0 0)',
      cardForeground: 'oklch(0.985 0 0)',
      popover: 'oklch(0.205 0 0)',
      popoverForeground: 'oklch(0.985 0 0)',
      primary: 'oklch(0.65 0.20 160)',
      primaryForeground: 'oklch(0.98 0.01 180)',
      secondary: 'oklch(0.269 0 0)',
      secondaryForeground: 'oklch(0.985 0 0)',
      muted: 'oklch(0.269 0 0)',
      mutedForeground: 'oklch(0.708 0 0)',
      accent: 'oklch(0.75 0.15 280)',
      accentForeground: 'oklch(0.985 0 0)',
      destructive: 'oklch(0.704 0.191 22.216)',
      destructiveForeground: 'oklch(0.985 0 0)',
      border: 'oklch(1 0 0 / 10%)',
      input: 'oklch(1 0 0 / 15%)',
      ring: 'oklch(0.65 0.20 160)',
    }
  },
  light: {
    name: 'Light',
    description: 'Clean light theme with soft colors',
    colors: {
      background: 'oklch(0.98 0.01 180)',
      foreground: 'oklch(0.15 0.02 240)',
      card: 'oklch(0.99 0.005 180)',
      cardForeground: 'oklch(0.15 0.02 240)',
      popover: 'oklch(1.00 0 0)',
      popoverForeground: 'oklch(0.15 0.02 240)',
      primary: 'oklch(0.65 0.20 160)',
      primaryForeground: 'oklch(0.98 0.01 180)',
      secondary: 'oklch(0.92 0.08 200)',
      secondaryForeground: 'oklch(0.20 0.05 240)',
      muted: 'oklch(0.94 0.02 180)',
      mutedForeground: 'oklch(0.45 0.02 240)',
      accent: 'oklch(0.75 0.15 280)',
      accentForeground: 'oklch(0.15 0.02 240)',
      destructive: 'oklch(0.65 0.20 25)',
      destructiveForeground: 'oklch(0.98 0.01 180)',
      border: 'oklch(0.88 0.02 180)',
      input: 'oklch(0.88 0.02 180)',
      ring: 'oklch(0.65 0.20 160)',
    }
  },
  commerzbank: {
    name: 'Commerzbank',
    description: 'Official Commerzbank brand colors',
    colors: {
      background: 'oklch(0.12 0.01 265)',
      foreground: 'oklch(0.98 0.005 100)',
      card: 'oklch(0.18 0.015 265)',
      cardForeground: 'oklch(0.98 0.005 100)',
      popover: 'oklch(0.20 0.015 265)',
      popoverForeground: 'oklch(0.98 0.005 100)',
      primary: 'oklch(0.68 0.17 60)',
      primaryForeground: 'oklch(0.12 0.01 265)',
      secondary: 'oklch(0.25 0.02 265)',
      secondaryForeground: 'oklch(0.98 0.005 100)',
      muted: 'oklch(0.22 0.015 265)',
      mutedForeground: 'oklch(0.65 0.01 265)',
      accent: 'oklch(0.68 0.17 60)',
      accentForeground: 'oklch(0.12 0.01 265)',
      destructive: 'oklch(0.60 0.22 25)',
      destructiveForeground: 'oklch(0.98 0.005 100)',
      border: 'oklch(0.30 0.02 265)',
      input: 'oklch(0.30 0.02 265)',
      ring: 'oklch(0.68 0.17 60)',
    }
  }
}

export function applyTheme(theme: ThemeOption) {
  const themeColors = themes[theme].colors
  const root = document.documentElement

  Object.entries(themeColors).forEach(([key, value]) => {
    const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    root.style.setProperty(`--${cssVarName}`, value)
  })
}
