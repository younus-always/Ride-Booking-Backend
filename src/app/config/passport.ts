import passport, { Profile } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs";
import { Role } from "../modules/user/user.interface";


passport.use(
      new LocalStrategy({
            usernameField: "email",
            passwordField: "password"
      }, async (email: string, password: string, done) => {
            try {
                  const isUserExist = await User.findOne({ email });

                  if (!isUserExist) {
                        return done(null, false, { message: "User doesn't exists." });
                  };

                  const isGoogleAuthenticate = isUserExist.auths.some(providerObj => providerObj.provider === "google");
                  if (isGoogleAuthenticate && !isUserExist.password) {
                        return done(null, false, { message: "You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password." });
                  };

                  const isPasswordMatch = await bcryptjs.compare(password, isUserExist?.password as string);

                  if (!isPasswordMatch) {
                        return done(null, false, { message: "Password does not match." });
                  };
                  return done(null, isUserExist);

            } catch (error) {
                  if (envVars.NODE_ENV === "development") {
                        console.log("Passport Local Strategy Error:", error);
                  };
                  return done(error);
            }
      })
);

passport.use(
      new GoogleStrategy({
            clientID: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
            callbackURL: envVars.GOOGLE_OAUTH_CALLBACK
      }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
            try {
                  const email = profile.emails?.[0].value;
                  if (!email) {
                        return done(null, false, { message: "No email found." });
                  };

                  let user = await User.findOne({ email });
                  if (!user) {
                        user = await User.create({
                              name: profile.displayName,
                              email,
                              picture: profile.photos?.[0].value,
                              role: Role.ADMIN,
                              isVerified: true,
                              auths: [{
                                    provider: profile.provider,
                                    providerId: profile.id
                              }]
                        });
                  };
                  return done(null, user);
            } catch (error) {
                  if (envVars.NODE_ENV === "development") {
                        console.log("Passport Google Strategy Error:", error);
                  }
                  return done(error);
            }
      })
);


passport.serializeUser((user: any, done) => {
      done(null, user._id);
});
passport.deserializeUser(async (id: string, done) => {
      try {
            const user = await User.findById(id);
            done(null, user);
      } catch (error) {
            done(error);
      }
});