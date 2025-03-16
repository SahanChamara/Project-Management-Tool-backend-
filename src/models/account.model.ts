import mongoose, { Document, Schema } from "mongoose";
import { string } from "zod";
import { ProviderEnum, ProviderEnumType } from "../enums/account-provider.enum";

export interface AccountDoucment extends Document {
    provider: ProviderEnumType;
    providerId: string;
    userId: mongoose.Types.ObjectId;
    refreshToken: string | null;
    tokenExpiry: Date | null,
    createdAt: Date;
}

const accountSchema = new Schema<AccountDoucment>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        provider: {
            type: String,
            enum: Object.values(ProviderEnum),
            required: true,
        },
        providerId: {
            type: String,
            required: true,
            unique: true,
        },
        refreshToken: {
            type: String,
            default: null,
        },
        tokenExpiry: {
            type: Date,
            dafault: null,
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.refreshToken
            },
        },
    }
);

const AccountModel = mongoose.model<AccountDoucment>("Account",accountSchema);
export default AccountModel;