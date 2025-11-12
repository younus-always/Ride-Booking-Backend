import passport, { Profile } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs";
import { IsActive, Role } from "../modules/user/user.interface";


passport.use(
      new LocalStrategy({
            usernameField: "email",
            passwordField: "password"
      }, async (email: string, password: string, done) => {
            try {
                  const user = await User.findOne({ email });

                  if (!user) {
                        return done(null, false, { message: "User doesn't exists." });
                  };

                  if (user.isActive === IsActive.INACTIVE || user.isActive === IsActive.BLOCKED) {
                        return done(null, false, { message: `User account is ${user.isActive}` });
                  }

                  if (user.isDeleted) {
                        return done(null, false, { message: "User account is deleted" });
                  }

                  const isGoogleAuthenticate = user.auths.some(providerObj => providerObj.provider === "google");
                  if (isGoogleAuthenticate && !user.password) {
                        return done(null, false, { message: "You have authenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password." });
                  };

                  const isPasswordMatch = await bcryptjs.compare(password, user.password as string);

                  if (!isPasswordMatch) {
                        return done(null, false, { message: "Password does not match." });
                  };
                  return done(null, user);

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
            callbackURL: envVars.GOOGLE_CALLBACK_URL
      }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
            try {
                  const email = profile.emails?.[0].value;
                  if (!email) {
                        return done(null, false, { message: "No email found." });
                  };

                  let user = await User.findOne({ email });

                  if (user && (user.isActive === IsActive.INACTIVE || user.isActive === IsActive.BLOCKED)) {
                        return done(null, false, { message: `User account is ${user.isActive}` });
                  }
                  if (user && user.isDeleted) {
                        return done(null, false, { message: "User account is deleted" });
                  }

                  if (!user) {
                        user = await User.create({
                              email,
                              name: profile.displayName,
                              picture: profile.photos?.[0].value,
                              role: Role.USER,
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