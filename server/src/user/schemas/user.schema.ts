import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from '../types/user.types';

export type UserDocument = HydratedDocument<User>;

const schemaOptions = {
    versionKey: false,
} as SchemaOptions;

@Schema(schemaOptions)
export class User {
    @Prop({ unique: true })
    username: string;

    @Prop()
    password: string;

    @Prop({
        type: String,
        enum: ['admin', 'support', 'guest'],
        default: 'guest',
    })
    role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
