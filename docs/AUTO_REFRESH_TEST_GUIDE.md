# Auto-Refresh Testing Guide with Encrypted Token Configuration

## Overview
This guide provides comprehensive testing procedures for the auto-refresh functionality with encrypted token configurations in the Multi-Agent Tester application.

## Features Tested
1. ✅ Encrypted credential storage
2. ✅ Decrypted credential caching
3. ✅ Auto-refresh with encrypted tokens
4. ✅ Auto-refresh countdown and limits
5. ✅ Password dialog flow for encrypted tokens
6. ✅ Auto-refresh disable after max refreshes

---

## Test Prerequisites

### Mock Token Endpoint Setup
Since this is a testing environment, you'll need a mock token endpoint. You can use one of these options:

**Option 1: Use a mock API service**
- Endpoint: `https://httpbin.org/post`
- Response format: `{"access_token": "mock-token-12345"}`

**Option 2: Local mock server**
```bash
# Create a simple Node.js mock server
node -e "
const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
  res.end(JSON.stringify({access_token: 'mock-token-' + Date.now()}));
}).listen(3001);
console.log('Mock server running on http://localhost:3001');
"
```

---

## Test Scenarios

### Test 1: Create Encrypted Token Configuration

**Steps:**
1. Open the application
2. Click "Token" button in the sidebar
3. Select "+ New Token Configuration"
4. Fill in the form:
   - Configuration Name: `Test Encrypted Config`
   - Token Endpoint URL: `https://httpbin.org/post` (or your mock endpoint)
   - Client ID: `test-client-id`
   - Client Secret: `test-client-secret`
   - Username: `test-user`
   - Password: `test-password`
5. Ensure "Encrypt Before Saving" toggle is **ON** (green)
6. Click "Save Configuration"
7. Enter an encryption password in the dialog (e.g., `MySecurePassword123!`)
8. Confirm the password
9. Click "Encrypt & Save"

**Expected Results:**
- ✅ Toast notification: "Token saved (encrypted)"
- ✅ Configuration appears in the dropdown with a lock icon 🔒
- ✅ Form closes automatically

---

### Test 2: Generate Token with Encrypted Configuration

**Steps:**
1. With the encrypted configuration selected
2. Click "Generate Token" button
3. Enter your encryption password when prompted
4. Click "Decrypt & Continue"

**Expected Results:**
- ✅ Password dialog appears
- ✅ Toast notification: "Credentials decrypted and cached for auto-refresh"
- ✅ Toast notification: "Token generated successfully"
- ✅ Token Status card shows "Token Active" with green indicator
- ✅ Lock icon appears in Token Status indicating cached credentials 🔒

---

### Test 3: Enable Auto-Refresh with Encrypted Token

**Steps:**
1. Expand the Token Status card (if collapsed)
2. Locate the "Auto-refresh (0/10)" switch
3. Toggle the switch to **ON**

**Expected Results:**
- ✅ If credentials are cached: Auto-refresh enables immediately
- ✅ If credentials not cached: Password dialog appears
- ✅ After entering password: "Credentials decrypted and cached for auto-refresh"
- ✅ Auto-refresh counter shows "Auto-refresh (0/10)"
- ✅ Switch turns blue/active

---

### Test 4: Verify Auto-Refresh Trigger (Simulated Short Expiry)

**Note:** Tokens expire after 15 minutes by default. For testing purposes, you can modify the expiry time temporarily.

**Manual Testing Steps:**
1. With auto-refresh enabled
2. Wait for token to approach expiry (< 1 minute remaining)
3. The system checks every 10 seconds
4. When time remaining ≤ 60 seconds, auto-refresh triggers

**Expected Results:**
- ✅ Toast notification: "Token auto-refreshed (1/10)" (with 2s duration)
- ✅ Token Status updates with new expiry time
- ✅ Auto-refresh counter increments: "Auto-refresh (1/10)"
- ✅ Process repeats up to max refreshes (10)

**For Quick Testing (Developer Mode):**
Temporarily modify line 79 in `src/components/TokenStatus.tsx`:
```typescript
// Change from 15 minutes to 2 minutes for testing
expiresAt: Date.now() + (2 * 60 * 1000),  // 2 minutes instead of 15
```

And line 253 in `src/components/TokenStatus.tsx`:
```typescript
// Change from 60 seconds to 30 seconds for faster testing
if (timeUntilExpiry <= 30000 && timeUntilExpiry > 0) {
```

---

### Test 5: Auto-Refresh Counter Limits

**Steps:**
1. Enable auto-refresh
2. Let the system auto-refresh 10 times (or modify code to lower limit for testing)

**Expected Results:**
- ✅ After 10th refresh: Toast "Auto-refresh stopped after 10 refreshes"
- ✅ Auto-refresh switch automatically turns OFF
- ✅ Counter shows "Auto-refresh (10/10)"
- ✅ User must manually enable auto-refresh again (resets counter to 0)

---

### Test 6: Encrypted Token Export/Import

**Steps:**
1. Create and save encrypted token configuration
2. In Token Manager, ensure "Encrypt Exports" is enabled
3. Click "Export All"
4. Enter encryption password
5. Confirm the export (file downloads)
6. Delete the saved configuration
7. Click "Import"
8. Select the exported JSON file
9. Enter the decryption password

**Expected Results:**
- ✅ Export: File downloads with encrypted data
- ✅ Import prompt: Password dialog appears
- ✅ After successful decrypt: "Imported X token configuration(s)"
- ✅ Configuration restored with encrypted credentials

---

### Test 7: Auto-Refresh Without Cached Credentials

**Steps:**
1. Have an encrypted token configuration selected
2. Refresh the page (clears credential cache)
3. Try to enable auto-refresh

