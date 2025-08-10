import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs";


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

                  if (!isUserExist.password) {
                        return done("You are google login");
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
                  done(error);
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