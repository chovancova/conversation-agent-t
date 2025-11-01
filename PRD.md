# Planning Guide

A testing environment for conversation agents that enables users to interact with AI models, evaluate responses, and analyze conversation flows in real-time.

**Experience Qualities**:
1. **Precise** - Clear, focused interface that emphasizes the conversation itself with minimal distractions, allowing testers to concentrate on agent behavior
2. **Responsive** - Immediate feedback and smooth interactions that make testing feel efficient and natural
3. **Professional** - Clean, technical aesthetic that conveys reliability and inspires confidence in the testing process

**Complexity Level**: Light Application (multiple features with basic state)
  - This is a focused testing tool with conversation management, message history, and model selection capabilities, but without complex features like user accounts or advanced analytics

## Essential Features

### Chat Interface
- **Functionality**: Send messages to AI conversation agent and receive responses in a chat format
- **Purpose**: Core testing mechanism for evaluating agent responses and conversation quality
- **Trigger**: User types message and presses enter or clicks send button
- **Progression**: User types message → Message appears in chat → AI processes → Response streams in → Ready for next message
- **Success criteria**: Messages send instantly, responses appear smoothly, conversation history persists

### Model Selection
- **Functionality**: Switch between different AI models (GPT-4o, GPT-4o-mini) to compare behavior
- **Purpose**: Enable testing across different model capabilities and response characteristics
- **Trigger**: User clicks model selector dropdown
- **Progression**: Click dropdown → Select model → Current selection updates → Subsequent messages use new model
- **Success criteria**: Model switches immediately, selection persists, clear indication of active model

### Conversation Management
- **Functionality**: Start new conversations, view conversation history, and switch between sessions
- **Purpose**: Test multiple scenarios without losing previous conversation context
- **Trigger**: User clicks new conversation button or selects previous conversation
- **Progression**: Click new conversation → Current chat clears → Fresh session begins → Previous conversations accessible in sidebar
- **Success criteria**: Conversations save automatically, can be resumed at any time, clear visual distinction

### Message Export
- **Functionality**: Copy conversation history for analysis or documentation
- **Purpose**: Enable testers to extract conversations for reports, bug tracking, or comparison
- **Trigger**: User clicks export button
- **Progression**: Click export → Conversation formatted → Copied to clipboard → Confirmation shown
- **Success criteria**: All messages captured accurately, format is readable, confirmation feedback immediate

## Edge Case Handling

- **Empty Messages**: Disable send button when input is empty to prevent blank submissions
- **Long Messages**: Support multi-line input with proper text wrapping and scrollable message bubbles
- **API Errors**: Display error messages inline in chat with retry option when AI calls fail
- **Slow Responses**: Show typing indicator during AI processing to maintain user awareness
- **No Conversations**: Display helpful empty state encouraging user to start first conversation
- **Rapid Submissions**: Disable input during active AI response to prevent queue buildup

## Design Direction

The design should feel technical and purposeful like a developer tool, with a clean interface that emphasizes readability and efficiency. Minimal decoration with focus on typography, whitespace, and subtle interactions that feel precise and professional.

## Color Selection

Complementary (opposite colors) - A muted blue-gray foundation paired with warm amber accents creates a professional technical feel while the accent provides clear visual hierarchy for interactive elements and AI responses.

- **Primary Color**: Deep Blue-Gray (oklch(0.35 0.02 250)) - Conveys technical sophistication and stability, used for primary actions and headers
- **Secondary Colors**: Cool Gray (oklch(0.92 0.005 250)) for subtle backgrounds and containers, Light Blue-Gray (oklch(0.75 0.015 250)) for secondary actions
- **Accent Color**: Warm Amber (oklch(0.75 0.15 65)) - Draws attention to AI responses and key interactive moments, creating warmth in a technical interface
- **Foreground/Background Pairings**:
  - Background (Soft White oklch(0.98 0 0)): Dark Gray text (oklch(0.25 0 0)) - Ratio 13.2:1 ✓
  - Card (White oklch(1 0 0)): Dark Gray text (oklch(0.25 0 0)) - Ratio 14.8:1 ✓
  - Primary (Deep Blue-Gray oklch(0.35 0.02 250)): White text (oklch(0.99 0 0)) - Ratio 9.5:1 ✓
  - Secondary (Cool Gray oklch(0.92 0.005 250)): Dark Gray text (oklch(0.25 0 0)) - Ratio 12.5:1 ✓
  - Accent (Warm Amber oklch(0.75 0.15 65)): Dark Gray text (oklch(0.25 0 0)) - Ratio 5.2:1 ✓

## Font Selection

Clean, highly legible sans-serif typography that emphasizes readability for extended testing sessions, using Inter for its excellent rendering at all sizes and neutral professional character.

- **Typographic Hierarchy**:
  - H1 (App Title): Inter SemiBold/24px/tight letter-spacing (-0.02em)
  - H2 (Section Headers): Inter Medium/16px/normal letter-spacing
  - Body (Messages): Inter Regular/15px/relaxed line-height (1.6)
  - Small (Timestamps): Inter Regular/13px/muted color
  - Code (Technical Content): Inter Regular/14px/monospace fallback for code blocks

## Animations

Subtle, purposeful animations that reinforce state changes without slowing down the testing workflow - messages should slide in gently, model switches should feel instant, and typing indicators should pulse naturally.

- **Purposeful Meaning**: Motion communicates system state (loading, processing, success) rather than decoration, with smooth but quick transitions that feel responsive
- **Hierarchy of Movement**: Message animations are gentle and organic, primary action feedback is immediate and confident, while background transitions are nearly invisible

## Component Selection

- **Components**:
  - **ScrollArea** (Messages container): Auto-scroll to newest messages with smooth scrolling behavior
  - **Button** (Send, New Chat, Export): Primary variant for send, ghost for secondary actions, custom rounded styling
  - **Input/Textarea** (Message input): Auto-expanding textarea with rounded borders and focus ring
  - **Select** (Model picker): Dropdown with clear labels for GPT-4o and GPT-4o-mini options
  - **Card** (Message bubbles): Distinct styling for user vs AI messages, subtle shadows
  - **Separator** (Visual dividers): Subtle lines between conversation list items
  - **Badge** (Model indicator): Small chip showing active model in conversation list

- **Customizations**:
  - Custom message bubble component with different alignments and colors for user/AI
  - Typing indicator component with animated dots
  - Conversation list item with hover states and selection indicator
  - Empty state component with illustration and call-to-action

- **States**:
  - Send button: Enabled (primary), disabled (muted), loading (with spinner)
  - Message input: Default, focused (accent ring), disabled during response
  - Conversation items: Default, hover (subtle background), selected (accent border)
  - Model select: Clear visual feedback on selection change

- **Icon Selection**:
  - PaperPlaneRight (Send message) - directional action
  - Plus (New conversation) - additive action
  - Export (Copy conversation) - data export
  - Robot (AI indicator) - agent identity
  - User (User indicator) - human identity
  - CaretDown (Dropdown indicators) - navigation

- **Spacing**:
  - Container padding: p-6 (24px)
  - Message gap: gap-4 (16px)
  - Input padding: p-3 (12px)
  - Button padding: px-4 py-2 (16px/8px)
  - Section margins: mb-6 (24px)

- **Mobile**:
  - Stack sidebar above chat on mobile with collapsible drawer
  - Full-width message input with larger touch target (min-h-12)
  - Simplified header with hamburger menu for conversations
  - Single column layout with conversation list accessible via slide-in panel
