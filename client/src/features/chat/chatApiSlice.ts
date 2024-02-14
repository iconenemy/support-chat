import { apiSlice } from "../../app/api/apiSlice";
import { IUser } from "../auth/auth.type";
import { IMessage, IRoomFindAllRes } from "./chat.type";

export const chatApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllRooms: builder.query<IRoomFindAllRes[], void>({
            query: () => ({ url: "room" }),
        }),
        getMessageById: builder.query<IMessage, string>({
            query: (id) => ({ url: `message/${id}` })
        }),
        getUserById: builder.query<IUser, string>({
            query: (id) => ({ url: `user/${id}` })
        }),
    }),
});

export const { useGetAllRoomsQuery, useGetMessageByIdQuery, useGetUserByIdQuery } = chatApiSlice;
