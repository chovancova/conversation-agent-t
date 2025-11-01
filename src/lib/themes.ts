export type ThemeOption = 'dark' | 'light' | 'commerzbank' | 'ocean' | 'forest' | 'sunset' | 'midnight' | 'custom'

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

export interface ThemeDefinition {
  name: string
  description: string
  colors: ThemeColors
  category?: 'default' | 'brand' | 'nature' | 'custom'
}

export const themes: Record<ThemeOption, ThemeDefinition> = {
  dark: {
    name: 'Dark',
    description: 'Modern dark theme with high contrast',
    category: 'default',
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
    category: 'default',
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
    description: 'Official Commerzbank brand colors with yellow accent',
    category: 'brand',
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
  },
  ocean: {
    name: 'Ocean',
    description: 'Deep blue tones inspired by the sea',
    category: 'nature',
    colors: {
      background: 'oklch(0.15 0.04 240)',
      foreground: 'oklch(0.95 0.02 200)',
      card: 'oklch(0.20 0.05 240)',
      cardForeground: 'oklch(0.95 0.02 200)',
      popover: 'oklch(0.22 0.05 240)',
      popoverForeground: 'oklch(0.95 0.02 200)',
      primary: 'oklch(0.60 0.18 220)',
      primaryForeground: 'oklch(0.98 0.01 220)',
      secondary: 'oklch(0.28 0.05 240)',
      secondaryForeground: 'oklch(0.95 0.02 200)',
      muted: 'oklch(0.25 0.04 240)',
      mutedForeground: 'oklch(0.65 0.03 220)',
      accent: 'oklch(0.70 0.15 200)',
      accentForeground: 'oklch(0.15 0.04 240)',
      destructive: 'oklch(0.65 0.22 25)',
      destructiveForeground: 'oklch(0.98 0.01 200)',
      border: 'oklch(0.32 0.05 240)',
      input: 'oklch(0.32 0.05 240)',
      ring: 'oklch(0.60 0.18 220)',
    }
  },
  forest: {
    name: 'Forest',
    description: 'Rich green tones inspired by nature',
    category: 'nature',
    colors: {
      background: 'oklch(0.14 0.03 145)',
      foreground: 'oklch(0.96 0.01 140)',
      card: 'oklch(0.19 0.04 145)',
      cardForeground: 'oklch(0.96 0.01 140)',
      popover: 'oklch(0.21 0.04 145)',
      popoverForeground: 'oklch(0.96 0.01 140)',
      primary: 'oklch(0.58 0.16 150)',
      primaryForeground: 'oklch(0.98 0.01 150)',
      secondary: 'oklch(0.26 0.04 145)',
      secondaryForeground: 'oklch(0.96 0.01 140)',
      muted: 'oklch(0.24 0.03 145)',
      mutedForeground: 'oklch(0.64 0.03 145)',
      accent: 'oklch(0.72 0.14 130)',
      accentForeground: 'oklch(0.14 0.03 145)',
      destructive: 'oklch(0.63 0.20 30)',
      destructiveForeground: 'oklch(0.98 0.01 140)',
      border: 'oklch(0.30 0.04 145)',
      input: 'oklch(0.30 0.04 145)',
      ring: 'oklch(0.58 0.16 150)',
    }
  },
  sunset: {
    name: 'Sunset',
    description: 'Warm orange and pink tones',
    category: 'nature',
    colors: {
      background: 'oklch(0.16 0.03 30)',
      foreground: 'oklch(0.97 0.01 50)',
      card: 'oklch(0.21 0.04 30)',
      cardForeground: 'oklch(0.97 0.01 50)',
      popover: 'oklch(0.23 0.04 30)',
      popoverForeground: 'oklch(0.97 0.01 50)',
      primary: 'oklch(0.68 0.18 40)',
      primaryForeground: 'oklch(0.16 0.03 30)',
      secondary: 'oklch(0.28 0.04 30)',
      secondaryForeground: 'oklch(0.97 0.01 50)',
      muted: 'oklch(0.26 0.03 30)',
      mutedForeground: 'oklch(0.66 0.03 40)',
      accent: 'oklch(0.72 0.20 350)',
      accentForeground: 'oklch(0.98 0.01 350)',
      destructive: 'oklch(0.64 0.22 25)',
      destructiveForeground: 'oklch(0.98 0.01 50)',
      border: 'oklch(0.32 0.04 30)',
      input: 'oklch(0.32 0.04 30)',
      ring: 'oklch(0.68 0.18 40)',
    }
  },
  midnight: {
    name: 'Midnight',
    description: 'Deep purple and blue night tones',
    category: 'nature',
    colors: {
      background: 'oklch(0.12 0.04 280)',
      foreground: 'oklch(0.96 0.02 260)',
      card: 'oklch(0.17 0.05 280)',
      cardForeground: 'oklch(0.96 0.02 260)',
      popover: 'oklch(0.19 0.05 280)',
      popoverForeground: 'oklch(0.96 0.02 260)',
      primary: 'oklch(0.62 0.20 290)',
      primaryForeground: 'oklch(0.98 0.01 290)',
      secondary: 'oklch(0.24 0.05 280)',
      secondaryForeground: 'oklch(0.96 0.02 260)',
      muted: 'oklch(0.22 0.04 280)',
      mutedForeground: 'oklch(0.64 0.03 280)',
      accent: 'oklch(0.75 0.18 320)',
      accentForeground: 'oklch(0.98 0.01 320)',
      destructive: 'oklch(0.62 0.20 25)',
      destructiveForeground: 'oklch(0.98 0.01 260)',
      border: 'oklch(0.28 0.05 280)',
      input: 'oklch(0.28 0.05 280)',
      ring: 'oklch(0.62 0.20 290)',
    }
  },
  custom: {
    name: 'Custom',
    description: 'Create your own theme',
    category: 'custom',
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
  }
}

export function applyTheme(theme: ThemeOption, customColors?: ThemeColors) {
  const themeColors = customColors || themes[theme].colors
  const root = document.documentElement

  Object.entries(themeColors).forEach(([key, value]) => {
    const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    root.style.setProperty(`--${cssVarName}`, value)
  })
}

export function hexToOklch(hex: string): string {
  hex = hex.replace('#', '')
  
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  
  let s = 0
  if (max !== min) {
    s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min)
  }
  
  let h = 0
  if (max !== min) {
    if (max === r) {
      h = ((g - b) / (max - min) + (g < b ? 6 : 0)) / 6
    } else if (max === g) {
      h = ((b - r) / (max - min) + 2) / 6
    } else {
      h = ((r - g) / (max - min) + 4) / 6
    }
  }

  const lightness = l
  const chroma = s * (1 - Math.abs(2 * l - 1))
  const hue = h * 360

  return `oklch(${lightness.toFixed(3)} ${chroma.toFixed(3)} ${hue.toFixed(1)})`
}
