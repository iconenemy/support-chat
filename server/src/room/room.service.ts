import { Injectable, NotAcceptableException } from '@nestjs/common';
import {
    AddMessageToRoomDto,
    AddUserToRoomDto,
    CreateRoomDto,
} from './dto/room.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Room, RoomDocument } from './schema/room.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class RoomService {
    constructor(
        @InjectModel(Room.name) private readonly roomModel: Model<Room>,
    ) { }

    create(payload: CreateRoomDto): Promise<RoomDocument> {
        return this.roomModel.create(payload);
    }

    deleteByRoom(room: string): Promise<RoomDocument> {
        return this.roomModel.findOneAndRemove({ room: room });
    }

    findRoomByName(room: string): Promise<RoomDocument> {
        return this.roomModel.findOne({ room });
    }

    findRoomByHost(host: Types.ObjectId): Promise<RoomDocument> {
        return this.roomModel.findOne({ host });
    }

    async addUserToRoom(payload: AddUserToRoomDto) {
        const { room, user } = payload;

        const findRoom = await this.findRoomByName(room);
        if (!findRoom) throw new NotAcceptableException('No such room');

        return this.roomModel.findByIdAndUpdate(findRoom._id, {
            $push: { user: user },
            status: 'processing',
        });
    }

    async addMessageToRoom(payload: AddMessageToRoomDto) {
        const { _id, message } = payload

        this.roomModel.findByIdAndUpdate(_id, { $push: { chat: message } })
    }

    findAll(): Promise<RoomDocument[]> {
        return this.roomModel.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'host',
                    foreignField: '_id',
                    as: 'host',
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
            {
                $unwind: '$host'
            }
        ])
    }

    findOne(_id: Types.ObjectId): Promise<RoomDocument> {
        return this.roomModel.findById(_id)
    }

}
