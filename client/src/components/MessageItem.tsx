import { useEffect, useRef } from "react"

import Box from "@mui/material/Box"

import { useAppSelector } from "../app/hooks"
import { Typography } from "@mui/material"
import { UserRes } from "../features/chat/chat.type"

type Props = {
    _id: string
    user: UserRes
    content: string
    created_at: Date
}

const MessageItem = ({ _id, user, content, created_at }: Props) => {
    const { _id: userId } = useAppSelector(state => state.persistedReducer.auth.user)

    const bottomElRef = useRef<null | HTMLDivElement>(null)
    useEffect(() => {
        bottomElRef?.current?.scrollIntoView({ behavior: 'auto' })
    }, [])

    return (
        <Box ref={bottomElRef} width={'100%'} display={'flex'} justifyContent={user._id === userId ? 'flex-end' : 'flex-start'}>
            <div
                key={_id}
                style={{
                    maxWidth: '60%',
                    minWidth: '50%',
                    maxHeight: '600px',
                    padding: '10px',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                    backgroundColor: `${user._id === userId ? '#d6b78f' : '#272727'}`,
                    borderRadius: '15px'
                }}
            >
                <Typography color={'white'}>{user.username}</Typography>
                <h3 style={{ overflowWrap: 'break-word', color: 'whitesmoke' }}>{content}</h3>
            </div>
        </Box>
    )
}

export default MessageItem