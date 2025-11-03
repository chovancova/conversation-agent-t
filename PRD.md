# Planning Guide

A professional testing environment for multiple conversation agents that enables users to interact with specialized HTTP-based agents via Bearer token authentication, evaluate responses, and efficiently test agent behaviors across different domains.

**Experience Qualities**:
1. **Precise** - Clear, focused interface that emphasizes agent configuration and conversation flow with minimal distractions, allowing testers to concentrate on agent behavior
2. **Efficient** - Streamlined workflows for token management, agent switching, and conversation testing that maximize productivity
3. **Professional** - Clean, technical aesthetic that conveys reliability and inspires confidence in the testing process with clear status indicators

**Complexity Level**: Light Application (multiple features with basic state)
  - A focused testing tool with multi-agent conversation management, Bearer token authentication, HTTP endpoint configuration, and persistent message history

## Essential Features

### Multi-Agent Chat Interface
- **Functionality**: Send messages to specialized HTTP-based agents (Account Opening, Payment, Moderator, Card, RAG) and receive responses in a chat format with response time tracking
- **Purpose**: Core testing mechanism for evaluating agent responses across different business domains with real API integration and latency monitoring
- **Trigger**: User types message and presses enter or clicks send button
- **Progression**: User types message → Token validation → HTTP POST to agent endpoint with Bearer auth → Response time tracked → Response appears in chat with latency display → Ready for next message
- **Success criteria**: Messages send instantly, responses appear with proper error handling and response time in milliseconds/seconds, conversation history persists with timing data, different agents accessible, latency visible for performance testing

### Token Manager
- **Functionality**: Generate and manage multiple Bearer authentication token configurations with 15-minute expiration via OAuth2-style endpoint, with encrypted storage, security warnings, and per-conversation token selection
- **Purpose**: Secure authentication for agent communication with automatic expiry tracking, support for multiple credential sets, and user education on credential safety
- **Trigger**: User clicks Token button in sidebar, selects token configuration in conversation header, or when token expires
- **Progression**: Click token button → Dialog opens → Create/manage multiple token configurations → Enter endpoint/credentials for each → Generate tokens → Tokens stored encrypted with expiration → Visual countdown displayed → Select token config per conversation → Security notices shown → Auto-prompt on expiry
- **Success criteria**: Multiple token configurations supported, tokens generate successfully, expiration clearly shown, expired tokens prevent message sending with helpful prompt, users can select different tokens per conversation (especially in split mode), encryption status and security warnings visible

### Agent Configuration
- **Functionality**: Configure HTTP POST endpoints for each specialized agent type (Account Opening, Payment, Moderator, Card, RAG) with protocol-specific validation for Custom HTTP, A2A (Agent-to-Agent), and MCP (Model Context Protocol) configurations. Advanced settings include custom headers, request body templates, and response field mappings with real-time validation.
- **Purpose**: Enable testing against different agent services and environments without code changes, with comprehensive protocol support and validation to ensure correct API integration
- **Trigger**: User clicks Agents button in sidebar or when endpoint not configured
- **Progression**: Click agents button → Dialog opens with tabs → Select agent → Enter endpoint URL and optional custom name → Expand Advanced Configuration → Select protocol type (Custom/A2A/MCP) → Configure protocol-specific headers and body templates → Set response field mappings → Click Validate to check configuration → Save → Configuration validated and used for requests
- **Success criteria**: Endpoints save per agent with protocol settings, validation displays errors/warnings for protocol-specific requirements, helpful prompts when missing or misconfigured, protocol templates auto-populate when switching types, validation passes before saving

### Protocol Validation
- **Functionality**: Real-time validation of agent configurations based on selected protocol (Custom HTTP, A2A, MCP) with specific requirements, error messages, and protocol-specific guidance
- **Purpose**: Ensure agent configurations meet protocol specifications before testing, preventing runtime errors and providing clear guidance on proper formatting
- **Trigger**: User clicks Validate button in agent settings or attempts to save configuration
- **Progression**: User configures agent → Clicks Validate → System checks protocol requirements → Displays validation results (errors/warnings/success) → User fixes issues if needed → Save when valid
- **Success criteria**: 
  - Custom HTTP validates: JSON body template, required fields, content-type header presence
  - A2A validates: Required headers (A2A-Version, A2A-Client-ID), intent field, context structure, version format
  - MCP validates: JSON-RPC 2.0 format, Content-Type: application/json-rpc, required fields (jsonrpc, method, params, id)
  - Clear error messages with specific field references
  - Warning messages for recommended but optional configurations
  - Protocol-specific help documentation displayed inline

