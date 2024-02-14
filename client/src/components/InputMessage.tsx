import { useFormik } from 'formik'

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import { useAppSelector } from "../app/hooks";
import { Socket } from 'socket.io-client';

type Props = {
    socket: Socket
}

const InputMessage = ({ socket }: Props) => {
    const { room } = useAppSelector(state => state.persistedReducer.chat)

    const formik = useFormik({
        initialValues: {
            content: "",
            room
        },
        onSubmit: (formData, { resetForm }) => {
            socket.emit('newMessage', formData)
            resetForm()
        },
    })

    return (
        <Paper
            onSubmit={formik.handleSubmit}
            component="form"
            sx={{ 
                p: '10px 0px 10px 10px', 
                display: 'flex', 
                alignItems: 'center', 
                width: '100%', 
                borderRadius: '20px', 
                backgroundColor: '#272727', 
                height: '10vh' 
            }}
        >
            <InputBase
                required
                sx={{ ml: 1, flex: 1, color: '#fff3e0', }}
                placeholder="Type your message"
                name="content"
                value={formik.values.content}
                onChange={formik.handleChange}
            />
            <IconButton type="submit" color="primary" sx={{ p: '10px' }} >
                <SendIcon />
            </IconButton>
        </Paper>
    )
}

export default InputMessage