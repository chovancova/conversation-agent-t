# Architecture

Technical architecture and implementation details of Multi-Agent Tester.

## Overview

Multi-Agent Tester is a client-side React application with zero server-side dependencies. All processing, storage, and encryption happen in the browser.

## Technology Stack

### Frontend Framework

**React 19**
- Latest React features
- Concurrent rendering
- Automatic batching
- Suspense for data fetching
- Server Components ready (not used)

**TypeScript 5.7**
- Type safety throughout
- Enhanced IDE support
- Compile-time error detection
- Better code documentation

### Build Tools

**Vite 6**
- Lightning-fast HMR
- Optimized production builds
- ES modules support
- Plugin ecosystem
- Asset optimization

**Features:**
- ⚡ Fast cold start
- 🔥 Instant hot reload
- 📦 Optimized bundling
- 🌳 Tree-shaking
- 💪 TypeScript support

### UI Framework

**Tailwind CSS 4**
- Utility-first CSS
- JIT compilation
- Custom theme support
- Responsive design
- Dark mode support

**Radix UI**
- Accessible primitives
- Unstyled components
- ARIA compliant
- Keyboard navigation
- Focus management

**shadcn/ui**
- Pre-built components
- Customizable styling
- Copy-paste components
- Tailwind integration
- TypeScript support

### Libraries

**UI & Animation:**
- **Lucide React** - Icon library
- **Phosphor Icons** - Additional icons
- **Framer Motion** - Animations
- **clsx** - Conditional classes
- **tailwind-merge** - Class merging

**State Management:**
- **React Hooks** - Local state
- **Context API** - Global state
- **TanStack Query** - Server state (ready, not used)

**Security:**
- **Web Crypto API** - Encryption
- **PBKDF2** - Key derivation
- **AES-256-GCM** - Symmetric encryption

**Storage:**
- **Spark KV** - Encrypted key-value store
- **IndexedDB** - Browser database (via Spark KV)
- **localStorage** - Non-sensitive preferences

## Application Structure

```
conversation-agent-t/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── TokenManager.tsx     # Token management
│   │   ├── TokenStatus.tsx      # Token status display
│   │   ├── AgentSelector.tsx    # Agent configuration
│   │   ├── ChatInterface.tsx    # Chat UI
│   │   ├── SecurityInfo.tsx     # Security dialog
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── use-countdown.ts     # Token countdown
│   │   ├── use-kv.ts            # Spark KV wrapper
│   │   ├── use-toast.ts         # Toast notifications
│   │   └── ...
│   ├── lib/                # Utility functions
│   │   ├── encryption.ts        # Crypto operations
│   │   ├── types.ts             # TypeScript types
│   │   ├── utils.ts             # Helper functions
│   │   ├── api.ts               # API client
│   │   └── ...
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── docs/                   # Documentation
├── wiki/                   # Wiki pages
└── dist/                   # Build output
```

## Component Architecture

### Component Hierarchy

```
App
├── TokenStatus            # Token expiration display
├── Sidebar                # Navigation sidebar
│   ├── TokenButton        # Token management trigger
│   ├── AgentsButton       # Agents config trigger
│   ├── PreferencesButton  # Settings trigger
│   └── SecurityButton     # Security dialog trigger
├── MainContent            # Primary content area
│   ├── SplitToggle        # Split view control
│   ├── ChatPanel          # Left panel (or full width)
│   │   ├── ConversationHeader
│   │   ├── MessageList
│   │   │   ├── UserMessage
│   │   │   └── AgentMessage
│   │   └── MessageInput
│   └── ChatPanel (optional) # Right panel
└── Dialogs                # Modal dialogs
    ├── TokenManagerDialog
    ├── AgentConfigDialog
    ├── PreferencesDialog
    └── SecurityInfoDialog
```

### Key Components

#### TokenManager
**Responsibilities:**
- Token configuration CRUD
- Token generation
- Token refresh management
- Auto-refresh control
- Encryption/decryption

