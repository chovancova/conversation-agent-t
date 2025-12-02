import { Conversation, TokenConfig, AgentAdvancedConfig } from './types'

export type ExportDataFormat = 'json' | 'encrypted-json'

export type ExportDataPackage = {
  version: string
  exportedAt: number
  exportedBy?: string
  metadata: {
    totalConversations: number
    totalMessages: number
    dateRange: {
      earliest: number
      latest: number
    }
    agentTypes: string[]
  }
  data: {
    conversations?: Conversation[]
    agentEndpoints?: Record<string, string>
    agentNames?: Record<string, string>
    agentAdvancedConfigs?: Record<string, AgentAdvancedConfig>
    tokenConfigs?: TokenConfig[]
    preferences?: {
      theme?: string
      customTheme?: any
      sidebarOpen?: boolean
      soundsEnabled?: boolean
      sessionTimeoutEnabled?: boolean
    }
  }
  checksum?: string
}

export type ImportOptions = {
  includeConversations: boolean
  includeAgentSettings: boolean
  includeTokenConfigs: boolean
  includePreferences: boolean
  mergeStrategy: 'replace' | 'merge' | 'skip-duplicates'
}

export type ImportResult = {
  success: boolean
  imported: {
    conversations: number
    agentSettings: number
    tokenConfigs: number
    preferences: number
  }
  skipped: {
    conversations: number
    agentSettings: number
    tokenConfigs: number
  }
  errors: string[]
  warnings: string[]
}

export type BackupMetadata = {
  id: string
  name: string
  createdAt: number
  size: number
  conversationCount: number
  autoBackup: boolean
}

export async function generateExportPackage(
  includeConversations: boolean = true,
  includeAgentSettings: boolean = true,
  includeTokenConfigs: boolean = false,
  includePreferences: boolean = true
): Promise<ExportDataPackage> {
  const pkg: ExportDataPackage = {
    version: '1.0.0',
    exportedAt: Date.now(),
    metadata: {
      totalConversations: 0,
      totalMessages: 0,
      dateRange: {
        earliest: 0,
        latest: 0
      },
      agentTypes: []
    },
    data: {}
  }

  try {
    const user = await window.spark.user()
    if (user) {
      pkg.exportedBy = user.login
    }
  } catch (e) {
  }

  if (includeConversations) {
    const conversations = await window.spark.kv.get<Conversation[]>('conversations') || []
    pkg.data.conversations = conversations

    const totalMessages = conversations.reduce((sum, c) => sum + c.messages.length, 0)
    const timestamps = conversations.map(c => c.createdAt)
    const agentTypes = [...new Set(conversations.map(c => c.agentType))]

    pkg.metadata.totalConversations = conversations.length
    pkg.metadata.totalMessages = totalMessages
    pkg.metadata.agentTypes = agentTypes

    if (timestamps.length > 0) {
      pkg.metadata.dateRange.earliest = Math.min(...timestamps)
      pkg.metadata.dateRange.latest = Math.max(...timestamps)
    }
  }

  if (includeAgentSettings) {
    const [agentEndpoints, agentNames, agentAdvancedConfigs] = await Promise.all([
      window.spark.kv.get<Record<string, string>>('agent-endpoints'),
      window.spark.kv.get<Record<string, string>>('agent-names'),
      window.spark.kv.get<Record<string, AgentAdvancedConfig>>('agent-advanced-configs')
    ])

    if (agentEndpoints) pkg.data.agentEndpoints = agentEndpoints
    if (agentNames) pkg.data.agentNames = agentNames
    if (agentAdvancedConfigs) pkg.data.agentAdvancedConfigs = agentAdvancedConfigs
  }

  if (includeTokenConfigs) {
    const savedTokens = await window.spark.kv.get<TokenConfig[]>('saved-tokens')
    if (savedTokens) {
      pkg.data.tokenConfigs = savedTokens
    }
  }

  if (includePreferences) {
    const [theme, customTheme, sidebarOpen, soundsEnabled, sessionTimeoutEnabled] = await Promise.all([
      window.spark.kv.get<string>('selected-theme'),
      window.spark.kv.get<any>('custom-theme'),
      window.spark.kv.get<boolean>('sidebar-open'),
      window.spark.kv.get<boolean>('sounds-enabled'),
      window.spark.kv.get<boolean>('session-timeout-enabled')
    ])

    pkg.data.preferences = {
      theme,
      customTheme,
      sidebarOpen,
      soundsEnabled,
      sessionTimeoutEnabled
    }
  }

  pkg.checksum = generateChecksum(JSON.stringify(pkg.data))

  return pkg
}

