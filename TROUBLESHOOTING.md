# Troubleshooting OAuth Issues

## Issue: After clicking "Sign in with Google", you're redirected back to the login page

This usually means one of these issues:

### 1. Check the URL Bar
After Google redirects you back, check the URL:
- If you see `/?error=auth_failed` → Authentication failed
- If you see `/auth/google/callback?...` → Callback URL issue
- If you see just `/` → Session might not be saving

### 2. Callback URL Mismatch (Most Common)

**If testing on Render:**
1. Go to Google Cloud Console: https://console.cloud.google.com
2. APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Check "Authorized redirect URIs"
5. Make sure you have EXACTLY: `https://your-app-name.onrender.com/auth/google/callback`
   - Must use `https://` (not `http://`)
   - Must match your Render URL exactly
   - No trailing slash

6. In Render dashboard, check Environment Variables:
   - `GOOGLE_CALLBACK_URL` should be: `https://your-app-name.onrender.com/auth/google/callback`

### 3. Missing Environment Variables

Check Render → Environment tab has all these:
- `NODE_ENV` = `production`
- `GOOGLE_CLIENT_ID` = (your client ID)
- `GOOGLE_CLIENT_SECRET` = (your client secret)
- `SESSION_SECRET` = (should be set)
- `GOOGLE_CALLBACK_URL` = `https://your-app-name.onrender.com/auth/google/callback`

### 4. Check Render Logs

1. Go to Render dashboard
2. Click on your service
3. Go to "Logs" tab
4. Look for errors like:
   - "ERROR: SESSION_SECRET must be set"
   - "Authentication successful for user: ..."
   - Any error messages

### 5. Browser Console Errors

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try signing in again
4. Look for any errors

### 6. Cookie Issues (If on Render)

On Render, cookies should work automatically with HTTPS. But if you see issues:
- Make sure you're accessing via HTTPS (not HTTP)
- Try in an incognito/private window
- Clear cookies for the site

### 7. Test Locally First

To debug, try testing locally:
```bash
npm start
```
Visit: http://localhost:3000

Make sure your `.env` file has:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback`
- `SESSION_SECRET=dev-secret-key-change-in-production`

And in Google Cloud Console, add both:
- `http://localhost:3000/auth/google/callback` (for local)
- `https://your-app-name.onrender.com/auth/google/callback` (for production)

### Quick Checklist

- [ ] Callback URL added to Google Cloud Console
- [ ] Callback URL uses HTTPS (for production)
- [ ] Callback URL matches Render app URL exactly
- [ ] All environment variables set in Render
- [ ] `GOOGLE_CALLBACK_URL` environment variable set in Render
- [ ] `SESSION_SECRET` is set in Render
- [ ] Check Render logs for errors
- [ ] Try in incognito window
- [ ] Clear browser cookies

### Still Not Working?

Share:
1. The URL you see after Google redirects you back
2. Any errors from Render logs
3. Whether you're testing locally or on Render
4. Your Render app URL
