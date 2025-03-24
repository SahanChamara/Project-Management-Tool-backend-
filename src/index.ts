import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors"
import session from "cookie-session";
import { config } from "./config/app.config"
import connectDatabase from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { HTTPSTATUS } from "./config/http.config";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { BadRequestException, UnauthorizedException } from "./utils/appError";
import { ErrorCodeEnum } from "./enums/error-code.enum";
import authRoutes from "./routes/auth.route";
import "./config/passport.config";
import passport from "passport";
import userRoutes from "./routes/user.route";
import isAuthenticated from "./middlewares/isAuthenticate.middleware";
import workspaceRoutes from "./routes/workspace.route";

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        name: 'session',
        keys: [config.SESSION_SECRET],
        maxAge: 24 * 60 * 60 * 1000,
        secure: config.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
    })
);

// Passport Initialze
app.use(passport.initialize());
app.use(passport.session());

app.use(
    cors({
        origin: config.FRONTEND_ORIGIN,
        credentials: true,
    })
);

// Main Test End Point
app.get('/', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    throw new BadRequestException(
        "This is a bad request",
        ErrorCodeEnum.VALIDATION_ERROR
    );
    return res.status(HTTPSTATUS.OK).json({
        message: "First EndPOint"
    });
}));

// Other End Points
app.use(`${BASE_PATH}/auth`, authRoutes);           // Authentication Routings....
app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);  // get Current user
app.use(`${BASE_PATH}/workspace`,isAuthenticated,workspaceRoutes);      // create new workspace


// Error handler
app.use(errorHandler)

//Express Start....
app.listen(config.PORT, async () => {
    console.log(`server is running on port ${config.PORT} in ${config.NODE_ENV}`);
    await connectDatabase();
});


