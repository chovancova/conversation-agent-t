import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bell, Clock, CheckCircle, XCircle, Info } from '@phosphor-icons/react'
import { NotificationPreferences } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type NotificationSettingsProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const defaultPreferences: NotificationPreferences = {
  tokenRefresh: true,
  tokenExpiring: true,
  tokenExpired: true,
  tokenGenerated: true,
  showResponseTime: true,
  showSuccessRate: true,
}

export function NotificationSettings({ open, onOpenChange }: NotificationSettingsProps) {
  const [preferences, setPreferences] = useKV<NotificationPreferences>(
    'notification-preferences',
    defaultPreferences
  )

  const updatePreference = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences((current = defaultPreferences) => ({
      ...current,
      [key]: value
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Bell size={28} weight="duotone" className="text-primary" />
            Notification Preferences
          </DialogTitle>
          <DialogDescription>
            Customize which notifications you want to receive
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <ScrollArea className="px-6 py-4 max-h-[calc(85vh-120px)]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock size={20} weight="duotone" className="text-primary" />
                  Token Events
                </CardTitle>
                <CardDescription>
                  Notifications about token lifecycle events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex-1">
                    <Label htmlFor="token-generated" className="text-sm font-medium">
                      Token Generated
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Show notification when a new access token is generated
                    </p>
                  </div>
                  <Switch
                    id="token-generated"
                    checked={preferences?.tokenGenerated ?? true}
                    onCheckedChange={(checked) => updatePreference('tokenGenerated', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex-1">
                    <Label htmlFor="token-refresh" className="text-sm font-medium">
                      Token Refreshed
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Show notification when token is automatically refreshed
                    </p>
                  </div>
                  <Switch
                    id="token-refresh"
                    checked={preferences?.tokenRefresh ?? true}
                    onCheckedChange={(checked) => updatePreference('tokenRefresh', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex-1">
                    <Label htmlFor="token-expiring" className="text-sm font-medium">
                      Token Expiring Soon
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Show warning when token is about to expire (2 minutes before)
                    </p>
                  </div>
                  <Switch
                    id="token-expiring"
                    checked={preferences?.tokenExpiring ?? true}
                    onCheckedChange={(checked) => updatePreference('tokenExpiring', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex-1">
                    <Label htmlFor="token-expired" className="text-sm font-medium">
                      Token Expired
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Show notification when token has expired
                    </p>
                  </div>
                  <Switch
                    id="token-expired"
                    checked={preferences?.tokenExpired ?? true}
                    onCheckedChange={(checked) => updatePreference('tokenExpired', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info size={20} weight="duotone" className="text-accent" />
                  Analytics Display
                </CardTitle>
                <CardDescription>
                  Control what analytics information is shown in the UI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex-1">
                    <Label htmlFor="show-response-time" className="text-sm font-medium">
                      Show Response Time
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Display response time for each agent message
                    </p>
                  </div>
                  <Switch
                    id="show-response-time"
                    checked={preferences?.showResponseTime ?? true}
                    onCheckedChange={(checked) => updatePreference('showResponseTime', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex-1">
                    <Label htmlFor="show-success-rate" className="text-sm font-medium">
                      Show Success Rate
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Display success rate badges in conversation list
                    </p>
                  </div>
                  <Switch
                    id="show-success-rate"
                    checked={preferences?.showSuccessRate ?? true}
                    onCheckedChange={(checked) => updatePreference('showSuccessRate', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex gap-3 text-sm">
                  <Info size={20} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">About Notifications</p>
                    <p className="text-muted-foreground">
                      These preferences control in-app toast notifications and UI elements. 
                      All settings are stored locally in your browser and are not shared with any server.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
