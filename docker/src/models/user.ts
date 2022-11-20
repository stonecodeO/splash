import { string } from 'joi';
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser {
    username: string;
    email: string;
    password: string;
    refreshToken?: string;
    role?: object;
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            user: { type: String, default: 'user' },
            editor: String,
            admin: String
        },
        profile: { type: Schema.Types.ObjectId, ref: 'Profile' },
        refreshToken: { type: String }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IUserModel>('User', UserSchema);
