# Quick Deploy to Render (5 minutes)

## Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/googleauth.git
git push -u origin main
```

## Step 2: Deploy on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select your repository
5. Configure:
   - **Name**: `googleauth` (or your choice)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
6. Click **"Advanced"** → Add Environment Variables:
   ```
   NODE_ENV=production
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   SESSION_SECRET=<generate with: openssl rand -hex 32>
   ```
7. Click **"Create Web Service"**
8. Wait for deployment (~2 minutes)
9. Copy your app URL (e.g., `https://googleauth-xxxx.onrender.com`)

## Step 3: Update Google Cloud Console

1. Go to https://console.cloud.google.com
2. APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Under "Authorized redirect URIs", add:
   ```
   https://your-app-name.onrender.com/auth/google/callback
   ```
5. Click **Save**

## Step 4: Update Render with Callback URL

1. Go back to Render dashboard
2. Click on your service → **Environment**
3. Click **"Add Environment Variable"**
4. Add:
   - Key: `GOOGLE_CALLBACK_URL`
   - Value: `https://your-app-name.onrender.com/auth/google/callback`
5. Click **Save Changes** (triggers redeploy)

## Step 5: Test!

Visit your app URL and try logging in with Google! 🎉

---

**Note:** Free tier apps on Render sleep after 15 minutes of inactivity. First request after sleep may take ~30 seconds to wake up.