export function downloadExportPackage(pkg: ExportDataPackage, filename?: string): void {
  const json = JSON.stringify(pkg, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename || `agent-tester-backup-${Date.now()}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export async function importDataPackage(
  pkg: ExportDataPackage,
  options: ImportOptions
): Promise<ImportResult> {
  const result: ImportResult = {
    success: false,
    imported: {
      conversations: 0,
      agentSettings: 0,
      tokenConfigs: 0,
      preferences: 0
    },
    skipped: {
      conversations: 0,
      agentSettings: 0,
      tokenConfigs: 0
    },
    errors: [],
    warnings: []
  }

  try {
    if (!validateDataPackage(pkg)) {
      result.errors.push('Invalid data package format')
      return result
    }

    if (pkg.checksum) {
      const calculatedChecksum = generateChecksum(JSON.stringify(pkg.data))
      if (calculatedChecksum !== pkg.checksum) {
        result.warnings.push('Checksum mismatch - data may have been modified')
      }
    }

    if (options.includeConversations && pkg.data.conversations) {
      const imported = await importConversations(
        pkg.data.conversations,
        options.mergeStrategy
      )
      result.imported.conversations = imported.imported
      result.skipped.conversations = imported.skipped
    }

    if (options.includeAgentSettings) {
      if (pkg.data.agentEndpoints) {
        await importAgentEndpoints(pkg.data.agentEndpoints, options.mergeStrategy)
        result.imported.agentSettings++
      }
      if (pkg.data.agentNames) {
        await importAgentNames(pkg.data.agentNames, options.mergeStrategy)
        result.imported.agentSettings++
      }
      if (pkg.data.agentAdvancedConfigs) {
        await importAgentAdvancedConfigs(pkg.data.agentAdvancedConfigs, options.mergeStrategy)
        result.imported.agentSettings++
      }
    }

    if (options.includeTokenConfigs && pkg.data.tokenConfigs) {
      const imported = await importTokenConfigs(
        pkg.data.tokenConfigs,
        options.mergeStrategy
      )
      result.imported.tokenConfigs = imported.imported
      result.skipped.tokenConfigs = imported.skipped
    }

    if (options.includePreferences && pkg.data.preferences) {
      await importPreferences(pkg.data.preferences)
      result.imported.preferences = 1
    }

    result.success = true
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : 'Unknown error during import')
  }

  return result
}

async function importConversations(
  conversations: Conversation[],
  mergeStrategy: 'replace' | 'merge' | 'skip-duplicates'
): Promise<{ imported: number; skipped: number }> {
  const existing = await window.spark.kv.get<Conversation[]>('conversations') || []
  
  let result: Conversation[] = []
  let imported = 0
  let skipped = 0

  if (mergeStrategy === 'replace') {
    result = conversations
    imported = conversations.length
  } else if (mergeStrategy === 'merge') {
    const existingIds = new Set(existing.map(c => c.id))
    const newConversations = conversations.filter(c => !existingIds.has(c.id))
    result = [...existing, ...newConversations]
    imported = newConversations.length
    skipped = conversations.length - newConversations.length
  } else {
    const existingIds = new Set(existing.map(c => c.id))
    const newConversations = conversations.filter(c => !existingIds.has(c.id))
    result = [...existing, ...newConversations]
    imported = newConversations.length
    skipped = conversations.length - newConversations.length
  }

  await window.spark.kv.set('conversations', result)
  return { imported, skipped }
}

async function importAgentEndpoints(
  endpoints: Record<string, string>,
  mergeStrategy: 'replace' | 'merge' | 'skip-duplicates'
): Promise<void> {
  if (mergeStrategy === 'replace') {
    await window.spark.kv.set('agent-endpoints', endpoints)
  } else {
    const existing = await window.spark.kv.get<Record<string, string>>('agent-endpoints') || {}
    const merged = { ...existing, ...endpoints }
    await window.spark.kv.set('agent-endpoints', merged)
  }
}

async function importAgentNames(
  names: Record<string, string>,
  mergeStrategy: 'replace' | 'merge' | 'skip-duplicates'
): Promise<void> {
  if (mergeStrategy === 'replace') {
    await window.spark.kv.set('agent-names', names)
  } else {
    const existing = await window.spark.kv.get<Record<string, string>>('agent-names') || {}
    const merged = { ...existing, ...names }
    await window.spark.kv.set('agent-names', merged)
  }
}

async function importAgentAdvancedConfigs(
  configs: Record<string, AgentAdvancedConfig>,
  mergeStrategy: 'replace' | 'merge' | 'skip-duplicates'
): Promise<void> {
  if (mergeStrategy === 'replace') {
    await window.spark.kv.set('agent-advanced-configs', configs)
  } else {
    const existing = await window.spark.kv.get<Record<string, AgentAdvancedConfig>>('agent-advanced-configs') || {}
    const merged = { ...existing, ...configs }
    await window.spark.kv.set('agent-advanced-configs', merged)
  }
}

async function importTokenConfigs(
  tokens: TokenConfig[],
  mergeStrategy: 'replace' | 'merge' | 'skip-duplicates'
): Promise<{ imported: number; skipped: number }> {
  const existing = await window.spark.kv.get<TokenConfig[]>('saved-tokens') || []
  
  let result: TokenConfig[] = []
  let imported = 0
  let skipped = 0

  if (mergeStrategy === 'replace') {
    result = tokens
    imported = tokens.length
  } else if (mergeStrategy === 'merge') {
    const existingIds = new Set(existing.map(t => t.id))
    const newTokens = tokens.filter(t => !existingIds.has(t.id))
    result = [...existing, ...newTokens]
    imported = newTokens.length
    skipped = tokens.length - newTokens.length
  } else {
    const existingIds = new Set(existing.map(t => t.id))
    const newTokens = tokens.filter(t => !existingIds.has(t.id))
    result = [...existing, ...newTokens]
    imported = newTokens.length
    skipped = tokens.length - newTokens.length
  }

  await window.spark.kv.set('saved-tokens', result)
  return { imported, skipped }
}

async function importPreferences(preferences: any): Promise<void> {
  if (preferences.theme !== undefined) {
    await window.spark.kv.set('selected-theme', preferences.theme)
  }
  if (preferences.customTheme !== undefined) {
    await window.spark.kv.set('custom-theme', preferences.customTheme)
  }
  if (preferences.sidebarOpen !== undefined) {
    await window.spark.kv.set('sidebar-open', preferences.sidebarOpen)
  }
  if (preferences.soundsEnabled !== undefined) {
    await window.spark.kv.set('sounds-enabled', preferences.soundsEnabled)
  }
  if (preferences.sessionTimeoutEnabled !== undefined) {
    await window.spark.kv.set('session-timeout-enabled', preferences.sessionTimeoutEnabled)
  }
}

function validateDataPackage(pkg: any): boolean {
  if (!pkg || typeof pkg !== 'object') return false
  if (!pkg.version || !pkg.exportedAt || !pkg.metadata || !pkg.data) return false
  return true
}

function generateChecksum(data: string): string {
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

export async function createAutoBackup(): Promise<void> {
  const pkg = await generateExportPackage(true, true, false, true)
  
  const backups = await window.spark.kv.get<BackupMetadata[]>('auto-backups') || []
  
  const backup: BackupMetadata = {
    id: Date.now().toString(),
    name: `Auto Backup ${new Date().toLocaleString()}`,
    createdAt: Date.now(),
    size: JSON.stringify(pkg).length,
    conversationCount: pkg.metadata.totalConversations,
    autoBackup: true
  }

  await window.spark.kv.set(`backup-${backup.id}`, pkg)
  
  backups.push(backup)
  
  const MAX_AUTO_BACKUPS = 10
  if (backups.length > MAX_AUTO_BACKUPS) {
    const oldestBackups = backups
      .filter(b => b.autoBackup)
      .sort((a, b) => a.createdAt - b.createdAt)
    
    for (let i = 0; i < backups.length - MAX_AUTO_BACKUPS; i++) {
      await window.spark.kv.delete(`backup-${oldestBackups[i].id}`)
    }
    
    const keepBackups = backups.slice(-(MAX_AUTO_BACKUPS))
    await window.spark.kv.set('auto-backups', keepBackups)
  } else {
    await window.spark.kv.set('auto-backups', backups)
  }
}

export async function getBackupsList(): Promise<BackupMetadata[]> {
  return await window.spark.kv.get<BackupMetadata[]>('auto-backups') || []
}

export async function loadBackup(backupId: string): Promise<ExportDataPackage | null> {
  const backup = await window.spark.kv.get<ExportDataPackage>(`backup-${backupId}`)
  return backup || null
}

export async function deleteBackup(backupId: string): Promise<void> {
  await window.spark.kv.delete(`backup-${backupId}`)
  
  const backups = await window.spark.kv.get<BackupMetadata[]>('auto-backups') || []
  const filtered = backups.filter(b => b.id !== backupId)
  await window.spark.kv.set('auto-backups', filtered)
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export async function exportSelectedConversations(conversationIds: string[]): Promise<ExportDataPackage> {
  const allConversations = await window.spark.kv.get<Conversation[]>('conversations') || []
  const selectedConversations = allConversations.filter(c => conversationIds.includes(c.id))
  
  const pkg: ExportDataPackage = {
    version: '1.0.0',
    exportedAt: Date.now(),
    metadata: {
      totalConversations: selectedConversations.length,
      totalMessages: selectedConversations.reduce((sum, c) => sum + c.messages.length, 0),
      dateRange: {
        earliest: Math.min(...selectedConversations.map(c => c.createdAt)),
        latest: Math.max(...selectedConversations.map(c => c.createdAt))
      },
      agentTypes: [...new Set(selectedConversations.map(c => c.agentType))]
    },
    data: {
      conversations: selectedConversations
    }
  }

  try {
    const user = await window.spark.user()
    if (user) {
      pkg.exportedBy = user.login
    }
  } catch (e) {
  }

  pkg.checksum = generateChecksum(JSON.stringify(pkg.data))

  return pkg
}

export async function clearAllData(includeTokens: boolean = false): Promise<void> {
  const keysToDelete = [
    'conversations',
    'activeConversationId',
    'splitConversationId',
    'split-mode',
    'agent-endpoints',
    'agent-names',
    'agent-advanced-configs',
    'setup-complete',
    'wizard-dismissed',
    'search-query',
    'selected-agent-filters'
  ]

  if (includeTokens) {
    keysToDelete.push('saved-tokens', 'selected-token-id', 'access-token', 'decrypted-credentials-cache')
  }

  await Promise.all(keysToDelete.map(key => window.spark.kv.delete(key)))
}

export type BatchImportResult = {
  success: boolean
  filesProcessed: number
  filesSkipped: number
  totalImported: {
    conversations: number
    agentSettings: number
    tokenConfigs: number
    preferences: number
  }
  totalSkipped: {
    conversations: number
    agentSettings: number
    tokenConfigs: number
  }
  fileResults: Array<{
    filename: string
    success: boolean
    imported: ImportResult['imported']
    skipped: ImportResult['skipped']
    errors: string[]
    warnings: string[]
  }>
  errors: string[]
  warnings: string[]
}

export async function importMultiplePackages(
  files: File[],
  options: ImportOptions
): Promise<BatchImportResult> {
  const result: BatchImportResult = {
    success: false,
    filesProcessed: 0,
    filesSkipped: 0,
    totalImported: {
      conversations: 0,
      agentSettings: 0,
      tokenConfigs: 0,
      preferences: 0
    },
    totalSkipped: {
      conversations: 0,
      agentSettings: 0,
      tokenConfigs: 0
    },
    fileResults: [],
    errors: [],
    warnings: []
  }

  for (const file of files) {
    try {
      const text = await file.text()
      const pkg = JSON.parse(text) as ExportDataPackage

      if (!validateDataPackage(pkg)) {
        result.fileResults.push({
          filename: file.name,
          success: false,
          imported: { conversations: 0, agentSettings: 0, tokenConfigs: 0, preferences: 0 },
          skipped: { conversations: 0, agentSettings: 0, tokenConfigs: 0 },
          errors: ['Invalid data package format'],
          warnings: []
        })
        result.filesSkipped++
        continue
      }

      const importResult = await importDataPackage(pkg, options)

      result.fileResults.push({
        filename: file.name,
        success: importResult.success,
        imported: importResult.imported,
        skipped: importResult.skipped,
        errors: importResult.errors,
        warnings: importResult.warnings
      })

      result.totalImported.conversations += importResult.imported.conversations
      result.totalImported.agentSettings += importResult.imported.agentSettings
      result.totalImported.tokenConfigs += importResult.imported.tokenConfigs
      result.totalImported.preferences += importResult.imported.preferences

      result.totalSkipped.conversations += importResult.skipped.conversations
      result.totalSkipped.agentSettings += importResult.skipped.agentSettings
      result.totalSkipped.tokenConfigs += importResult.skipped.tokenConfigs

      if (importResult.success) {
        result.filesProcessed++
      } else {
        result.filesSkipped++
      }

      if (importResult.errors.length > 0) {
        result.errors.push(...importResult.errors.map(e => `${file.name}: ${e}`))
      }
      if (importResult.warnings.length > 0) {
        result.warnings.push(...importResult.warnings.map(w => `${file.name}: ${w}`))
      }

    } catch (error) {
      result.fileResults.push({
        filename: file.name,
        success: false,
        imported: { conversations: 0, agentSettings: 0, tokenConfigs: 0, preferences: 0 },
        skipped: { conversations: 0, agentSettings: 0, tokenConfigs: 0 },
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        warnings: []
      })
      result.filesSkipped++
      result.errors.push(`${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  result.success = result.filesProcessed > 0 && result.errors.length === 0

  return result
}

export async function exportMultipleConversationGroups(groups: Array<{
  name: string
  conversationIds: string[]
}>): Promise<void> {
  for (const group of groups) {
    const pkg = await exportSelectedConversations(group.conversationIds)
    const filename = `${group.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}.json`
    downloadExportPackage(pkg, filename)
    await new Promise(resolve => setTimeout(resolve, 100))
  }
}
