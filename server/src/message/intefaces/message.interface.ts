import { Types } from 'mongoose';

export interface IMessage {
    _id: Types.ObjectId;
    room: Types.ObjectId;
    user: Types.ObjectId;
    content: string;
    created_at: Date
    updated_at: Date
}
