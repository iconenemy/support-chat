import { Types } from 'mongoose';
import { UserRole } from '../types/user.types';

export interface IUser {
    _id: Types.ObjectId;
    username: string;
    password: string;
    role: UserRole;
    hashed_token: string;
}
