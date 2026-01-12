require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
const PORT = process.env.PORT || 3000;

// Construct callback URL
const isProduction = process.env.NODE_ENV === 'production';
const baseURL = process.env.BASE_URL || (isProduction ? '' : `http://localhost:${PORT}`);
const callbackURL = process.env.GOOGLE_CALLBACK_URL || `${baseURL}/auth/google/callback`;

// Session configuration
const sessionSecret = process.env.SESSION_SECRET || (isProduction ? null : 'dev-secret-key-change-in-production');
if (isProduction && !sessionSecret) {
  console.error('ERROR: SESSION_SECRET must be set in production!');
  process.exit(1);
}

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: isProduction, // Use secure cookies in production (HTTPS)
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: callbackURL
},
function(accessToken, refreshToken, profile, done) {
  // In a real app, you would save the user to your database here
  return done(null, profile);
}));

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Google OAuth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/?error=auth_failed' }),
  function(req, res) {
    // Successful authentication, redirect to home
    res.redirect('/profile');
  }
);

// Profile page (protected route)
app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(__dirname + '/public/profile.html');
  } else {
    res.redirect('/');
  }
});

// Get user data (API endpoint)
app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: {
        id: req.user.id,
        displayName: req.user.displayName,
        emails: req.user.emails,
        photos: req.user.photos
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.redirect('/?error=logout_failed');
    }
    res.redirect('/');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Callback URL: ${callbackURL}`);
  console.log('\nMake sure your .env file has:');
  console.log('- GOOGLE_CLIENT_ID');
  console.log('- GOOGLE_CLIENT_SECRET');
  console.log('\n⚠️  IMPORTANT: Make sure this callback URL is authorized in Google Cloud Console:');
  console.log(`   ${callbackURL}`);
});
