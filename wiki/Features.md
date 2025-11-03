# Features

Comprehensive guide to all features in Multi-Agent Tester.

## Core Features

### Multi-Agent Testing

Test multiple specialized conversation agents through a unified interface.

**Supported Agent Types:**

| Agent | Icon | Purpose | Common Use Cases |
|-------|------|---------|------------------|
| **Account Opening** | 💼 | Customer onboarding | Account creation, KYC verification, document submission |
| **Payment** | 💰 | Transaction processing | Payment initiation, transaction status, refunds |
| **Moderator** | 🛡️ | Content moderation | Policy enforcement, content review, flagging |
| **Card** | 💳 | Card services | Card activation, PIN management, limits |
| **RAG** | 📚 | Retrieval-augmented generation | Knowledge queries, document search, Q&A |

**Features:**
- Configure multiple agents simultaneously
- Switch between agents instantly
- Independent conversations per agent
- Agent-specific protocol support

### OAuth2 Authentication

Secure token generation with automatic management.

**Token Generation:**
- Multiple configuration support
- Encrypted credential storage
- One-click token generation
- Automatic expiration tracking

**Token Status Display:**
- Live countdown timer
- Expiration warnings
- Refresh count tracking
- Visual status indicators

**Auto-Refresh:**
- Configurable refresh intervals
- Maximum refresh count (1-9,999)
- Manual refresh capability
- Refresh failure handling

### Split View Testing

Compare two agents side-by-side in real-time.

**Capabilities:**
- Independent token configurations
- Different agent types per panel
- Synchronized or independent messaging
- Response time comparison
- Side-by-side response viewing

**Use Cases:**
1. **Agent Comparison**: Test different agents with same query
2. **Environment Testing**: Compare dev vs. staging responses
3. **Version Testing**: Compare agent versions
4. **Load Testing**: Monitor performance differences

**Split View Controls:**
- Toggle split view on/off
- Resize panels (50/50 split)
- Independent token generation
- Separate conversation histories

### Conversation Management

Comprehensive conversation handling and organization.

**Features:**

#### New Conversation
- Quick agent selection
- Automatic conversation initialization
- Unique conversation IDs
- Timestamp tracking

#### Conversation History
- Persistent storage (encrypted)
- Message timestamps
- Response time metrics
- Search and filter (coming soon)

#### Conversation Actions
- **Export**: Download as JSON
- **Clear**: Remove messages, keep config
- **Delete**: Permanently remove conversation
- **Rename**: Custom conversation names (coming soon)

#### Message Display
- User messages (right-aligned)
- Agent responses (left-aligned)
- Timestamps for each message
- Response time per message
- Markdown support (coming soon)

### Response Metrics

Track performance and analyze agent behavior.

**Metrics Collected:**

| Metric | Description | Display |
|--------|-------------|---------|
| **Response Time** | Time from send to receive | Per message |
| **Total Messages** | Count of exchanges | Per conversation |
| **Average Response Time** | Mean response time | Per conversation |
| **Success Rate** | Successful vs. failed calls | Per session |

**Metric Display:**
- Real-time updates
- Visual indicators
- Historical tracking
- Export capability

## Security Features

### Client-Side Encryption

All sensitive data encrypted at rest.

**Encryption Details:**
- **Algorithm**: AES-256-GCM
- **Key Derivation**: PBKDF2 (100,000 iterations)
- **Encrypted Data**: Tokens, configurations, conversations
- **User Control**: Optional encryption per configuration

**Encryption Features:**
- One-click encryption enable/disable
- Password-based encryption
- Strong key derivation
- Authenticated encryption (AEAD)

See [[Security|Security]] for comprehensive details.

### Zero Server Storage

Complete data privacy with browser-only storage.

**Privacy Features:**
- No server-side data storage
- No cloud synchronization
- No analytics or tracking
- Direct browser-to-agent communication

**Benefits:**
- Complete data control
- No third-party access
- Compliance-friendly
- Maximum privacy

### Security & Privacy Controls

**Data Management:**
- Clear all conversations
- Clear all configurations
- Clear all tokens
- Clear cache and temporary data
- Export data before clearing

**Access Controls:**
- Password-protected encryption
- Device-level security
- Browser profile isolation
- Session timeout (optional)

## User Interface Features

### Theme Customization

Personalize your testing environment.

**Preset Themes (9):**

| Theme | Description | Colors |
|-------|-------------|--------|
| **Dark** | Modern dark mode | Cyan-green accents |
| **Light** | Clean minimal | White background |
| **Corporate Gold** | Professional | Gold highlights |
| **Ocean** | Water-inspired | Blue tones |
| **Forest** | Nature-inspired | Green tones |
| **Sunset** | Warm colors | Orange-pink |
| **Midnight** | Deep night | Deep blue |
| **Lavender Dream** | Soft purple | Lavender tones |
| **Rose Garden** | Pink theme | Rose colors |

**Custom Theme Builder:**
- Background color
- Foreground color
- Primary accent
- Secondary accent
- Border colors
- Card backgrounds
- Syntax highlighting

**Theme Preview:**
- Real-time preview
- Apply instantly
- Save custom themes
- Share theme configs (coming soon)

### Typography Settings

Customize reading experience.

**Font Families:**

