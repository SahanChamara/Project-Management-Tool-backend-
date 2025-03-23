import { UserDocuemnt } from "../models/user.model";

declare global {
    namespace Express {
        interface User extends UserDocuemnt {
            _id?: any;
        }
    }
}