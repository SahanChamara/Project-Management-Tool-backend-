import { ErrorRequestHandler, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { AppError } from "../utils/appError";
import { z, ZodError } from "zod";
import { ErrorCodeEnum } from "../enums/error-code.enum";

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

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
            errorCode: error.errorCode,
        });
    }

    if (error instanceof ZodError) {
        return formatZodError(res, error);
    }


    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
        error: error?.message || "Unknown error occured",
    });
}

const formatZodError = (res: Response, error: z.ZodError) => {
    const errors = error?.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
    }));
    return res.status(HTTPSTATUS.BAR_REQUEST).json({
        message: "Validation Failed",
        errors: errors,
        errorCode: ErrorCodeEnum.VALIDATION_ERROR,
    });
};