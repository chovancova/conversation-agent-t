# Features

This document describes the functional features of the Multi-Agent Tester application, focusing on what users can do rather than technical implementation details.

## Overview

The Multi-Agent Tester is a professional testing environment that allows you to interact with multiple specialized conversation agents through a clean, efficient interface. You can test different agents, manage authentication, customize the interface, and analyze conversation performance.

---

## 🤖 Conversation Features

### Multi-Agent Chat Interface
Send messages to specialized HTTP-based conversation agents and receive responses in a chat format. The interface supports five different agent types:
- **Account Opening** - Test customer account creation and onboarding scenarios
- **Payment** - Test payment processing and transaction handling
- **Moderator** - Test content moderation and policy enforcement
- **Card** - Test card services and management scenarios
- **RAG** - Test retrieval-augmented generation for knowledge queries

Each conversation maintains its own message history and context, allowing you to test multiple scenarios simultaneously.

### Conversation Management
- **Create Multiple Conversations** - Start new conversation sessions with any agent type
- **Switch Between Conversations** - Easily navigate between different conversation sessions
- **Conversation History** - All messages are automatically saved and can be resumed later
- **Conversation Titles** - Each conversation displays a descriptive title based on the first message
- **Delete Conversations** - Remove individual conversations or clear all conversations at once

### Split-Screen Mode
View and interact with two conversations side by side:
- **Dual Conversations** - Test two different agents simultaneously
- **Independent Operation** - Each pane works independently with its own agent and messages
- **Flexible Comparison** - Compare agent behaviors and responses in real-time
- **Easy Toggle** - Enable or disable split mode with a single click

### Search and Filter
- **Search Conversations** - Search through conversation titles and message content
- **Filter by Agent Type** - Show only conversations with specific agent types
- **Quick Access** - Quickly find past conversations and specific exchanges

### Message Export
- **Copy to Clipboard** - Export complete conversation history including timestamps
- **Share and Document** - Extract conversations for reports, bug tracking, or analysis
- **Format Preservation** - Exported messages maintain structure and agent metadata

### Response Time Tracking
- **Latency Display** - See how long each agent response takes
- **Performance Monitoring** - Track response times in milliseconds or seconds
- **Performance Analysis** - Identify slow responses and performance patterns

---

## 🔐 Authentication & Security

### Token Management
Generate and manage multiple authentication token configurations:
- **OAuth2-Style Authentication** - Generate Bearer tokens using OAuth token endpoints
- **Multiple Token Configurations** - Save and manage different credential sets
- **Token Expiration Tracking** - Visual countdown shows remaining token validity (15-minute expiration)
- **Automatic Expiry Detection** - Get notified when tokens expire and need regeneration
- **Per-Conversation Token Selection** - Use different tokens for different conversations

### Token Auto-Refresh
- **Automatic Renewal** - Tokens refresh automatically before expiration
- **Manual Refresh** - Refresh tokens on demand with a single click
- **Refresh Status** - See when the last refresh occurred and when the next one is due
- **Seamless Testing** - Continue testing without interruption from token expiration

### Encrypted Storage
- **Password-Protected Encryption** - Secure sensitive data with AES-256-GCM encryption
- **Encrypted Credentials** - Client secrets, passwords, and tokens stored securely
- **Encrypted Conversations** - Message history protected with encryption at rest
- **User-Controlled Keys** - You set the encryption password for your data
- **Import/Export with Encryption** - Share configurations securely with encryption option

### Security & Privacy Information
- **Data Transparency** - View exactly what data is stored and how it's protected
- **Security Best Practices** - Learn about proper credential handling and security
- **Clear All Data** - Remove all stored data with a single action
- **Security Warnings** - Get notified about security considerations when exporting data

---

## ⚙️ Configuration Features

### Agent Endpoint Configuration
Configure HTTP endpoints for each agent type:
- **Independent Endpoints** - Set different URLs for each agent type
- **Custom Agent Names** - Give agents descriptive names for easier identification
- **Endpoint Validation** - Validate configurations before testing
- **Protocol Support** - Configure for Custom HTTP, A2A (Agent-to-Agent), and MCP (Model Context Protocol)

