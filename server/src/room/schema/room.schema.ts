import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Message } from 'src/message/schema/message.schema';
import { User } from 'src/user/schemas/user.schema';
import { Status } from '../types/room.type';

export type RoomDocument = HydratedDocument<Room>;

const schemaOptions = {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
} as SchemaOptions;

@Schema(schemaOptions)
export class Room {
    @Prop({ unique: true })
    room: string;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    host: User;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
    user: User;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }] })
    chat: Message;

    @Prop({
        type: String,
        enum: ['not started', 'processing', 'completed'],
        default: 'not started',
    })
    status: Status;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
