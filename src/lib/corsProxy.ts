export const COMMON_CORS_PROXIES = [
  { name: 'CORS Anywhere', url: 'https://cors-anywhere.herokuapp.com/', requiresAuth: false, description: 'Popular CORS proxy service', urlPattern: 'append' },
  { name: 'AllOrigins', url: 'https://api.allorigins.win/raw?url=', requiresAuth: false, description: 'No-auth CORS proxy with URL encoding', urlPattern: 'query' },
  { name: 'CORS.SH', url: 'https://cors.sh/', requiresAuth: false, description: 'Fast and reliable CORS proxy', urlPattern: 'append' },
  { name: 'Proxy.CORS.SH', url: 'https://proxy.cors.sh/', requiresAuth: false, description: 'Alternative CORS.SH endpoint', urlPattern: 'append' },
  { name: 'CORS Proxy', url: 'https://corsproxy.io/?', requiresAuth: false, description: 'Simple CORS proxy with query params', urlPattern: 'query' },
  { name: 'ThingProxy', url: 'https://thingproxy.freeboard.io/fetch/', requiresAuth: false, description: 'Freeboard CORS proxy service', urlPattern: 'append' },
  { name: 'CrossOrigin.me', url: 'https://crossorigin.me/', requiresAuth: false, description: 'Basic CORS proxy service', urlPattern: 'append' },
  { name: 'CORS.Bridged.cc', url: 'https://cors.bridged.cc/', requiresAuth: false, description: 'Bridged CORS proxy with caching', urlPattern: 'append' },
  { name: 'YACDN CORS', url: 'https://yacdn.org/proxy/', requiresAuth: false, description: 'Fast CDN-backed CORS proxy', urlPattern: 'append' },
  { name: 'Cloudflare Workers', url: 'https://workers.cloudflare.com/cors/', requiresAuth: false, description: 'Edge-based CORS proxy', urlPattern: 'append' },
  { name: 'Heroku CORS Proxy', url: 'https://cors-proxy.herokuapp.com/', requiresAuth: false, description: 'Heroku-hosted CORS proxy', urlPattern: 'append' },
  { name: 'CORSFlare', url: 'https://api.codetabs.com/v1/proxy?quest=', requiresAuth: false, description: 'CodeTabs proxy service', urlPattern: 'query' },
  { name: 'JSONProxy', url: 'https://jsonp.afeld.me/?url=', requiresAuth: false, description: 'JSONP CORS proxy', urlPattern: 'query' },
  { name: 'CORS.EU.org', url: 'https://cors.eu.org/', requiresAuth: false, description: 'European CORS proxy service', urlPattern: 'append' },
  { name: 'Cloudflare Worker Proxy', url: 'https://proxy.example.workers.dev/', requiresAuth: false, description: 'Deploy your own Cloudflare Worker', urlPattern: 'append' },
  { name: 'Vercel Edge Proxy', url: 'https://cors-proxy.vercel.app/', requiresAuth: false, description: 'Vercel Edge Function proxy', urlPattern: 'append' },
  { name: 'Netlify Function Proxy', url: 'https://cors-proxy.netlify.app/.netlify/functions/proxy?url=', requiresAuth: false, description: 'Netlify serverless proxy', urlPattern: 'query' },
  { name: 'ProxyCrawl', url: 'https://api.proxycrawl.com/?url=', requiresAuth: true, description: 'Premium proxy with auth', urlPattern: 'query' },
  { name: 'ScraperAPI', url: 'https://api.scraperapi.com/?url=', requiresAuth: true, description: 'Advanced scraping proxy', urlPattern: 'query' },
  { name: 'Bright Data Proxy', url: 'https://proxy.brightdata.com/', requiresAuth: true, description: 'Enterprise-grade proxy network', urlPattern: 'append' },
  { name: 'Oxylabs Proxy', url: 'https://realtime.oxylabs.io/v1/queries', requiresAuth: true, description: 'Premium residential proxy', urlPattern: 'custom' },
  { name: 'SmartProxy', url: 'https://gate.smartproxy.com/', requiresAuth: true, description: 'Residential & datacenter proxies', urlPattern: 'append' },
  { name: 'Squid Proxy', url: 'http://localhost:3128/', requiresAuth: true, description: 'Local Squid proxy server', urlPattern: 'append' },
  { name: 'Charles Proxy', url: 'http://localhost:8888/', requiresAuth: false, description: 'Local Charles debugging proxy', urlPattern: 'append' },
  { name: 'Fiddler Proxy', url: 'http://localhost:8866/', requiresAuth: false, description: 'Local Fiddler debugging proxy', urlPattern: 'append' },
  { name: 'Mitmproxy', url: 'http://localhost:8080/', requiresAuth: false, description: 'Local mitmproxy debugging tool', urlPattern: 'append' },
  { name: 'BrowserStack Proxy', url: 'http://localhost:45691/', requiresAuth: false, description: 'BrowserStack local testing proxy', urlPattern: 'append' },
  { name: 'Custom Proxy', url: '', requiresAuth: false, description: 'Enter your own proxy URL', urlPattern: 'custom' },
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
