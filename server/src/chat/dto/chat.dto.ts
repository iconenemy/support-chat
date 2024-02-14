import { Types } from 'mongoose';
import { IsNotEmpty, Length, IsString } from 'class-validator';

import { IMessage } from 'src/message/intefaces/message.interface';
import { IRoom } from 'src/room/interfaces/room.interface';

export class CreateMessageDto implements Pick<IMessage, 'content'>, Pick<IRoom, 'room'> {
    @IsNotEmpty()
    @IsString()
    @Length(5, 500)
    content: string;

    @IsNotEmpty()
    @IsString()
    room: string
}

export class JoinedUserDto implements Pick<IRoom, 'room'> {
    @IsNotEmpty()
    @IsString()
    room: string;
}

export class GetAllMessageDto implements Pick<IRoom, "room"> {
    @IsNotEmpty()
    @IsString()
    room: string;
}