**Expected Results:**
- ✅ Password dialog appears immediately
- ✅ Message: "Enter your encryption password to unlock credentials for token generation and auto-refresh"
- ✅ After entering password: Credentials cached and auto-refresh enables

---

### Test 8: Multiple Encrypted Configurations

**Steps:**
1. Create 2-3 encrypted token configurations with different passwords
2. Switch between configurations
3. Try generating tokens with each

**Expected Results:**
- ✅ Credential cache clears when switching configurations
- ✅ Password prompt appears for each configuration
- ✅ Each configuration maintains its own encrypted data
- ✅ Lock icons display correctly for encrypted configs

---

### Test 9: Unencrypted Token Configuration (Comparison)

**Steps:**
1. Create a new token configuration
2. Turn OFF "Encrypt Before Saving"
3. Save the configuration
4. Enable auto-refresh

**Expected Results:**
- ✅ No password dialog required
- ✅ Warning: "Unencrypted credentials - stored in plaintext"
- ✅ No lock icon in dropdown
- ✅ Auto-refresh works without password prompts
- ✅ Toast shows: "Token saved (unencrypted)" with warning

---

### Test 10: Auto-Refresh Failure Handling

**Steps:**
1. Enable auto-refresh with valid encrypted config
2. Change the endpoint to an invalid URL (edit configuration)
3. Wait for auto-refresh to trigger

**Expected Results:**
- ✅ Auto-refresh disables automatically
- ✅ Toast error: "Auto-refresh failed. Please generate token manually."
- ✅ User can manually fix configuration and re-enable

---

## Security Verification

### Encrypted Storage Check
1. Open Browser DevTools → Application → IndexedDB (or Local Storage)
2. Look for stored token configurations
3. Verify credentials are NOT in plaintext
4. Encrypted data should show base64 strings

### Credential Cache Check
1. Enable auto-refresh with encrypted token
2. Check stored data: `decrypted-credentials-cache` key
3. Verify this cache is cleared on:
   - Page refresh
   - Configuration switch
   - Manual clear

### Network Inspection
1. Open DevTools → Network tab
2. Generate token with encrypted configuration
3. Verify the request body contains decrypted values
4. Confirm no encryption password is sent to server

---

## Known Behaviors

### Positive Behaviors ✅
- Credentials decrypt only when needed (on-demand)
- Decrypted credentials cached for convenience during session
- Cache clears on page refresh for security
- Auto-refresh works seamlessly after initial decrypt
- Counter prevents infinite refresh loops
- Clear user feedback at each step

### Edge Cases to Consider
- **Session Length**: Decrypted cache persists only in current session
- **Browser Refresh**: Requires re-entering password after refresh
- **Network Issues**: Auto-refresh disables on network errors
- **Max Refreshes**: After 10 refreshes, user must manually re-enable

---

## Quick Test Checklist

Use this checklist for rapid testing:

- [ ] Create encrypted token config
- [ ] Generate token (password prompt appears)
- [ ] Verify credentials cached (lock icon in Token Status)
- [ ] Enable auto-refresh
- [ ] Verify auto-refresh counter (0/10)
- [ ] Wait for auto-refresh trigger (or simulate short expiry)
- [ ] Confirm token auto-refreshed (counter increments)
- [ ] Verify toast notifications appear
- [ ] Export encrypted configuration
- [ ] Import encrypted configuration
- [ ] Switch configurations (cache clears)
- [ ] Test with unencrypted config (no password prompt)

---

## Troubleshooting

### Issue: "Failed to decrypt credentials"
**Solution:** Verify you're entering the correct encryption password used when saving

### Issue: Auto-refresh not triggering
**Solution:** 
- Check that token is approaching expiry (< 60 seconds)
- Verify auto-refresh is enabled (switch is ON)
- Ensure credentials are cached (lock icon visible)
- Check browser console for errors

### Issue: Password dialog not appearing
**Solution:**
- Credentials might already be cached
- Check for lock icon in Token Status
- Refresh page to clear cache and test again

### Issue: "No token configuration selected"
**Solution:** Select a configuration from the dropdown in Token Manager

---

## Performance Notes

- **Encryption Time**: ~100-200ms for encrypt/decrypt operations
- **Auto-Refresh Check Interval**: Every 10 seconds
- **Token Expiry**: 15 minutes default
- **Refresh Window**: Triggers when ≤ 60 seconds remaining
- **Max Refreshes**: 10 per auto-refresh session

---

## Test Results Template

```
Test Date: __________
Tester: __________

[ ] Test 1: Create Encrypted Config - PASS / FAIL
[ ] Test 2: Generate with Encrypted - PASS / FAIL
[ ] Test 3: Enable Auto-Refresh - PASS / FAIL
[ ] Test 4: Auto-Refresh Trigger - PASS / FAIL
[ ] Test 5: Counter Limits - PASS / FAIL
[ ] Test 6: Export/Import - PASS / FAIL
[ ] Test 7: Without Cached Creds - PASS / FAIL
[ ] Test 8: Multiple Configs - PASS / FAIL
[ ] Test 9: Unencrypted Config - PASS / FAIL
[ ] Test 10: Failure Handling - PASS / FAIL

Notes:
___________________________________
___________________________________
```

---

## Conclusion

This auto-refresh implementation with encrypted tokens provides:
- ✅ **Security**: AES-256-GCM encryption with PBKDF2 key derivation
- ✅ **Convenience**: Cached credentials for seamless auto-refresh
- ✅ **Safety**: Max refresh limits prevent infinite loops
- ✅ **Transparency**: Clear user feedback and status indicators
- ✅ **Flexibility**: Works with both encrypted and unencrypted configs

All encryption happens client-side in the browser - passwords and credentials never leave the device.
