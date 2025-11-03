# Token Auto-Refresh & Sound Alert Testing Guide

This guide explains how to test and configure token auto-refresh with different time limits and sound alerts for token expiration warnings.

## Features Overview

### 1. Extended Auto-Refresh Limits
The auto-refresh system now supports extended unattended operation with configurable limits:
- **Minimum**: 1 refresh
- **Maximum**: 9,999 refreshes
- **Default**: 10 refreshes

#### Quick Presets
- **10 refreshes**: ~2.5 hours (10 × 15 minutes)
- **50 refreshes**: ~12.5 hours
- **100 refreshes**: ~25 hours (1+ day)
- **500 refreshes**: ~5.2 days
- **1,000 refreshes**: ~10.4 days
- **9,999 refreshes**: ~104 days (3+ months)

### 2. Test Token Generation
Create test tokens with custom expiry times to verify auto-refresh and sound alert behavior without making real API calls.

#### Available Test Times
- **30 seconds**: Quick sound alert testing
- **1 minute**: Fast auto-refresh testing
- **2 minutes**: Short cycle testing
- **5 minutes**: Medium duration testing
- **10 minutes**: Extended warning testing
- **15 minutes**: Full production simulation

### 3. Enhanced Sound Alerts
Six configurable warning intervals for token expiration:

| Interval | Time Remaining | Default | Use Case |
|----------|---------------|---------|----------|
| 10 Minutes | 600 seconds | OFF | Early warning for long sessions |
| 5 Minutes | 300 seconds | ON | Standard advance warning |
| 2 Minutes | 120 seconds | ON | Preparation time for manual refresh |
| 1 Minute | 60 seconds | ON | Final warning before auto-refresh |
| 30 Seconds | 30 seconds | OFF | Critical alert for manual mode |
| 10 Seconds | 10 seconds | OFF | Emergency notification |

## Testing Auto-Refresh

### Basic Auto-Refresh Test (1 minute tokens)

1. **Setup Sound Alerts** (optional but recommended):
   - Click **Sounds** button in sidebar
   - Enable **1 Minute** and **30 Seconds** warnings
   - Set volume to 50-75%
   - Choose **Chime** or **Alert** sound
   - Click **Test Sound** to verify

2. **Create Test Token**:
   - Expand **Token Status** card in sidebar
   - Click **Test Token with Custom Time**
   - Select **1m** (1 minute)
   - Token will be created and countdown starts

3. **Configure Auto-Refresh**:
   - Click the **Gear icon** next to Auto-refresh toggle
   - Set **Max Auto-Refreshes** to **5**
   - Click outside popover to close
   - Enable **Auto-refresh** toggle

4. **Observe Behavior**:
   - At **1 minute remaining**: Sound alert plays (if enabled)
   - At **30 seconds remaining**: Sound alert plays (if enabled)
   - At **less than 1 minute**: Token auto-refreshes
   - Check counter: Shows "1/5", "2/5", etc.
   - After 5 refreshes: Auto-refresh stops automatically

### Extended Unattended Operation Test

1. **Configure for Long Duration**:
   - Open auto-refresh settings (Gear icon)
   - Click **1000** preset button (or type 9999)
   - Review estimated runtime: ~10.4 days for 1000 refreshes
   - Close popover

2. **Enable Auto-Refresh**:
   - Toggle **Auto-refresh** ON
   - Generate a real token or create 15m test token
   - System will refresh up to 1000 times

3. **Monitor Progress**:
   - Counter shows current/max: "47/1000"
   - Each refresh increments counter
   - Toast notifications on each refresh
   - System stops at limit automatically

### Testing Different Time Limits

#### Quick Test (30 seconds)
```
Purpose: Verify sound alerts fire correctly
Steps:
1. Create 30s test token
2. Enable all sound warnings
3. Watch for alerts at 10s mark
4. No auto-refresh will occur (token too short)
```

#### Standard Test (2 minutes)
```
Purpose: Test one complete refresh cycle
Steps:
1. Create 2m test token
2. Set max refreshes to 2
3. Enable auto-refresh
4. Observe countdown and refresh at ~1m remaining
5. Second token refreshes again
6. System stops after 2 refreshes
```

#### Full Production Simulation (15 minutes)
```
Purpose: Simulate real token behavior
Steps:
1. Create 15m test token
2. Set max refreshes to 3
3. Enable 10m, 5m, 2m, 1m warnings
4. Let run for full duration (~45 minutes)
5. Verify alerts at correct intervals
6. Confirm 3 refreshes occur
```

## Testing Sound Alerts

### Sound Alert Configuration Test

1. **Open Sound Settings**:
   - Click **Sounds** button in sidebar
   - Ensure **Enable Sounds** is ON