### Advanced Agent Configuration
Fine-tune how requests are sent to agents:
- **Custom Headers** - Add authentication, content-type, or custom headers
- **Request Body Templates** - Define the structure of messages sent to agents
- **Response Field Mapping** - Specify where to find the agent's response in the API response
- **Protocol-Specific Templates** - Pre-configured templates for A2A and MCP protocols
- **Configuration Validation** - Real-time validation with error messages and warnings

### Protocol Validation
Ensure agent configurations meet protocol specifications:
- **Custom HTTP Validation** - Check JSON body templates and required fields
- **A2A Protocol Validation** - Verify required headers (A2A-Version, A2A-Client-ID) and intent structure
- **MCP Protocol Validation** - Validate JSON-RPC 2.0 format and required fields
- **Inline Error Messages** - See specific validation issues with clear guidance
- **Protocol Documentation** - Access protocol-specific help inline

---

## 🎨 Personalization Features

### Theme Selection
Choose from professionally designed color themes:
- **Dark Theme** - Modern dark theme with cyan-green accents (default)
- **Light Theme** - Clean light theme with soft colors
- **Corporate Gold** - Professional dark theme with golden accents
- **Ocean Theme** - Deep blue tones with aqua accents
- **Forest Theme** - Rich green tones with emerald highlights
- **Sunset Theme** - Warm orange and pink tones
- **Midnight Theme** - Deep purple and blue night tones
- **Lavender Dream** - Soft purple and lavender tones
- **Rose Garden** - Elegant pink and rose tones

### Custom Theme Creation
Design your own color scheme:
- **Palette Picker** - Choose from 12 coordinated color palettes
- **Manual Color Selection** - Pick exact colors with color pickers and hex inputs
- **Live Preview** - See changes instantly before applying
- **Save Custom Themes** - Your custom theme persists across sessions

### Typography Customization
Adjust text appearance for optimal readability:
- **Font Family Selection** - Choose from 12 fonts across sans-serif, serif, and monospace categories
- **Font Size Control** - Select small (14px), medium (16px), or large (18px) base sizes
- **Line Height Adjustment** - Choose compact (1.4), normal (1.6), or relaxed (1.8) spacing
- **Live Preview** - See typography changes before applying
- **Accessibility** - Customize for visual comfort and accessibility needs

---

## 🔊 Sound Features

### Audio Notifications
Get notified when agents respond:
- **Enable/Disable Sounds** - Toggle audio notifications on or off
- **Volume Control** - Adjust notification volume to your preference
- **Sound Preview** - Test the notification sound before saving
- **Sound on Response** - Hear a notification when agent messages arrive

---

## ⌨️ Productivity Features

### Keyboard Shortcuts
Navigate and operate the application efficiently:
- **Create New Conversation** (Ctrl/Cmd + N)
- **Focus Search** (Ctrl/Cmd + F)
- **Send Message** (Enter)
- **New Line in Message** (Shift + Enter)
- **Toggle Sidebar** (Ctrl/Cmd + B)
- **Open Keyboard Shortcuts** (Ctrl/Cmd + /)
- **View All Shortcuts** - Access complete list from the sidebar

### Sidebar Management
- **Toggle Sidebar** - Show or hide the conversation list and controls
- **Collapse/Expand Sections** - Minimize token status to save space
- **Responsive Layout** - Sidebar adapts to screen size automatically

### Interface Optimization
- **Auto-Scroll** - Conversations automatically scroll to newest messages
- **Message Timestamps** - See when each message was sent
- **Typing Indicators** - Visual feedback while waiting for agent responses
- **Loading States** - Clear indicators when operations are in progress
- **Empty States** - Helpful prompts when starting or when no conversations exist

---

## 📊 Monitoring Features

### Token Status Display
Track authentication status at a glance:
- **Active Token Display** - See which token configuration is currently active
- **Expiration Countdown** - Real-time timer showing remaining validity
- **Visual Status Indicators** - Color-coded status (valid/expiring/expired)
- **Expandable Details** - Show or hide token status panel to save space

### Response Performance
Monitor agent performance:
- **Response Time** - See how quickly agents respond to messages
- **Time Format** - Display in milliseconds (< 1s) or seconds (≥ 1s)
- **Performance Patterns** - Track response times over multiple messages
- **Error Timing** - See response time even for failed requests

### Connection Status
Understand connection and error states:
- **Error Messages** - Clear error descriptions when requests fail
- **HTTP Status Codes** - Detailed error information for troubleshooting
- **Retry Capability** - Resend failed messages easily
- **Network Error Detection** - Identify connection issues

