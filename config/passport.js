const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const config = require("./app");
const authConfig = require("./auth");

const User = require("../models/user");

module.exports = function (passport) {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = config.token.secret;
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    User.findById(jwt_payload._id, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }))
  passport.use(new GoogleStrategy({
    clientID: authConfig.google.clientID,
    clientSecret: authConfig.google.clientSecret,
    callbackURL: authConfig.google.callbackURL,
  }, (token, refreshToken, profile, done) => {
    process.nextTick(() => {
      User.findOne({ 'google.id': profile.id }, (err, user) => {
        if (err) return done(err);
        if (user) {
          return done(null, user);
        } else {
          const newUser = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            google: {
              id: profile.id,
              token: token,
              picture: profile._json.picture
            }
          });
          // save the user
          newUser.save(function(err) {
              if (err)
                  throw err;
              return done(null, newUser);
          });
        }
      })
    })
  }));

  // passport.serializeUser((user, done) => {

  // })

}