import {
    IsAlphanumeric,
    MinLength,
    MaxLength,
    IsNotEmpty,
    IsOptional,
} from 'class-validator';

import { IUser } from '../interfaces/user.interface';
import { UserRole } from '../types/user.types';

export class CreateUserDto
    implements Pick<IUser, 'username' | 'password' | 'role'>
{
    @IsAlphanumeric()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(25)
    username: string;

    @IsAlphanumeric()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(30)
    password: string;

    @IsOptional()
    role: UserRole;
}

export class UpdateUserDto implements Omit<IUser, 'password' | '_id'> {
    @IsAlphanumeric()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(25)
    @IsOptional()
    username: string;

    @IsOptional()
    role: UserRole;

    @IsOptional()
    hashed_token: string;
}