---

## 🔄 Data Management

### Data Import/Export
Move configurations between environments:
- **Export Token Configurations** - Save token settings to file
- **Import Token Configurations** - Load saved token settings
- **Encryption Options** - Export with or without encryption protection
- **Security Warnings** - Get notified about plaintext credential risks

### Data Clearing
Manage stored information:
- **Clear All Data** - Remove all conversations, tokens, and settings
- **Delete Specific Conversations** - Remove individual conversation sessions
- **Confirmation Dialogs** - Prevent accidental data loss
- **Fresh Start** - Clear everything to begin testing a new project

---

## 🛡️ Safety Features

### Credential Protection
Keep sensitive information secure:
- **Visual Protection** - Password fields hide credentials from view
- **No Console Logging** - Credentials never appear in browser logs
- **HTTPS Enforcement** - Endpoint URLs validated for secure protocols
- **Encryption at Rest** - All sensitive data encrypted in browser storage

### Testing Best Practices
Built-in guidance for safe testing:
- **Test Credentials Only** - Warnings to use non-production credentials
- **Token Expiration** - Short-lived tokens reduce exposure risk
- **Security Notices** - Regular reminders about credential safety
- **Export Warnings** - Alerts when exporting files with credentials

### Data Isolation
- **User-Scoped Storage** - Data isolated to your browser session
- **No Server Storage** - All data remains in your browser
- **Client-Side Encryption** - Encryption happens locally, never sent to servers

---

## 📱 Cross-Platform Support

### Responsive Design
Works on various screen sizes:
- **Desktop Optimized** - Full feature set on larger screens
- **Mobile Accessible** - Core features available on mobile devices
- **Split Mode Disabled on Mobile** - Simplified single-conversation view on small screens
- **Touch-Friendly** - Larger touch targets for mobile interaction

### Browser Compatibility
- **Modern Browser Support** - Works in Chrome, Firefox, Safari, Edge
- **Local Storage** - Uses browser storage for data persistence
- **No Installation Required** - Runs directly in your web browser

---

## 💡 User Experience

### Visual Feedback
Clear indication of system state:
- **Button States** - Disabled/enabled states clearly visible
- **Progress Indicators** - Loading spinners during operations
- **Success Confirmations** - Toast notifications for completed actions
- **Error Highlighting** - Failed messages visually distinct

### Intuitive Interface
Easy to learn and use:
- **Clean Layout** - Focused design minimizes distractions
- **Logical Organization** - Settings and features grouped sensibly
- **Helpful Labels** - Clear naming for all controls and options
- **Empty State Guidance** - Instructions when starting out

### Performance
Fast and responsive:
- **Instant Theme Changes** - Color and typography updates apply immediately
- **Smooth Animations** - Transitions enhance without slowing down
- **Efficient Rendering** - Handles long conversations smoothly
- **Quick Navigation** - Switch between conversations instantly

---

## 📖 Help & Documentation

### In-App Guidance
- **Security Information Dialog** - Comprehensive security documentation
- **Keyboard Shortcuts Reference** - Complete list of available shortcuts
- **Protocol Documentation** - Inline help for A2A and MCP configurations
- **Validation Messages** - Clear error messages with specific guidance

### External Documentation
- **README.md** - Getting started and overview
- **SECURITY.md** - Detailed security documentation
- **PRD.md** - Product requirements and design decisions
- **THEME_CUSTOMIZATION.md** - Theme and typography customization guide
- **Auto-Refresh Guides** - Token auto-refresh implementation and testing documentation

---

## 🎯 Use Cases

This application is designed for:
- **Agent Development Testing** - Test agent implementations during development
- **Quality Assurance** - Verify agent behaviors and responses
- **Performance Evaluation** - Monitor and analyze agent response times
- **Multi-Agent Comparison** - Compare different agent types side by side
- **Integration Testing** - Test agent API integrations and protocols
- **Credential Testing** - Test with different authentication configurations
- **User Acceptance Testing** - Validate agent functionality meets requirements
- **Documentation** - Capture conversation examples for documentation

---

## ⚠️ Important Notes

- This is a **testing and development tool** - not intended for production use
- Use **test credentials only** - never use production secrets
- **Export files contain credentials** - handle securely and delete when done
- Consider **dedicated secret management** solutions for production environments
- Ensure compliance with your **organization's security policies**
