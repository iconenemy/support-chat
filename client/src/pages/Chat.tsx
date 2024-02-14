import { useEffect } from 'react'

import { ContainerScreenCenter } from "../utils/styles"
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { addToRoom } from '../features/chat/chatSlice'
import DisplayMessage from '../components/DisplayMessage'
import InputMessage from '../components/InputMessage'
import { useSocket } from '../utils/socket'

const Chat = () => {
    const dispatch = useAppDispatch()
    const { socket } = useSocket()


    const { role } = useAppSelector(state => state.persistedReducer.auth.user)
    const { room } = useAppSelector(state => state.persistedReducer.chat)

    useEffect(() => {
        socket.on('connect', () => { })
        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`)
        })

        if (role === 'guest') {
            socket.on('getRoom', (room) => dispatch(addToRoom(room)))
        } else {
            socket.emit('join', { room })
        }
    }, [])

    return (
        <ContainerScreenCenter maxWidth='md'  >
            <DisplayMessage socket={socket}  />
            <InputMessage socket={socket} />
        </ContainerScreenCenter>
    )
}

export default Chat