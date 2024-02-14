import { Schema, Prop, SchemaOptions, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Room } from 'src/room/schema/room.schema';
import { User } from 'src/user/schemas/user.schema';

export type MessageDocument = HydratedDocument<Message>;

const schemaOptions = {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
} as SchemaOptions;

@Schema(schemaOptions)
export class Message {
    @Prop({ type: Types.ObjectId, ref: 'User' })
    user: User;

    @Prop({ type: Types.ObjectId, ref: 'Room' })
    room: Room;

    @Prop()
    content: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
