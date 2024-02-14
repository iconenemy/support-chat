import { Types } from 'mongoose';
import {
    IsOptional,
    IsString,
    IsArray,
    Length,
    ArrayMaxSize,
    IsNotEmpty
} from 'class-validator';

import { IRoom } from '../interfaces/room.interface';
import { Status } from '../types/room.type';

export class CreateRoomDto implements Pick<IRoom, 'user' | 'chat' | 'status' | 'room' | 'host'> {
    @IsArray()
    @IsString({ each: true })
    @Length(25, 25, { each: true })
    @ArrayMaxSize(2)
    user: Types.ObjectId[];

    @IsNotEmpty()
    @IsString()
    room: string;

    @IsNotEmpty()
    @IsString()
    host: Types.ObjectId;

    @IsArray()
    @IsString({ each: true })
    @Length(25, 25, { each: true })
    chat: Types.ObjectId[];

    @IsOptional()
    status: Status;
}

export class AddUserToRoomDto implements Pick<IRoom, 'room'> {
    @IsNotEmpty()
    @IsString()
    room: string;

    @IsNotEmpty()
    @IsString()
    @Length(25)
    user: Types.ObjectId;
}

export class AddMessageToRoomDto implements Pick<IRoom, '_id'> {
    @IsNotEmpty()
    @IsString()
    _id: Types.ObjectId;

    @IsNotEmpty()
    @IsString()
    @Length(25)
    message: Types.ObjectId;
}
