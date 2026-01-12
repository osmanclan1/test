# Deployment Checklist for Render

## ✅ Step 1: Push to GitHub (Do this first)

1. **Create a GitHub repository:**
   - Go to https://github.com/new
   - Repository name: `googleauth` (or your choice)
   - Choose **Public** or **Private**
   - **DO NOT** initialize with README, .gitignore, or license
   - Click "Create repository"

2. **Push your code:**
   Run these commands (replace YOUR_USERNAME with your GitHub username):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/googleauth.git
   git branch -M main
   git push -u origin main
   ```

   Or if you prefer SSH:
   ```bash
   git remote add origin git@github.com:YOUR_USERNAME/googleauth.git
   git branch -M main
   git push -u origin main
   ```

## ✅ Step 2: Deploy on Render

1. **Sign up/Login to Render:**
   - Go to https://dashboard.render.com
   - Sign up with GitHub (recommended) or email

2. **Create Web Service:**
   - Click "New +" button → "Web Service"
   - Connect GitHub account if not already connected
   - Find and select your `googleauth` repository
   - Click "Connect"

3. **Configure Service:**
   - **Name**: `googleauth` (or your choice)
   - **Environment**: `Node`
   - **Region**: Choose closest to you (e.g., `Oregon (US West)`)
   - **Branch**: `main`
   - **Root Directory**: (leave empty)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: **Free** (or choose a plan)

4. **Add Environment Variables:**
   Click "Advanced" → Scroll to "Environment Variables" → Add these:

   ```
   Key: NODE_ENV
   Value: production

   Key: GOOGLE_CLIENT_ID
   Value: (your Google Client ID from .env file)

   Key: GOOGLE_CLIENT_SECRET
   Value: (your Google Client Secret from .env file)

   Key: SESSION_SECRET
   Value: 52b42062fa9749ebceda4180c66a0df01cb6a83f08a1fac25bee2ecfd25bbc6d

   Key: GOOGLE_CALLBACK_URL
   Value: (leave empty for now, we'll update after deployment)
   ```

5. **Deploy:**
   - Scroll down and click **"Create Web Service"**
   - Wait for build to complete (~2-3 minutes)
   - **IMPORTANT:** Copy your app URL (e.g., `https://googleauth-xxxx.onrender.com`)

## ✅ Step 3: Update Google Cloud Console

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com
   - Select your project

2. **Update OAuth Credentials:**
   - Navigate: **APIs & Services** → **Credentials**
   - Find your OAuth 2.0 Client ID → Click the **Edit** (pencil) icon

3. **Add Authorized Redirect URI:**
   - Scroll to **"Authorized redirect URIs"**
   - Click **"+ ADD URI"**
   - Add: `https://your-app-name.onrender.com/auth/google/callback`
     (Replace `your-app-name` with your actual Render app name)
   - Click **"SAVE"**

## ✅ Step 4: Update Render with Callback URL

1. **Go back to Render Dashboard:**
   - Click on your service
   - Go to **Environment** tab

2. **Update GOOGLE_CALLBACK_URL:**
   - Find `GOOGLE_CALLBACK_URL` environment variable
   - Click **Edit**
   - Set value to: `https://your-app-name.onrender.com/auth/google/callback`
   - Click **Save Changes** (this will trigger a redeploy)

## ✅ Step 5: Test!

1. Visit your app URL: `https://your-app-name.onrender.com`
2. Click "Sign in with Google"
3. Complete OAuth flow
4. You should see your profile! 🎉

---

## Environment Variables Reference

From your `.env` file, you'll need:
- `GOOGLE_CLIENT_ID` - Already in your .env
- `GOOGLE_CLIENT_SECRET` - Already in your .env
- `SESSION_SECRET` - Generated: `52b42062fa9749ebceda4180c66a0df01cb6a83f08a1fac25bee2ecfd25bbc6d`

## Notes:

- Free tier apps on Render sleep after 15 min of inactivity (first request may take ~30 seconds)
- Your `.env` file is NOT pushed to GitHub (it's in .gitignore) ✅
- All sensitive data should be in Render's environment variables
- The callback URL must match exactly in Google Cloud Console
