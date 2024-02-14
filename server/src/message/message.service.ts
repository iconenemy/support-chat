import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateMessageDto } from './dto/message.dto';
import { Message, MessageDocument } from './schema/message.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MessageService {
    constructor(
        @InjectModel(Message.name)
        private readonly messageModel: Model<Message>,
        private readonly userService: UserService,
    ) { }
    async create(payload: CreateMessageDto) {
        const { user } = payload;

        const findUser = await this.userService.findOne(user);
        if (!findUser) throw new NotAcceptableException('Something went wrong');

        return this.messageModel.create({ ...payload, user: findUser._id });
    }

    findAll() {
        return this.messageModel.find();
    }

    findOne(_id: Types.ObjectId) {
        return this.messageModel.aggregate([
            {
                $match: { _id }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                username: 1
                            }
                        }
                    ]
                }
            },
            { $unwind: '$user' }
        ]);
    }

    findByUserId(id: Types.ObjectId) {
        return this.messageModel.findOne({ user: id })
    }

    findManyByRoom(room: Types.ObjectId): Promise<MessageDocument[]> {
        return this.messageModel.aggregate([
            {
                $match: {
                    room: room
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                username: 1
                            }
                        }
                    ]
                }
            },
            { $unwind: '$user' },
            {
                $sort: {
                    created_at: 1
                }
            }
        ])
    }
}
