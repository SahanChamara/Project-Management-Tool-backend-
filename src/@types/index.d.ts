import { UserDocuemnt } from "../models/user.mode";

declare global {
    namespace Express {
        interface User extends UserDocuemnt {
            _id?: any;
        }
    }
}