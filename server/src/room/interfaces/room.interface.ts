import { Types } from 'mongoose';
import { Status } from '../types/room.type';

export interface IRoom {
    _id: Types.ObjectId;
    room: string;
    host: Types.ObjectId;
    user: Types.ObjectId[];
    chat: Types.ObjectId[];
    status: Status;
    created_at: Date;
    updated_at: Date;
}
