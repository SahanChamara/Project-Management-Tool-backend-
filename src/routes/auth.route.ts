import { Router } from "express";
import { config } from "../config/app.config";
import passport from "passport";
import { googleLoginCallBack, loginUserController, logOutController, registerUserController } from "../controllers/auth.controller";

const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;
const authRoutes = Router();

authRoutes.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"],
}));

authRoutes.get("/google/callback", passport.authenticate("google", {
    failureRedirect: failedUrl,
}),
    googleLoginCallBack
);

authRoutes.post("/register", registerUserController);
authRoutes.post("/login", loginUserController);
authRoutes.post("/logout", logOutController);

export default authRoutes;