export function isSecureContext(): boolean {
  return window.isSecureContext
}

export function validateHTTPS(url: string): { valid: boolean; message?: string } {
  try {
    const parsed = new URL(url)
    
    if (parsed.protocol !== 'https:') {
      return {
        valid: false,
        message: 'URL must use HTTPS for secure communication'
      }
    }
    
    return { valid: true }
  } catch {
    return {
      valid: false,
      message: 'Invalid URL format'
    }
  }
}

export function validateEndpointSecurity(url: string): { valid: boolean; warnings: string[]; errors: string[] } {
  const warnings: string[] = []
  const errors: string[] = []
  
  try {
    const parsed = new URL(url)
    
    if (parsed.protocol !== 'https:') {
      errors.push('Endpoint must use HTTPS protocol')
    }
    
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
      warnings.push('Using localhost - ensure this is intentional for local testing')
    }
    
    if (parsed.port && parsed.port !== '443') {
      warnings.push(`Using non-standard port ${parsed.port}`)
    }
    
    return {
      valid: errors.length === 0,
      warnings,
      errors
    }
  } catch {
    return {
      valid: false,
      warnings: [],
      errors: ['Invalid URL format']
    }
  }
}

export function sanitizeForDisplay(value: string, visibleChars = 4): string {
  if (value.length <= visibleChars) {
    return '•'.repeat(value.length)
  }
  
  return value.substring(0, visibleChars) + '•'.repeat(Math.min(value.length - visibleChars, 8))
}

export async function secureWipeString(value: string): Promise<void> {
  if (typeof value !== 'string') return
  
  try {
    const array = new TextEncoder().encode(value)
    crypto.getRandomValues(array)
    array.fill(0)
  } catch {
  }
}

export function checkPasswordStrength(password: string): {
  strength: 'weak' | 'medium' | 'strong'
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0
  
  if (password.length >= 12) {
    score += 2
  } else if (password.length >= 8) {
    score += 1
    feedback.push('Use at least 12 characters for better security')
  } else {
    feedback.push('Password is too short (minimum 8 characters)')
  }
  
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^a-zA-Z0-9]/.test(password)) score += 1
  
  if (!/[a-z]/.test(password)) feedback.push('Add lowercase letters')
  if (!/[A-Z]/.test(password)) feedback.push('Add uppercase letters')
  if (!/[0-9]/.test(password)) feedback.push('Add numbers')
  if (!/[^a-zA-Z0-9]/.test(password)) feedback.push('Add special characters')
  
  const commonPatterns = ['password', '123456', 'qwerty', 'admin', 'letmein', 'welcome']
  if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
    score = Math.max(0, score - 2)
    feedback.push('Avoid common words and patterns')
  }
  
  let strength: 'weak' | 'medium' | 'strong'
  if (score <= 2) {
    strength = 'weak'
  } else if (score <= 4) {
    strength = 'medium'
  } else {
    strength = 'strong'
  }
  
  return { strength, score, feedback }
}

export class SessionTimeout {
  private timeoutId: number | null = null
  private warningTimeoutId: number | null = null
  private lastActivityTime: number = Date.now()
  private readonly timeoutDuration: number
  private readonly warningDuration: number
  
  constructor(
    timeoutMinutes: number = 30,
    warningMinutes: number = 5,
    private onTimeout: () => void,
    private onWarning: (minutesRemaining: number) => void
  ) {
    this.timeoutDuration = timeoutMinutes * 60 * 1000
    this.warningDuration = warningMinutes * 60 * 1000
    this.resetTimer()
    this.setupActivityListeners()
  }
  
  private setupActivityListeners() {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']
    events.forEach(event => {
      document.addEventListener(event, () => this.resetTimer(), { passive: true })
    })
  }
  
  resetTimer() {
    this.lastActivityTime = Date.now()
    
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId)
    }
    if (this.warningTimeoutId) {
      window.clearTimeout(this.warningTimeoutId)
    }
    
    const warningTime = this.timeoutDuration - this.warningDuration
    this.warningTimeoutId = window.setTimeout(() => {
      const minutesRemaining = Math.ceil(this.warningDuration / (60 * 1000))
      this.onWarning(minutesRemaining)
    }, warningTime)
    
    this.timeoutId = window.setTimeout(() => {
      this.onTimeout()
    }, this.timeoutDuration)
  }
  
  destroy() {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId)
    }
    if (this.warningTimeoutId) {
      window.clearTimeout(this.warningTimeoutId)
    }
  }
  
  getMinutesUntilTimeout(): number {
    const elapsed = Date.now() - this.lastActivityTime
    const remaining = this.timeoutDuration - elapsed
    return Math.ceil(remaining / (60 * 1000))
  }
}

export async function clearSensitiveData(keys: string[]) {
  const promises = keys.map(key => window.spark.kv.delete(key))
  await Promise.all(promises)
}

export function detectDebugger(): boolean {
  const start = performance.now()
  debugger
  const end = performance.now()
  return end - start > 100
}

export function generateSecurePassword(length: number = 16): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  const all = lowercase + uppercase + numbers + special
  
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  
  let password = ''
  password += lowercase[array[0] % lowercase.length]
  password += uppercase[array[1] % uppercase.length]
  password += numbers[array[2] % numbers.length]
  password += special[array[3] % special.length]
  
  for (let i = 4; i < length; i++) {
    password += all[array[i] % all.length]
  }
  
  return password.split('').sort(() => (crypto.getRandomValues(new Uint8Array(1))[0] % 3) - 1).join('')
}

export function getSecurityHeaders(): Record<string, boolean> {
  return {
    'X-Frame-Options': document.querySelector('meta[http-equiv="X-Frame-Options"]') !== null,
    'X-Content-Type-Options': document.querySelector('meta[http-equiv="X-Content-Type-Options"]') !== null,
    'Referrer-Policy': document.querySelector('meta[name="referrer"]') !== null,
    'Permissions-Policy': document.querySelector('meta[http-equiv="Permissions-Policy"]') !== null
  }
}

export async function secureClipboardCopy(text: string, autoClears: boolean = true): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    
    if (autoClears) {
      setTimeout(async () => {
        try {
          await navigator.clipboard.writeText('')
        } catch {
        }
      }, 60000)
    }
    
    return true
  } catch {
    return false
  }
}
