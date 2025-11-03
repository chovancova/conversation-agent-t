# Multi-Agent Tester with HTTP Bearer Auth

A professional testing environment for conversation agents that enables secure interaction with specialized HTTP-based agents via Bearer token authentication.

## 🎯 Overview

This application allows you to test and evaluate multiple conversation agents across different business domains (Account Opening, Payment, Moderator, Card, RAG) through a clean, efficient interface.

## 🔐 100% Client-Side Architecture

**⚠️ IMPORTANT: ALL data stays in your browser. ZERO server-side storage.**

This is a completely client-side application:
- ✅ All credentials stored in browser local storage only
- ✅ All data encrypted with AES-256-GCM (optional)
- ✅ Direct API calls from browser to agent endpoints
- ✅ Zero data transmission to application server
- ✅ Zero analytics, tracking, or logging

**New Features:**
- 🔒 **Certificate Error Handling**: Document certificate validation settings for development endpoints
- 🌐 **Proxy Configuration**: Document proxy requirements for corporate networks
- 📄 **Comprehensive Guides**: See [CERTIFICATE_AND_PROXY_GUIDE.md](./CERTIFICATE_AND_PROXY_GUIDE.md) and [CLIENT_SIDE_CONFIRMATION.md](./CLIENT_SIDE_CONFIRMATION.md)

## ✨ Key Features

- **Multi-Agent Chat Interface**: Test different specialized agents in isolated conversations
- **Bearer Token Authentication**: OAuth2-style token generation with automatic expiry tracking
- **Agent Configuration**: Configure HTTP endpoints for each agent type independently
- **Conversation Management**: Maintain multiple conversation sessions with persistent history
- **Message Export**: Extract conversations for analysis and documentation
- **Security & Privacy**: Comprehensive data encryption and security information

## 🔒 Security Features

### Encrypted Storage
All credentials and sensitive data are stored using **Spark KV with encryption at rest**:
- Client secrets
- Passwords
- Bearer tokens
- Conversation history
- Agent endpoints

### Security Best Practices
✅ **What this app does right:**
- Encrypted at-rest storage via Spark KV
- User-scoped data isolation
- Short-lived tokens (15-minute expiration)
- Password input fields for visual protection
- No credential logging to console
- HTTPS enforcement for endpoints
- Security warnings on export

⚠️ **Important considerations:**
- **Use test credentials only** - Never store production secrets
- Export files contain plaintext credentials - handle securely
- Browser environment requires credential decryption for use
- Clear data after testing sessions

### Data Stored
The application stores the following data types:
- `saved-tokens` - Token configurations (encrypted)
- `access-token` - Active bearer token (encrypted)
- `agent-endpoints` - Agent HTTP endpoints (encrypted)
- `conversations` - Message history (encrypted)

### Clearing Data
Access the "Security & Privacy" dialog from the sidebar to:
- View detailed security information
- Understand data encryption
- Clear all stored data with one click

## 🚀 Getting Started

### 1. Generate Access Token
1. Click "Token" in the sidebar
2. Enter your OAuth token endpoint URL
3. Provide client ID, client secret, username, and password
4. Click "Generate Token"
5. Save configuration for reuse (optional)

### 2. Configure Agent Endpoints
1. Click "Agents" in the sidebar
2. For each agent type, enter the HTTP POST endpoint
3. Save configurations

### 3. Start Testing
1. Click "New Conversation" and select an agent type
2. Type your message and press Enter
3. View agent responses in real-time
4. Switch agents or create new conversations as needed

## 🔧 Technical Details

### Token Generation
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
```
POST [agent-endpoint]
Authorization: Bearer [access-token]
Content-Type: application/json

{
  "message": "user message"
}
```

## 📋 Agent Types

- **Account Opening**: Customer account creation and onboarding
- **Payment**: Payment processing and transaction handling
- **Moderator**: Content moderation and policy enforcement
- **Card**: Card services and management
- **RAG**: Retrieval-augmented generation for knowledge queries

## 🔧 Troubleshooting

### Certificate Errors (ERR_CERT_AUTHORITY_INVALID)

If you see certificate validation errors:

1. **Visit the endpoint directly in your browser**
   - Navigate to the token/agent endpoint URL
   - Accept the certificate warning
   - Return to the app and try again

2. **Enable "Ignore Certificate Errors" in Token Manager**
   - This documents your intention to use self-signed certs
   - Note: Browser still enforces validation (see guide below)

3. **Install certificate in trust store**
   - For permanent solution with self-signed certificates
   - See [CERTIFICATE_AND_PROXY_GUIDE.md](./CERTIFICATE_AND_PROXY_GUIDE.md)

### Proxy Configuration

- Configure proxy at **system level** (OS/Browser settings)
- The "Proxy URL" field in Token Manager is **documentation only**
- Browser fetch API automatically uses system proxy
- Cannot be overridden by JavaScript for security

### Failed to Fetch Errors

Common causes:
1. Certificate validation failure (see above)
2. CORS headers missing on agent endpoint
3. Network/proxy blocking request
4. Endpoint not accessible from browser

**Solution**: Check browser console (F12) for specific error details

## 🛡️ Security Recommendations

### For Users
1. Use dedicated test/development credentials only
2. Rotate credentials regularly after testing
3. Store exported files in encrypted storage
4. Delete export files when no longer needed
5. Never commit export files to version control
6. Clear stored data when switching projects
7. Use tokens with minimal required permissions

### For Administrators
1. Implement short-lived tokens (current: 15 minutes)
2. Configure rate limiting on agent endpoints
3. Require HTTPS for all endpoints
4. Implement server-side audit logging
5. Provide token revocation mechanisms
6. Restrict endpoint access to authorized sources

## 📖 Documentation

- **[QUICK_REFERENCE_CERT_PROXY.md](./QUICK_REFERENCE_CERT_PROXY.md)** - Quick solutions for certificate and proxy issues
- **[CERTIFICATE_AND_PROXY_GUIDE.md](./CERTIFICATE_AND_PROXY_GUIDE.md)** - Certificate validation and proxy configuration
- **[CLIENT_SIDE_CONFIRMATION.md](./CLIENT_SIDE_CONFIRMATION.md)** - 100% client-side architecture verification
- **[SECURITY.md](./SECURITY.md)** - Comprehensive security documentation
- **[PRD.md](./PRD.md)** - Product requirements and design decisions
- **[FEATURES.md](./FEATURES.md)** - Complete feature list and usage guide

## ⚠️ Important Notes

- This is a **testing and development tool**
- Not intended for production credential management
- Consider dedicated secret management solutions for production
- Ensure compliance with your organization's security policies

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
