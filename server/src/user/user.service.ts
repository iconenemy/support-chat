import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, ObjectId, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly configService: ConfigService,
    ) { }

    async create(payload: CreateUserDto): Promise<UserDocument> {
        const { username, password } = payload;

        const findUser = await this.findByUsername(username);
        if (findUser)
            throw new NotAcceptableException('This username has already exist');

        const hashPassword = await bcrypt.hash(
            password,
            10,
        );

        const newUser = await this.userModel.create({ ...payload, password: hashPassword });
        return this.userModel.findById(newUser._id, { password: 0 })
    }

    findAll(): Promise<User[]> {
        return this.userModel.find();
    }

    findOne(id: Types.ObjectId): Promise<UserDocument> {
        return this.userModel.findById(id);
    }

    update(id: ObjectId, payload: UpdateUserDto) {
        return this.userModel.findByIdAndUpdate(id, payload);
    }

    remove(id: ObjectId) {
        return this.userModel.findByIdAndRemove(id);
    }

    findByUsername(username: string) {
        return this.userModel.findOne({ username: username });
    }

    async updateHashedToken(
        _id: Types.ObjectId,
        hashed_token: string
    ) {
        return this.userModel.findByIdAndUpdate(_id, { hashed_token });
    }
}