### Agent Selection & Switching
- **Functionality**: Create new conversations with specific agent types or switch agent mid-conversation
- **Purpose**: Test different agents efficiently and compare behaviors within same session
- **Trigger**: User clicks new conversation dropdown or changes agent selector in active conversation
- **Progression**: Click new conversation → Select agent type → Fresh session begins → Or change agent dropdown in header → Subsequent messages use new agent
- **Success criteria**: Agent switches immediately, selection persists, clear visual indication of active agent in conversation list

### Conversation Management
- **Functionality**: Start new conversations with agent selection, view conversation history with agent badges, switch between sessions, open split-screen view to test two agents simultaneously, and configure different token configurations per conversation
- **Purpose**: Test multiple scenarios across different agents without losing previous conversation context, compare agent behaviors side-by-side, and test with different authentication credentials simultaneously
- **Trigger**: User clicks new conversation with agent selection or selects previous conversation, or clicks Split button to enable dual conversations, or changes token configuration in conversation header
- **Progression**: Click new conversation → Select agent → Current chat clears → Fresh session begins → Previous conversations accessible in sidebar with agent badges → Click Split button → Second conversation pane opens → Select different conversation for split view → Both conversations active simultaneously → Select different token configurations per pane → Use Columns icon in sidebar to change split conversation → Click X on split pane to close
- **Success criteria**: Conversations save automatically with agent type and token configuration, can be resumed at any time, clear visual distinction, split view shows two conversations independently with separate token configs, each pane can send messages with its own credentials separately, split state and token selections persist across sessions

### Message Export
- **Functionality**: Copy conversation history including agent metadata for analysis or documentation, with security warnings for export files
- **Purpose**: Enable testers to extract conversations for reports, bug tracking, or comparison across agents
- **Trigger**: User clicks export button
- **Progression**: Click export → Conversation formatted with agent info → Copied to clipboard → Confirmation shown
- **Success criteria**: All messages captured accurately with timestamps and agent metadata, format is readable, confirmation feedback immediate

### Security & Privacy Information
- **Functionality**: Display comprehensive security information about data encryption, storage, and best practices with option to clear all data
- **Purpose**: Educate users on how credentials are protected and provide transparency about data handling
- **Trigger**: User clicks Security & Privacy button in sidebar
- **Progression**: Click button → Dialog opens → Shows encryption details, security considerations, stored data list → Option to clear all data → Confirmation and reload
- **Success criteria**: Clear explanation of encryption, visible warnings about test credentials, successful data clearing when requested

### Theme Customization
- **Functionality**: Choose from predefined color palettes or create custom themes with color pickers, plus customize typography with font family, size, and line height controls
- **Purpose**: Allow users to personalize the interface appearance and text rendering to match preferences, corporate branding, or accessibility needs
- **Trigger**: User clicks Theme button in sidebar
- **Progression**: Click theme button → Dialog opens with tabs (Preset Themes, Create Custom, Typography) → Browse presets or create custom colors → Adjust font family (Inter, Roboto, Lora, etc.) → Set font size (Small/Medium/Large) → Choose line height (Compact/Normal/Relaxed) → Preview updates live → Apply theme → Settings persist across sessions
- **Success criteria**: Themes apply instantly, color previews accurate, custom theme editor intuitive with palette picker and manual mode, typography changes visible immediately, all settings persist and load on app restart

## Edge Case Handling

- **Expired Token**: Show warning banner when token expires, disable send button, prompt user to generate new token
- **Missing Endpoint**: Detect unconfigured agent endpoints, show helpful error, open settings dialog automatically
- **Network Errors**: Display error messages inline in chat with detailed HTTP status codes, allow retry
- **Empty Messages**: Disable send button when input is empty to prevent blank submissions
- **Long Messages**: Support multi-line input with proper text wrapping and scrollable message bubbles
- **Protocol Validation Errors**: Display inline validation errors in agent settings with specific field references and required fixes
- **Invalid JSON Templates**: Catch JSON parsing errors in body templates and show syntax error details
- **Missing Protocol Headers**: Highlight missing required headers for A2A (A2A-Version, A2A-Client-ID) and MCP (Content-Type: application/json-rpc)
- **Invalid A2A Version Format**: Validate A2A-Version header matches X.Y format (e.g., "1.0"), show error if invalid
- **Missing MCP Fields**: Validate JSON-RPC 2.0 required fields (jsonrpc: "2.0", method, params, id), show specific missing field
- **Protocol Mismatch**: Warn when endpoint URL pattern doesn't match selected protocol (e.g., A2A without /a2a suffix)
- **Empty Header Values**: Warn about headers with empty keys or values that will be ignored in requests
- **Response Field Mapping**: Validate response field paths are properly formatted (e.g., "data.message" vs "data message")
- **Protocol Template Auto-Fill**: When switching protocols, offer to replace configuration with protocol defaults or keep current
- **Save with Validation Errors**: Prevent saving agent configuration when validation errors exist, allow warnings
- **API Errors**: Display error messages with distinct visual styling (red border/icon) in chat flow
- **Slow Responses**: Show typing indicator during agent processing to maintain user awareness
- **No Conversations**: Display helpful empty state encouraging user to start first conversation
- **Rapid Submissions**: Disable input during active agent response to prevent queue buildup
- **Token Generation Failures**: Show specific error messages from token endpoint with retry option
- **Export Security**: Warn users that exported files contain plaintext credentials and should be handled securely
- **Data Privacy**: Display encryption status and security considerations prominently in token manager
- **Credential Storage**: Inform users that Spark KV provides encryption at rest for all stored credentials
- **Split View Same Conversation**: Prevent selecting the same conversation in both panes (active conversation cannot be selected for split)
- **Split View Auto-Select**: When opening split view, automatically select first available different conversation, or create new one if none exist
- **Split View Delete**: If active or split conversation is deleted, gracefully handle by closing that pane or switching to another conversation
- **Split View Independent Loading**: Show loading indicators independently for each pane when sending messages simultaneously
- **Per-Conversation Token Selection**: Each conversation can use a different token configuration, enabling testing with multiple credentials simultaneously in split mode
- **Token Configuration Fallback**: When no specific token is selected for a conversation, use the global default token configuration
- **Response Time Display**: Show response time for each assistant message in milliseconds (< 1000ms) or seconds (>= 1000ms) with Timer icon
- **Response Time Errors**: Track and display response time even for failed requests to help diagnose timeout issues

