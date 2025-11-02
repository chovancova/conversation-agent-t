# Security Documentation

## 🔒 Client-Side Only Architecture

### **ZERO SERVER-SIDE DATA STORAGE**

This application uses a **100% client-side storage architecture**. All data remains in your browser and is never transmitted to or stored on any server.

### Critical Security Points

✅ **Your data never leaves your browser**  
✅ **No server sees or stores your credentials**  
✅ **Direct browser-to-agent communication only**  
✅ **Complete data privacy and control**

---

## Data Storage and Encryption

### Current Implementation

This application uses the Spark KV (Key-Value) storage API for data persistence. All data is stored **encrypted at rest** within your **browser's local storage environment** - NOT on any server.

### What Gets Stored (Client-Side Only)

The following data is stored **exclusively in your browser**:

1. **Token Configurations** (`saved-tokens`)
   - Configuration name
   - Token endpoint URL
   - Client ID
   - Client Secret ⚠️
   - Username
   - Password ⚠️

2. **Access Tokens** (`access-token`)
   - Bearer token
   - Expiration timestamp
   - Refresh count

3. **Agent Endpoints** (`agent-endpoints`)
   - HTTP endpoint URLs per agent

4. **Agent Display Names** (`agent-names`)
   - Custom names for your agents

5. **Conversation History** (`conversations`)
   - Messages (user input and agent responses)
   - Timestamps and metadata
   - Session IDs

6. **UI Preferences**
   - Theme settings
   - Sidebar state
   - Search filters
   - Split mode state

### Encryption Details

- **Storage Location**: Spark KV storage in your browser (client-side encrypted storage)
- **Encryption**: All data stored via `useKV` and `spark.kv` APIs is encrypted at rest in your browser
- **Scope**: Data is scoped to your user account and browser profile
- **Persistence**: Data persists between sessions and page refreshes on this device only
- **Server Access**: **ZERO** - The application server never sees, processes, or stores any of your data

### Data Flow Architecture

```
User Input (Credentials)
    ↓
Browser Memory
    ↓
Spark KV API (useKV) - Client-Side
    ↓
Encrypted Browser Storage (Your Device)
    ↓
[NO SERVER TRANSMISSION]
    ↓
Decrypted for Use (Browser Memory Only)
    ↓
Direct HTTPS Request to Token Endpoint ←→ Token Service
    ↓
Bearer Token Returned to Browser
    ↓
Encrypted Browser Storage (Your Device)
    ↓
Direct HTTPS Request to Agent Endpoint ←→ Agent Service
    ↓
Response Stored in Browser Only

⚠️ AT NO POINT IS DATA SENT TO THE APPLICATION SERVER
```

### Communication Model

1. **Application Serving**: The server provides static HTML/CSS/JS files only
2. **Token Generation**: Your browser communicates directly with token endpoints
3. **Agent Interaction**: Your browser communicates directly with agent endpoints
4. **Data Storage**: All data is stored locally in your browser's Spark KV storage
5. **Server Role**: The application server acts only as a static file host - it never proxies, processes, or logs your requests

---

## Security Best Practices

### ✅ What This App Does Right

1. **Client-Side Only Storage**: Zero server-side data storage or transmission
2. **Encrypted Browser Storage**: All credentials stored via Spark KV are encrypted at rest in your browser
3. **Direct Communication**: Browser talks directly to your configured endpoints, no proxy
4. **User-Isolated Storage**: Your data is scoped to your user account and browser profile
5. **Token Expiration**: Access tokens expire after 15 minutes
6. **Bearer Auth**: Uses industry-standard Bearer token authentication
7. **HTTPS Required**: All agent endpoints should use HTTPS
8. **Password Input Types**: Passwords use `type="password"` for visual protection
9. **No Server Logging**: The app server never sees your data to log it

### ⚠️ Important Security Considerations

1. **Browser Environment**: This is a client-side application. While data is encrypted in browser storage, it must be decrypted in browser memory to be used. This is inherent to all client-side applications.

2. **Physical Device Access**: Anyone with physical access to your unlocked device can potentially access the stored data. Always lock your device when not in use.

3. **Export Functionality**: When you export token configurations, they are exported as **plain JSON** containing credentials. Treat these files as highly sensitive:
   - Store in encrypted storage only
   - Delete immediately after use
   - Never commit to version control
   - Never share via unsecured channels

4. **No Cross-Device Sync**: Since data is stored only in your browser, you cannot access it from other devices or browsers. Each browser/device requires separate configuration.

5. **Browser Data Clearing**: Clearing your browser data will permanently delete all stored credentials and conversations. There is no server-side backup.

6. **Token Lifetime**: The app stores generated access tokens in your browser. Ensure these are invalidated server-side when no longer needed.

7. **Shared Devices**: If you share your device with others, they may be able to access your stored data if they use your browser profile. Consider using separate browser profiles or private browsing mode.

---

## Recommendations for Production Use

### For Users

1. **Use Dedicated Test Credentials**: Never use production credentials in this testing tool, even though they stay client-side
2. **Rotate Credentials**: Regularly rotate any credentials stored in the app
3. **Secure Exports**: If you export token configurations:
   - Store export files in encrypted storage
   - Delete exports when no longer needed
   - Never commit export files to version control
   - Treat exports as sensitive as the credentials themselves
