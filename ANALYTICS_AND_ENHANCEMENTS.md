# Analytics and Enhancements Update

## New Features Added

### 1. Response Time Analytics Dashboard

A comprehensive analytics dashboard that tracks and visualizes agent performance metrics.

**Features:**
- **Overall Statistics**: Total conversations, messages, average response time, and success rate
- **Agent-Level Analytics**: Performance metrics for each agent including:
  - Average, median, min, and max response times
  - Success/failure counts and success rate percentage
  - Number of conversations per agent
  - Last used timestamp
- **Conversation-Level Analytics**: Individual conversation performance tracking
- **Data Export**: Export analytics as JSON or CSV for external analysis
- **Visual Hierarchy**: Card-based layout with color-coded badges for quick insights

**Access:**
- Keyboard shortcut: `Ctrl+Shift+A`
- Sidebar button: "Analytics" button
- Shows real-time data from all conversations

**Location:** `src/components/AnalyticsDashboard.tsx`

### 2. Enhanced CORS Proxy Providers

Expanded list of CORS proxy providers with descriptions and easy selection.

**New Providers Added:**
1. CORS Anywhere - Popular CORS proxy service
2. AllOrigins - No-auth CORS proxy with URL encoding
3. CORS.SH - Fast and reliable CORS proxy
4. Proxy.CORS.SH - Alternative CORS.SH endpoint
5. CORS Proxy - Simple CORS proxy with query params
6. ThingProxy - Freeboard CORS proxy service
7. CrossOrigin.me - Basic CORS proxy service
8. Custom Proxy - Enter your own proxy URL

**Features:**
- Dropdown selector in Token Manager for easy proxy selection
- Descriptions for each proxy provider
- Support for credentials in proxy URLs (`username:password@host`)
- Visual feedback with examples and usage notes

**Location:** 
- `src/lib/corsProxy.ts` - Updated proxy list
- `src/components/TokenManager.tsx` - UI integration

### 3. Token Refresh Notification Preferences

Granular control over notifications related to token lifecycle events.

**Notification Controls:**
- ✅ Token Generated - When a new access token is created
- ✅ Token Refreshed - When token is automatically refreshed
- ✅ Token Expiring Soon - Warning 2 minutes before expiration
- ✅ Token Expired - When token has expired

**Analytics Display Controls:**
- ✅ Show Response Time - Display response time in message metadata
- ✅ Show Success Rate - Display success rate badges in conversation list

**Features:**
- Per-notification toggle switches
- Settings persist in browser storage
- Affects toast notifications and UI elements
- Default: All notifications enabled

**Access:**
- Sidebar button: "Notifications" button
- Integrates with existing notification system

**Location:** `src/components/NotificationSettings.tsx`

### 4. Endpoint Configuration Validation Rules

Real-time validation for endpoint URLs and agent configurations.

**Validation Types:**

**URL Validation:**
- Protocol check (HTTP/HTTPS required)
- Security warnings for HTTP on non-localhost
- Port validation and warnings
- Localhost detection
- Format validation

**Endpoint-Specific:**
- Path validation and warnings
- Best practice recommendations

**JSON Validation:**
- Request body template parsing
- Placeholder detection ({{message}}, {{sessionId}})

**Field Validation:**
- Response field path validation
- Header key format validation
- Reserved header warnings

**Visual Feedback:**
- ✅ Green badges for valid configurations
- ⚠️ Yellow badges for warnings
- ❌ Red badges for errors
- Inline alerts with specific error/warning messages

**Location:** 
- `src/lib/validation.ts` - Validation functions
- `src/components/EndpointValidator.tsx` - UI component
- `src/components/AgentSettings.tsx` - Integration

## Technical Implementation

### New Files Created:
1. `src/lib/analytics.ts` - Analytics calculation functions
2. `src/lib/validation.ts` - Endpoint and configuration validation
3. `src/components/AnalyticsDashboard.tsx` - Analytics UI
4. `src/components/NotificationSettings.tsx` - Notification preferences UI
5. `src/components/EndpointValidator.tsx` - Validation feedback component
6. `ANALYTICS_AND_ENHANCEMENTS.md` - This documentation

### Updated Files:
1. `src/App.tsx` - Integrated new components and keyboard shortcuts
2. `src/lib/types.ts` - Added NotificationPreferences and AnalyticsPreferences types
3. `src/lib/corsProxy.ts` - Expanded CORS proxy provider list
4. `src/components/ChatMessage.tsx` - Added notification preference support
5. `src/components/AgentSettings.tsx` - Added endpoint validation display
6. `src/components/TokenManager.tsx` - Added CORS proxy dropdown selector

## Usage Guide

### Viewing Analytics

1. Click the "Analytics" button in the sidebar OR press `Ctrl+Shift+A`
2. View overall statistics at the top
3. Switch between tabs:
   - **Overview**: General performance summary and top performers
   - **By Agent**: Detailed metrics for each agent
   - **By Conversation**: Individual conversation analytics
4. Export data using "JSON" or "CSV" buttons

### Configuring Notifications

1. Click the "Notifications" button in the sidebar
2. Toggle individual notification preferences
3. Enable/disable analytics display options
4. Changes are saved automatically

### Setting Up CORS Proxy

1. Open Token Manager
2. Enable "Use CORS Proxy" switch
3. Select a proxy from the dropdown menu OR enter a custom URL
4. Proxy will be used for all agent requests with this token

### Validating Endpoints

1. Open Agent Settings
2. Enter an endpoint URL for any agent
3. View real-time validation feedback below the input
4. Red alerts indicate errors that must be fixed
5. Yellow alerts indicate warnings (optional improvements)

## Data Privacy

All features maintain the client-side-only architecture:
- ✅ Analytics calculated locally in the browser
- ✅ No data sent to external servers
- ✅ Notification preferences stored in browser storage
- ✅ Validation performed client-side
- ✅ Export files created locally

## Performance Considerations

- Analytics calculations are memoized for efficiency
- Validation runs on input change with debouncing
- Large datasets are paginated in the UI
- Export operations are non-blocking

## Browser Compatibility

All features work in modern browsers that support:
- ES6+ JavaScript
- Local Storage API
- Fetch API
- File API (for exports)

## Future Enhancements

Potential improvements for future iterations:
- Chart visualizations for response time trends
- Configurable analytics time ranges
- Response time threshold alerts
- Advanced filtering and sorting in analytics
- Webhook notifications (if server component added)
- Custom validation rules editor
