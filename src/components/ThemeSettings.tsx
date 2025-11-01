import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Palette, Check, Plus, Pencil } from '@phosphor-icons/react'
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
import { themes, ThemeOption, ThemeColors, applyTheme, hexToOklch } from '@/lib/themes'

type ThemeSettingsProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ThemeSettings({ open, onOpenChange }: ThemeSettingsProps) {
  const [selectedTheme, setSelectedTheme] = useKV<ThemeOption>('selected-theme', 'dark')
  const [customTheme, setCustomTheme] = useKV<ThemeColors | null>('custom-theme', null)
  const [editingCustom, setEditingCustom] = useState(false)
  const [customColors, setCustomColors] = useState<Record<string, string>>({
    background: '#252525',
    foreground: '#fafafa',
    card: '#353535',
    primary: '#3b82f6',
    accent: '#a855f7',
  })

  const handleThemeChange = (theme: ThemeOption) => {
    if (theme === 'custom' && !customTheme) {
      setEditingCustom(true)
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

  const handleCustomColorChange = (key: string, value: string) => {
    setCustomColors((prev) => ({ ...prev, [key]: value }))
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
    setEditingCustom(false)
    toast.success('Custom theme saved and applied')
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

  if (editingCustom) {
    return (
      <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); setEditingCustom(false) }}>
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
                <h4 className="text-sm font-semibold mb-3">Preview</h4>
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
            <Button variant="outline" onClick={() => setEditingCustom(false)}>
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets">Preset Themes</TabsTrigger>
            <TabsTrigger value="custom">Custom Theme</TabsTrigger>
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
                                      
                                      <div className="flex gap-2">
                                        <div 
                                          className="w-10 h-10 rounded-lg border-2 border-border shadow-sm"
                                          style={{ backgroundColor: theme.colors.background }}
                                          title="Background"
                                        />
                                        <div 
                                          className="w-10 h-10 rounded-lg border-2 border-border shadow-sm"
                                          style={{ backgroundColor: theme.colors.primary }}
                                          title="Primary"
                                        />
                                        <div 
                                          className="w-10 h-10 rounded-lg border-2 border-border shadow-sm"
                                          style={{ backgroundColor: theme.colors.accent }}
                                          title="Accent"
                                        />
                                        <div 
                                          className="w-10 h-10 rounded-lg border-2 border-border shadow-sm"
                                          style={{ backgroundColor: theme.colors.card }}
                                          title="Card"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </Card>
                              </Label>
                            </div>
                          )
                        })}
                      </div>
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
                        <Button variant="outline" onClick={() => setEditingCustom(true)}>
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
                      <Button onClick={() => setEditingCustom(true)}>
                        <Plus size={16} weight="bold" className="mr-2" />
                        Create Custom Theme
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