4. **Clear Data After Sessions**: Use the "Clear All Data" button in Security Info when done testing
5. **Limit Token Scope**: Use tokens with minimal required permissions
6. **Lock Your Device**: Always lock your device when stepping away
7. **Use Browser Profiles**: Isolate different projects using separate browser profiles
8. **Consider Private Browsing**: Use incognito/private mode for temporary testing sessions
9. **Physical Security**: Maintain physical security of devices with stored credentials
10. **Monitor Token Usage**: Check with your administrators if tokens show unexpected usage

### For Administrators

1. **Restrict Endpoints**: Configure agent endpoints to accept connections only from authorized sources
2. **Token Expiration**: Implement short-lived tokens (current: 15 minutes)
3. **Rate Limiting**: Implement rate limiting on agent endpoints
4. **Audit Logging**: Log all authentication and API requests server-side (on your token/agent services)
5. **Revocation**: Implement token revocation mechanisms
6. **CORS Policies**: Configure appropriate CORS policies on your endpoints
7. **Monitor Access**: Monitor token endpoint and agent endpoint access patterns
8. **Client Certificate Auth**: Consider requiring client certificates for additional security
9. **IP Restrictions**: Consider restricting token/agent endpoints by IP if feasible

---

## Clearing Stored Data

### Method 1: In-App (Recommended)

1. Click "Security & Privacy Info" in the sidebar
2. Scroll to bottom
3. Click "Clear All Stored Data from Browser"
4. Confirm the action

### Method 2: Browser Developer Tools

To manually clear all stored credentials and data:

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Run the following commands:

```javascript
// Clear specific keys
await spark.kv.delete('saved-tokens')
await spark.kv.delete('access-token')
await spark.kv.delete('agent-endpoints')
await spark.kv.delete('agent-names')
await spark.kv.delete('conversations')
await spark.kv.delete('activeConversationId')
await spark.kv.delete('splitConversationId')
await spark.kv.delete('selected-token-id')
await spark.kv.delete('sidebar-open')
await spark.kv.delete('split-mode')
await spark.kv.delete('conversations-visible')
await spark.kv.delete('selected-theme')
await spark.kv.delete('custom-theme')
```

Or clear all keys at once:

```javascript
const keys = await spark.kv.keys()
console.log(`Deleting ${keys.length} keys:`, keys)
for (const key of keys) {
  await spark.kv.delete(key)
}
console.log('All data cleared')
location.reload()
```

---

## Threat Model

| Threat | Risk Level | Mitigation |
|--------|-----------|------------|
| Server-side data breach | **NONE** | No server-side storage - data never leaves browser |
| Server logging credentials | **NONE** | Direct browser-to-endpoint communication only |
| Credentials exposed in browser memory | Medium | Inherent to client-side apps; use test credentials only |
| Export files contain plaintext credentials | High | User education; secure file handling; delete after use |
| XSS attacks accessing storage | Low | Spark runtime provides isolation |
| Man-in-the-middle attacks | Medium | Require HTTPS for all endpoints |
| Token theft from browser storage | Low | Encrypted at rest; short-lived tokens |
| Shared device access | Medium | Clear data after sessions; use private browsing |
| Physical device theft | Medium | Encrypted storage; short token lifetime |
| Browser data sync exposure | Low | Consider disabling sync for sensitive testing |

---

## Privacy Guarantees

### What the Application Server CANNOT See

❌ Your token configurations (client IDs, secrets, passwords)  
❌ Your access tokens  
❌ Your conversation history  
❌ Your agent endpoints  
❌ Your messages to agents  
❌ Agent responses  
❌ Any of your configuration or preferences

### What the Application Server CAN See

✅ That you loaded the web application (standard web server logs)  
✅ Your IP address (standard for any web request)  
✅ Browser user agent (standard HTTP headers)

### What Token/Agent Endpoints CAN See

Your token generation and agent endpoints will see:
- Authentication requests with credentials (as designed)
- API requests with bearer tokens (as designed)
- Message content sent to agents (as designed)
- Standard HTTP request metadata (IP, user agent, etc.)

This is normal and expected - these are YOUR services that you're testing.

---

## Compliance Notes

- This tool is designed for **testing and development purposes**
- **Zero server-side data storage** eliminates many compliance concerns
- Data remains under user's physical control at all times
- Not recommended for production credential management
- Consider dedicated secret management solutions for production use
- Ensure compliance with your organization's security policies before use
- Client-side storage may still be subject to data handling policies
- Understand your organization's policies on credential storage

---

## Questions or Concerns?

If you discover a security vulnerability, please report it responsibly by following your organization's security disclosure process.

### Verifying Client-Side Only Architecture

You can verify that no data is sent to the application server:

1. Open browser Developer Tools (F12)
2. Go to Network tab
3. Clear network log
4. Perform actions in the app (save tokens, send messages, etc.)
5. Observe that requests go only to:
   - Your configured token endpoints
   - Your configured agent endpoints
   - NOT to the application hosting server (except initial page load)

---

**Remember: With client-side storage, YOU are in complete control of your data. But this also means YOU are responsible for protecting your device and managing your data lifecycle.**
