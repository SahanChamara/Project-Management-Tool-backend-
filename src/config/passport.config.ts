import passport, { session } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { config } from "./app.config";
import { NotFoundException } from "../utils/appError";
import { ProviderEnum } from "../enums/account-provider.enum";
import { loginOrCreateAccountService, verfyUserService } from "../services/auth.service";
import { Request } from "express";

passport.use(
    new GoogleStrategy(
        {
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: config.GOOGLE_CALLBACK_URL,
            scope: ["profile", "email"],
            passReqToCallback: true,
        },
        async (req: Request, accessToken, refreshToken, profile, done) => {
            try {
                const { email, sub: googleId, picture } = profile._json;
                console.log("prifle", profile);
                console.log("google ID", googleId);

                if (!googleId) {
                    throw new NotFoundException("Google ID (sub) is Missing");
                }

                const { user } = await loginOrCreateAccountService({
                    provider: ProviderEnum.GOOGLE,
                    displayName: profile.displayName,
                    providerId: googleId,
                    picture: picture,
                    email: email,
                });
                done(null, user);
            } catch (error) {
                done(error, false);

            }
        }
    )
);

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            session: true,
        },
        async (email, password, done) => {
            try {
                const user = await verfyUserService({ email, password });
                return done(null, user);
            } catch (error: any) {
                return done(error, false, { message: error?.message });
            }
        }
    )

)


passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));