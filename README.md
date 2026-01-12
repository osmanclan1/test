# Google OAuth Web App

A basic web application that implements Google OAuth authentication using Express.js and Passport.

## Local Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure your `.env` file contains:
```
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
SESSION_SECRET=your_session_secret_here
PORT=3000
```

3. Run the server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Features

- Google OAuth 2.0 authentication
- User profile page after login
- Session management
- Clean, modern UI
- Production-ready with secure cookies

## Routes

- `GET /` - Home page with login button
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - Google OAuth callback
- `GET /profile` - User profile page (protected)
- `GET /api/user` - API endpoint to get current user data
- `GET /logout` - Logout user

## Deployment

This app is ready to deploy to various platforms. See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions.

**Quick Deploy Options:**
- **Render** (Recommended) - Free tier available, easy setup
- **Railway** - Simple deployment
- **Heroku** - Classic platform
- **Vercel** - Serverless option

**Important for Production:**
1. Set `NODE_ENV=production`
2. Generate a strong `SESSION_SECRET` (e.g., `openssl rand -hex 32`)
3. Set `GOOGLE_CALLBACK_URL` to your production URL (e.g., `https://your-app.com/auth/google/callback`)
4. Update Google Cloud Console with your production callback URL
5. Enable HTTPS (required for OAuth in production)

For detailed instructions, see [DEPLOY.md](./DEPLOY.md).