2. **Test Each Sound Type**:
   - Select **Beep** → Click **Test Sound**
   - Select **Chime** → Click **Test Sound** (default)
   - Select **Alert** → Click **Test Sound**
   - Select **Gentle** → Click **Test Sound**
   - Choose preferred sound

3. **Configure Warning Intervals**:
   - Enable desired intervals (5m, 2m, 1m recommended)
   - Disable intervals you don't want
   - Volume slider: 50% recommended

4. **Live Test with Token**:
   - Create 5m test token
   - Enable 2m and 1m warnings
   - Wait and verify sounds play at correct times
   - Check toast notifications appear with sounds

### Recommended Configurations

#### For Unattended Operation
```
Max Refreshes: 1000-9999
Sound Warnings: 
  ✓ 10 Minutes (early notice)
  ✓ 5 Minutes (standard)
  ✗ 2 Minutes (too frequent)
  ✗ 1 Minute (too frequent)
  ✗ 30 Seconds (unnecessary with auto-refresh)
  ✗ 10 Seconds (unnecessary with auto-refresh)
```

#### For Attended Testing
```
Max Refreshes: 10-50
Sound Warnings:
  ✗ 10 Minutes (too early)
  ✓ 5 Minutes (good advance notice)
  ✓ 2 Minutes (prepare for refresh)
  ✓ 1 Minute (final warning)
  ✓ 30 Seconds (critical alert)
  ✗ 10 Seconds (too late)
```

#### For Manual Token Management
```
Max Refreshes: Disabled/0
Sound Warnings:
  ✓ 10 Minutes (early planning)
  ✓ 5 Minutes (start preparing)
  ✓ 2 Minutes (action needed soon)
  ✓ 1 Minute (urgent)
  ✓ 30 Seconds (critical)
  ✓ 10 Seconds (immediate action)
```

## Troubleshooting

### Auto-Refresh Not Working

**Issue**: Counter stays at 0/10, no refreshes occur
**Solutions**:
1. Check auto-refresh toggle is ON (green)
2. Ensure token configuration is selected in Token Manager
3. For encrypted configs: Decrypt credentials first (lock icon)
4. Verify token has less than 1 minute remaining (refresh trigger)
5. Check browser console for errors

### Sound Alerts Not Playing

**Issue**: No sound when warnings should fire
**Solutions**:
1. Verify **Enable Sounds** is ON in Sound Settings
2. Check sound is not set to **None**
3. Increase volume slider (50%+)
4. Click **Test Sound** to verify browser audio works
5. Check browser allows audio (some browsers block autoplay)
6. Verify interval toggles are enabled (e.g., 1m, 2m)

### Test Token Issues

**Issue**: Can't create test tokens or they don't work
**Solutions**:
1. Test tokens are separate from real tokens
2. They don't require API configuration
3. They won't trigger actual API calls during refresh
4. Use for testing timers and sounds only
5. Switch to real token for actual agent testing

### Max Refresh Limit Reached

**Issue**: Auto-refresh stopped at limit
**Expected Behavior**: This is correct!
**Actions**:
1. Check counter: "10/10" means limit reached
2. Manually generate new token OR
3. Reset counter: Disable and re-enable auto-refresh OR
4. Increase limit: Open gear icon, set higher max

## Security Notes

1. **Encrypted Credentials**: 
   - Auto-refresh requires decrypted credentials cached
   - Enter password once to cache for session
   - Cache clears when token config changes

2. **Unattended Operation**:
   - High refresh limits (1000+) for unattended use
   - Monitor security logs for suspicious activity
   - Consider shorter token validity for sensitive environments

3. **Sound Privacy**:
   - Disable sounds in shared environments
   - Use headphones if alerts are distracting
   - Alerts contain token status info (privacy consideration)

## Best Practices

1. **Start Small**: Test with 30s-2m tokens before long sessions
2. **Verify Sounds**: Test audio before leaving unattended
3. **Monitor Initially**: Watch first few auto-refreshes to ensure working
4. **Set Appropriate Limits**: Don't set 9999 if you only need 50
5. **Use Real Tokens**: Switch to real tokens after test token validation
6. **Check Credentials**: Ensure encrypted configs are decrypted before enabling auto-refresh

## Runtime Calculations

Formula: `Runtime (hours) = (MaxRefreshes × TokenLifetime) / 60`

With 15-minute tokens:
- 10 refreshes = 2.5 hours
- 100 refreshes = 25 hours = 1+ day
- 500 refreshes = 125 hours = 5.2 days  
- 1,000 refreshes = 250 hours = 10.4 days
- 5,000 refreshes = 1,250 hours = 52 days
- 9,999 refreshes = 2,499.75 hours = 104 days

With custom token lifetime:
1. Check your token's actual expiry time (may vary from 15m)
2. Multiply: `maxRefreshes × tokenLifetimeMinutes / 60 = hours`
3. Set limit accordingly for desired runtime
