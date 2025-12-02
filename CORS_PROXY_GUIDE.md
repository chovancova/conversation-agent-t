# CORS Proxy Configuration Guide

## Overview

The Multi-Agent Tester now includes comprehensive CORS (Cross-Origin Resource Sharing) proxy configuration to help you bypass browser CORS restrictions when testing APIs from different domains.

## What is CORS?

CORS is a browser security feature that restricts web pages from making requests to a different domain than the one serving the page. When testing APIs from this client-side application, you may encounter CORS errors if the target API doesn't include the appropriate CORS headers.

## When Do You Need a CORS Proxy?

You need a CORS proxy when:

- ✅ You see "blocked by CORS policy" errors in the browser console
- ✅ The target API doesn't include `Access-Control-Allow-Origin` headers
- ✅ You're calling third-party APIs from different domains
- ✅ The API server doesn't support CORS for browser requests

## Configuration Options

### 1. Access CORS Proxy Settings

**Via Token Manager:**
1. Open the Token Manager (Key button in sidebar)
2. Scroll to the "Use CORS Proxy" section
3. Toggle "Use CORS Proxy" switch
4. Click "Advanced CORS Proxy Settings" button

### 2. Select a Proxy Provider

The application includes **27+ pre-configured proxy providers**:

#### Free Public Proxies
- **CORS Anywhere** - Popular community proxy
- **CORS.SH** - Fast and reliable
- **AllOrigins** - No-auth proxy with URL encoding
- **ThingProxy** - Freeboard service
- **CORSFlare** - CodeTabs proxy service
- And 10+ more free options

#### Premium/Authenticated Proxies
- **ProxyCrawl** - Premium with authentication
- **ScraperAPI** - Advanced scraping capabilities
- **Bright Data** - Enterprise-grade proxy network
- **Oxylabs** - Premium residential proxies
- **SmartProxy** - Residential & datacenter proxies

#### Local Development Proxies
- **Charles Proxy** (localhost:8888)
- **Fiddler Proxy** (localhost:8866)
- **Squid Proxy** (localhost:3128)
- **Mitmproxy** (localhost:8080)
- **BrowserStack Proxy** (localhost:45691)

#### Cloud/Edge Proxies
- **Cloudflare Workers** - Edge-based proxy
- **Vercel Edge Proxy** - Vercel edge functions
- **Netlify Function Proxy** - Netlify serverless

### 3. Configure Authentication (if required)

Some proxies require authentication:

1. Toggle "Proxy Requires Authentication"
2. Enter proxy username
3. Enter proxy password
4. Credentials will be embedded in the URL securely

**Security Note:** Credentials are embedded in the proxy URL format: `https://username:password@proxy.example.com/`

### 4. Test Your Proxy

Before saving, test the proxy configuration:

1. Click "Test Proxy" button
2. The app will make a test request to `httpbin.org` (or your configured endpoint)
3. View the test result:
   - ✅ **Success** - Proxy is working correctly
   - ❌ **Error** - Check configuration and try another provider

### 5. Save Configuration

Once testing is successful:
1. Click "Save Configuration"
2. The CORS proxy will be used for all API requests
3. Settings persist across sessions

## Advanced Features

### Provider Information Tab

View detailed information about each proxy provider:
- Provider name and description
- Authentication requirements
- URL pattern (append vs query parameter)
- Local vs remote classification
- Premium vs free tier

### Info & Best Practices Tab

Access the comprehensive guide covering:
- How CORS proxies work
- When to use them
- Security considerations
- Recommended setups for dev vs production
- Quick start guide

### Validation

The system automatically validates:
- ✅ Proxy URL format
- ✅ HTTPS vs HTTP security
- ✅ Authentication completeness
- ✅ Credential format
- ⚠️ Warnings for HTTP with credentials
- ⚠️ Free tier limitations

## How It Works

### Request Flow

```
1. Your Browser → CORS Proxy (with credentials if needed)
2. CORS Proxy → Target API Server
3. Target API → CORS Proxy (adds CORS headers)
4. CORS Proxy → Your Browser (with CORS headers)
```

### URL Construction

The proxy URL is automatically constructed based on the provider's pattern:

**Append Pattern:**
```
https://cors-proxy.example.com/ + https://api.target.com/endpoint
= https://cors-proxy.example.com/https://api.target.com/endpoint
```

