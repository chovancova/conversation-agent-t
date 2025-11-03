# Testing Encrypted Auto-Refresh - Quick Start

## 🚀 Quick Test (5 Minutes)

### Step 1: Create Encrypted Token Configuration
1. Click **"Token"** button in sidebar
2. Click **"+ New Token Configuration"**
3. Fill in test data:
   ```
   Name: Test Config
   Endpoint: https://httpbin.org/post
   Client ID: test-client
   Client Secret: test-secret
   Username: testuser
   Password: testpass
   ```
4. Keep **"Encrypt Before Saving"** toggle ON ✅
5. Click **"Save Configuration"**
6. When prompted, enter password: `test123`
7. Confirm password: `test123`
8. Click **"Encrypt & Save"**

**✅ Expected:** Green toast "Token saved (encrypted)" appears

---

### Step 2: Generate Token with Encrypted Config
1. Configuration should now be selected (with 🔒 lock icon)
2. Click **"Generate Token"** button
3. Password dialog appears
4. Enter password: `test123`
5. Click **"Decrypt & Continue"**

**✅ Expected:** 
- Toast: "Credentials decrypted and cached for auto-refresh"
- Toast: "Token generated successfully"
- Token Status shows "Token Active" (green)
- Small lock icon 🔒 appears in Token Status card

---

### Step 3: Enable Auto-Refresh
1. In Token Status card, find **"Auto-refresh (0/10)"** toggle
2. Click the toggle to turn it ON

**✅ Expected:**
- Toggle turns blue/active
- No password prompt (credentials already cached)
- Counter shows (0/10)

---

### Step 4: Verify Auto-Refresh Works

#### Option A: Wait for Natural Expiry (15 minutes)
- Token expires in 15 minutes
- Auto-refresh triggers at 1 minute remaining
- Watch for toast notification

#### Option B: Simulate Quick Expiry (Recommended for Testing)

**Modify Code Temporarily:**

Open `src/components/TokenStatus.tsx`:

**Line 79** - Change token expiry to 2 minutes:
```typescript
expiresAt: Date.now() + (2 * 60 * 1000),  // Was: 15 * 60 * 1000
```

**Line 253** - Change refresh trigger to 30 seconds:
```typescript
if (timeUntilExpiry <= 30000 && timeUntilExpiry > 0) {  // Was: 60000
```

Save the file and refresh the page, then repeat Steps 1-3.

**✅ Expected After ~1.5 Minutes:**
- Toast: "Token auto-refreshed (1/10)"
- Counter increments: "Auto-refresh (1/10)"
- Timer resets to 2 minutes (or 15 if using default)
- Process repeats automatically

---

## 🔍 Visual Indicators

### Token Status Card
```
┌─────────────────────────────────┐
│ ✅ Token Active          🔒 🔑  │ ← Lock = cached credentials
│                                 │
│ Time remaining:      1m 23s     │ ← Countdown timer
│                                 │
│ [Refresh Token Button]          │
│                                 │
│ Auto-refresh (1/10)        🔘ON │ ← Counter / Toggle
└─────────────────────────────────┘
```

### What Each Icon Means
- ✅ **Green Check** = Token is valid
- ⚠️ **Warning** = Token expired
- 🔒 **Lock (small)** = Encrypted credentials cached
- 🔑 **Key** = Token status indicator
- 🔘 **Toggle ON (blue)** = Auto-refresh active

---

## 🧪 Test Scenarios Checklist

### Basic Functionality
- [x] Create encrypted token configuration
- [x] Password prompt on generation
- [x] Credentials cached after first decrypt
- [x] Lock icon appears when cached
- [x] Auto-refresh enables without password (if cached)
- [x] Auto-refresh counter increments
- [x] Toast notifications appear

### Edge Cases
- [ ] Page refresh clears cache (requires password again)
- [ ] Switch configuration clears cache
- [ ] After 10 refreshes, auto-refresh stops
- [ ] Manual re-enable resets counter to 0
- [ ] Network error disables auto-refresh
- [ ] Invalid password shows error

### Security
- [ ] Credentials not visible in DevTools/Storage
- [ ] Password never sent to server
- [ ] Export encrypts data
- [ ] Import requires password

---

## 🐛 Common Issues & Solutions

### "Failed to decrypt credentials"
**Problem:** Wrong password entered
**Solution:** Re-enter the correct encryption password used when saving

### Auto-refresh not triggering
**Problem:** Token not approaching expiry, or credentials not cached
**Solution:** 
1. Check lock icon is visible (credentials cached)
2. Check toggle is ON (blue)
3. Wait until < 1 minute remaining (or use shorter expiry for testing)

### "Auto-refresh disabled: encrypted credentials not available"
**Problem:** Page refreshed or configuration switched
**Solution:** Re-enable auto-refresh, enter password when prompted

### No password dialog appears
**Problem:** Credentials already cached from previous generation
**Solution:** This is correct behavior! Password only required once per session

---

## 📊 Expected Behavior Flow

```
1. Create Encrypted Config → Enter Password → Saved ✅

2. Generate Token → Enter Password → Credentials Cached 🔒 → Token Generated ✅

3. Enable Auto-Refresh → No Password (cached) → Auto-refresh ON ✅

4. Token Approaches Expiry (< 60s) → Auto-refresh Triggers → Counter +1 → New Token ✅

5. Repeat Until → Counter = 10/10 → Auto-refresh OFF → Manual Re-enable Required
```

---

## 🎯 Success Criteria

You've successfully tested encrypted auto-refresh when:

1. ✅ Token configuration saved with encryption
2. ✅ Password prompt appears on first generation
3. ✅ Credentials cached (lock icon visible)
4. ✅ Auto-refresh enables without password
5. ✅ Auto-refresh triggers automatically
6. ✅ Counter increments with each refresh
7. ✅ Toast notifications appear
8. ✅ Stops after max refreshes (10)

---

## 📝 Notes

- **Encryption:** AES-256-GCM with PBKDF2 (100,000 iterations)
- **Token Expiry:** 15 minutes default
- **Refresh Trigger:** ≤ 60 seconds before expiry
- **Check Interval:** Every 10 seconds
- **Max Refreshes:** 10 per session
- **Cache Duration:** Current browser session only

---

## 🔗 Related Documentation

- [Full Test Guide](./AUTO_REFRESH_TEST_GUIDE.md) - Comprehensive testing procedures
- [Security Documentation](./SECURITY.md) - Security & privacy details
- [PRD](./PRD.md) - Product requirements

---

**Last Updated:** December 2024
**Test Status:** ✅ Ready for Testing