**State:**
- Configurations list
- Active configuration
- Token status
- Refresh count

#### ChatInterface
**Responsibilities:**
- Message display
- User input handling
- Agent communication
- Response time tracking
- Conversation persistence

**State:**
- Conversation history
- Current agent
- Loading state
- Error state

#### SecurityInfo
**Responsibilities:**
- Security documentation
- Data management
- Clear data operations
- Export functionality

## Data Flow

### Message Flow

```
User Input
    ↓
MessageInput Component
    ↓
ChatInterface Component
    ↓
API Client (lib/api.ts)
    ↓
Agent Endpoint
    ↓
Response Processing
    ↓
MessageList Update
    ↓
Encrypted Storage
```

### Token Flow

```
User Configuration
    ↓
TokenManager Component
    ↓
Encrypt (if enabled)
    ↓
Spark KV Storage
    ↓
Token Generation Request
    ↓
OAuth2 Endpoint
    ↓
Token Response
    ↓
Encrypt Token
    ↓
Store + Display Status
    ↓
Auto-Refresh (if enabled)
```

## State Management

### Local State (useState)

Used for:
- Component-specific UI state
- Form inputs
- Toggle states
- Loading indicators

**Example:**
```typescript
const [isOpen, setIsOpen] = useState(false);
const [message, setMessage] = useState('');
```

### Global State (Context API)

Used for:
- Theme preferences
- User settings
- Active conversations
- Token status

**Example:**
```typescript
const ThemeContext = createContext<ThemeContextType>(null);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### Persistent State (Spark KV)

Used for:
- Token configurations
- Agent configurations
- Conversation history
- User preferences

**Example:**
```typescript
import { useKV } from './hooks/use-kv';

const { data, isLoading } = useKV('token-configs');
```

## Security Architecture

### Encryption Layer

```
┌─────────────────────────────────────────┐
│         User Data (Plaintext)           │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│    Password → PBKDF2 → Encryption Key   │
│        (100,000 iterations, SHA-256)    │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│      AES-256-GCM Encryption             │
│   (Key + IV + Plaintext → Ciphertext)  │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│    Encrypted Data Storage (Spark KV)    │
│         (IndexedDB in browser)          │
└─────────────────────────────────────────┘
```

### Encryption Implementation

**Location:** `src/lib/encryption.ts`

**Functions:**
- `deriveKey()`: PBKDF2 key derivation
- `encrypt()`: AES-256-GCM encryption
- `decrypt()`: AES-256-GCM decryption
- `generateSalt()`: Random salt generation
- `generateIV()`: Random IV generation

**Example:**
```typescript
import { encrypt, decrypt, deriveKey } from './lib/encryption';

// Encryption
const password = 'user-password';
const data = { clientId: 'abc', secret: 'xyz' };
const encrypted = await encrypt(data, password);

// Decryption
const decrypted = await decrypt(encrypted, password);
```

### Storage Security

**Spark KV Features:**
- Encrypted by default (optional)
- User-scoped data
- Automatic encryption/decryption
- IndexedDB backed
- Promise-based API

**Storage Structure:**
```
IndexedDB
├── token-configs      # Encrypted token configurations
├── agent-configs      # Encrypted agent endpoints
├── conversations      # Encrypted conversation history
└── preferences        # Non-encrypted user preferences
```

## API Communication

### API Client

**Location:** `src/lib/api.ts`

**Features:**
- Protocol abstraction
- Bearer token authentication
- Error handling
- Response time tracking
- Retry logic (optional)

### Protocol Handlers

**Custom HTTP:**
```typescript
async function sendCustomHttp(
  endpoint: string,
  token: string,
  message: string
): Promise<string> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
  
  const data = await response.json();
  return data.response;
}
```

**A2A Protocol:**
```typescript
async function sendA2A(
  endpoint: string,
  token: string,
  message: string,
  context: any
): Promise<string> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'A2A-Version': '1.0',
      'A2A-Client-ID': clientId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'query',
      context,
      message,
    }),
  });
  
  const data = await response.json();
  return data.response;
}
```

**MCP Protocol:**
```typescript
async function sendMCP(
  endpoint: string,
  token: string,
  message: string
): Promise<string> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json-rpc',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'agent.query',
      params: { message },
      id: generateId(),
    }),
  });
  
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message);
  }
  return data.result.response;
}
```

## Performance Optimization

### Build Optimization

**Vite Configuration:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', ...],
        },
      },
    },
    minify: 'terser',
    sourcemap: true,
  },
});
```

