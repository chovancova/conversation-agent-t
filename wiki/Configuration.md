# Configuration

This guide covers how to configure Multi-Agent Tester for testing your conversation agents.

## Overview

Multi-Agent Tester requires two main configurations:
1. **Token Configuration** - OAuth2 authentication setup
2. **Agent Configuration** - Agent endpoint configuration

## Token Configuration

### Creating a Token Configuration

1. Click the **"Token"** button in the sidebar
2. Click **"Create New Configuration"**
3. Fill in the required fields
4. Save the configuration

### Token Configuration Fields

#### Basic Fields

| Field | Description | Required | Example |
|-------|-------------|----------|---------|
| **Name** | Configuration identifier | Yes | "Dev Environment" |
| **Token Endpoint** | OAuth2 token URL | Yes | `https://auth.example.com/oauth/token` |
| **Client ID** | OAuth2 client identifier | Yes | `my-client-id` |
| **Client Secret** | OAuth2 client secret | Yes | `my-secret-key` |
| **Username** | User account username | Yes | `test-user` |
| **Password** | User account password | Yes | `test-password` |

#### Security Options

- **Encrypt Before Saving**: Encrypts the configuration using AES-256-GCM
  - ✅ Highly recommended for all configurations
  - Requires encryption password
  - Uses PBKDF2 with 100,000 iterations

### Managing Token Configurations

#### List All Configurations
1. Open Token Manager
2. View all saved configurations
3. See encryption status for each

#### Edit Configuration
1. Select configuration from list
2. Click **"Edit"**
3. Modify fields as needed
4. Save changes

#### Delete Configuration
1. Select configuration from list
2. Click **"Delete"**
3. Confirm deletion
4. ⚠️ This action cannot be undone

#### Import/Export
- **Export**: Download configuration as JSON (plaintext)
- **Import**: Upload JSON configuration file
- ⚠️ Exported files are NOT encrypted - handle securely

### Token Generation Settings

#### Auto-Refresh
Automatically refresh tokens before expiration:

```
Settings → Auto-Refresh Token
- Enable/Disable toggle
- Max Refresh Count: 1 to 9,999
- Current Count tracking
```

**When to use:**
- ✅ Long testing sessions
- ✅ Batch testing scenarios
- ✅ Continuous monitoring
- ❌ Quick one-off tests

#### Audio Alerts
Sound notifications for token expiration:

```
Settings → Enable Sound Alerts
- 10 minutes warning
- 5 minutes warning
- 2 minutes warning
- 1 minute warning
- 30 seconds warning
- 10 seconds warning
```

**Benefits:**
- Never miss token expiration
- Multi-task while testing
- Audible feedback

## Agent Configuration

### Supported Agent Types

Multi-Agent Tester supports five agent types:

| Agent Type | Icon | Use Case |
|------------|------|----------|
| **Account Opening** | 💼 | Customer onboarding, account creation |
| **Payment** | 💰 | Payment processing, transactions |
| **Moderator** | 🛡️ | Content moderation, policy enforcement |
| **Card** | 💳 | Card services, card operations |
| **RAG** | 📚 | Retrieval-augmented generation queries |

### Configuring an Agent

1. Click **"Agents"** button in sidebar
2. Select agent type from dropdown
3. Enter agent endpoint URL
4. Select protocol type
5. Click **"Save"**

### Agent Configuration Fields

| Field | Description | Required |
|-------|-------------|----------|
| **Agent Type** | Type of agent to configure | Yes |
| **Endpoint URL** | HTTP POST endpoint | Yes |
| **Protocol** | Communication protocol | Yes |

### Protocol Support

Multi-Agent Tester supports three protocols:

#### 1. Custom HTTP

Standard REST API with Bearer token authentication.

**Request Format:**
```http
POST {endpoint_url}
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "user message text"
}
```

**Response Format:**
```json
{
  "response": "agent response text"
}
```

**Use when:**
- Standard REST API
- Simple request/response format
- Bearer token authentication

#### 2. A2A (Agent-to-Agent)

Specialized protocol for agent-to-agent communication.

**Request Format:**
```http
POST {endpoint_url}
Authorization: Bearer {token}
A2A-Version: 1.0
A2A-Client-ID: {client-id}
Content-Type: application/json

{
  "intent": "query",
  "context": {
    "session": "session-id",
    "user": "user-id"
  },
  "message": "user message text"
}
```

**Additional Headers:**
- `A2A-Version`: Protocol version
- `A2A-Client-ID`: Client identifier

**Use when:**
- Agent-to-agent communication
- Context tracking required
- Intent-based routing

#### 3. MCP (Model Context Protocol)

JSON-RPC 2.0 based protocol for model interactions.

**Request Format:**
```http
POST {endpoint_url}
Authorization: Bearer {token}
Content-Type: application/json-rpc

{
  "jsonrpc": "2.0",
  "method": "agent.query",
  "params": {
    "message": "user message text",
    "context": {}
  },
  "id": "unique-request-id"
}
```