## Design Direction

The design should feel like a professional developer tool for API testing, with a clean interface that emphasizes configuration clarity, status awareness, and efficient workflows. Technical and purposeful with clear visual feedback for authentication state and agent selection.

## Future Enhancements (TODO)

### Response Statistics Dashboard
- **Aggregate Metrics**: Display statistics across all conversations including average response time, min/max latency, success/error rates per agent type
- **Performance Trends**: Visualize response time trends over time with charts showing latency patterns for different agents
- **Comparison View**: Side-by-side comparison of agent performance metrics (avg response time, reliability, etc.)
- **Export Statistics**: Export performance data as CSV or JSON for external analysis
- **Session Analytics**: Track conversation duration, message count, and agent switching patterns

### Advanced Token Management
- **Token Pool**: Maintain a pool of pre-generated tokens with automatic rotation
- **Token Analytics**: Track token usage, refresh patterns, and expiration statistics
- **Batch Token Generation**: Generate multiple tokens for different configurations simultaneously

### Enhanced Split View
- **Multi-pane Support**: Support for more than 2 concurrent conversations (3-4 panes)
- **Synchronized Scrolling**: Option to sync scroll position across panes for comparison
- **Diff View**: Highlight differences in responses when same message sent to different agents

## Design Direction (continued)

## Color Selection

The application supports multiple themes with complementary color schemes. Each theme provides a professional technical feel with clear visual hierarchy. The default theme uses a muted blue-gray foundation paired with warm amber accents.

**Available Themes**:
- **Dark**: Modern dark theme with high contrast and cyan-green accents
- **Light**: Clean light theme with soft colors and subtle shadows
- **Corporate Gold**: Professional dark theme with golden accents (formerly Commerzbank, more universal branding)
- **Ocean**: Deep blue tones inspired by the sea with aqua accents
- **Forest**: Rich green tones inspired by nature with emerald highlights
- **Sunset**: Warm orange and pink tones for a vibrant feel
- **Midnight**: Deep purple and blue night tones with violet accents
- **Lavender Dream**: Soft purple and lavender tones for a calming aesthetic
- **Rose Garden**: Elegant pink and rose tones for a warm feel
- **Custom**: User-created themes with personalized color palettes

Default Dark Theme Colors:
- **Primary Color**: Cyan-Green (oklch(0.65 0.20 160)) - Modern, technical feel for primary actions
- **Secondary Colors**: Dark Gray (oklch(0.269 0 0)) for containers
- **Accent Color**: Purple (oklch(0.75 0.15 280)) - Visual interest for highlights and active states
- **Destructive Color**: Red (oklch(0.704 0.191 22.216)) - Clear error indication

## Font Selection

Clean, highly legible typography system that emphasizes readability for extended testing sessions. Users can choose from multiple font families across three categories (sans-serif, serif, monospace), adjust base font size, and control line height for optimal reading comfort.

**Font Options**:
- **Sans Serif**: Inter (default), System UI, Roboto, Open Sans, Poppins, Lato
- **Serif**: Lora, Merriweather, Playfair Display
- **Monospace**: JetBrains Mono, Fira Code, Source Code Pro

**Font Size Options**:
- **Small**: 14px base (0.9x scale) - Compact for dense information
- **Medium**: 16px base (1.0x scale) - Standard comfortable reading
- **Large**: 18px base (1.1x scale) - Enhanced readability

