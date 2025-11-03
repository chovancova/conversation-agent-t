export type ValidationResult = {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export const validateUrl = (url: string): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  if (!url || url.trim() === '') {
    errors.push('URL is required')
    return { valid: false, errors, warnings }
  }

  try {
    const urlObj = new URL(url)

    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      errors.push('URL must use HTTP or HTTPS protocol')
    }

    if (urlObj.protocol === 'http:' && !urlObj.hostname.includes('localhost') && !urlObj.hostname.includes('127.0.0.1')) {
      warnings.push('Using HTTP instead of HTTPS may be insecure')
    }

    if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
      warnings.push('Using localhost - ensure the server is running locally')
    }

    if (urlObj.port && !['80', '443', '8080', '3000', '5000'].includes(urlObj.port)) {
      warnings.push(`Non-standard port ${urlObj.port} detected`)
    }

  } catch (error) {
    errors.push('Invalid URL format')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

export const validateEndpoint = (endpoint: string): ValidationResult => {
  const result = validateUrl(endpoint)

  if (!result.valid) {
    return result
  }

  try {
    const url = new URL(endpoint)
    
    if (url.pathname === '/') {
      result.warnings.push('Endpoint path is empty - ensure this is correct')
    }

    if (!url.pathname.includes('/')) {
      result.warnings.push('Endpoint should typically include a path (e.g., /api/chat)')
    }

  } catch (error) {
  }

  return result
}

export const validateJSON = (jsonString: string): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  if (!jsonString || jsonString.trim() === '') {
    errors.push('JSON is required')
    return { valid: false, errors, warnings }
  }

  try {
    JSON.parse(jsonString)
  } catch (error) {
    errors.push(`Invalid JSON: ${error instanceof Error ? error.message : 'Parse error'}`)
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

export const validateRequestBodyTemplate = (template: string): ValidationResult => {
  const result = validateJSON(template)

  if (!result.valid) {
    return result
  }

  const hasMessagePlaceholder = template.includes('{{message}}')
  if (!hasMessagePlaceholder) {
    result.warnings.push('Template should include {{message}} placeholder')
  }

  const hasSessionPlaceholder = template.includes('{{sessionId}}')
  if (!hasSessionPlaceholder) {
    result.warnings.push('Template may need {{sessionId}} placeholder for stateful conversations')
  }

  return result
}

export const validateResponseField = (field: string): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  if (!field || field.trim() === '') {
    errors.push('Response field is required')
    return { valid: false, errors, warnings }
  }

  const validFieldPattern = /^[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)*$/
  if (!validFieldPattern.test(field)) {
    errors.push('Response field must be a valid object path (e.g., "response", "data.message")')
  }

  if (field.split('.').length > 5) {
    warnings.push('Deep nested paths may be harder to maintain')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

export const validateHeaderKey = (key: string): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  if (!key || key.trim() === '') {
    errors.push('Header key is required')
    return { valid: false, errors, warnings }
  }

  const invalidChars = /[^a-zA-Z0-9\-_]/
  if (invalidChars.test(key)) {
    errors.push('Header key can only contain letters, numbers, hyphens, and underscores')
  }

  const reservedHeaders = ['host', 'connection', 'content-length']
  if (reservedHeaders.includes(key.toLowerCase())) {
    warnings.push(`Header "${key}" is typically set automatically by the browser`)
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

export const validateTokenExpiration = (expirationMinutes: number): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  if (!Number.isFinite(expirationMinutes) || expirationMinutes <= 0) {
    errors.push('Expiration time must be a positive number')
    return { valid: false, errors, warnings }
  }

  if (expirationMinutes < 5) {
    warnings.push('Token expires in less than 5 minutes - may require frequent refreshes')
  }

  if (expirationMinutes > 1440) {
    warnings.push('Token valid for more than 24 hours - consider security implications')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

export const validateCorsProxyUrl = (proxyUrl: string): ValidationResult => {
  const result = validateUrl(proxyUrl)

  if (!result.valid) {
    return result
  }

  try {
    const url = new URL(proxyUrl)
    
    if (url.username && url.password) {
      result.warnings.push('Proxy credentials detected in URL - ensure this is intentional')
    }

    if (url.protocol === 'http:' && !url.hostname.includes('localhost')) {
      result.warnings.push('HTTP proxy may expose credentials in transit - use HTTPS when possible')
    }

  } catch (error) {
  }

  return result
}

export const validateAgentConfiguration = (
  endpoint: string,
  bodyTemplate: string,
  responseField: string
): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  const endpointResult = validateEndpoint(endpoint)
  errors.push(...endpointResult.errors)
  warnings.push(...endpointResult.warnings)

  const templateResult = validateRequestBodyTemplate(bodyTemplate)
  errors.push(...templateResult.errors)
  warnings.push(...templateResult.warnings)

  const responseResult = validateResponseField(responseField)
  errors.push(...responseResult.errors)
  warnings.push(...responseResult.warnings)

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}