**Sans Serif:**
- Inter (default)
- Roboto
- Open Sans
- Lato

**Serif:**
- Merriweather
- Lora
- Playfair Display
- Crimson Text

**Monospace:**
- Fira Code
- JetBrains Mono
- Source Code Pro
- IBM Plex Mono

**Font Sizes:**
- Small: 14px (compact interface)
- Medium: 16px (default, comfortable)
- Large: 18px (improved readability)

**Line Heights:**
- Compact: 1.4 (more content visible)
- Normal: 1.6 (default, balanced)
- Relaxed: 1.8 (easier reading)

### Sound Alerts

Audio notifications for important events.

**Alert Types:**

| Time Remaining | Alert | Purpose |
|----------------|-------|---------|
| 10 minutes | Warning | Advance notice |
| 5 minutes | Warning | Prepare refresh |
| 2 minutes | Alert | Urgent notice |
| 1 minute | Alert | Critical warning |
| 30 seconds | Alert | Imminent expiry |
| 10 seconds | Alert | Last warning |

**Features:**
- Enable/disable per session
- Volume control (browser-level)
- Multiple alert sounds
- Visual + audio alerts

**Use Cases:**
- Multi-tasking during tests
- Long testing sessions
- Background testing
- Preventing expiration

### Keyboard Shortcuts

Efficient navigation and control.

**Global Shortcuts:**
- `Ctrl/Cmd + N`: New conversation
- `Ctrl/Cmd + Enter`: Send message
- `Ctrl/Cmd + /`: Toggle sidebar
- `Ctrl/Cmd + K`: Open command palette (coming soon)
- `Esc`: Close dialogs

**Navigation:**
- `Tab`: Focus next element
- `Shift + Tab`: Focus previous element
- `Arrow Keys`: Navigate lists
- `Enter`: Select/activate

**Message Input:**
- `Enter`: Send message (default)
- `Shift + Enter`: New line
- `Ctrl/Cmd + K`: Clear input
- `Ctrl/Cmd + V`: Paste (with formatting)

**Customization:**
- Enable/disable shortcuts
- Configure behavior
- Modifier key preferences

## Protocol Features

### Custom HTTP Protocol

Standard REST API with Bearer token authentication.

**Features:**
- Simple request/response format
- Standard HTTP headers
- JSON payload
- Bearer token authentication
- Custom headers support (coming soon)

**Configuration:**
- Endpoint URL
- HTTP method (POST)
- Content-Type
- Authorization header

See [[API Reference|API-Reference]] for protocol details.

### A2A (Agent-to-Agent) Protocol

Specialized inter-agent communication protocol.

**Features:**
- Version negotiation
- Client identification
- Context passing
- Intent-based routing
- Session management

**Headers:**
- `A2A-Version`: Protocol version
- `A2A-Client-ID`: Client identifier
- Custom headers: Extensible

**Payload:**
- Intent field
- Context object
- Message content
- Metadata support

### MCP (Model Context Protocol)

JSON-RPC 2.0 based protocol for model interactions.

**Features:**
- JSON-RPC 2.0 compliance
- Method-based routing
- Parameter passing
- Error handling
- ID tracking

**Methods:**
- `agent.query`: Send query
- `agent.context`: Set context
- `agent.reset`: Reset session
- Custom methods: Extensible

## Advanced Features

### Data Export/Import

**Export Capabilities:**
- Individual conversations (JSON)
- All configurations (JSON)
- Token settings (JSON)
- Complete backup (JSON)

⚠️ **Warning**: Exports are NOT encrypted!

**Import Capabilities:**
- Configuration files
- Token settings
- Bulk import
- Migration support

**Export Format:**
```json
{
  "version": "1.0",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "conversations": [...],
    "configurations": [...],
    "settings": {...}
  }
}
```

### Performance Optimization

**Features:**
- Lazy loading of conversations
- Virtualized message lists
- Debounced search
- Optimized rendering
- Asset optimization

**Settings:**
- Reduce animations
- Disable blur effects
- Limit history size
- Clear cache automatically

### Accessibility

**Features:**
- ARIA labels
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus indicators

**WCAG Compliance:**
- Level AA support
- Color contrast ratios
- Semantic HTML
- Alt text for images

### Responsive Design

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px
- Wide: > 1440px

**Mobile Features:**
- Touch-optimized interface
- Swipe gestures
- Mobile-first design
- Responsive typography

## Upcoming Features

See [TODO.md](https://github.com/chovancova/conversation-agent-t/blob/main/docs/TODO.md) for planned features:

- 🔍 Search and filter conversations
- 📊 Advanced analytics dashboard
- 🔗 Webhook support
- 📝 Markdown rendering in messages
- 🎨 Theme marketplace
- 🔄 Cloud backup (optional)
- 👥 Team collaboration features
- 📱 Mobile app
- 🔌 Plugin system
- 🌐 Internationalization (i18n)

## Feature Requests

Have an idea for a new feature?
- 🐛 [Open an issue](https://github.com/chovancova/conversation-agent-t/issues)
- 💬 Tag it as "feature-request"
- 📋 Describe the use case
- ⭐ Vote on existing requests

---

**Previous**: [[Security]]  
**Next**: [[API Reference|API-Reference]]
