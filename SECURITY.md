# Security Documentation

## Data Storage and Encryption

### Current Implementation

This application uses the Spark KV (Key-Value) storage API for data persistence. All data is stored **encrypted at rest** within the Spark runtime environment.

### What Gets Stored

The following sensitive data is stored encrypted:

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

3. **Agent Endpoints** (`agent-endpoints`)
   - HTTP endpoint URLs per agent

4. **Conversation History** (`conversations`)
   - Messages (user input and agent responses)
   - Timestamps and metadata

### Encryption Details

- **Storage Location**: Spark KV storage (server-side encrypted storage)
- **Encryption**: All data stored via `useKV` and `spark.kv` APIs is encrypted at rest
- **Scope**: Data is scoped to the current user's session
- **Persistence**: Data persists between sessions and page refreshes

### Security Best Practices

#### ✅ What This App Does Right

1. **Encrypted Storage**: All credentials stored via Spark KV are encrypted at rest
2. **Session Scoping**: Token configurations are isolated per user
3. **Token Expiration**: Access tokens expire after 15 minutes
4. **Bearer Auth**: Uses industry-standard Bearer token authentication
5. **HTTPS Required**: All agent endpoints should use HTTPS
6. **Password Input Types**: Passwords use `type="password"` for visual protection
7. **No Console Logging**: Tokens and credentials are never logged to console

#### ⚠️ Important Security Considerations

1. **Browser Environment**: This is a client-side application. While data is encrypted in Spark KV storage, it must be decrypted in the browser to be used.

2. **Export Functionality**: When you export token configurations, they are exported as **plain JSON** containing credentials. Treat these files as highly sensitive.

3. **Shared Access**: If multiple users share the same Spark app instance, they may have access to the same encrypted storage.

4. **Token Lifetime**: The app stores generated access tokens. Ensure these are invalidated server-side when no longer needed.

### Recommendations for Production Use

#### For Users

1. **Use Dedicated Test Credentials**: Never use production credentials in this testing tool
2. **Rotate Credentials**: Regularly rotate any credentials stored in the app
3. **Secure Exports**: If you export token configurations:
   - Store export files in encrypted storage
   - Delete exports when no longer needed
   - Never commit export files to version control
4. **Clear Data**: Use browser developer tools to clear Spark KV data when done testing
5. **Limit Token Scope**: Use tokens with minimal required permissions

#### For Administrators

1. **Restrict Endpoints**: Configure agent endpoints to accept connections only from authorized sources
2. **Token Expiration**: Implement short-lived tokens (current: 15 minutes)
3. **Rate Limiting**: Implement rate limiting on agent endpoints
4. **Audit Logging**: Log all authentication and API requests server-side
5. **Revocation**: Implement token revocation mechanisms

### Data Flow Diagram

```
User Input (Credentials)
    ↓
Spark KV API (useKV)
    ↓
Encrypted Storage (Spark Runtime)
    ↓
Decrypted for Use (Browser Memory)
    ↓
HTTPS Request to Token Endpoint
    ↓
Bearer Token Returned
    ↓
Encrypted Storage (Spark Runtime)
    ↓
HTTPS Request to Agent Endpoint (with Bearer Token)
```

### Clearing Stored Data

To completely clear all stored credentials and data:

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Run the following commands:

```javascript
await spark.kv.delete('saved-tokens')
await spark.kv.delete('access-token')
await spark.kv.delete('agent-endpoints')
await spark.kv.delete('conversations')
await spark.kv.delete('activeConversationId')
await spark.kv.delete('selected-token-id')
```

Or clear all keys:

```javascript
const keys = await spark.kv.keys()
for (const key of keys) {
  await spark.kv.delete(key)
}
```

### Threat Model

| Threat | Risk Level | Mitigation |
|--------|-----------|------------|
| Credentials exposed in browser memory | Medium | Inherent to client-side apps; use test credentials only |
| Export files contain plaintext credentials | High | User education; secure file handling |
| XSS attacks accessing storage | Low | Spark runtime provides isolation |
| Man-in-the-middle attacks | Medium | Require HTTPS for all endpoints |
| Token theft from storage | Low | Encrypted at rest; short-lived tokens |
| Shared device access | Medium | Clear data after sessions; use private browsing |

### Compliance Notes

- This tool is designed for **testing and development purposes**
- Not recommended for production credential management
- Consider dedicated secret management solutions for production use
- Ensure compliance with your organization's security policies before use

### Questions or Concerns?

If you discover a security vulnerability, please report it responsibly by following your organization's security disclosure process.
