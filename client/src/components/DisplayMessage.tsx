import { useEffect, useState } from 'react'

import { IMessageRes } from '../features/chat/chat.type'
import MessageItem from './MessageItem'
import { Socket } from 'socket.io-client'
import { useAppSelector } from '../app/hooks'

type Props = {
    socket: Socket
}

const DisplayMessage = ({ socket }: Props) => {
    const { room } = useAppSelector(state => state.persistedReducer.chat)
    const [messages, setMessages] = useState<IMessageRes[]>([])



    useEffect(() => {
        socket.emit('getAllMessage', { room })
        socket.on('recAllMessage', (response: IMessageRes[]) => setMessages(response))
    }, [room])

    useEffect(() => {
        socket.on('recMessage', (message: IMessageRes) => setMessages(prev => [...prev, message]))
    }, [])

    return (
        <div
            style={{
                padding: '10px 15px',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: '20px',
                overflow: 'auto',
                overflowX: 'hidden',
                marginBottom: '15px',
            }}
            id='style-2'
        >
            {messages?.map((item) =>
                <MessageItem

                    key={item._id}
                    {...item}
                />
            )}
        </div>
    )
}

export default DisplayMessage