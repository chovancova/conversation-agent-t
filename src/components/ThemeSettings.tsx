import { useState, useEffect, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Palette, Check, Plus, Pencil, Swatches, TextAa, Export, Download, FloppyDisk, Eye } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ColorPalettePicker, predefinedPalettes } from '@/components/ColorPalettePicker'
import { themes, ThemeOption, ThemeColors, applyTheme, hexToOklch, fontOptions, TypographySettings, applyTypography } from '@/lib/themes'
import { analyzeThemeContrast, getContrastResult } from '@/lib/contrast'
import { ContrastIndicator } from '@/components/ContrastIndicator'

type ThemeSettingsProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ThemeSettings({ open, onOpenChange }: ThemeSettingsProps) {
  const [selectedTheme, setSelectedTheme] = useKV<ThemeOption>('selected-theme', 'dark')
  const [customTheme, setCustomTheme] = useKV<ThemeColors | null>('custom-theme', null)
  const [typography, setTypography] = useKV<TypographySettings>('typography-settings', {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    fontSize: 'medium',
    lineHeight: 'normal'
  })
  const [editingMode, setEditingMode] = useState<'palette' | 'manual' | null>(null)
  const [customColors, setCustomColors] = useState<Record<string, string>>({
    background: '#252525',
    foreground: '#fafafa',
    card: '#353535',
    primary: '#3b82f6',
    accent: '#a855f7',
  })
  const [selectedPalette, setSelectedPalette] = useState(predefinedPalettes[0])

  useEffect(() => {
    if (typography) {
      applyTypography(typography)
    }
  }, [typography])

  const handleThemeChange = (theme: ThemeOption) => {
    if (theme === 'custom' && !customTheme) {
      setEditingMode('palette')
      return
    }
    
    setSelectedTheme(theme)
    if (theme === 'custom' && customTheme) {
      applyTheme(theme, customTheme)
    } else {
      applyTheme(theme)
    }
    toast.success(`${themes[theme].name} theme applied`)
  }

  const handlePaletteSelect = (palette: typeof predefinedPalettes[0]) => {
    setSelectedPalette(palette)
    setCustomColors(palette.colors)
  }

  const handleCustomColorChange = (key: string, value: string) => {
    setCustomColors((prev) => ({ ...prev, [key]: value }))
  }

  const handleTypographyChange = (key: keyof TypographySettings, value: any) => {
    setTypography((prev = { fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif', fontSize: 'medium', lineHeight: 'normal' }) => {
      const newTypography: TypographySettings = { ...prev, [key]: value }
      applyTypography(newTypography)
      return newTypography
    })
    toast.success('Typography updated')
  }

  const handleSaveCustomTheme = () => {
    const newCustomTheme: ThemeColors = {
      background: hexToOklch(customColors.background),
      foreground: hexToOklch(customColors.foreground),
      card: hexToOklch(customColors.card),
      cardForeground: hexToOklch(customColors.foreground),
      popover: hexToOklch(customColors.card),
      popoverForeground: hexToOklch(customColors.foreground),
      primary: hexToOklch(customColors.primary),
      primaryForeground: hexToOklch(customColors.background),
      secondary: hexToOklch(customColors.background),
      secondaryForeground: hexToOklch(customColors.foreground),
      muted: hexToOklch(customColors.card),
      mutedForeground: hexToOklch(customColors.foreground),
      accent: hexToOklch(customColors.accent),
      accentForeground: hexToOklch(customColors.background),
      destructive: 'oklch(0.65 0.22 25)',
      destructiveForeground: hexToOklch(customColors.foreground),
      border: hexToOklch(customColors.card),
      input: hexToOklch(customColors.card),
      ring: hexToOklch(customColors.primary),
    }

    setCustomTheme(newCustomTheme)
    setSelectedTheme('custom')
    applyTheme('custom', newCustomTheme)
    setEditingMode(null)
    toast.success('Custom theme saved and applied')
  }

  const handleExportTheme = () => {
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      theme: {
        selectedTheme,
        customTheme,
        typography
      }
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    const filename = `theme-settings-${Date.now()}.json`
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success('Theme settings exported to Downloads folder', {
      description: `File: ${filename}`
    })
  }

  const handleImportTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)
        
        if (!data.theme) {
          throw new Error('Invalid theme file format')
        }

        if (data.theme.customTheme) {
          setCustomTheme(data.theme.customTheme)
        }
        if (data.theme.typography) {
          setTypography(data.theme.typography)
          applyTypography(data.theme.typography)
        }
        if (data.theme.selectedTheme) {
          setSelectedTheme(data.theme.selectedTheme)
          if (data.theme.selectedTheme === 'custom' && data.theme.customTheme) {
            applyTheme('custom', data.theme.customTheme)
          } else {
            applyTheme(data.theme.selectedTheme)
          }
        }

        toast.success('Theme imported and applied successfully')
      } catch (error) {
        toast.error('Failed to import theme', {
          description: error instanceof Error ? error.message : 'Invalid file format'
        })
        console.error('Import error:', error)
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  const groupedThemes = (Object.keys(themes) as ThemeOption[]).reduce((acc, key) => {
    if (key === 'custom') return acc
    const category = themes[key].category || 'default'
    if (!acc[category]) acc[category] = []
    acc[category].push(key)
    return acc
  }, {} as Record<string, ThemeOption[]>)

  const categoryLabels: Record<string, string> = {
    default: 'Default Themes',
    brand: 'Brand Themes',
    nature: 'Nature-Inspired',
  }

  const currentThemeColors = useMemo(() => {
    if (selectedTheme === 'custom' && customTheme) {
      return customTheme
    }
    return themes[selectedTheme || 'dark'].colors
  }, [selectedTheme, customTheme])

  const contrastResults = useMemo(() => {
    return analyzeThemeContrast(currentThemeColors)
  }, [currentThemeColors])

  const customColorsContrast = useMemo(() => {
    const tempColors = {
      background: hexToOklch(customColors.background),
      foreground: hexToOklch(customColors.foreground),
      card: hexToOklch(customColors.card),
      primary: hexToOklch(customColors.primary),
      accent: hexToOklch(customColors.accent),
    }
    return analyzeThemeContrast({
      ...tempColors,
      cardForeground: tempColors.foreground,
      primaryForeground: tempColors.background,
      accentForeground: tempColors.background,
      mutedForeground: tempColors.foreground,
    })
  }, [customColors])

  if (editingMode === 'palette') {
    return (
      <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); setEditingMode(null) }}>
        <DialogContent className="max-w-3xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Swatches size={24} weight="duotone" />
              Choose Color Palette
            </DialogTitle>
            <DialogDescription>
              Select a predefined palette or switch to manual mode for full control
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[500px] pr-4">
            <div className="space-y-6 py-4">
              <ColorPalettePicker 
                selectedPalette={selectedPalette}
                onSelect={handlePaletteSelect}
              />
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-semibold mb-3">Preview & Accessibility</h4>
                
                <div className="mb-4 space-y-2">
                  {Array.from(customColorsContrast.entries()).slice(0, 4).map(([name, result]) => (
                    <ContrastIndicator key={name} pairName={name} result={result} showDetails={true} />
                  ))}
                </div>

                <Card 
                  className="p-6 border-2"
                  style={{ 
                    backgroundColor: customColors.card,
                    color: customColors.foreground,
                    borderColor: customColors.primary + '40'
                  }}
                >
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold" style={{ color: customColors.foreground }}>
                      {selectedPalette.name} Theme
                    </h3>
                    <p className="text-sm" style={{ color: customColors.foreground + 'bb' }}>
                      This is how your theme will look with these colors
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        style={{ 
                          backgroundColor: customColors.primary,
                          color: customColors.background
                        }}
                      >
                        Primary Button
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        style={{ 
                          borderColor: customColors.accent,
                          color: customColors.accent
                        }}
                      >
                        Accent Button
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </ScrollArea>

          <div className="flex justify-between gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setEditingMode('manual')}>
              <Pencil size={16} className="mr-2" />
              Manual Mode
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditingMode(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCustomTheme}>
                Save & Apply Theme
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (editingMode === 'manual') {
    return (
      <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); setEditingMode(null) }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil size={24} weight="duotone" />
              Create Custom Theme
            </DialogTitle>
            <DialogDescription>
              Pick your favorite colors to create a unique theme
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[500px] pr-4">
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bg-color">Background Color</Label>
                  <div className="flex gap-3">
                    <Input
                      id="bg-color"
                      type="color"
                      value={customColors.background}
                      onChange={(e) => handleCustomColorChange('background', e.target.value)}
                      className="w-20 h-12 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={customColors.background}
                      onChange={(e) => handleCustomColorChange('background', e.target.value)}
                      className="flex-1"
                      placeholder="#252525"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fg-color">Text Color</Label>
                  <div className="flex gap-3">
                    <Input
                      id="fg-color"
                      type="color"
                      value={customColors.foreground}
                      onChange={(e) => handleCustomColorChange('foreground', e.target.value)}
                      className="w-20 h-12 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={customColors.foreground}
                      onChange={(e) => handleCustomColorChange('foreground', e.target.value)}
                      className="flex-1"
                      placeholder="#fafafa"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="card-color">Card Background</Label>
                  <div className="flex gap-3">
                    <Input
                      id="card-color"
                      type="color"
                      value={customColors.card}
                      onChange={(e) => handleCustomColorChange('card', e.target.value)}
                      className="w-20 h-12 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={customColors.card}
                      onChange={(e) => handleCustomColorChange('card', e.target.value)}
                      className="flex-1"
                      placeholder="#353535"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex gap-3">
                    <Input
                      id="primary-color"
                      type="color"
                      value={customColors.primary}
                      onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                      className="w-20 h-12 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={customColors.primary}
                      onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                      className="flex-1"
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <div className="flex gap-3">
                    <Input
                      id="accent-color"
                      type="color"
                      value={customColors.accent}
                      onChange={(e) => handleCustomColorChange('accent', e.target.value)}
                      className="w-20 h-12 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={customColors.accent}
                      onChange={(e) => handleCustomColorChange('accent', e.target.value)}
                      className="flex-1"
                      placeholder="#a855f7"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-semibold mb-3">Preview & Accessibility</h4>
                
                <div className="mb-4 space-y-2">
                  {Array.from(customColorsContrast.entries()).slice(0, 4).map(([name, result]) => (
                    <ContrastIndicator key={name} pairName={name} result={result} showDetails={true} />
                  ))}
                </div>

                <Card 
                  className="p-6 border-2"
                  style={{ 
                    backgroundColor: customColors.card,
                    color: customColors.foreground,
                    borderColor: customColors.primary + '40'
                  }}
                >
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold" style={{ color: customColors.foreground }}>
                      Preview Card
                    </h3>
                    <p className="text-sm" style={{ color: customColors.foreground + 'bb' }}>
                      This is how your custom theme will look
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        style={{ 
                          backgroundColor: customColors.primary,
                          color: customColors.background
                        }}
                      >
                        Primary Button
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        style={{ 
                          borderColor: customColors.accent,
                          color: customColors.accent
                        }}
                      >
                        Accent Button
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setEditingMode(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCustomTheme}>
              Save & Apply Theme
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette size={24} weight="duotone" />
            Theme Settings
          </DialogTitle>
          <DialogDescription>
            Choose from predefined themes or create your own
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="presets" className="flex-1">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="presets">Preset Themes</TabsTrigger>
            <TabsTrigger value="custom">Create Custom</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="mt-6">
            <ScrollArea className="h-[400px] pr-4">
              <RadioGroup value={selectedTheme} onValueChange={handleThemeChange}>
                <div className="space-y-6">
                  {Object.entries(groupedThemes).map(([category, themeKeys]) => (
                    <div key={category}>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        {categoryLabels[category]}
                      </h3>
                      <div className="grid gap-3">
                        {themeKeys.map((themeKey) => {
                          const theme = themes[themeKey]
                          const isSelected = selectedTheme === themeKey
                          const themeContrast = analyzeThemeContrast(theme.colors)
                          const avgContrast = Array.from(themeContrast.values()).reduce((sum, r) => sum + r.ratio, 0) / themeContrast.size
                          const aaaCount = Array.from(themeContrast.values()).filter(r => r.wcagAAA).length
                          const aaCount = Array.from(themeContrast.values()).filter(r => r.wcagAA).length
                          
                          return (
                            <div key={themeKey} className="relative">
                              <RadioGroupItem
                                value={themeKey}
                                id={themeKey}
                                className="sr-only"
                              />
                              <Label
                                htmlFor={themeKey}
                                className="cursor-pointer"
                              >
                                <Card className={`p-4 transition-all hover:shadow-lg ${
                                  isSelected 
                                    ? 'ring-2 ring-primary shadow-md' 
                                    : 'hover:border-primary/50'
                                }`}>
                                  <div className="flex items-start gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold">{theme.name}</h3>
                                        {isSelected && (
                                          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary">
                                            <Check size={12} weight="bold" className="text-primary-foreground" />
                                          </div>
                                        )}
                                      </div>
                                      <p className="text-sm text-muted-foreground mb-3">
                                        {theme.description}
                                      </p>
                                      
                                      <div className="flex items-center gap-2 mb-3">
                                        <div className="text-xs text-muted-foreground">Accessibility:</div>
                                        <div className="flex gap-1">
                                          {Array.from(themeContrast.entries()).slice(0, 3).map(([name, result]) => (
                                            <ContrastIndicator key={name} pairName={name} result={result} />
                                          ))}
                                        </div>
                                        <div className="text-xs text-muted-foreground ml-auto">
                                          {aaaCount > 0 && `${aaaCount} AAA`}
                                          {aaaCount > 0 && aaCount > aaaCount && ' · '}
                                          {aaCount > aaaCount && `${aaCount - aaaCount} AA`}
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2 flex flex-col items-center">
                                        <div className="text-xs text-muted-foreground font-medium">Color Palette</div>
                                        <div className="flex gap-1.5">
                                          <div 
                                            className="w-12 h-12 rounded-lg border-2 border-border/60 shadow-sm transition-transform hover:scale-105"
                                            style={{ backgroundColor: theme.colors.background }}
                                            title="Background"
                                          />
                                          <div 
                                            className="w-12 h-12 rounded-lg border-2 border-border/60 shadow-sm transition-transform hover:scale-105"
                                            style={{ backgroundColor: theme.colors.card }}
                                            title="Card"
                                          />
                                          <div 
                                            className="w-12 h-12 rounded-lg border-2 border-border/60 shadow-sm transition-transform hover:scale-105"
                                            style={{ backgroundColor: theme.colors.primary }}
                                            title="Primary"
                                          />
                                          <div 
                                            className="w-12 h-12 rounded-lg border-2 border-border/60 shadow-sm transition-transform hover:scale-105"
                                            style={{ backgroundColor: theme.colors.accent }}
                                            title="Accent"
                                          />
                                      </div>
                                      </div>
                                    </div>
                                  </div>
                                </Card>
                              </Label>
                            </div>
                          )
                        })}
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="custom" className="mt-6">
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-center space-y-4">
                {customTheme ? (
                  <>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
                      <Palette size={32} weight="duotone" className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Custom Theme Saved</h3>
                      <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                        Your custom theme is ready to use. You can edit it or create a new one.
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Button onClick={() => handleThemeChange('custom')}>
                          Apply Custom Theme
                        </Button>
                        <Button variant="outline" onClick={() => setEditingMode('palette')}>
                          <Pencil size={16} className="mr-2" />
                          Edit Theme
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
                      <Plus size={32} weight="bold" className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Create Your Theme</h3>
                      <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                        Design a unique theme with your own color palette
                      </p>
                      <Button onClick={() => setEditingMode('palette')}>
                        <Plus size={16} weight="bold" className="mr-2" />
                        Create Custom Theme
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="typography" className="mt-6">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TextAa size={24} weight="duotone" className="text-primary" />
                    <h3 className="font-semibold text-lg">Typography Settings</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    Customize the appearance of text throughout the application
                  </p>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="font-family" className="text-base">Font Family</Label>
                      <Select 
                        value={typography?.fontFamily || 'Inter, ui-sans-serif, system-ui, sans-serif'} 
                        onValueChange={(value) => handleTypographyChange('fontFamily', value)}
                      >
                        <SelectTrigger id="font-family">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Sans Serif
                          </div>
                          {fontOptions.filter(f => f.category === 'sans-serif').map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              <span style={{ fontFamily: font.value }}>{font.name}</span>
                            </SelectItem>
                          ))}
                          <Separator className="my-2" />
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Serif
                          </div>
                          {fontOptions.filter(f => f.category === 'serif').map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              <span style={{ fontFamily: font.value }}>{font.name}</span>
                            </SelectItem>
                          ))}
                          <Separator className="my-2" />
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Monospace
                          </div>
                          {fontOptions.filter(f => f.category === 'monospace').map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              <span style={{ fontFamily: font.value }}>{font.name}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Choose the primary font for the interface
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label htmlFor="font-size" className="text-base">Font Size</Label>
                      <RadioGroup 
                        value={typography?.fontSize || 'medium'} 
                        onValueChange={(value) => handleTypographyChange('fontSize', value)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="small" id="size-small" />
                            <Label htmlFor="size-small" className="cursor-pointer flex-1">
                              <div className="flex items-center justify-between">
                                <span>Small</span>
                                <span className="text-xs text-muted-foreground">14px base</span>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="medium" id="size-medium" />
                            <Label htmlFor="size-medium" className="cursor-pointer flex-1">
                              <div className="flex items-center justify-between">
                                <span>Medium</span>
                                <span className="text-xs text-muted-foreground">16px base</span>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="large" id="size-large" />
                            <Label htmlFor="size-large" className="cursor-pointer flex-1">
                              <div className="flex items-center justify-between">
                                <span>Large</span>
                                <span className="text-xs text-muted-foreground">18px base</span>
                              </div>
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                      <p className="text-xs text-muted-foreground">
                        Adjust the overall text size for better readability
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label htmlFor="line-height" className="text-base">Line Height</Label>
                      <RadioGroup 
                        value={typography?.lineHeight || 'normal'} 
                        onValueChange={(value) => handleTypographyChange('lineHeight', value)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="compact" id="height-compact" />
                            <Label htmlFor="height-compact" className="cursor-pointer flex-1">
                              <div className="flex items-center justify-between">
                                <span>Compact</span>
                                <span className="text-xs text-muted-foreground">1.4</span>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="normal" id="height-normal" />
                            <Label htmlFor="height-normal" className="cursor-pointer flex-1">
                              <div className="flex items-center justify-between">
                                <span>Normal</span>
                                <span className="text-xs text-muted-foreground">1.6</span>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="relaxed" id="height-relaxed" />
                            <Label htmlFor="height-relaxed" className="cursor-pointer flex-1">
                              <div className="flex items-center justify-between">
                                <span>Relaxed</span>
                                <span className="text-xs text-muted-foreground">1.8</span>
                              </div>
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                      <p className="text-xs text-muted-foreground">
                        Control the spacing between lines of text
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold mb-3">Preview</h4>
                  <Card className="p-6">
                    <div className="space-y-4" style={{ fontFamily: typography?.fontFamily || 'Inter, ui-sans-serif, system-ui, sans-serif' }}>
                      <h3 className="text-xl font-semibold">Typography Preview</h3>
                      <p className="text-sm text-muted-foreground">
                        The quick brown fox jumps over the lazy dog. This preview shows how your selected typography settings will appear throughout the application.
                      </p>
                      <p className="text-base">
                        Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed.
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm">Primary Button</Button>
                        <Button size="sm" variant="outline">Secondary Button</Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

Content value="accessibility" className="mt-6">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total Color Pairs</span>
                        <span className="font-mono font-semibold">{contrastResults.size}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-green-600 dark:text-green-400">AAA Compliant</span>
                        <span className="font-mono font-semibold">
                          {Array.from(contrastResults.values()).filter(r => r.wcagAAA).length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 dark:text-blue-400">AA Compliant</span>
                        <span className="font-mono font-semibold">
                          {Array.from(contrastResults.values()).filter(r => r.wcagAA).length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-600 dark:text-yellow-400">AA Large Text Only</span>
                        <span className="font-mono font-semibold">
                          {Array.from(contrastResults.values()).filter(r => !r.wcagAA && r.wcagAALarge).length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-red-600 dark:text-red-400">Non-Compliant</span>
                        <span className="font-mono font-semibold">
                          {Array.from(contrastResults.values()).filter(r => !r.wcagAALarge).length}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold mb-3">Accessibility Guidelines</h4>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex gap-2">
                      <span className="font-bold text-green-600 dark:text-green-400 min-w-[60px]">AAA (7:1)</span>
                      <span>Enhanced contrast for users with low vision or color deficiencies</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-blue-600 dark:text-blue-400 min-w-[60px]">AA (4.5:1)</span>
                      <span>Minimum contrast for normal text (most common requirement)</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-yellow-600 dark:text-yellow-400 min-w-[60px]">AA Large</span>
                      <span>Minimum 3:1 for large text (18pt+ or 14pt+ bold)</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-red-600 dark:text-red-400 min-w-[60px]">Fail</span>
                      <span>Does not meet accessibility standards</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between gap-2 pt-4 border-t">
          <div className="flex gap-2">
            <Button
              onClick={handleExportTheme}
              variant="outline"
              size="sm"
            >
              <Export size={16} className="mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('import-theme-settings')?.click()}
            >
              <Download size={16} className="mr-2" />
              Import
            </Button>
            <input
              id="import-theme-settings"
              type="file"
              accept=".json"
              onChange={handleImportTheme}
              className="hidden"
            />
          </div>
          <Button onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
        </Tabs>

        <div className="flex justify-between gap-2 pt-4 border-t">
          <div className="flex gap-2">
            <Button
              onClick={handleExportTheme}
              variant="outline"
              size="sm"
            >
              <Export size={16} className="mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('import-theme-settings')?.click()}
            >
              <Download size={16} className="mr-2" />
              Import
            </Button>
            <input
              id="import-theme-settings"
              type="file"
              accept=".json"
              onChange={handleImportTheme}
              className="hidden"
            />
          </div>
          <Button onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
    </Dialog>
  )
}
