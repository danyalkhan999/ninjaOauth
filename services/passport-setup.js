const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const { clientID, clientSecret } = require("../config/keys").google;
const GoogleUser = require("../modal/GoogleUser");

passport.serializeUser((googleUser, done) => {
  done(null, googleUser.id);
});

passport.deserializeUser((id, done) => {
  GoogleUser.findById(id).then((googleUser) => {
    done(null, googleUser);
  });
});

passport.use(
  new GoogleStrategy(
    {
      //options for strategy
      callbackURL: "/auth/google/redirect",
      clientID,
      clientSecret,
    },
    (accessToken, refreshToken, profile, done) => {
      // passport callback function
      // check if user already exist

      GoogleUser.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          // if user is already exist
          console.log("user is ", currentUser);
          done(null, currentUser);
        } else {
          // if user in not exist, create a new in db
          new GoogleUser({
            name: profile.displayName,
            googleId: profile.id,
          })
            .save()
            .then((newGoogleUser) => {
              console.log("new user created: " + newGoogleUser);
              done(null, newGoogleUser);
            });
        }
      });
    }
  )
);
