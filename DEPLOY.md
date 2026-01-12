# Deployment Guide

This guide will help you deploy the Google OAuth app to Render (recommended) or other platforms.

## Option 1: Deploy to Render (Recommended - Free Tier Available)

### Prerequisites:
- GitHub account (or GitLab/Bitbucket)
- Render account (sign up at https://render.com)
- Your app pushed to a Git repository

### Steps:

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Create a Web Service on Render**
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository and branch

3. **Configure the Service**
   - **Name**: googleauth (or your choice)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose a paid plan)

4. **Set Environment Variables**
   Click "Advanced" → "Add Environment Variable" and add:
   - `NODE_ENV` = `production`
   - `GOOGLE_CLIENT_ID` = (your Google Client ID)
   - `GOOGLE_CLIENT_SECRET` = (your Google Client Secret)
   - `SESSION_SECRET` = (generate a random string, e.g., run `openssl rand -hex 32`)
   - `GOOGLE_CALLBACK_URL` = (leave empty initially, we'll update this after deployment)

5. **Deploy**
   - Click "Create Web Service"
   - Wait for the build to complete
   - Note your app URL (e.g., `https://googleauth.onrender.com`)

6. **Update Google Cloud Console**
   - Go to Google Cloud Console → APIs & Services → Credentials
   - Edit your OAuth 2.0 Client ID
   - Add Authorized redirect URI: `https://your-app-name.onrender.com/auth/google/callback`
   - Save

7. **Update Render Environment Variable**
   - Go back to Render dashboard
   - Environment → Edit
   - Set `GOOGLE_CALLBACK_URL` = `https://your-app-name.onrender.com/auth/google/callback`
   - Save changes (this will trigger a new deployment)

8. **Test**
   - Visit your app URL
   - Try logging in with Google

---

## Option 2: Deploy to Railway

1. **Sign up at Railway** (https://railway.app)
2. **New Project** → "Deploy from GitHub repo"
3. **Select your repository**
4. **Add Environment Variables**:
   - `NODE_ENV` = `production`
   - `GOOGLE_CLIENT_ID` = (your Client ID)
   - `GOOGLE_CLIENT_SECRET` = (your Client Secret)
   - `SESSION_SECRET` = (random string)
   - `GOOGLE_CALLBACK_URL` = (will be set after getting the URL)
5. **Get your app URL** from Railway dashboard
6. **Update Google Cloud Console** with the callback URL
7. **Update GOOGLE_CALLBACK_URL** in Railway environment variables

---

## Option 3: Deploy to Heroku

1. **Install Heroku CLI** (https://devcenter.heroku.com/articles/heroku-cli)
2. **Create Heroku app**:
   ```bash
   heroku create your-app-name
   ```
3. **Set environment variables**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set GOOGLE_CLIENT_ID=your_client_id
   heroku config:set GOOGLE_CLIENT_SECRET=your_client_secret
   heroku config:set SESSION_SECRET=$(openssl rand -hex 32)
   ```
4. **Deploy**:
   ```bash
   git push heroku main
   ```
5. **Get your app URL**: `https://your-app-name.herokuapp.com`
6. **Update Google Cloud Console** with callback URL
7. **Set GOOGLE_CALLBACK_URL**:
   ```bash
   heroku config:set GOOGLE_CALLBACK_URL=https://your-app-name.herokuapp.com/auth/google/callback
   ```

---

## Option 4: Deploy to Vercel

1. **Install Vercel CLI**: `npm i -g vercel`
2. **Create `vercel.json`**:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "server.js"
       }
     ]
   }
   ```
3. **Deploy**: `vercel`
4. **Set environment variables** in Vercel dashboard
5. **Update Google Cloud Console** with callback URL

---

## Important Notes:

1. **Session Secret**: Must be a strong random string in production. Generate one with:
   ```bash
   openssl rand -hex 32
   ```

2. **Callback URL**: Must use HTTPS in production. Format:
   ```
   https://your-domain.com/auth/google/callback
   ```

3. **Google Cloud Console**: Always update the Authorized redirect URIs in Google Cloud Console to match your production URL.

4. **Environment Variables**: Never commit `.env` file to Git. Use platform-specific environment variable settings.

5. **Free Tier Limits**: 
   - Render free tier: Apps sleep after 15 minutes of inactivity
   - Railway: Limited free credits
   - Heroku: No longer has a free tier
   - Vercel: Generous free tier for serverless

---

## Testing Production Locally

To test production settings locally:
```bash
NODE_ENV=production SESSION_SECRET=your-secret npm start
```
