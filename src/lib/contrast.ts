import { ThemeColors } from './themes'

export interface ContrastResult {
  ratio: number
  wcagAA: boolean
  wcagAAA: boolean
  wcagAALarge: boolean
  wcagAAALarge: boolean
  grade: 'AAA' | 'AA' | 'AA Large' | 'Fail'
}

function parseOklch(oklch: string): { l: number; c: number; h: number; alpha: number } {
  const match = oklch.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\)/)
  
  if (!match) {
    return { l: 0.5, c: 0, h: 0, alpha: 1 }
  }
  
  const l = parseFloat(match[1])
  const c = parseFloat(match[2])
  const h = parseFloat(match[3])
  let alpha = 1
  
  if (match[4]) {
    if (match[4].endsWith('%')) {
      alpha = parseFloat(match[4]) / 100
    } else {
      alpha = parseFloat(match[4])
    }
  }
  
  return { l, c, h, alpha }
}

function oklchToRgb(l: number, c: number, h: number): { r: number; g: number; b: number } {
  const hRad = (h * Math.PI) / 180
  
  const a = c * Math.cos(hRad)
  const b = c * Math.sin(hRad)
  
  let lrgb = l + 0.3963377774 * a + 0.2158037573 * b
  let mrgb = l - 0.1055613458 * a - 0.0638541728 * b
  let srgb = l - 0.0894841775 * a - 1.2914855480 * b
  
  lrgb = lrgb ** 3
  mrgb = mrgb ** 3
  srgb = srgb ** 3
  
  let r = +4.0767416621 * lrgb - 3.3077115913 * mrgb + 0.2309699292 * srgb
  let g = -1.2684380046 * lrgb + 2.6097574011 * mrgb - 0.3413193965 * srgb
  let blue = -0.0041960863 * lrgb - 0.7034186147 * mrgb + 1.7076147010 * srgb
  
  r = Math.max(0, Math.min(1, r))
  g = Math.max(0, Math.min(1, g))
  blue = Math.max(0, Math.min(1, blue))
  
  return { r, g, b: blue }
}

function linearToSrgb(value: number): number {
  if (value <= 0.0031308) {
    return value * 12.92
  }
  return 1.055 * Math.pow(value, 1 / 2.4) - 0.055
}

function getLuminance(r: number, g: number, b: number): number {
  const rsrgb = linearToSrgb(r)
  const gsrgb = linearToSrgb(g)
  const bsrgb = linearToSrgb(b)
  
  return 0.2126 * rsrgb + 0.7152 * gsrgb + 0.0722 * bsrgb
}

export function calculateContrastRatio(color1: string, color2: string): number {
  const oklch1 = parseOklch(color1)
  const oklch2 = parseOklch(color2)
  
  const rgb1 = oklchToRgb(oklch1.l, oklch1.c, oklch1.h)
  const rgb2 = oklchToRgb(oklch2.l, oklch2.c, oklch2.h)
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)
  
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

export function getContrastResult(foreground: string, background: string): ContrastResult {
  const ratio = calculateContrastRatio(foreground, background)
  
  const wcagAA = ratio >= 4.5
  const wcagAAA = ratio >= 7
  const wcagAALarge = ratio >= 3
  const wcagAAALarge = ratio >= 4.5
  
  let grade: 'AAA' | 'AA' | 'AA Large' | 'Fail' = 'Fail'
  if (wcagAAA) {
    grade = 'AAA'
  } else if (wcagAA) {
    grade = 'AA'
  } else if (wcagAALarge) {
    grade = 'AA Large'
  }
  
  return {
    ratio,
    wcagAA,
    wcagAAA,
    wcagAALarge,
    wcagAAALarge,
    grade
  }
}

export interface ColorPair {
  name: string
  foreground: string
  background: string
  description?: string
}

export function analyzeThemeContrast(colors: ThemeColors | Record<string, string>): Map<string, ContrastResult> {
  const pairs: ColorPair[] = [
    { name: 'Background Text', foreground: colors.foreground || '', background: colors.background || '' },
    { name: 'Card Text', foreground: (colors as any).cardForeground || colors.foreground || '', background: (colors as any).card || '' },
    { name: 'Primary Button', foreground: (colors as any).primaryForeground || '', background: (colors as any).primary || '' },
    { name: 'Secondary', foreground: (colors as any).secondaryForeground || '', background: (colors as any).secondary || '' },
    { name: 'Accent', foreground: (colors as any).accentForeground || '', background: (colors as any).accent || '' },
    { name: 'Muted Text', foreground: (colors as any).mutedForeground || '', background: colors.background || '' },
    { name: 'Destructive', foreground: (colors as any).destructiveForeground || '', background: (colors as any).destructive || '' },
  ]
  
  const results = new Map<string, ContrastResult>()
  
  pairs.forEach(pair => {
    if (pair.foreground && pair.background) {
      const result = getContrastResult(pair.foreground, pair.background)
      results.set(pair.name, result)
    }
  })
  
  return results
}
