const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");

const { User } = require("../models/user.model");

passport.serializeUser(function (user, done) {
        done(null, user);
});

passport.deserializeUser(function (user, done) {
        done(null, user);
});

passport.use(
        new GoogleStrategy(
                {
                        clientID: process.env.GOOGLE_ID,
                        clientSecret: process.env.GOOGLE_SECRET,
                        callbackURL: "/user/auth/google/callback",
                },
                async function (accessToken, refreshToken, profile, cb) {
                        const user = await User.getByField("googleId", profile.id);
                        if (!user) {
                                const newUser = await new User({ username: profile.displayName }).createNewUserBySocial(profile, "googleId");
                                return cb(null, newUser);
                        }
                        return cb(null, user);
                }
        )
);

passport.use(
        new FacebookStrategy(
                {
                        clientID: process.env.FACEBOOK_ID,
                        clientSecret: process.env.FACEBOOK_SECRET,
                        callbackURL: "/user/auth/facebook/callback",
                },
                async function (accessToken, refreshToken, profile, cb) {
                        const user = await User.getByField("facebookId", profile.id);

                        if (!user) {
                                const newUser = await new User({ username: profile.displayName }).createNewUserBySocial(profile, "facebookId");
                                return cb(null, newUser);
                        }

                        return cb(null, user);
                }
        )
);
