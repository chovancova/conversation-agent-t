import { Check } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type ColorPalette = {
  name: string
  colors: {
    background: string
    foreground: string
    card: string
    primary: string
    accent: string
  }
}

export const predefinedPalettes: ColorPalette[] = [
  {
    name: 'Classic Dark',
    colors: {
      background: '#252525',
      foreground: '#fafafa',
      card: '#353535',
      primary: '#3b82f6',
      accent: '#a855f7',
    }
  },
  {
    name: 'Midnight Blue',
    colors: {
      background: '#1a1f3a',
      foreground: '#e8ecf5',
      card: '#252b45',
      primary: '#4f7cff',
      accent: '#a78bfa',
    }
  },
  {
    name: 'Forest Green',
    colors: {
      background: '#1a2820',
      foreground: '#e8f5e8',
      card: '#253530',
      primary: '#4ade80',
      accent: '#86efac',
    }
  },
  {
    name: 'Sunset Orange',
    colors: {
      background: '#2a1f1a',
      foreground: '#f5ede8',
      card: '#3a2f28',
      primary: '#fb923c',
      accent: '#f472b6',
    }
  },
  {
    name: 'Ocean Breeze',
    colors: {
      background: '#1a2428',
      foreground: '#e8f2f5',
      card: '#253238',
      primary: '#22d3ee',
      accent: '#38bdf8',
    }
  },
  {
    name: 'Royal Purple',
    colors: {
      background: '#231a2a',
      foreground: '#f0e8f5',
      card: '#33253a',
      primary: '#c084fc',
      accent: '#e879f9',
    }
  },
  {
    name: 'Cherry Blossom',
    colors: {
      background: '#2a1a22',
      foreground: '#f5e8f0',
      card: '#3a2832',
      primary: '#f472b6',
      accent: '#fda4af',
    }
  },
  {
    name: 'Golden Hour',
    colors: {
      background: '#2a2518',
      foreground: '#f5f0e8',
      card: '#3a3528',
      primary: '#fbbf24',
      accent: '#fb923c',
    }
  },
  {
    name: 'Arctic Ice',
    colors: {
      background: '#1a2328',
      foreground: '#e8f0f5',
      card: '#253238',
      primary: '#67e8f9',
      accent: '#93c5fd',
    }
  },
  {
    name: 'Ruby Red',
    colors: {
      background: '#2a1818',
      foreground: '#f5e8e8',
      card: '#3a2525',
      primary: '#f87171',
      accent: '#fca5a5',
    }
  },
  {
    name: 'Emerald',
    colors: {
      background: '#182a20',
      foreground: '#e8f5ed',
      card: '#253a30',
      primary: '#10b981',
      accent: '#34d399',
    }
  },
  {
    name: 'Indigo Night',
    colors: {
      background: '#1a1a2a',
      foreground: '#e8e8f5',
      card: '#252535',
      primary: '#818cf8',
      accent: '#a5b4fc',
    }
  }
]

type ColorPalettePickerProps = {
  selectedPalette?: ColorPalette
  onSelect: (palette: ColorPalette) => void
}

export function ColorPalettePicker({ selectedPalette, onSelect }: ColorPalettePickerProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="grid grid-cols-2 gap-3">
        {predefinedPalettes.map((palette) => {
          const isSelected = selectedPalette?.name === palette.name
          
          return (
            <Button
              key={palette.name}
              variant="outline"
              className={`h-auto p-3 flex flex-col items-start gap-2 transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary border-primary' : ''
              }`}
              onClick={() => onSelect(palette)}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-medium">{palette.name}</span>
                {isSelected && (
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary">
                    <Check size={12} weight="bold" className="text-primary-foreground" />
                  </div>
                )}
              </div>
              <div className="flex gap-1.5 w-full">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className="w-8 h-8 rounded border-2 border-border/60 cursor-help transition-transform hover:scale-110"
                      style={{ backgroundColor: palette.colors.background }}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="font-mono text-xs">
                    <div className="flex flex-col gap-0.5">
                      <div className="font-semibold text-foreground">Background</div>
                      <div className="text-muted-foreground">{palette.colors.background}</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className="w-8 h-8 rounded border-2 border-border/60 cursor-help transition-transform hover:scale-110"
                      style={{ backgroundColor: palette.colors.card }}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="font-mono text-xs">
                    <div className="flex flex-col gap-0.5">
                      <div className="font-semibold text-foreground">Card</div>
                      <div className="text-muted-foreground">{palette.colors.card}</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className="w-8 h-8 rounded border-2 border-border/60 cursor-help transition-transform hover:scale-110"
                      style={{ backgroundColor: palette.colors.primary }}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="font-mono text-xs">
                    <div className="flex flex-col gap-0.5">
                      <div className="font-semibold text-foreground">Primary</div>
                      <div className="text-muted-foreground">{palette.colors.primary}</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className="w-8 h-8 rounded border-2 border-border/60 cursor-help transition-transform hover:scale-110"
                      style={{ backgroundColor: palette.colors.accent }}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="font-mono text-xs">
                    <div className="flex flex-col gap-0.5">
                      <div className="font-semibold text-foreground">Accent</div>
                      <div className="text-muted-foreground">{palette.colors.accent}</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            </Button>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
