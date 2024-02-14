import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { IAddToRoom, IChatState } from './chat.type'

const initialState: IChatState = {
    room: ''
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addToRoom: (state, action: PayloadAction<IAddToRoom>) => {
            state.room = action.payload.room
        },
        clearRoom: () => initialState
    }
})

export const { addToRoom, clearRoom } = chatSlice.actions

export default chatSlice.reducer