import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { useGetAllRoomsQuery } from '../features/chat/chatApiSlice'
import { ContainerScreenCenter } from '../utils/styles'
import { IRoomFindAllRes } from '../features/chat/chat.type'
import { addToRoom } from '../features/chat/chatSlice'

const Rooms = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const { role } = useAppSelector(state => state.persistedReducer.auth.user)
    useEffect(() => {
        if (role === 'guest') navigate('/')
    }, [role])

    const { data: rooms } = useGetAllRoomsQuery()

    const handleClick = (room: string) => {
        dispatch(addToRoom({ room }))
        navigate('/chat')
    }

    return (
        <ContainerScreenCenter maxWidth='md' sx={{ border: '1px solid white' }}>
            <Grid container spacing={2} justifyContent={'center'}>
                {rooms?.map(({ _id, room, host: { username }, status }: IRoomFindAllRes) => (
                    <Grid item key={_id} md={4} xs={6}>
                        <Card sx={{ maxWidth: 345 }}>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography>{room}</Typography>
                                <Typography>{username}</Typography>
                                <Typography color={
                                    status === 'completed'
                                        ? 'green'
                                        : status === 'not started'
                                            ? 'red'
                                            : 'blue'}>
                                    {status}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button variant='contained' fullWidth onClick={() => handleClick(room)}>Go to chat</Button>
                            </CardActions>
                        </Card>
                    </Grid>)
                )}
            </Grid>
        </ContainerScreenCenter>

    )

}

export default Rooms