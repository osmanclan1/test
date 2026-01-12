# Fixing redirect_uri_mismatch Error

The `redirect_uri_mismatch` error occurs when the callback URL in your app doesn't match what's authorized in Google Cloud Console.

## Steps to Fix:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project

2. **Navigate to APIs & Services > Credentials**
   - Go to "APIs & Services" in the left menu
   - Click on "Credentials"

3. **Edit your OAuth 2.0 Client ID**
   - Find your OAuth 2.0 Client ID (the one you're using)
   - Click the edit (pencil) icon

4. **Add Authorized redirect URIs**
   - Scroll down to "Authorized redirect URIs"
   - Click "ADD URI"
   - Add exactly: `http://localhost:3000/auth/google/callback`
     - (Or whatever port you're using - check the server console output)
   - Click "SAVE"

5. **Restart your server**
   ```bash
   npm start
   ```

6. **Try logging in again**

## Common Callback URLs:

- Local development: `http://localhost:3000/auth/google/callback`
- If using a different port: `http://localhost:YOUR_PORT/auth/google/callback`
- For production: `https://yourdomain.com/auth/google/callback`

## Important Notes:

- The callback URL must match **exactly** (including `http://` vs `https://`)
- No trailing slashes
- Case-sensitive
- Must include the full URL, not just the path

## Check Your Current Callback URL:

When you start the server, it will print the callback URL being used. Make sure that exact URL is in your Google Cloud Console.
