import { useKV } from '@github/spark/hooks'
import { SpeakerHigh, SpeakerSlash, Play } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { SoundPreferences, NotificationSound, DEFAULT_SOUND_PREFERENCES, playNotificationSound } from '@/lib/sound'
import { toast } from 'sonner'

type SoundSettingsProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SoundSettings({ open, onOpenChange }: SoundSettingsProps) {
  const [soundPreferences, setSoundPreferences] = useKV<SoundPreferences>('sound-preferences', DEFAULT_SOUND_PREFERENCES)

  const prefs = soundPreferences || DEFAULT_SOUND_PREFERENCES

  const handleToggle = (enabled: boolean) => {
    setSoundPreferences((current = DEFAULT_SOUND_PREFERENCES) => ({
      ...current,
      enabled
    }))
    toast.success(enabled ? 'Sound notifications enabled' : 'Sound notifications disabled')
  }

  const handleSoundChange = (sound: NotificationSound) => {
    setSoundPreferences((current = DEFAULT_SOUND_PREFERENCES) => ({
      ...current,
      sound
    }))
  }

  const handleVolumeChange = (value: number[]) => {
    setSoundPreferences((current = DEFAULT_SOUND_PREFERENCES) => ({
      ...current,
      volume: value[0]
    }))
  }

  const handleIntervalToggle = (interval: keyof SoundPreferences['warningIntervals'], enabled: boolean) => {
    setSoundPreferences((current = DEFAULT_SOUND_PREFERENCES) => ({
      ...current,
      warningIntervals: {
        ...current.warningIntervals,
        [interval]: enabled
      }
    }))
  }

  const handleTestSound = () => {
    playNotificationSound(prefs.sound, prefs.volume)
    toast.info('Playing test sound')
  }

  const handleResetDefaults = () => {
    setSoundPreferences(DEFAULT_SOUND_PREFERENCES)
    toast.success('Sound settings reset to defaults')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {prefs.enabled ? (
              <div className="p-2.5 rounded-xl bg-accent/20">
                <SpeakerHigh size={24} weight="duotone" className="text-accent" />
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-muted">
                <SpeakerSlash size={24} weight="duotone" className="text-muted-foreground" />
              </div>
            )}
            <div>
              <DialogTitle>Sound Notifications</DialogTitle>
              <DialogDescription>
                Configure audio alerts for token expiry warnings
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Enable Sounds</Label>
              <p className="text-xs text-muted-foreground">
                Play audio notifications for token warnings
              </p>
            </div>
            <Switch
              checked={prefs.enabled}
              onCheckedChange={handleToggle}
            />
          </div>

          {prefs.enabled && (
            <>
              <Separator />

              <div className="space-y-3">
                <Label className="text-sm font-medium">Notification Sound</Label>
                <Select value={prefs.sound} onValueChange={handleSoundChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Silent)</SelectItem>
                    <SelectItem value="beep">Beep</SelectItem>
                    <SelectItem value="chime">Chime (Default)</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                    <SelectItem value="gentle">Gentle</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestSound}
                  disabled={prefs.sound === 'none'}
                  className="w-full"
                >
                  <Play size={16} weight="fill" className="mr-2" />
                  Test Sound
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Volume</Label>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {Math.round(prefs.volume * 100)}%
                  </span>
                </div>
                <Slider
                  value={[prefs.volume]}
                  onValueChange={handleVolumeChange}
                  min={0}
                  max={1}
                  step={0.05}
                  className="w-full"
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-sm font-medium">Warning Intervals</Label>
                <p className="text-xs text-muted-foreground mb-3">
                  Choose when to play notification sounds
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                    <div>
                      <p className="text-sm font-medium">5 Minutes</p>
                      <p className="text-xs text-muted-foreground">Alert when 5 minutes remaining</p>
                    </div>
                    <Switch
                      checked={prefs.warningIntervals.fiveMinutes}
                      onCheckedChange={(checked) => handleIntervalToggle('fiveMinutes', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                    <div>
                      <p className="text-sm font-medium">2 Minutes</p>
                      <p className="text-xs text-muted-foreground">Alert when 2 minutes remaining</p>
                    </div>
                    <Switch
                      checked={prefs.warningIntervals.twoMinutes}
                      onCheckedChange={(checked) => handleIntervalToggle('twoMinutes', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                    <div>
                      <p className="text-sm font-medium">1 Minute</p>
                      <p className="text-xs text-muted-foreground">Alert when 1 minute remaining</p>
                    </div>
                    <Switch
                      checked={prefs.warningIntervals.oneMinute}
                      onCheckedChange={(checked) => handleIntervalToggle('oneMinute', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                    <div>
                      <p className="text-sm font-medium">30 Seconds</p>
                      <p className="text-xs text-muted-foreground">Alert when 30 seconds remaining</p>
                    </div>
                    <Switch
                      checked={prefs.warningIntervals.thirtySeconds}
                      onCheckedChange={(checked) => handleIntervalToggle('thirtySeconds', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <Button
                variant="outline"
                size="sm"
                onClick={handleResetDefaults}
                className="w-full"
              >
                Reset to Defaults
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
