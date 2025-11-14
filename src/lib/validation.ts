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

export const validateEndpointSecurity = (endpoint: string): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  try {
    const url = new URL(endpoint)

    if (url.protocol === 'http:' && !['localhost', '127.0.0.1', '0.0.0.0'].includes(url.hostname)) {
      warnings.push('Endpoint uses HTTP - credentials and data will be sent unencrypted')
    }

    if (url.port && ['21', '23', '25'].includes(url.port)) {
      errors.push('Endpoint uses an insecure protocol port')
    }

    if (url.hostname.includes('test') || url.hostname.includes('dev') || url.hostname.includes('staging')) {
      warnings.push('Endpoint appears to be a test/dev/staging environment')
    }

    if (url.pathname.includes('..') || url.pathname.includes('//')) {
      errors.push('Endpoint path contains suspicious patterns')
    }

    const privateRanges = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^169\.254\./
    ]

    const isPrivateIP = privateRanges.some(pattern => pattern.test(url.hostname))
    if (isPrivateIP) {
      warnings.push('Endpoint uses a private IP address - ensure it is accessible from your network')
    }

  } catch (error) {
    errors.push('Cannot validate endpoint security - invalid URL format')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

export const validateEndpointReachability = (endpoint: string): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  try {
    const url = new URL(endpoint)

    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      warnings.push('Local endpoint - ensure the service is running on your machine')
    }

    if (!url.port && !['http:', 'https:'].includes(url.protocol)) {
      warnings.push('No port specified - will use default for protocol')
    }

    if (url.hostname.includes('example.') || url.hostname === 'example.com') {
      errors.push('Endpoint uses example domain - replace with actual endpoint')
    }

    if (!url.hostname.includes('.') && url.hostname !== 'localhost') {
      warnings.push('Endpoint hostname has no TLD - ensure this is correct')
    }

  } catch (error) {
    errors.push('Cannot validate endpoint reachability - invalid URL format')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

export const validateEndpointCompliance = (endpoint: string): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  try {
    const url = new URL(endpoint)

    if (url.username || url.password) {
      errors.push('Endpoint contains credentials in URL - use Authorization header instead')
    }

    if (url.search && url.search.toLowerCase().includes('api_key')) {
      warnings.push('API key detected in query string - consider using headers for sensitive data')
    }

    if (url.search && url.search.toLowerCase().includes('token')) {
      warnings.push('Token detected in query string - consider using Authorization header')
    }

    const maxUrlLength = 2048
    if (endpoint.length > maxUrlLength) {
      warnings.push(`Endpoint URL exceeds ${maxUrlLength} characters - may cause issues in some browsers`)
    }

    if (url.pathname.length > 1 && !url.pathname.startsWith('/api') && !url.pathname.startsWith('/v')) {
      warnings.push('Endpoint path does not follow common API conventions (/api/* or /v*/*)')
    }

  } catch (error) {
    errors.push('Cannot validate endpoint compliance - invalid URL format')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

export const validateEndpointComprehensive = (endpoint: string): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  const basicResult = validateEndpoint(endpoint)
  errors.push(...basicResult.errors)
  warnings.push(...basicResult.warnings)

  if (basicResult.valid) {
    const securityResult = validateEndpointSecurity(endpoint)
    errors.push(...securityResult.errors)
    warnings.push(...securityResult.warnings)

    const reachabilityResult = validateEndpointReachability(endpoint)
    errors.push(...reachabilityResult.errors)
    warnings.push(...reachabilityResult.warnings)

    const complianceResult = validateEndpointCompliance(endpoint)
    errors.push(...complianceResult.errors)
    warnings.push(...complianceResult.warnings)
  }

  return {
    valid: errors.length === 0,
    errors: [...new Set(errors)],
    warnings: [...new Set(warnings)]
  }
}

export const validateProxyConfiguration = (
  proxyUrl: string,
  requiresAuth: boolean,
  username?: string,
  password?: string
): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  const urlResult = validateCorsProxyUrl(proxyUrl)
  errors.push(...urlResult.errors)
  warnings.push(...urlResult.warnings)

  if (requiresAuth) {
    if (!username || username.trim() === '') {
      errors.push('Proxy requires authentication but username is missing')
    }

    if (!password || password.trim() === '') {
      errors.push('Proxy requires authentication but password is missing')
    }

    if (username && username.length < 3) {
      warnings.push('Proxy username is very short - ensure this is correct')
    }

    if (password && password.length < 6) {
      warnings.push('Proxy password is short - consider using a stronger password')
    }
  }

  try {
    const url = new URL(proxyUrl)
    
    if (requiresAuth && url.protocol === 'http:' && !url.hostname.includes('localhost')) {
      warnings.push('Using HTTP with authentication - credentials will be sent unencrypted')
    }

    if (url.hostname.includes('herokuapp.com') && !url.hostname.includes('cors-anywhere')) {
      warnings.push('Using Heroku free tier proxy - may have rate limits or availability issues')
    }

  } catch (error) {
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

export const validateBearerToken = (token: string): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []

  if (!token || token.trim() === '') {
    errors.push('Bearer token is required')
    return { valid: false, errors, warnings }
  }

  if (token.includes(' ') && !token.startsWith('Bearer ')) {
    errors.push('Token contains spaces - ensure this is valid')
  }

  if (token.startsWith('Bearer ')) {
    warnings.push('Token includes "Bearer " prefix - this will be added automatically')
  }

  if (token.length < 20) {
    warnings.push('Token is very short - ensure this is a valid token')
  }

  if (token.length > 8192) {
    warnings.push('Token is very long - may exceed header size limits')
  }

  const tokenPatterns = [
    { pattern: /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/, type: 'JWT' },
    { pattern: /^[A-Fa-f0-9]{32,}$/, type: 'Hexadecimal' },
    { pattern: /^[A-Za-z0-9+/]+=*$/, type: 'Base64' },
  ]

  const matchedPattern = tokenPatterns.find(({ pattern }) => pattern.test(token.replace('Bearer ', '')))
  if (matchedPattern) {
    warnings.push(`Token appears to be in ${matchedPattern.type} format`)
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}
