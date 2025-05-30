import { HTTPSTATUS, HttpStatusCodeType } from "../config/http.config";
import { ErrorCodeEnum, ErrorCodeEnumType } from "../enums/error-code.enum";

export class AppError extends Error {
    public statusCode: HttpStatusCodeType
    public errorCode?: ErrorCodeEnumType;

    constructor(
        message: string,
        statusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR,
        errorCode?: ErrorCodeEnumType
    ){
        super(message)
        this.statusCode=statusCode;
        this.errorCode = errorCode;
        Error.captureStackTrace(this,this.constructor);
    }
}

export class HttpException extends AppError {
    constructor(
        message: "Http Exception Eror",
        statucCode: HttpStatusCodeType,
        errorCode?: ErrorCodeEnumType
    ){
        super(
            message,
            statucCode,errorCode
        );
    }
}

export class InternalServerError extends AppError{
    constructor(
        message = "Internal Server Error",
        erroCode?: ErrorCodeEnumType
    ){
        super(
            message,
            HTTPSTATUS.INTERNAL_SERVER_ERROR,
            erroCode ?? ErrorCodeEnum.INTERNAL_SERVER_ERROR
        );
    }
}

export class NotFoundException extends AppError{
    constructor(
        message = "Resource Not Foound",
        errorCode?: ErrorCodeEnumType
    ){
        super(
            message,
            HTTPSTATUS.NOT_FOUND,
            errorCode?? ErrorCodeEnum.RESOURCE_NOT_FOUND
        );
    }
}

export class BadRequestException extends AppError{
    constructor(message = "Bad Request",errorCode?: ErrorCodeEnumType){
        super(message,HTTPSTATUS.BAR_REQUEST,errorCode ?? ErrorCodeEnum.VALIDATION_ERROR);
    }
}

export class UnauthorizedException extends AppError{
    constructor(
        message = "Unauthorized Error",
        errorCode?: ErrorCodeEnumType
    ){
        super(
            message,
            HTTPSTATUS.UNAUTHORIZED,
            errorCode ?? ErrorCodeEnum.ACCESS_UNAUTHORIZED
        );        
    }
}