import {
    IsString,
    IsNotEmpty,
    MinLength,
    MaxLength,
    IsOptional,
} from 'class-validator';
import { Types } from 'mongoose'
import { IUser } from 'src/user/interfaces/user.interface';

import { UserRole } from 'src/user/types/user.types';

export class SignUpDto implements Omit<IUser, '_id' | 'hashed_token'> {
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(25)
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password: string;

    @IsOptional()
    role: UserRole;
}

export class SignInDto implements Pick<IUser, 'username' | 'password'> {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class JwtIssueDto implements Pick<IUser, '_id' | 'username' | 'role'> {
    _id: Types.ObjectId;
    username: string;
    role: UserRole;
}
