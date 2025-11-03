# Troubleshooting

Common issues and solutions for Multi-Agent Tester.

## Quick Diagnostics

### Check Browser Console

1. Open Developer Tools (F12 or Right-click → Inspect)
2. Click "Console" tab
3. Look for error messages (red text)
4. Copy error messages for troubleshooting

### Check Network Tab

1. Open Developer Tools (F12)
2. Click "Network" tab
3. Reload page
4. Check for failed requests (red)
5. Click failed request for details

### Clear Browser Data

Sometimes cached data causes issues:
1. Settings → Privacy → Clear browsing data
2. Select "Cached images and files"
3. Select "Cookies and site data"
4. Clear data and reload

## Installation Issues

### npm install Fails

**Problem:** Dependencies fail to install

**Solutions:**

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Node version:**
   ```bash
   node --version  # Should be 18.0.0 or higher
   ```

3. **Update npm:**
   ```bash
   npm install -g npm@latest
   ```

4. **Try different registry:**
   ```bash
   npm install --registry=https://registry.npmjs.org/
   ```

### Build Fails

**Problem:** `npm run build` fails

**Solutions:**

1. **Clear Vite cache:**
   ```bash
   rm -rf node_modules/.vite
   npm run build
   ```

2. **Check TypeScript errors:**
   ```bash
   npx tsc --noEmit
   ```

