require('dotenv').config();
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Construct callback URL
const isProduction = process.env.NODE_ENV === 'production';
const callbackURL = process.env.GOOGLE_CALLBACK_URL || 
  (isProduction 
    ? `https://test-9v73.onrender.com/auth/google/callback`
    : `http://localhost:${PORT}/auth/google/callback`);

// JWT Secret
const jwtSecret = process.env.JWT_SECRET || process.env.SESSION_SECRET || (isProduction ? null : 'dev-jwt-secret-change-in-production');
if (isProduction && !jwtSecret) {
  console.error('ERROR: JWT_SECRET or SESSION_SECRET must be set in production!');
  process.exit(1);
}

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport (without sessions)
app.use(passport.initialize());

// Passport Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: callbackURL
},
function(accessToken, refreshToken, profile, done) {
  // Return the profile
  return done(null, profile);
}));

// JWT Middleware to verify token
function authenticateToken(req, res, next) {
  // Try to get token from cookie first, then Authorization header
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ authenticated: false, error: 'No token provided' });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ authenticated: false, error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Google OAuth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/?error=auth_failed', session: false }),
  function(req, res) {
    // Create JWT token with user info
    const userPayload = {
      id: req.user.id,
      displayName: req.user.displayName,
      emails: req.user.emails,
      photos: req.user.photos
    };

    const token = jwt.sign(userPayload, jwtSecret, { expiresIn: '7d' });

    // Set token as httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction, // HTTPS only in production
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Redirect to profile with token in URL for localStorage (will be handled by frontend)
    res.redirect(`/profile?token=${token}`);
  }
);

// Profile page - serve HTML (token verification happens on API call)
app.get('/profile', (req, res) => {
  res.sendFile(__dirname + '/public/profile.html');
});

// Get user data (API endpoint)
app.get('/api/user', authenticateToken, (req, res) => {
  res.json({
    authenticated: true,
    user: req.user
  });
});

// Logout route
app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Callback URL: ${callbackURL}`);
  console.log('\nMake sure your .env file has:');
  console.log('- GOOGLE_CLIENT_ID');
  console.log('- GOOGLE_CLIENT_SECRET');
  console.log('- JWT_SECRET (or SESSION_SECRET)');
  console.log('\n⚠️  IMPORTANT: Make sure this callback URL is authorized in Google Cloud Console:');
  console.log(`   ${callbackURL}`);
});