**Optimizations:**
- Code splitting
- Tree shaking
- Asset optimization
- Lazy loading
- Compression

### Runtime Optimization

**React Optimizations:**
- `useMemo` for expensive calculations
- `useCallback` for function memoization
- `React.memo` for component memoization
- Virtualized lists for long conversations
- Debounced search and input

**Example:**
```typescript
const sortedMessages = useMemo(
  () => messages.sort((a, b) => a.timestamp - b.timestamp),
  [messages]
);

const handleSend = useCallback(
  async (message: string) => {
    await sendMessage(message);
  },
  [sendMessage]
);
```

## Testing Strategy

### Current State

**Manual Testing:**
- UI/UX testing
- Token generation flow
- Agent communication
- Encryption/decryption
- Error scenarios

### Planned Additions

**Unit Tests:**
- Utility functions
- Encryption functions
- API client
- State management

**Integration Tests:**
- Component interactions
- Data flow
- Storage operations
- API communication

**E2E Tests:**
- Complete user workflows
- Token management
- Conversation flow
- Security features

## Deployment Architecture

### Static Hosting

Multi-Agent Tester is a static single-page application (SPA).

**Hosting Options:**
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront
- Any static web host

### Build Process

```bash
# Development
npm run dev     # Start dev server (port 5173)

# Production
npm run build   # Build to dist/
npm run preview # Test production build (port 4173)
```

### Deployment Configuration

**For SPA routing:**
```
All routes → /index.html
```

**Example (Netlify):**
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Browser Compatibility

### Minimum Requirements

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Required APIs

- Web Crypto API (encryption)
- IndexedDB (storage)
- localStorage (preferences)
- Fetch API (HTTP requests)
- ES Modules (JavaScript)

### Polyfills

Not required for supported browsers.

## Monitoring & Debugging

### Development Tools

**React DevTools:**
- Component hierarchy
- Props inspection
- State debugging
- Performance profiling

**Vite DevTools:**
- Module graph
- Build analysis
- HMR debugging

### Error Handling

**Global Error Boundary:**
```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
    // Log to error service (optional)
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### Logging

**Console Logging:**
- Development: Verbose logging
- Production: Error logging only

**Future: Error Tracking**
- Sentry integration (optional)
- Custom error service
- User-controlled reporting

## Future Enhancements

### Architecture Improvements

1. **Server Components**
   - React Server Components
   - Streaming SSR
   - Progressive enhancement

2. **State Management**
   - Zustand or Jotai
   - Better state organization
   - Improved performance

3. **Testing**
   - Comprehensive test suite
   - CI/CD integration
   - Automated testing

4. **Observability**
   - Performance monitoring
   - Error tracking
   - User analytics (opt-in)

### Technical Debt

See [TODO.md](https://github.com/chovancova/conversation-agent-t/blob/main/docs/TODO.md) for:
- ESLint configuration migration
- Bundle size optimization
- Mobile responsiveness improvements
- Accessibility enhancements

## Additional Resources

- **[React Documentation](https://react.dev/)**
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)**
- **[Vite Guide](https://vitejs.dev/guide/)**
- **[Tailwind CSS Docs](https://tailwindcss.com/docs)**

---

**Previous**: [[API Reference|API-Reference]]  
**Next**: [[Contributing|Contributing]]
