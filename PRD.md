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
- **Functionality**: Send messages to specialized HTTP-based agents (Account Opening, Payment, Moderator, Card, RAG) and receive responses in a chat format
- **Purpose**: Core testing mechanism for evaluating agent responses across different business domains with real API integration
- **Trigger**: User types message and presses enter or clicks send button
- **Progression**: User types message → Token validation → HTTP POST to agent endpoint with Bearer auth → Response appears in chat → Ready for next message
- **Success criteria**: Messages send instantly, responses appear with proper error handling, conversation history persists, different agents accessible

### Token Manager
- **Functionality**: Generate and manage Bearer authentication tokens with 15-minute expiration via OAuth2-style endpoint
- **Purpose**: Secure authentication for agent communication with automatic expiry tracking
- **Trigger**: User clicks Token button in sidebar or when token expires
- **Progression**: Click token button → Dialog opens → Enter endpoint/credentials → Generate token → Token stored with expiration → Visual countdown displayed → Auto-prompt on expiry
- **Success criteria**: Token generates successfully, expiration clearly shown, expired tokens prevent message sending with helpful prompt

### Agent Configuration
- **Functionality**: Configure HTTP POST endpoints for each specialized agent type (Account Opening, Payment, Moderator, Card, RAG)
- **Purpose**: Enable testing against different agent services and environments without code changes
- **Trigger**: User clicks Agents button in sidebar or when endpoint not configured
- **Progression**: Click agents button → Dialog opens with tabs → Select agent → Enter endpoint URL → Save → Endpoint used for subsequent requests
- **Success criteria**: Endpoints save per agent, clear visual indication of configuration status, helpful prompts when missing

### Agent Selection & Switching
- **Functionality**: Create new conversations with specific agent types or switch agent mid-conversation
- **Purpose**: Test different agents efficiently and compare behaviors within same session
- **Trigger**: User clicks new conversation dropdown or changes agent selector in active conversation
- **Progression**: Click new conversation → Select agent type → Fresh session begins → Or change agent dropdown in header → Subsequent messages use new agent
- **Success criteria**: Agent switches immediately, selection persists, clear visual indication of active agent in conversation list

### Conversation Management
- **Functionality**: Start new conversations with agent selection, view conversation history with agent badges, and switch between sessions
- **Purpose**: Test multiple scenarios across different agents without losing previous conversation context
- **Trigger**: User clicks new conversation with agent selection or selects previous conversation
- **Progression**: Click new conversation → Select agent → Current chat clears → Fresh session begins → Previous conversations accessible in sidebar with agent badges
- **Success criteria**: Conversations save automatically with agent type, can be resumed at any time, clear visual distinction

### Message Export
- **Functionality**: Copy conversation history including agent metadata for analysis or documentation
- **Purpose**: Enable testers to extract conversations for reports, bug tracking, or comparison across agents
- **Trigger**: User clicks export button
- **Progression**: Click export → Conversation formatted with agent info → Copied to clipboard → Confirmation shown
- **Success criteria**: All messages captured accurately with timestamps and agent metadata, format is readable, confirmation feedback immediate

## Edge Case Handling

- **Expired Token**: Show warning banner when token expires, disable send button, prompt user to generate new token
- **Missing Endpoint**: Detect unconfigured agent endpoints, show helpful error, open settings dialog automatically
- **Network Errors**: Display error messages inline in chat with detailed HTTP status codes, allow retry
- **Empty Messages**: Disable send button when input is empty to prevent blank submissions
- **Long Messages**: Support multi-line input with proper text wrapping and scrollable message bubbles
- **API Errors**: Display error messages with distinct visual styling (red border/icon) in chat flow
- **Slow Responses**: Show typing indicator during agent processing to maintain user awareness
- **No Conversations**: Display helpful empty state encouraging user to start first conversation
- **Rapid Submissions**: Disable input during active agent response to prevent queue buildup
- **Token Generation Failures**: Show specific error messages from token endpoint with retry option

## Design Direction

The design should feel like a professional developer tool for API testing, with a clean interface that emphasizes configuration clarity, status awareness, and efficient workflows. Technical and purposeful with clear visual feedback for authentication state and agent selection.

## Color Selection

Complementary (opposite colors) - A muted blue-gray foundation paired with warm amber accents creates a professional technical feel while the accent provides clear visual hierarchy for interactive elements and agent responses. Additional destructive colors for error states.

- **Primary Color**: Deep Blue-Gray (oklch(0.35 0.02 250)) - Conveys technical sophistication and stability, used for primary actions and user messages
- **Secondary Colors**: Cool Gray (oklch(0.92 0.005 250)) for subtle backgrounds and containers, Light Blue-Gray (oklch(0.75 0.015 250)) for secondary actions
- **Accent Color**: Warm Amber (oklch(0.75 0.15 65)) - Draws attention to agent responses and key interactive moments, creating warmth in a technical interface
- **Destructive Color**: Coral Red (oklch(0.55 0.22 25)) - Clear error indication for expired tokens and failed requests
- **Foreground/Background Pairings**:
  - Background (Soft White oklch(0.98 0 0)): Dark Gray text (oklch(0.25 0 0)) - Ratio 13.2:1 ✓
  - Card (White oklch(1 0 0)): Dark Gray text (oklch(0.25 0 0)) - Ratio 14.8:1 ✓
  - Primary (Deep Blue-Gray oklch(0.35 0.02 250)): White text (oklch(0.99 0 0)) - Ratio 9.5:1 ✓
  - Secondary (Cool Gray oklch(0.92 0.005 250)): Dark Gray text (oklch(0.25 0 0)) - Ratio 12.5:1 ✓
  - Accent (Warm Amber oklch(0.75 0.15 65)): Dark Gray text (oklch(0.25 0 0)) - Ratio 5.2:1 ✓
  - Destructive (Coral Red oklch(0.55 0.22 25)): White text (oklch(0.99 0 0)) - Ratio 5.8:1 ✓

## Font Selection

Clean, highly legible sans-serif typography that emphasizes readability for extended testing sessions, using Inter for its excellent rendering at all sizes and neutral professional character.

- **Typographic Hierarchy**:
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
  - Key (Token manager) - authentication/security
  - Gear (Agent settings) - configuration
  - Robot (Agent/assistant indicator) - agent identity
  - User (User indicator) - human identity
  - Warning (Error indicator) - failure states
  - Clock (Token expiration) - time-based indicators
  - CheckCircle (Valid status) - success confirmation
  - XCircle (Invalid status) - error indication

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
