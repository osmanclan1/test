# Render Deployment Steps - Ready to Deploy!

Your code is now on GitHub: https://github.com/osmanclan1/test.git ✅

## Step-by-Step Render Setup

### 1. Sign Up / Login to Render
- Go to: https://dashboard.render.com
- Sign up with GitHub (recommended) - it will automatically connect your repos
- Or sign up with email

### 2. Create New Web Service
- Click the **"New +"** button (top right)
- Select **"Web Service"**
- Connect your GitHub account if prompted
- Find and select the repository: **`osmanclan1/test`**
- Click **"Connect"**

### 3. Configure Your Service
Fill in the following:
- **Name**: `googleauth` (or your choice)
- **Environment**: `Node`
- **Region**: Choose closest to you (e.g., `Oregon (US West)`)
- **Branch**: `main`
- **Root Directory**: (leave empty)
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Select **"Free"** (or choose a plan)

### 4. Set Environment Variables
Scroll down and click **"Advanced"** → Find **"Environment Variables"** section

Click **"Add Environment Variable"** for each of these:

1. **NODE_ENV**
   - Key: `NODE_ENV`
   - Value: `production`

2. **GOOGLE_CLIENT_ID**
   - Key: `GOOGLE_CLIENT_ID`
   - Value: (get from your .env file)

3. **GOOGLE_CLIENT_SECRET**
   - Key: `GOOGLE_CLIENT_SECRET`
   - Value: (get from your .env file)

4. **SESSION_SECRET**
   - Key: `SESSION_SECRET`
   - Value: `52b42062fa9749ebceda4180c66a0df01cb6a83f08a1fac25bee2ecfd25bbc6d`

5. **GOOGLE_CALLBACK_URL**
   - Key: `GOOGLE_CALLBACK_URL`
   - Value: (leave empty for now - we'll update after deployment)

### 5. Deploy
- Scroll down
- Click **"Create Web Service"**
- Wait for deployment (~2-3 minutes)
- **IMPORTANT:** Copy your app URL (it will look like `https://googleauth-xxxx.onrender.com` or `https://test-xxxx.onrender.com`)

### 6. Update Google Cloud Console
After you get your Render URL:

1. Go to: https://console.cloud.google.com
2. Select your project
3. Go to: **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID (Edit icon)
5. Scroll to **"Authorized redirect URIs"**
6. Click **"+ ADD URI"**
7. Add: `https://your-app-name.onrender.com/auth/google/callback`
   (Replace `your-app-name` with your actual Render app URL)
8. Click **"SAVE"**

### 7. Update Render Callback URL
1. Go back to Render dashboard
2. Click on your service
3. Go to **"Environment"** tab
4. Find `GOOGLE_CALLBACK_URL`
5. Click **Edit**
6. Set value to: `https://your-app-name.onrender.com/auth/google/callback`
7. Click **Save Changes** (this triggers a redeploy)

### 8. Test! 🎉
Visit your Render app URL and try signing in with Google!

---

## Quick Reference

**Your GitHub Repo:** https://github.com/osmanclan1/test.git ✅

**Environment Variables Needed:**
- `NODE_ENV` = `production`
- `GOOGLE_CLIENT_ID` = (from your .env)
- `GOOGLE_CLIENT_SECRET` = (from your .env)
- `SESSION_SECRET` = `52b42062fa9749ebceda4180c66a0df01cb6a83f08a1fac25bee2ecfd25bbc6d`
- `GOOGLE_CALLBACK_URL` = (set after deployment)

**Render Dashboard:** https://dashboard.render.com

---

## Notes
- Free tier apps sleep after 15 minutes of inactivity
- First request after sleep may take ~30 seconds
- Make sure callback URL matches exactly in Google Cloud Console
