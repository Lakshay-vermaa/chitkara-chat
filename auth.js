require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/auth/google/callback"
  },
  function (accessToken, refreshToken, profile, done) {
    const email = profile.emails[0].value;
    if (!email.endsWith("@chitkarauniversity.edu.in")) {
      return done(null, false, { message: "Only Chitkara emails allowed" });
    }
    return done(null, profile);
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
