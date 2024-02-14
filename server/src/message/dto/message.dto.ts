import {
    IsNotEmpty,
    IsAlphanumeric,
    MaxLength,
    IsOptional,
    Length,
    IsString,
} from 'class-validator';
import { Types } from 'mongoose';

import { IMessage } from '../intefaces/message.interface';

export class CreateMessageDto
    implements Pick<IMessage, 'content' | 'user' | 'room'>
{
    @IsNotEmpty()
    @Length(24)
    user: Types.ObjectId;

    @IsNotEmpty()
    @IsString()
    @MaxLength(500)
    content: string;

    @IsNotEmpty()
    @Length(24)
    room: Types.ObjectId;
}

export class UpdateMessageDto
    implements Pick<IMessage, 'content' | 'user' | 'room'>
{
    @IsOptional()
    @Length(24)
    @IsNotEmpty()
    user: Types.ObjectId;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @MaxLength(500)
    content: string;

    @IsOptional()
    @IsNotEmpty()
    @Length(24)
    room: Types.ObjectId;
}