3. **Increase Node memory:**
   ```bash
   NODE_OPTIONS=--max-old-space-size=4096 npm run build
   ```

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5173`

**Solutions:**

1. **Kill process on port:**
   ```bash
   # On Unix/Linux/Mac
   lsof -ti:5173 | xargs kill -9

   # On Windows
   netstat -ano | findstr :5173
   taskkill /PID <PID> /F
   ```

2. **Use different port:**
   ```bash
   npm run dev -- --port 3000
   ```

## Token Generation Issues

### Token Generation Fails

**Problem:** Cannot generate token

**Checklist:**
- ✅ Token endpoint URL correct?
- ✅ Client ID correct?
- ✅ Client Secret correct?
- ✅ Username/password correct?
- ✅ Network connectivity?
- ✅ CORS enabled on server?

**Solutions:**

1. **Verify configuration:**
   - Double-check all credentials
   - Test endpoint with Postman/curl
   - Verify OAuth2 grant type supported

2. **Check network errors:**
   - Open DevTools → Network tab
   - Try token generation
   - Check failed request details
   - Look for CORS errors

3. **Test with curl:**
   ```bash
   curl -X POST 'https://your-token-endpoint' \
     -H 'Content-Type: application/x-www-form-urlencoded' \
     -d 'grant_type=password' \
     -d 'client_id=YOUR_CLIENT_ID' \
     -d 'client_secret=YOUR_CLIENT_SECRET' \
     -d 'username=YOUR_USERNAME' \
     -d 'password=YOUR_PASSWORD'
   ```

### Token Expires Immediately

**Problem:** Token expires right after generation

**Causes:**
- Server returns very short expiry
- Clock skew between client/server
- Token configuration issue

**Solutions:**

1. **Check token response:**
   - Open DevTools → Network
   - Generate token
   - Check `expires_in` value
   - Should be > 0

2. **Check system time:**
   - Verify system clock is correct
   - Synchronize with time server

3. **Enable auto-refresh:**
   - Token Manager → Settings
   - Enable "Auto-Refresh Token"
   - Set appropriate refresh count

### Auto-Refresh Not Working

**Problem:** Token doesn't auto-refresh

**Checklist:**
- ✅ Auto-refresh enabled?
- ✅ Refresh count > 0?
- ✅ Refresh token available?
- ✅ Not at maximum refreshes?

**Solutions:**

1. **Verify settings:**
   - Open Token Manager
   - Check Settings tab
   - Verify "Auto-Refresh" enabled
   - Check refresh count limits

2. **Check refresh token:**
   - Token response must include `refresh_token`
   - Verify OAuth2 server supports refresh
   - Test refresh manually with curl

3. **Monitor console:**
   - Open DevTools → Console
   - Watch for refresh attempts
   - Check for error messages

## Agent Communication Issues

### Agent Not Responding

**Problem:** No response from agent

**Checklist:**
- ✅ Agent endpoint URL correct?
- ✅ Token valid and not expired?
- ✅ Protocol type correct?
- ✅ Agent service running?
- ✅ Network connectivity?

**Solutions:**

1. **Verify endpoint:**
   - Test with Postman/curl
   - Check endpoint is accessible
   - Verify HTTP method (POST)
   - Check for CORS issues

2. **Check token:**
   - Token Status should show valid
   - Green indicator = valid
   - Red indicator = expired/invalid
   - Regenerate if needed

3. **Test with curl:**

   **Custom HTTP:**
   ```bash
   curl -X POST 'https://your-agent-endpoint' \
     -H 'Authorization: Bearer YOUR_TOKEN' \
     -H 'Content-Type: application/json' \
     -d '{"message": "test message"}'
   ```

   **A2A:**
   ```bash
   curl -X POST 'https://your-agent-endpoint' \
     -H 'Authorization: Bearer YOUR_TOKEN' \
     -H 'A2A-Version: 1.0' \
     -H 'A2A-Client-ID: YOUR_CLIENT_ID' \
     -H 'Content-Type: application/json' \
     -d '{
       "intent": "query",
       "context": {},
       "message": "test message"
     }'
   ```

### Wrong Protocol Error

**Problem:** "Protocol mismatch" or "Invalid request format"

**Solution:**
- Verify protocol type in Agent Config
- Custom HTTP: Standard REST
- A2A: Agent-to-agent with context
- MCP: JSON-RPC 2.0 format

**Protocol Selection Guide:**
- Agent expects standard REST → Custom HTTP
- Agent requires A2A headers → A2A
- Agent uses JSON-RPC → MCP

### CORS Error

**Problem:** "Access to fetch has been blocked by CORS policy"

**Understanding CORS:**
- Browser security feature
- Blocks cross-origin requests
- Server must allow your origin

**Solutions:**

1. **Server-side fix (Preferred):**
   - Add CORS headers on server
   - Allow your origin
   - Example header:
     ```
     Access-Control-Allow-Origin: *
     Access-Control-Allow-Methods: POST
     Access-Control-Allow-Headers: Authorization, Content-Type
     ```

2. **Development workaround:**
   - Use browser CORS extension (testing only!)
   - Deploy app to same origin as API
   - Use reverse proxy

3. **Production solution:**
   - Deploy to same domain as API
   - Use API gateway/proxy
   - Configure server CORS properly

## Encryption Issues

### Cannot Decrypt Configuration

**Problem:** "Decryption failed" or "Invalid password"

**Causes:**
- Wrong password
- Corrupted data
- Different encryption key

**Solutions:**

1. **Verify password:**
   - Password is case-sensitive
   - Check for extra spaces
   - Try password manager autofill

2. **If password forgotten:**
   - ⚠️ Cannot be recovered
   - Must delete and recreate config
   - Future: Add password hint feature

3. **Corrupted data:**
   - Clear all data via Security & Privacy
   - Recreate configurations
   - Re-encrypt with new password

### Encryption Takes Too Long

**Problem:** Encryption/decryption slow

**Cause:** PBKDF2 with 100,000 iterations (by design)

**Expected Behavior:**
- First encryption: 1-2 seconds
- Subsequent: Cached, < 1 second
- This is normal for security

**Not a bug!** - Strong encryption requires time

## Storage Issues

### Data Not Persisting

**Problem:** Configurations/conversations lost after reload

**Causes:**
- Private browsing mode
- Browser storage disabled
- Storage quota exceeded
- Browser extension interference

**Solutions:**

1. **Check private browsing:**
   - Exit private/incognito mode
   - Use normal browser window
   - Data persists in normal mode only

2. **Enable storage:**
   - Browser Settings → Privacy
   - Allow site to store data
   - Allow cookies and site data

3. **Clear old data:**
   - Security & Privacy dialog
   - Export important data first
   - Clear all data
   - Start fresh

4. **Check storage quota:**
   ```javascript
   // In browser console
   navigator.storage.estimate().then(estimate => {
     console.log(`Usage: ${estimate.usage} / ${estimate.quota}`);
   });
   ```

### Cannot Export Data

**Problem:** Export fails or file is empty

**Solutions:**

1. **Check browser permissions:**
   - Allow file downloads
   - Check download location
   - Disable download blocking

2. **Try different browser:**
   - Test in Chrome/Firefox
   - Check if browser-specific issue

3. **Manual export:**
   - Open DevTools → Console
   - Run:
     ```javascript
     // Get all data
     const kv = window.sparkKV;
     kv.get('token-configs').then(console.log);
     ```
   - Copy console output
   - Save manually

## UI/UX Issues

### Split View Not Working

**Problem:** Split view toggle doesn't work

**Solutions:**

1. **Screen size:**
   - Split view requires minimum width
   - Resize browser window wider
   - Use desktop/laptop screen

2. **Browser zoom:**
   - Reset zoom to 100%
   - Ctrl/Cmd + 0

3. **Reload page:**
   - Hard refresh: Ctrl+Shift+R
   - Clear cache and reload

### Theme Not Applying

**Problem:** Theme changes don't take effect

**Solutions:**

1. **Reload page:**
   - Refresh browser (F5)
   - Hard refresh if needed

2. **Clear localStorage:**
   ```javascript
   // In browser console
   localStorage.clear();
   location.reload();
   ```

3. **Check browser extensions:**
   - Disable theme/dark mode extensions
   - Test in incognito mode

### Keyboard Shortcuts Not Working

**Problem:** Shortcuts don't respond

**Causes:**
- Focus on wrong element
- Browser extension conflict
- Keyboard layout issue

**Solutions:**

1. **Click in message input:**
   - Ensure focus on input field
   - Try shortcuts again

2. **Disable extensions:**
   - Test in incognito mode
   - Identify conflicting extension

3. **Check keyboard layout:**
   - Verify correct keyboard layout
   - Try on different keyboard

## Performance Issues

### Slow Application Loading

**Problem:** App takes long to load

**Solutions:**

1. **Clear browser cache:**
   - Settings → Privacy
   - Clear cached data
   - Reload application

2. **Check network:**
   - Test internet speed
   - Check network tab for slow requests
   - Try different network

3. **Disable extensions:**
   - Some extensions slow down apps
   - Test in incognito mode

### Slow Message Sending

**Problem:** Messages take long to send

**Causes:**
- Agent endpoint slow
- Network latency
- Large request payload

**Solutions:**

1. **Check agent response time:**
   - Look at response metrics
   - If consistently slow, agent issue
   - Contact agent API team

2. **Check network:**
   - Test network speed
   - Use faster connection
   - Check for packet loss

3. **Optimize messages:**
   - Keep messages concise
   - Avoid very long messages
   - Break into multiple queries

## Browser-Specific Issues

### Safari Issues

**Issue:** Some features not working in Safari

**Solutions:**
- Update to Safari 14+
- Enable JavaScript
- Allow localStorage
- Disable intelligent tracking prevention (for this site)

### Firefox Issues

**Issue:** Visual glitches or errors

**Solutions:**
- Update to Firefox 88+
- Disable strict tracking protection (for this site)
- Clear Firefox cache

### Mobile Browser Issues

**Issue:** Poor mobile experience

**Status:** Mobile optimization in progress

**Workarounds:**
- Use desktop mode in browser
- Rotate to landscape orientation
- Use tablet/laptop for better experience

## Data Recovery

### Lost All Data

**Problem:** All configurations/conversations gone

**Possible Causes:**
- Cleared browser data
- Private browsing mode
- Browser reset/reinstall
- Storage corruption

**Solutions:**

1. **Check if recoverable:**
   - Look for backup exports
   - Check other browser profiles
   - Check other devices

2. **Prevention:**
   - Regular exports
   - Store exports securely
   - Use multiple browsers
   - Document configurations

3. **Recreate:**
   - Recreate token configs
   - Reconfigure agents
   - Restart testing

### Corrupted Storage

**Problem:** Errors accessing stored data

**Solution:**
1. Export what you can
2. Security & Privacy → Clear All Data
3. Reload application
4. Recreate configurations

## Getting More Help

### Before Reporting Issues

**Gather Information:**
- Browser and version
- Operating system
- Console errors (screenshot)
- Network errors (screenshot)
- Steps to reproduce
- Expected vs actual behavior

### Reporting Bugs

1. **Search existing issues:**
   - Check if already reported
   - Add information to existing issue

2. **Create new issue:**
   - Use bug report template
   - Provide all information
   - Include screenshots
   - Describe impact

3. **Follow up:**
   - Respond to questions
   - Test proposed fixes
   - Confirm resolution

### Where to Get Help

- 📖 Check this troubleshooting guide
- 🐛 [Open an issue](https://github.com/chovancova/conversation-agent-t/issues)
- 💬 Search existing issues
- 📧 Contact maintainers

## Additional Resources

- [[Installation|Installation]] - Setup guide
- [[Configuration|Configuration]] - Configuration help
- [[Security|Security]] - Security information
- [[API Reference|API-Reference]] - Protocol documentation

---

**Previous**: [[Contributing]]  
**Next**: [[Home]]
