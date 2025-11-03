# Certificate Validation & Proxy Configuration Guide

## Overview

This guide explains the new certificate validation and proxy configuration features added to the Token Manager, along with important information about browser limitations in a 100% client-side application.

## New Features

### 1. Certificate Error Handling

The Token Manager now includes an "Ignore Certificate Errors" toggle that helps document your intention to work with self-signed certificates or development environments.

**Location:** Token Manager → Configuration Form → Advanced Settings

**Important:** This setting is **informational only**. Browsers enforce certificate validation for security reasons and cannot be overridden by JavaScript.

#### Common Certificate Errors

- `ERR_CERT_AUTHORITY_INVALID` - Certificate not trusted by browser
- `ERR_CERT_COMMON_NAME_INVALID` - Certificate hostname mismatch
- `ERR_CERT_DATE_INVALID` - Certificate expired or not yet valid

#### Solutions for Certificate Errors

1. **Visit the endpoint directly in your browser**
   - Navigate to the token endpoint URL
   - Accept the certificate warning
   - The browser will remember your choice for that session/domain

2. **Install the certificate in your trust store**
   - Export the self-signed certificate
   - Install it in your operating system or browser's certificate trust store
   - This provides permanent trust

3. **Use a valid SSL certificate**
   - Obtain a certificate from a trusted Certificate Authority (Let's Encrypt, etc.)
   - This is the recommended production solution

4. **Development workarounds**
   - Use Chrome with `--ignore-certificate-errors` flag (development only, never in production)
   - Use localhost with valid local certificates (mkcert tool)

### 2. Proxy Configuration

The Token Manager now includes a "Proxy URL" field for documenting your network's proxy requirements.

**Location:** Token Manager → Configuration Form → Advanced Settings

**Important:** This field is **for documentation only**. Browser fetch API automatically uses your system's proxy settings. You cannot override proxy configuration from JavaScript for security reasons.

#### How Proxy Settings Work in Browsers

- Browsers use system-level proxy configuration automatically
- Configure proxy in:
  - **Windows:** Settings → Network & Internet → Proxy
  - **macOS:** System Preferences → Network → Advanced → Proxies
  - **Linux:** System Settings → Network → Network Proxy
  - **Browser-specific:** Check your browser's settings (some browsers have independent proxy settings)

- The proxy URL field in this app serves as:
  - Documentation of your network requirements
  - Reference for team members
  - Configuration notes

## 100% Client-Side Architecture

### What This Means

**ZERO server-side data storage or processing.** This application:

✅ Runs entirely in your browser  
✅ Stores all data in browser local storage (Spark KV)  
✅ Makes direct API calls from your browser to configured endpoints  
✅ Never sends credentials, tokens, or conversations to any server  
✅ Serves only static HTML/JS/CSS files  

### Browser Security Model

Because this is a client-side application, it operates within browser security constraints:

1. **Certificate Validation**
   - Enforced by browser
   - Cannot be disabled via JavaScript
   - Protects against man-in-the-middle attacks

2. **Proxy Settings**
   - Controlled by system/browser settings
   - Cannot be overridden per-request
   - Ensures consistent network behavior

3. **CORS (Cross-Origin Resource Sharing)**
   - Agent endpoints must include proper CORS headers
   - Required for browser to allow requests
   - Server-side configuration needed

4. **Credential Storage**
   - Uses browser's local storage
   - Encrypted with AES-256-GCM
   - Scoped to your user account
   - Device-specific (not synced)

### Privacy & Security Benefits

Because everything is client-side:

- ✅ **Complete Privacy** - No server can access your data
- ✅ **No Data Breaches** - Nothing stored on servers to leak
- ✅ **Full Control** - Clear data anytime from browser
- ✅ **No Tracking** - Usage patterns stay private
- ✅ **No Analytics** - Zero data collection
- ✅ **Open Source** - Verify the code yourself

## Configuration Best Practices

### For Development Environments

```
Configuration Name: Development
Token Endpoint: https://dev-api.example.com/oauth/token
Ignore Certificate Errors: ✓ (Enabled)
Proxy URL: http://proxy.corp.local:8080
```

**Setup Steps:**
1. Enable "Ignore Certificate Errors" toggle
2. Visit the token endpoint URL in your browser
3. Accept the certificate warning
4. Return to the app and generate token

### For Production Environments

```
Configuration Name: Production
Token Endpoint: https://api.example.com/oauth/token
Ignore Certificate Errors: ✗ (Disabled)
Proxy URL: (leave empty or document corporate proxy)
```

**Setup Steps:**
1. Ensure endpoint has valid SSL certificate
2. Keep "Ignore Certificate Errors" disabled
3. Document proxy if required by network
4. Generate token normally

## Troubleshooting

### Problem: "Failed to fetch" error

**Possible Causes:**
1. Certificate validation failure
2. CORS headers missing
3. Network/proxy blocking request
4. Endpoint not accessible

**Solutions:**
1. Check browser console for specific error (F12 → Console)
2. Visit endpoint URL directly to test certificate
3. Verify CORS headers on server side
4. Test connectivity outside the app (curl, Postman)
5. Check system proxy settings

### Problem: "ERR_CERT_AUTHORITY_INVALID"

**Solution:**
- Follow certificate solutions listed above
- Enable "Ignore Certificate Errors" toggle for documentation
- Visit endpoint in browser and accept certificate
- Consider installing certificate in trust store

### Problem: Proxy not working

**Solution:**
- Configure proxy at system/browser level
- Proxy URL field is documentation only
- Test connectivity with system proxy configured
- Contact network administrator if needed

## Understanding Browser Fetch API Limitations

The browser's `fetch()` API, which this application uses, has security-by-design limitations:

| Feature | Configurable? | Notes |
|---------|---------------|-------|
| Certificate Validation | ❌ No | Enforced by browser for security |
| Proxy Settings | ❌ No | Uses system proxy automatically |
| Custom Headers | ✅ Yes | Can be set per-request |
| CORS | ⚠️ Server-side | Server must send CORS headers |
| Credentials | ✅ Yes | Can include cookies/auth |

These limitations exist to protect users and are fundamental to web security.

## Additional Resources

### Client-Side Only Information
- Click "Client-Side Only" button in the sidebar
- Detailed explanation of data storage
- Benefits and limitations
- Browser security model

### Security & Privacy
- Click "Security & Privacy" button in the sidebar  
- Encryption details
- Session timeout settings
- Data management options

### Data Manager
- Export/import configurations
- Backup conversations
- Clear all data
- Encrypted exports

## Summary

The new certificate and proxy settings help document your network environment but cannot override browser security policies. This is a **feature, not a bug** - it ensures the application operates within browser security constraints while maintaining 100% client-side architecture.

For handling certificate errors:
1. Visit the endpoint directly and accept the certificate
2. Or install the certificate in your trust store
3. Or use valid certificates in production

For proxy configuration:
1. Configure proxy at system/browser level
2. Use the proxy URL field for documentation
3. The app will automatically use system proxy settings

Remember: **All your data stays in your browser. Nothing is sent to or stored on any server.**
