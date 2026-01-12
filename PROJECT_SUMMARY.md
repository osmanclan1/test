# Project Summary: Google OAuth Web App

## Overview

A complete web application implementing Google OAuth 2.0 authentication using Express.js, Passport.js, and JWT tokens. The app allows users to sign in with their Google accounts and view their profile information.

## Initial Setup (What We Built)

- Basic Express.js web app with Google OAuth 2.0
- Passport.js for authentication
- Two pages: login page and protected profile page
- Session-based authentication (later switched to JWT)
- Modern, responsive UI

**Files Created:**
- `server.js` - Express server with OAuth routes
- `public/index.html` - Login page
- `public/profile.html` - Profile page
- `package.json` - Dependencies
- Deployment guides and documentation

---

## Problems Encountered & Solutions

### Problem #1: `redirect_uri_mismatch` Error

**Symptom:** After clicking "Sign in with Google", Google showed an error: "redirect_uri_mismatch"

**Cause:** 
- The callback URL wasn't properly configured in Google Cloud Console
- The callback URL needed to be an absolute URL, not relative

**Solution:**
1. Updated the code to construct the full callback URL properly:
   ```javascript
   const callbackURL = process.env.GOOGLE_CALLBACK_URL || 
     `https://test-9v73.onrender.com/auth/google/callback`;
   ```
2. Added the exact callback URL to Google Cloud Console:
   - APIs & Services → Credentials → OAuth 2.0 Client ID
   - Added: `https://test-9v73.onrender.com/auth/google/callback` to Authorized redirect URIs

---

### Problem #2: Session Not Persisting (The Real Issue)

**Symptom:** 
- User completes OAuth flow at Google successfully
- Gets redirected back to the app
- But ends up back at the login page instead of the profile page
- Authentication appears to work but doesn't persist

**Root Cause:**
- Session cookies weren't being saved/persisted properly
- Possible causes:
  - Cookie `secure` flag issues with HTTPS
  - `sameSite` cookie attribute not configured for cross-origin scenarios
  - Session storage issues on Render's infrastructure
  - Cookie domain/path configuration issues

**Solution: Switch from Sessions to JWT Authentication**

Instead of fixing session cookies, we switched to JWT (JSON Web Tokens):

**Changes Made:**
1. Removed `express-session` dependency
2. Added `jsonwebtoken` and `cookie-parser` packages
3. Rewrote authentication flow:
   - Generate JWT token on successful OAuth callback
   - Store token in httpOnly cookie (automatic, secure)
   - Also pass token in URL for localStorage backup
   - Verify JWT tokens instead of checking sessions
4. Updated authentication middleware:
   ```javascript
   function authenticateToken(req, res, next) {
     const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
     jwt.verify(token, jwtSecret, (err, user) => {
       if (err) return res.status(403).json({ error: 'Invalid token' });
       req.user = user;
       next();
     });
   }
   ```
5. Updated frontend to handle JWT tokens:
   - Extract token from URL and store in localStorage
   - Send token via cookie (automatic) or Authorization header (backup)
   - Clear tokens on logout

**Why JWT Solved It:**
- No server-side session storage needed
- Tokens work reliably across different hosting environments
- Stateless authentication (scales better)
- httpOnly cookies prevent XSS attacks
- Token verification is straightforward

---

### Problem #3: Deployment Configuration

**Issues During Deployment:**
- Need to set environment variables on Render
- Need to configure Google Cloud Console properly
- Need to ensure callback URLs match exactly

**Solutions:**
- Created deployment guides (`DEPLOY.md`, `RENDER_SETUP_STEPS.md`)
- Documented all required environment variables
- Provided step-by-step instructions for Google Cloud Console
- Added troubleshooting guides

---

## Final Architecture

**Authentication Flow:**
1. User clicks "Sign in with Google" → `/auth/google`
2. Redirected to Google OAuth page
3. User authenticates with Google
4. Google redirects to `/auth/google/callback`
5. Server creates JWT token with user info
6. Token stored in httpOnly cookie + passed to frontend
7. Frontend stores token in localStorage (backup)
8. Protected routes verify JWT token
9. User sees profile page

**Technology Stack:**
- Backend: Node.js + Express.js
- Authentication: Passport.js + Google OAuth 2.0
- Token: JWT (jsonwebtoken)
- Frontend: Vanilla HTML/CSS/JavaScript
- Hosting: Render (free tier)

**Key Files:**
- `server.js` - Express server with JWT authentication
- `public/index.html` - Login page
- `public/profile.html` - Profile page with token handling
- `package.json` - Dependencies (removed express-session, added jsonwebtoken)

---

## Lessons Learned

1. OAuth callback URLs must match exactly (including protocol)
2. Session-based auth can be problematic in cloud environments
3. JWT is more reliable for stateless authentication
4. Always test authentication flow end-to-end
5. Cookie configuration (secure, sameSite, httpOnly) matters
6. Environment variables must be set correctly in production

---

## Current Status

The app is working with:
- ✅ Google OAuth 2.0 authentication
- ✅ JWT token-based authentication
- ✅ Secure token storage (httpOnly cookies + localStorage backup)
- ✅ Protected profile page
- ✅ Logout functionality
- ✅ Deployed on Render

Users can now sign in with Google, see their profile, and the authentication persists properly! 🎉
