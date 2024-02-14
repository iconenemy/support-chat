import { useEffect } from 'react'
import { IMessageFindAllRes } from '../../features/chat/chat.type'

export const useAutoScroll = (lastMessageRef: any, messages: IMessageFindAllRes[]) => {
    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])
}