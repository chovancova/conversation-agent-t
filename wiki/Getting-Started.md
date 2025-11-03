# Getting Started

> Get started with Multi-Agent Tester in 5 minutes

## Prerequisites

Before you begin, ensure you have:
- ✅ Modern web browser (Chrome, Firefox, Safari, Edge)
- ✅ Access to OAuth2 token endpoint
- ✅ Agent API endpoints with Bearer token authentication
- ✅ Test credentials (never use production credentials!)

## Quick Start Steps

### Step 1: Access the Application

**Option A: Use Hosted Version** (Recommended)
- Visit your deployed instance URL
- No installation required!

**Option B: Run Locally**
```bash
# Clone the repository
git clone https://github.com/chovancova/conversation-agent-t.git
cd conversation-agent-t

# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:5173
```

See [[Installation|Installation]] for detailed setup instructions.

### Step 2: Configure Token Generation

1. Click the **"Token"** button in the left sidebar
2. Click **"Create New Configuration"**
3. Fill in the token configuration:
   - **Name**: Give your configuration a descriptive name (e.g., "Dev Environment")
   - **Token Endpoint**: Your OAuth2 token endpoint URL
   - **Client ID**: Your OAuth2 client ID
   - **Client Secret**: Your OAuth2 client secret
   - **Username**: Your test user username
   - **Password**: Your test user password
4. ✅ Enable **"Encrypt Before Saving"** (highly recommended)
5. Click **"Save Configuration"**

💡 **Tip**: You can create multiple token configurations for different environments (dev, staging, etc.)

### Step 3: Configure Agent Endpoints

1. Click the **"Agents"** button in the left sidebar
2. Select an agent type:
   - 💼 **Account Opening** - Customer onboarding workflows
   - 💰 **Payment** - Transaction processing
   - 🛡️ **Moderator** - Content moderation
   - 💳 **Card** - Card services
   - 📚 **RAG** - Retrieval-augmented generation
3. Enter the agent's HTTP POST endpoint URL
4. Select protocol type:
   - **Custom HTTP** (standard Bearer token)
   - **A2A** (Agent-to-Agent protocol)
   - **MCP** (Model Context Protocol)
5. Click **"Save"**

See [[Configuration|Configuration]] for detailed configuration options.

### Step 4: Generate Authentication Token

1. Click the **"Generate Token"** button in the top toolbar
2. Wait for token generation to complete
3. Token status will appear in the top-right corner showing:
   - ✅ Token expiration countdown
   - 🔄 Auto-refresh status (if enabled)
   - 🔔 Audio alerts (if enabled)

### Step 5: Start Testing

1. Click the **"New Conversation"** button
2. Select the agent type you configured
3. Type your message in the input field
4. Press **Enter** or click **Send**
5. View the agent's response with timing metrics

## Essential Features

### Split View Testing

Test two agents simultaneously:
1. Click **"Split View"** toggle in the toolbar
2. Configure separate tokens for left and right panels (optional)
3. Each panel operates independently
4. Compare responses side-by-side in real-time

### Conversation Management

- **New Conversation**: Start fresh with a selected agent
- **Export Conversation**: Save conversation history as JSON
- **Clear History**: Remove conversation from storage
- **Delete Conversation**: Remove conversation permanently

### Token Auto-Refresh

Keep your testing session alive:
1. Open **Token Manager** → **Settings**
2. Enable **"Auto-Refresh Token"**
3. Set maximum refresh count (1-9,999)
4. Configure audio alerts for expiration warnings

## Common Workflows

### Testing a Single Agent

```
1. Configure token → Generate token
2. Configure agent endpoint
3. New conversation → Select agent
4. Send test messages
5. Review responses and metrics
```

### Comparing Multiple Agents

```
1. Enable Split View
2. Configure two different agent endpoints
3. Generate tokens for both panels
4. Send same message to both agents
5. Compare responses side-by-side
```

### Long Testing Sessions

```
1. Enable token auto-refresh
2. Set high refresh count (e.g., 100)
3. Enable audio alerts
4. Test continuously without interruption
```

## Security Best Practices

⚠️ **Important Guidelines:**

1. **Use Test Credentials Only**
   - Never use production secrets
   - Create dedicated test accounts
   
2. **Enable Encryption**
   - Always encrypt token configurations
   - Use strong encryption passwords
   
3. **Clear Data After Testing**
   - Use Security & Privacy dialog to clear sensitive data
   - Export files contain plaintext - handle securely
   
4. **Lock Your Device**
   - Lock screen when stepping away
   - Use browser profiles to isolate projects

See [[Security|Security]] for comprehensive security documentation.

## Next Steps

Now that you're up and running:

- 📖 Explore [[Features|Features]] documentation
- 🔐 Review [[Security|Security]] best practices
- 🎨 Customize themes and appearance
- ⚙️ Learn about [[API Reference|API-Reference]]
- 🏗️ Understand the [[Architecture|Architecture]]

## Troubleshooting

Having issues? Check the [[Troubleshooting|Troubleshooting]] page for common problems and solutions.

---

**Previous**: [[Home]]  
**Next**: [[Installation|Installation]]