**Line Height Options**:
- **Compact**: 1.4 - Dense text for maximum content
- **Normal**: 1.6 - Balanced readability (default)
- **Relaxed**: 1.8 - Spacious for easier scanning

- **Typographic Hierarchy** (using default settings):
  - H1 (App Title): Inter SemiBold/24px/tight letter-spacing (-0.02em)
  - H2 (Section Headers): Inter Medium/16px/normal letter-spacing
  - Body (Messages): Inter Regular/15px/relaxed line-height (1.6)
  - Small (Timestamps): Inter Regular/13px/muted color
  - Code (Endpoints/Tokens): Inter Regular/12px/monospace with muted background

## Animations

Subtle, purposeful animations that reinforce state changes without slowing down the testing workflow - dialogs should slide in smoothly, agent switches should feel instant, typing indicators should pulse naturally, and token countdown should update fluidly.

- **Purposeful Meaning**: Motion communicates system state (loading, authentication, success, error) rather than decoration, with smooth but quick transitions that feel responsive
- **Hierarchy of Movement**: Message animations are gentle and organic, primary action feedback is immediate and confident, dialog entrances are smooth, while background transitions are nearly invisible

## Component Selection

- **Components**:
  - **ScrollArea** (Messages container, conversation list): Auto-scroll to newest messages with smooth scrolling behavior
  - **Button** (Send, New Chat, Export, Token, Agents): Primary variant for send, outline for utility actions, custom rounded styling
  - **Input/Textarea** (Message input, config forms): Auto-expanding textarea with rounded borders and focus ring
  - **Select** (Agent picker): Dropdown with clear labels for all agent types (Account Opening, Payment, Moderator, Card, RAG)
  - **Dialog** (Token Manager, Agent Settings): Large modal dialogs with clear headers and structured forms
  - **Card** (Message bubbles, token status): Distinct styling for user vs agent messages, error states, and info cards
  - **Separator** (Visual dividers): Subtle lines between conversation list items and header sections
  - **Badge** (Agent indicator): Small chip showing active agent type in conversation list
  - **Tabs** (Agent configuration): Tab interface for configuring multiple agents efficiently
  - **Label** (Form labels): Clear, accessible labels for all inputs

- **Customizations**:
  - Custom message bubble component with different alignments and colors for user/agent/error
  - Token status card with live countdown timer and expiration warning states
  - Agent configuration tabs with endpoint preview and request format examples
  - Typing indicator component with animated dots
  - Conversation list item with hover states, selection indicator, and agent badges
  - Empty state component with helpful onboarding prompts
  - Expired token warning banner with direct action button

- **States**:
  - Send button: Enabled (primary), disabled (muted when empty/loading/expired token)
  - Message input: Default, focused (accent ring), disabled during response
  - Conversation items: Default, hover (subtle background), selected (accent border)
  - Agent select: Clear visual feedback on selection change with agent icons
  - Token status: Valid (green), expiring soon (yellow), expired (red)
  - Settings dialogs: Loading, success, error with appropriate visual feedback

- **Icon Selection**:
  - PaperPlaneRight (Send message) - directional action
  - Plus (New conversation) - additive action
  - Export (Copy conversation) - data export
  - Key (Token manager & token selector) - authentication/security
  - Gear (Agent settings) - configuration
  - Robot (Agent/assistant indicator) - agent identity
  - User (User indicator) - human identity
  - Warning (Error indicator) - failure states and security warnings
  - Clock (Token expiration) - time-based indicators
  - Timer (Response time) - latency measurement indicator
  - CheckCircle (Valid status) - success confirmation
  - XCircle (Invalid status) - error indication
  - ShieldCheck (Security information) - data privacy and encryption status
  - LockKey (Credential protection) - encrypted storage indicator
  - Palette (Theme customization) - color and appearance settings
  - Pencil (Edit custom theme) - theme creation and editing
  - TextAa (Typography settings) - font and text size controls
  - Swatches (Color palette picker) - choosing color schemes
  - Columns (Split view) - enable side-by-side conversations
  - X (Close split) - exit split view mode

- **Spacing**:
  - Container padding: p-6 (24px)
  - Message gap: gap-4 (16px)
  - Input padding: p-3 (12px)
  - Button padding: px-4 py-2 (16px/8px)
  - Section margins: mb-6 (24px)
  - Dialog padding: p-6 (24px) with space-y-4 for form elements

- **Mobile**:
  - Stack sidebar above chat on mobile with collapsible drawer
  - Full-width message input with larger touch target (min-h-12)
  - Simplified header with hamburger menu for conversations
  - Single column layout with conversation list accessible via slide-in panel
  - Token/agent buttons stack vertically on small screens
  - Dialog forms use single column layout on mobile
  - Split view disabled on mobile (screens < 768px) - only single conversation view available for better usability
