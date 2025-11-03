import { useState, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Download, Upload, Database, Check, X as XIcon, FileArrowDown, FileArrowUp, Trash, Clock, HardDrives, WarningCircle, CheckCircle, Info } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  generateExportPackage, 
  downloadExportPackage, 
  importDataPackage, 
  createAutoBackup,
  getBackupsList,
  loadBackup,
  deleteBackup,
  formatFileSize,
  exportSelectedConversations,
  type ImportOptions,
  type ImportResult,
  type BackupMetadata,
  type ExportDataPackage
} from '@/lib/dataManager'
import { Conversation } from '@/lib/types'

type DataManagerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DataManager({ open, onOpenChange }: DataManagerProps) {
  const [conversations] = useKV<Conversation[]>('conversations', [])
  const [activeTab, setActiveTab] = useState('export')
  
  const [exportIncludeConversations, setExportIncludeConversations] = useState(true)
  const [exportIncludeAgentSettings, setExportIncludeAgentSettings] = useState(true)
  const [exportIncludeTokenConfigs, setExportIncludeTokenConfigs] = useState(false)
  const [exportIncludePreferences, setExportIncludePreferences] = useState(true)
  const [exportSelectedIds, setExportSelectedIds] = useState<string[]>([])
  const [exportMode, setExportMode] = useState<'all' | 'selected'>('all')
  
  const [importIncludeConversations, setImportIncludeConversations] = useState(true)
  const [importIncludeAgentSettings, setImportIncludeAgentSettings] = useState(true)
  const [importIncludeTokenConfigs, setImportIncludeTokenConfigs] = useState(false)
  const [importIncludePreferences, setImportIncludePreferences] = useState(true)
  const [importMergeStrategy, setImportMergeStrategy] = useState<'replace' | 'merge' | 'skip-duplicates'>('merge')
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importPreview, setImportPreview] = useState<ExportDataPackage | null>(null)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  
  const [backups, setBackups] = useState<BackupMetadata[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadBackups = async () => {
    const backupsList = await getBackupsList()
    setBackups(backupsList)
  }

  const handleExport = async () => {
    setIsLoading(true)
    try {
      let pkg: ExportDataPackage
      
      if (exportMode === 'selected' && exportSelectedIds.length > 0) {
        pkg = await exportSelectedConversations(exportSelectedIds)
      } else {
        pkg = await generateExportPackage(
          exportIncludeConversations,
          exportIncludeAgentSettings,
          exportIncludeTokenConfigs,
          exportIncludePreferences
        )
      }
      
      downloadExportPackage(pkg)
      toast.success('Data exported successfully')
    } catch (error) {
      toast.error('Export failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImportFile(file)
    
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        setImportPreview(data)
        setImportResult(null)
      } catch (error) {
        toast.error('Invalid JSON file')
        setImportFile(null)
        setImportPreview(null)
      }
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    if (!importPreview) {
      toast.error('No file selected')
      return
    }

    setIsLoading(true)
    try {
      const options: ImportOptions = {
        includeConversations: importIncludeConversations,
        includeAgentSettings: importIncludeAgentSettings,
        includeTokenConfigs: importIncludeTokenConfigs,
        includePreferences: importIncludePreferences,
        mergeStrategy: importMergeStrategy
      }

      const result = await importDataPackage(importPreview, options)
      setImportResult(result)
      
      if (result.success) {
        toast.success('Data imported successfully')
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        toast.error('Import completed with errors')
      }
    } catch (error) {
      toast.error('Import failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateBackup = async () => {
    setIsLoading(true)
    try {
      await createAutoBackup()
      await loadBackups()
      toast.success('Backup created successfully')
    } catch (error) {
      toast.error('Backup failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestoreBackup = async (backupId: string) => {
    setIsLoading(true)
    try {
      const backup = await loadBackup(backupId)
      if (!backup) {
        toast.error('Backup not found')
        return
      }

      const options: ImportOptions = {
        includeConversations: true,
        includeAgentSettings: true,
        includeTokenConfigs: false,
        includePreferences: true,
        mergeStrategy: 'replace'
      }

      const result = await importDataPackage(backup, options)
      
      if (result.success) {
        toast.success('Backup restored successfully')
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        toast.error('Restore completed with errors')
      }
    } catch (error) {
      toast.error('Restore failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteBackup = async (backupId: string) => {
    try {
      await deleteBackup(backupId)
      await loadBackups()
      toast.success('Backup deleted')
    } catch (error) {
      toast.error('Delete failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleDownloadBackup = async (backupId: string) => {
    try {
      const backup = await loadBackup(backupId)
      if (!backup) {
        toast.error('Backup not found')
        return
      }
      downloadExportPackage(backup, `backup-${backupId}.json`)
      toast.success('Backup downloaded')
    } catch (error) {
      toast.error('Download failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const toggleSelectConversation = (id: string) => {
    setExportSelectedIds(current => 
      current.includes(id) 
        ? current.filter(cid => cid !== id)
        : [...current, id]
    )
  }

  const selectAllConversations = () => {
    setExportSelectedIds(conversations?.map(c => c.id) || [])
  }

  const deselectAllConversations = () => {
    setExportSelectedIds([])
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database size={24} weight="duotone" className="text-primary" />
              Data Management
            </DialogTitle>
            <DialogDescription>
              Export, import, and backup your conversations and settings
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="export" className="gap-2">
                <FileArrowDown size={16} weight="bold" />
                Export
              </TabsTrigger>
              <TabsTrigger value="import" className="gap-2">
                <FileArrowUp size={16} weight="bold" />
                Import
              </TabsTrigger>
              <TabsTrigger value="backups" className="gap-2" onClick={loadBackups}>
                <HardDrives size={16} weight="bold" />
                Backups
              </TabsTrigger>
            </TabsList>

            <TabsContent value="export" className="space-y-4 mt-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Export Mode</h3>
                    <RadioGroup value={exportMode} onValueChange={(value) => setExportMode(value as 'all' | 'selected')}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="export-all" />
                        <Label htmlFor="export-all">Export all data</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="selected" id="export-selected" />
                        <Label htmlFor="export-selected">Export selected conversations</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {exportMode === 'selected' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm">Select Conversations ({exportSelectedIds.length})</h3>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={selectAllConversations}>
                            Select All
                          </Button>
                          <Button size="sm" variant="outline" onClick={deselectAllConversations}>
                            Deselect All
                          </Button>
                        </div>
                      </div>
                      <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
                        {(conversations || []).map((conv) => (
                          <div key={conv.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`conv-${conv.id}`}
                              checked={exportSelectedIds.includes(conv.id)}
                              onCheckedChange={() => toggleSelectConversation(conv.id)}
                            />
                            <Label htmlFor={`conv-${conv.id}`} className="text-sm flex-1 cursor-pointer">
                              {conv.title}
                              <span className="text-muted-foreground ml-2">
                                ({conv.messages.length} messages)
                              </span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {exportMode === 'all' && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-sm">Include in Export</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="export-conversations"
                            checked={exportIncludeConversations}
                            onCheckedChange={(checked) => setExportIncludeConversations(!!checked)}
                          />
                          <Label htmlFor="export-conversations">Conversations & Messages</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="export-agent-settings"
                            checked={exportIncludeAgentSettings}
                            onCheckedChange={(checked) => setExportIncludeAgentSettings(!!checked)}
                          />
                          <Label htmlFor="export-agent-settings">Agent Settings & Endpoints</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="export-token-configs"
                            checked={exportIncludeTokenConfigs}
                            onCheckedChange={(checked) => setExportIncludeTokenConfigs(!!checked)}
                          />
                          <Label htmlFor="export-token-configs">Token Configurations</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="export-preferences"
                            checked={exportIncludePreferences}
                            onCheckedChange={(checked) => setExportIncludePreferences(!!checked)}
                          />
                          <Label htmlFor="export-preferences">User Preferences</Label>
                        </div>
                      </div>
                    </div>
                  )}

                  <Alert>
                    <Info size={16} className="text-primary" />
                    <AlertDescription className="text-sm">
                      {exportIncludeTokenConfigs 
                        ? 'Warning: Token configurations may contain sensitive credentials. Store the export file securely.'
                        : 'Export will not include sensitive token configurations.'}
                    </AlertDescription>
                  </Alert>
                </div>
              </ScrollArea>

              <Separator />

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleExport} disabled={isLoading || (exportMode === 'selected' && exportSelectedIds.length === 0)}>
                  <Download size={16} className="mr-2" weight="bold" />
                  Export Data
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="import" className="space-y-4 mt-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Select Import File</h3>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload size={16} className="mr-2" weight="bold" />
                      {importFile ? importFile.name : 'Choose File'}
                    </Button>
                  </div>

                  {importPreview && (
                    <>
                      <div className="border rounded-lg p-4 space-y-2 bg-muted/30">
                        <h3 className="font-semibold text-sm">Import Preview</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Version:</span>
                            <span className="ml-2 font-medium">{importPreview.version}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Exported:</span>
                            <span className="ml-2 font-medium">
                              {new Date(importPreview.exportedAt).toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Conversations:</span>
                            <span className="ml-2 font-medium">{importPreview.metadata.totalConversations}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Messages:</span>
                            <span className="ml-2 font-medium">{importPreview.metadata.totalMessages}</span>
                          </div>
                        </div>
                        {importPreview.exportedBy && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Exported by:</span>
                            <span className="ml-2 font-medium">{importPreview.exportedBy}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-semibold text-sm">Import Options</h3>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="import-conversations"
                              checked={importIncludeConversations}
                              onCheckedChange={(checked) => setImportIncludeConversations(!!checked)}
                            />
                            <Label htmlFor="import-conversations">Import Conversations</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="import-agent-settings"
                              checked={importIncludeAgentSettings}
                              onCheckedChange={(checked) => setImportIncludeAgentSettings(!!checked)}
                            />
                            <Label htmlFor="import-agent-settings">Import Agent Settings</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="import-token-configs"
                              checked={importIncludeTokenConfigs}
                              onCheckedChange={(checked) => setImportIncludeTokenConfigs(!!checked)}
                            />
                            <Label htmlFor="import-token-configs">Import Token Configurations</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="import-preferences"
                              checked={importIncludePreferences}
                              onCheckedChange={(checked) => setImportIncludePreferences(!!checked)}
                            />
                            <Label htmlFor="import-preferences">Import Preferences</Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-semibold text-sm">Merge Strategy</h3>
                        <RadioGroup value={importMergeStrategy} onValueChange={(value) => setImportMergeStrategy(value as any)}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="merge" id="merge" />
                            <Label htmlFor="merge">Merge with existing data</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="skip-duplicates" id="skip-duplicates" />
                            <Label htmlFor="skip-duplicates">Skip duplicates</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="replace" id="replace" />
                            <Label htmlFor="replace">Replace all existing data</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {importResult && (
                        <div className="border rounded-lg p-4 space-y-2">
                          <div className="flex items-center gap-2">
                            {importResult.success ? (
                              <>
                                <CheckCircle size={20} weight="fill" className="text-green-500" />
                                <h3 className="font-semibold text-sm">Import Successful</h3>
                              </>
                            ) : (
                              <>
                                <WarningCircle size={20} weight="fill" className="text-destructive" />
                                <h3 className="font-semibold text-sm">Import Completed with Errors</h3>
                              </>
                            )}
                          </div>
                          <div className="text-sm space-y-1">
                            <div>Conversations imported: {importResult.imported.conversations}</div>
                            <div>Agent settings imported: {importResult.imported.agentSettings}</div>
                            <div>Token configs imported: {importResult.imported.tokenConfigs}</div>
                            {importResult.skipped.conversations > 0 && (
                              <div className="text-muted-foreground">
                                Conversations skipped: {importResult.skipped.conversations}
                              </div>
                            )}
                            {importResult.errors.length > 0 && (
                              <div className="text-destructive">
                                Errors: {importResult.errors.join(', ')}
                              </div>
                            )}
                            {importResult.warnings.length > 0 && (
                              <div className="text-yellow-500">
                                Warnings: {importResult.warnings.join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </ScrollArea>

              <Separator />

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleImport} disabled={isLoading || !importPreview}>
                  <Upload size={16} className="mr-2" weight="bold" />
                  Import Data
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="backups" className="space-y-4 mt-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Available Backups</h3>
                    <Button size="sm" onClick={handleCreateBackup} disabled={isLoading}>
                      <Clock size={16} className="mr-2" weight="bold" />
                      Create Backup
                    </Button>
                  </div>

                  {backups.length === 0 ? (
                    <div className="border rounded-lg p-8 text-center text-muted-foreground">
                      <HardDrives size={48} className="mx-auto mb-2 opacity-50" />
                      <p>No backups available</p>
                      <p className="text-sm mt-1">Create your first backup to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {backups.map((backup) => (
                        <div key={backup.id} className="border rounded-lg p-4 space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-sm">{backup.name}</h4>
                                {backup.autoBackup && (
                                  <Badge variant="secondary" className="text-xs">Auto</Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {new Date(backup.createdAt).toLocaleString()}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownloadBackup(backup.id)}
                                title="Download backup"
                              >
                                <Download size={14} weight="bold" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRestoreBackup(backup.id)}
                                disabled={isLoading}
                                title="Restore backup"
                              >
                                <Upload size={14} weight="bold" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteBackup(backup.id)}
                                title="Delete backup"
                              >
                                <Trash size={14} weight="bold" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>{backup.conversationCount} conversations</span>
                            <span>{formatFileSize(backup.size)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Alert>
                    <Info size={16} className="text-primary" />
                    <AlertDescription className="text-sm">
                      Backups are stored locally. Only the 10 most recent auto-backups are kept.
                    </AlertDescription>
                  </Alert>
                </div>
              </ScrollArea>

              <Separator />

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}
