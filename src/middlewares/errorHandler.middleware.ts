import { ErrorRequestHandler } from "express";
import { HTTPSTATUS } from "../config/http.config";

export const errorHandler: ErrorRequestHandler = (
    error,
    req,
    res,
    next
): any => {
    console.error(`Error Occured on PATH: ${req.path}`, error);

    if (error instanceof SyntaxError) {
        return res.status(HTTPSTATUS.BAR_REQUEST).json({
            message: "Invalid Json Format. Please check your request"
        });
    }
    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
        error: error?.message || "Unknown error occured",
    });
}