**Response Format:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "response": "agent response text"
  },
  "id": "unique-request-id"
}
```

**Use when:**
- JSON-RPC 2.0 protocol
- Model Context Protocol compliant
- Structured request/response needed

### Managing Agent Configurations

#### View All Agents
1. Open Agents Manager
2. See all configured agents
3. View endpoint and protocol for each

#### Edit Agent
1. Select agent type
2. Modify endpoint or protocol
3. Save changes

#### Delete Agent
1. Select agent type
2. Click **"Delete"**
3. Confirm deletion

## Split View Configuration

Split view allows testing two agents simultaneously with independent configurations.

### Enabling Split View

1. Click **"Split View"** toggle in toolbar
2. Screen splits into left and right panels
3. Each panel operates independently

### Panel Configuration

Each panel can have:
- ✅ Different token configurations
- ✅ Different agent types
- ✅ Independent conversations
- ✅ Separate token status

### Use Cases

**Compare Agent Responses:**
```
Left Panel: Payment Agent
Right Panel: Account Opening Agent
Send same query to both
```

**Test Different Environments:**
```
Left Panel: Dev environment token
Right Panel: Staging environment token
Same agent type, different backends
```

**Version Comparison:**
```
Left Panel: Agent v1.0
Right Panel: Agent v2.0
Compare behavior changes
```

## Theme Configuration

### Preset Themes

Choose from 9 professionally designed themes:

| Theme | Description | Best For |
|-------|-------------|----------|
| **Dark** | Modern dark with cyan-green accents | Default, general use |
| **Light** | Clean and minimal | Bright environments |
| **Corporate Gold** | Professional with gold highlights | Business presentations |
| **Ocean** | Blue ocean inspired | Calm, focused work |
| **Forest** | Green nature inspired | Reduced eye strain |
| **Sunset** | Warm orange/pink tones | Evening work |
| **Midnight** | Deep blue midnight | Late night coding |
| **Lavender Dream** | Purple/lavender palette | Creative work |
| **Rose Garden** | Rose pink theme | Personal preference |

### Custom Themes

Create your own theme:
1. Open **Preferences** → **Theme**
2. Click **"Custom Theme"**
3. Configure colors:
   - Background
   - Foreground
   - Primary
   - Secondary
   - Accent
   - Muted
   - Border
4. Save custom theme

### Typography Settings

**Font Families:**
- Sans Serif: Inter, Roboto, Open Sans, Lato
- Serif: Merriweather, Lora, Playfair Display, Crimson Text
- Monospace: Fira Code, JetBrains Mono, Source Code Pro, IBM Plex Mono

**Font Sizes:**
- Small: 14px (compact)
- Medium: 16px (default)
- Large: 18px (comfortable)

**Line Heights:**
- Compact: 1.4
- Normal: 1.6 (default)
- Relaxed: 1.8

## Advanced Settings

### Performance Optimization

```
Preferences → Advanced
- Reduce animations
- Disable blur effects
- Limit conversation history
```

### Keyboard Shortcuts

Enable/disable keyboard navigation:
- `Ctrl/Cmd + N`: New conversation
- `Ctrl/Cmd + Enter`: Send message
- `Ctrl/Cmd + /`: Toggle sidebar
- `Esc`: Close dialogs

### Data Management

**Security & Privacy:**
1. Open **Preferences** → **Security & Privacy**
2. Options:
   - Clear all conversations
   - Clear all configurations
   - Clear all tokens
   - Export all data
   - Clear cache

⚠️ **Warning**: Clearing data is permanent and cannot be undone!

## Environment Variables

For deployment, configure:

```bash
# Optional: Custom base URL
VITE_BASE_URL=/app

# Optional: API endpoint prefix
VITE_API_PREFIX=/api
```

These are optional and only needed for specific deployment scenarios.

## Configuration Best Practices

### Security
1. ✅ Always enable encryption for token configurations
2. ✅ Use strong encryption passwords
3. ✅ Never commit configuration files to version control
4. ✅ Use test credentials only
5. ✅ Clear data after testing sessions

### Organization
1. Use descriptive names for configurations
2. Create separate configs for each environment
3. Group related agents together
4. Document custom protocol requirements

### Testing
1. Verify configurations with simple test messages
2. Check token expiration and auto-refresh
3. Test each protocol type separately
4. Monitor response times and performance

## Troubleshooting Configuration

See [[Troubleshooting|Troubleshooting]] page for common configuration issues and solutions.

## Next Steps

✅ Configuration complete! Now:
1. Start [[Getting Started#Step 5: Start Testing|testing your agents]]
2. Explore [[Features|advanced features]]
3. Review [[Security|security best practices]]

---

**Previous**: [[Installation|Installation]]  
**Next**: [[Security|Security]]
