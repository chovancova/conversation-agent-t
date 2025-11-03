# Quick Reference: Certificate & Proxy Settings

## TL;DR

**Problem**: Getting `ERR_CERT_AUTHORITY_INVALID` or need proxy for corporate network?

**Solution**: These are browser limitations, not app bugs. See solutions below.

## Certificate Errors - Quick Fix

```
❌ Error: ERR_CERT_AUTHORITY_INVALID
❌ Error: Failed to fetch
❌ Error: net::ERR_CERT_*
```

### Solution (Choose One)

#### Option 1: Accept in Browser (Fastest)
1. Copy the endpoint URL from Token Manager
2. Open it in a new browser tab
3. Click "Advanced" → "Proceed anyway"
4. Return to app and try again

#### Option 2: Install Certificate
```bash
# For development with self-signed certs
# Use mkcert or similar tool
mkcert -install
mkcert example.com localhost
```

#### Option 3: Use Valid Certificate
- Get free cert from Let's Encrypt
- Or use certificate from trusted CA
- Update server configuration

## Proxy Configuration

### The Setting in Token Manager
- **Purpose**: Documentation only
- **Effect**: None (browser handles proxy)
- **Why**: JavaScript cannot override proxy for security

### Actual Configuration

#### Windows
```
Settings → Network & Internet → Proxy
```

#### macOS
```
System Preferences → Network → Advanced → Proxies
```

#### Linux
```
System Settings → Network → Network Proxy
```

#### Chrome/Edge
```
Settings → System → Open proxy settings
```

## Is Data Sent to Server?

### ❌ NO. NEVER. ZERO.

```
Your Browser  →  [Local Storage]  ←  Your Browser
     ↓
     ↓ (Direct API Call)
     ↓
Agent Endpoint
```

**Application Server**: Only serves HTML/JS/CSS files. Never sees your data.

## Token Manager Settings Explained

### "Ignore Certificate Errors" Toggle
- ✅ **Does**: Documents your preference
- ✅ **Does**: Reminds you about cert issues
- ❌ **Doesn't**: Override browser security
- ❌ **Doesn't**: Disable certificate validation

### "Proxy URL" Field
- ✅ **Does**: Stores proxy URL for reference
- ✅ **Does**: Helps team know network config
- ❌ **Doesn't**: Configure actual proxy
- ❌ **Doesn't**: Change browser behavior

## Troubleshooting Flowchart

```
Getting "Failed to fetch" error?
           ↓
    Open Browser Console (F12)
           ↓
    What's the error?
           ↓
    ┌──────────────┬────────────────┬────────────────┐
    ↓              ↓                ↓                ↓
ERR_CERT_*    CORS Error    Network Error    Other
    ↓              ↓                ↓                ↓
See Cert      Server needs   Check proxy/   Check
Solutions     CORS headers   firewall       endpoint
Above                                       is running
```

## Common Questions

**Q: Why doesn't "Ignore Certificate Errors" work?**  
A: It's documentation only. Browser enforces cert validation for your security.

**Q: Why can't I set a custom proxy?**  
A: Browser security. Use system settings instead.

**Q: Is my data sent to any server?**  
A: NO. 100% client-side. See [CLIENT_SIDE_CONFIRMATION.md](./CLIENT_SIDE_CONFIRMATION.md)

**Q: What's stored on the server?**  
A: NOTHING. Only static files (HTML/JS/CSS) are served.

**Q: How do I verify it's client-side?**  
A: Open DevTools → Network tab. See only agent endpoint calls.

**Q: Can I disable certificate validation?**  
A: Only by visiting endpoint in browser and accepting cert, or installing cert in trust store.

**Q: My company uses a proxy. How do I configure it?**  
A: Configure at system level. Browser will use it automatically.

## One-Page Cheat Sheet

| Issue | Solution | Time |
|-------|----------|------|
| Self-signed cert | Visit URL in browser, accept cert | 1 min |
| Corporate proxy | Configure system proxy settings | 2 min |
| CORS error | Server must add CORS headers | N/A (server-side) |
| Failed to fetch | Check console for specific error | 1 min |
| Token expired | Generate new token | 30 sec |

## Links to Full Guides

📄 **[CERTIFICATE_AND_PROXY_GUIDE.md](./CERTIFICATE_AND_PROXY_GUIDE.md)**
- Detailed explanations
- Multiple solutions
- Technical background
- Configuration examples

📄 **[CLIENT_SIDE_CONFIRMATION.md](./CLIENT_SIDE_CONFIRMATION.md)**
- 100% client-side verification
- Architecture diagrams
- Security benefits
- FAQ section

📄 **[README.md](./README.md)**
- Getting started
- Feature overview
- Basic troubleshooting

## Getting Help

1. Check browser console (F12 → Console)
2. Read the error message
3. Search this guide for the error
4. Check the full guides linked above
5. Verify system proxy settings
6. Test endpoint outside the app

## Remember

```
╔══════════════════════════════════════════════════════════╗
║  Certificate & Proxy Settings = DOCUMENTATION ONLY       ║
║                                                          ║
║  They CANNOT override browser security.                 ║
║  They HELP YOU remember your network configuration.     ║
║  They EMPHASIZE that this is a client-side app.        ║
║                                                          ║
║  This is CORRECT BEHAVIOR, not a limitation.            ║
╚══════════════════════════════════════════════════════════╝
```

## Quick Actions

### I have a certificate error
→ Visit endpoint in browser, accept cert

### I need to use a proxy  
→ Configure system proxy, not in app

### I want to verify client-side
→ Open DevTools → Application → Local Storage

### I need more details
→ Read [CERTIFICATE_AND_PROXY_GUIDE.md](./CERTIFICATE_AND_PROXY_GUIDE.md)

---

**Last Updated**: With certificate & proxy features  
**Status**: ✅ 100% Client-Side Confirmed
