import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // const email = profile.emails[0].value;
                const email = profile.emails && profile.emails[0] && profile.emails[0].value;
                const photo = profile.photos && profile.photos[0] && profile.photos[0].value;

                if (!email) return done(new Error("No email from Google"), null);

                let user = await User.findOne({ email });

                if (!user) {
                    user = await User.create({
                        fullName: profile.displayName || "Google User",
                        email,
                        avatar: photo || undefined,
                        password: Math.random().toString(36).slice(-8),
                        provider: "google",
                        isEmailVerified: profile.emails[0].verified || false,
                    });
                }

                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }
    )
);

export default passport;