**Query Parameter Pattern:**
```
https://proxy.example.com/?url= + https://api.target.com/endpoint
= https://proxy.example.com/?url=https://api.target.com/endpoint
```

## Security Considerations

### ⚠️ Important Security Notes

1. **Data Visibility**: CORS proxies can see all request and response data
2. **Trust**: Only use trusted proxy providers for sensitive data
3. **Public Proxies**: Free public proxies may log or rate-limit requests
4. **Credentials**: Proxy credentials are embedded in URLs - use HTTPS proxies
5. **Production**: Deploy your own proxy for production use

### Best Practices

#### For Development
- ✅ Use local proxies (Charles, Fiddler, mitmproxy)
- ✅ Use free public proxies for non-sensitive testing
- ✅ Test multiple providers to find the most reliable

#### For Production
- ✅ Deploy your own CORS proxy (Cloudflare Workers, AWS Lambda)
- ✅ Use premium proxy services with SLA guarantees
- ✅ Implement authentication for your proxy
- ✅ Monitor proxy response times and uptime
- ✅ Have fallback proxies configured

## Troubleshooting

### Common Issues

**1. CORS Error Still Occurs**
- Verify proxy is enabled in Token Manager
- Test the proxy connection
- Try a different proxy provider
- Check if the proxy service is operational

**2. Proxy Authentication Fails**
- Verify username and password are correct
- Check if credentials are properly URL-encoded
- Ensure the proxy provider supports the authentication method

**3. Slow Response Times**
- Free proxies may be overloaded - try premium options
- Use local proxies for faster development
- Consider geographic proximity to proxy servers

**4. Proxy Test Fails**
- Check your internet connection
- Verify the proxy URL is correct
- Try a different proxy provider
- Some proxies may have rate limits

### Error Messages

**"Proxy configuration is invalid"**
- Check the proxy URL format (must be valid HTTP/HTTPS URL)
- Ensure authentication credentials are provided if required

**"Proxy test failed: timeout"**
- The proxy may be slow or offline
- Try increasing timeout or use a different provider

**"Proxy returned error: 403/401"**
- Authentication credentials may be incorrect
- The proxy may require registration or API key

## Deploying Your Own Proxy

For production use, consider deploying your own CORS proxy:

### Cloudflare Workers (Recommended)

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const targetUrl = url.searchParams.get('url')
  
  if (!targetUrl) {
    return new Response('Missing url parameter', { status: 400 })
  }

  const response = await fetch(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body
  })

  const newResponse = new Response(response.body, response)
  newResponse.headers.set('Access-Control-Allow-Origin', '*')
  
  return newResponse
}
```

### Benefits of Your Own Proxy
- ✅ Full control over security and logging
- ✅ No rate limits or usage restrictions
- ✅ Better performance and reliability
- ✅ Can implement custom authentication
- ✅ Free tier available on most platforms

## Integration with Token Manager

CORS proxy settings are saved per token configuration:

1. Each token configuration can have its own CORS proxy settings
2. Enable/disable CORS proxy per token
3. Switch between token configurations to use different proxies
4. Test different proxy providers without affecting other configurations

## Quick Reference

### Settings Location
**Sidebar → Token Button → Use CORS Proxy → Advanced CORS Proxy Settings**

### Quick Actions
- **Test Proxy**: Verify connectivity before saving
- **Copy URL**: Copy the configured proxy URL
- **Select Provider**: Choose from 27+ pre-configured options
- **Custom URL**: Enter your own proxy server

### Keyboard Shortcuts
- None specific to CORS settings
- Use Token Manager shortcuts to access (see Keyboard Shortcuts dialog)

## Additional Resources

- [CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [CORS Anywhere GitHub](https://github.com/Rob--W/cors-anywhere)

## Support

If you encounter issues with CORS proxy configuration:

1. Check the validation messages in the settings dialog
2. Test the proxy with the built-in test feature
3. Review the Info tab for troubleshooting guidance
4. Try multiple proxy providers
5. Consider deploying your own proxy for critical use cases

---

**Note:** This is a client-side application. All requests are made from your browser, not from a server. CORS proxies are a workaround for browser security restrictions and should be used with appropriate security considerations.
