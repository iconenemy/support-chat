import { IUser } from "../auth/auth.type"

export type RoomStatus = 'not started' | 'processing' | 'completed'

export interface IMessage {
    _id: string
    user: string
    room: string
    content: string
    created_at: Date
    updated_at: Date
}

export interface IRoom {
    _id: string;
    room: string;
    host: string;
    user: string[];
    chat: string[];
    status: RoomStatus
    created_at: Date;
    updated_at: Date;
}

export interface IRoomFindAllRes {
    _id: string;
    room: string;
    host: UserRes;
    user: string[];
    chat: string[];
    status: RoomStatus
    created_at: Date;
    updated_at: Date;
}

export interface IMessageRes {
    _id: string
    user: UserRes
    room: string
    content: string
    created_at: Date
    updated_at: Date
}

export interface IChatState {
    room: string
}

export interface IAddToRoom {
    room: string
}

export type UserRes = Pick<IUser, '_id' | 'username'>