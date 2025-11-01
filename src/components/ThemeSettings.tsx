import { useKV } from '@github/spark/hooks'
import { Palette, Check } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card } from '@/components/ui/card'
import { themes, ThemeOption, applyTheme } from '@/lib/themes'

type ThemeSettingsProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ThemeSettings({ open, onOpenChange }: ThemeSettingsProps) {
  const [selectedTheme, setSelectedTheme] = useKV<ThemeOption>('selected-theme', 'dark')

  const handleThemeChange = (theme: ThemeOption) => {
    setSelectedTheme(theme)
    applyTheme(theme)
    toast.success(`${themes[theme].name} theme applied`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette size={24} weight="duotone" />
            Theme Settings
          </DialogTitle>
          <DialogDescription>
            Choose your preferred visual theme
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <RadioGroup value={selectedTheme} onValueChange={handleThemeChange}>
            <div className="grid gap-4">
              {(Object.keys(themes) as ThemeOption[]).map((themeKey) => {
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
                              <h3 className="font-semibold text-lg">{theme.name}</h3>
                              {isSelected && (
                                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary">
                                  <Check size={14} weight="bold" className="text-primary-foreground" />
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              {theme.description}
                            </p>
                            
                            <div className="flex gap-2">
                              <div 
                                className="w-12 h-12 rounded-lg border-2 border-border shadow-sm"
                                style={{ backgroundColor: theme.colors.background }}
                                title="Background"
                              />
                              <div 
                                className="w-12 h-12 rounded-lg border-2 border-border shadow-sm"
                                style={{ backgroundColor: theme.colors.primary }}
                                title="Primary"
                              />
                              <div 
                                className="w-12 h-12 rounded-lg border-2 border-border shadow-sm"
                                style={{ backgroundColor: theme.colors.accent }}
                                title="Accent"
                              />
                              <div 
                                className="w-12 h-12 rounded-lg border-2 border-border shadow-sm"
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
          </RadioGroup>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
