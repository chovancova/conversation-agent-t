export const COMMON_CORS_PROXIES = [
  { name: 'CORS Anywhere', url: 'https://cors-anywhere.herokuapp.com/', requiresAuth: false },
  { name: 'AllOrigins', url: 'https://api.allorigins.win/raw?url=', requiresAuth: false },
  { name: 'Custom Proxy', url: '', requiresAuth: false },
]

export type CORSProxyConfig = {
  enabled: boolean
  proxyUrl: string
  requiresAuth: boolean
  credentials?: {
    username: string
    password: string
  }
}

export const buildProxiedUrl = (targetUrl: string, proxyUrl: string): string => {
  if (!proxyUrl || !targetUrl) {
    return targetUrl
  }

  if (proxyUrl.includes('allorigins.win')) {
    return `${proxyUrl}${encodeURIComponent(targetUrl)}`
  }

  if (proxyUrl.endsWith('/')) {
    return `${proxyUrl}${targetUrl}`
  }

  return `${proxyUrl}/${targetUrl}`
}

export const extractCredentialsFromProxyUrl = (proxyUrl: string) => {
  try {
    const url = new URL(proxyUrl)
    
    if (url.username || url.password) {
      return {
        cleanUrl: `${url.protocol}//${url.host}${url.pathname}${url.search}`,
        credentials: {
          username: decodeURIComponent(url.username),
          password: decodeURIComponent(url.password)
        }
      }
    }

    return { cleanUrl: proxyUrl }
  } catch (error) {
    return { cleanUrl: proxyUrl }
  }
}

export const buildProxyUrlWithCredentials = (
  baseUrl: string,
  username?: string,
  password?: string
): string => {
  if (!username || !password) {
    return baseUrl
  }

  try {
    const url = new URL(baseUrl)
    url.username = encodeURIComponent(username)
    url.password = encodeURIComponent(password)
    return url.toString()
  } catch (error) {
    return baseUrl
  }
}

export const sanitizeProxyUrlForDisplay = (proxyUrl: string): string => {
  try {
    const url = new URL(proxyUrl)
    
    if (url.username || url.password) {
      const username = url.username ? `${url.username.substring(0, 2)}***` : ''
      const password = url.password ? ':***' : ''
      return `${url.protocol}//${username}${password}@${url.host}${url.pathname}${url.search}`
    }

    return proxyUrl
  } catch (error) {
    return proxyUrl
  }
}
