import { io } from 'socket.io-client'

import { useAppSelector } from '../../app/hooks'
import { useRefreshQuery } from '../../app/api/apiSlice'

export const useSocket = () => {
    useRefreshQuery()
    const { access_token } = useAppSelector(state => state.persistedReducer.auth.tokens)
    
    const uri: string = 'http://localhost:5000'

    const socketOptions = {
        withCredentials: true,
        auth: { token: 'Bearer ' + access_token },
        transports: ['websocket']
    }

    const socket = io(uri, socketOptions)

    return { socket }
}