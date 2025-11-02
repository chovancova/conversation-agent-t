# Multi-Agent Tester with HTTP Bearer Auth

A professional testing environment for conversation agents that enables secure interaction with specialized HTTP-based agents via Bearer token authentication.

## 🔒 Privacy First: 100% Client-Side Storage

**ALL DATA STAYS IN YOUR BROWSER** - Zero server-side storage. Your credentials, tokens, and conversations never leave your device.

## 🎯 Overview

This application allows you to test and evaluate multiple conversation agents across different business domains (Account Opening, Payment, Moderator, Card, RAG) through a clean, efficient interface.

## ✨ Key Features

- **Multi-Agent Chat Interface**: Test different specialized agents in isolated conversations
- **Bearer Token Authentication**: OAuth2-style token generation with automatic expiry tracking
- **Agent Configuration**: Configure HTTP endpoints for each agent type independently
- **Conversation Management**: Maintain multiple conversation sessions with persistent history
- **Split View Testing**: Compare two conversations side-by-side
- **Message Export**: Extract conversations for analysis and documentation
- **Security & Privacy**: 100% client-side storage with comprehensive security information
- **Theme Customization**: Multiple theme options including custom color palettes

## 🔒 Security Architecture

### **Zero Server-Side Storage**

This application uses a **client-side only architecture**:

✅ **All data stored exclusively in your browser**  
✅ **Your browser communicates directly with agent endpoints**  
✅ **Application server never sees your credentials or data**  
✅ **No server-side logging or processing of user data**  
✅ **Complete data privacy and control**

### Encrypted Browser Storage

All credentials and sensitive data are stored using **Spark KV with encryption at rest in your browser**:
- Client secrets
- Passwords
- Bearer tokens
- Conversation history
- Agent endpoints
- UI preferences

### Security Best Practices

✅ **What this app does right:**
- **Client-side only storage** - zero server transmission
- Encrypted at-rest storage in browser via Spark KV
- User-scoped data isolation
- Direct browser-to-endpoint communication
- Short-lived tokens (15-minute expiration)
- Password input fields for visual protection
- No credential logging to console
- HTTPS enforcement for endpoints
- Security warnings on export
- Clear data management

⚠️ **Important considerations:**
- **Use test credentials only** - Never store production secrets (even client-side)
- Export files contain plaintext credentials - handle securely
- Browser environment requires credential decryption for use
- Physical device security is critical with client-side storage
- Clear data after testing sessions
- No cross-device sync (data is device-specific)
- Clearing browser data will permanently delete all configurations

### Data Flow

```
Your Browser → Token Endpoint (Direct)
Your Browser → Agent Endpoint (Direct)
Your Browser → Encrypted Local Storage

❌ NO server-side storage
❌ NO application server sees your data
```

### Data Stored (Client-Side Only)

The application stores the following data **in your browser only**:
- `saved-tokens` - Token configurations (encrypted)
- `access-token` - Active bearer token (encrypted)
- `agent-endpoints` - Agent HTTP endpoints (encrypted)
- `agent-names` - Custom agent display names (encrypted)
- `conversations` - Message history (encrypted)
- `selected-theme` - Theme preferences
- Various UI state preferences

### Clearing Data

Access the "Security & Privacy Info" dialog from the sidebar to:
- View detailed security information
- Understand the client-side architecture
- View all stored data keys
- **Clear all stored data from your browser with one click**

## 🚀 Getting Started

### 1. Generate Access Token

1. Click "Token" in the sidebar
2. Enter your OAuth token endpoint URL
3. Provide client ID, client secret, username, and password
4. Click "Generate Token"
5. Save configuration for reuse (optional)
6. Export/import configurations between browsers if needed

### 2. Configure Agent Endpoints

1. Click "Agents" in the sidebar
2. For each agent type, enter the HTTP POST endpoint
3. Optionally customize agent display names
4. Save configurations

### 3. Start Testing

1. Click "New Conversation" and select an agent type
2. Type your message and press Enter
3. View agent responses in real-time
4. Switch agents or create new conversations as needed
5. Use split view to compare two conversations side-by-side

## 🔧 Technical Details

### Token Generation

Your browser sends directly to your token endpoint:

```
POST [token-endpoint]
Content-Type: application/json

{
  "client_id": "your-client-id",
  "client_secret": "your-client-secret",
  "username": "username",
  "password": "password"
}
```

### Agent Communication

Your browser sends directly to your agent endpoint:

```
POST [agent-endpoint]
Authorization: Bearer [access-token]
Content-Type: application/json

{
  "message": "user message",
  "sessionId": "optional-session-id"
}
```

## 📋 Agent Types

- **Account Opening**: Customer account creation and onboarding
- **Payment**: Payment processing and transaction handling
- **Moderator**: Content moderation and policy enforcement
- **Card**: Card services and management
- **RAG**: Retrieval-augmented generation for knowledge queries

## 🛡️ Security Recommendations

### For Users

1. **Use dedicated test/development credentials only**
2. Rotate credentials regularly after testing
3. Store exported files in encrypted storage
4. Delete export files when no longer needed
5. Never commit export files to version control
6. Clear stored data when switching projects
7. Use tokens with minimal required permissions
8. **Lock your device when not in use** (client-side storage)
9. Use browser profiles to isolate different projects
10. Consider private/incognito mode for temporary testing

### For Administrators

1. Implement short-lived tokens (current: 15 minutes)
2. Configure rate limiting on agent endpoints
3. Require HTTPS for all endpoints
4. Implement server-side audit logging (on your token/agent services)
5. Provide token revocation mechanisms
6. Restrict endpoint access to authorized sources
7. Monitor token usage patterns
8. Configure appropriate CORS policies

## 🎨 Customization

### Theme Settings

Access theme customization via the "Theme" button:
- Choose from preset themes (Dark, Light, Midnight Blue, etc.)
- Create custom color palettes
- Adjust UI spacing and visual style
- Export/import theme configurations

## 📖 Documentation

- See [SECURITY.md](./SECURITY.md) for comprehensive security documentation
- See [PRD.md](./PRD.md) for product requirements and design decisions
- See [THEME_CUSTOMIZATION.md](./THEME_CUSTOMIZATION.md) for theme customization guide

## ⚠️ Important Notes

- This is a **testing and development tool**
- **100% client-side architecture** means zero server-side data storage
- Data is **device-specific** and not synced across devices
- Not intended for production credential management
- Consider dedicated secret management solutions for production
- Ensure compliance with your organization's security policies
- Physical device security is critical with client-side storage

## 🔍 Verifying Security

To verify that no data is sent to the application server:

1. Open browser Developer Tools (F12)
2. Go to Network tab
3. Perform actions (save tokens, send messages)
4. Observe requests go only to YOUR configured endpoints
5. No requests to application server (except initial page load)

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
