import SendIcon from '@material-ui/icons/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ImageIcon from '@mui/icons-material/Image';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive'
import { TextField, FormControl, InputAdornment } from "@material-ui/core"
import { MessageSharp } from '@material-ui/icons';

const Input = ({ setDialogs }) => {
    const [message, setMessage] = useState('')
    const limit = useMediaQuery({ maxWidth: 900 })
    const limit2 = useMediaQuery({ maxWidth: 600 })
    const style = {
        input: {
            display: 'block',
            position: 'relative',
            right: '-16px',
            bottom: '16px',
            borderSizing: 'border-box',
            width: '105%',
        },

        textField: {
            width: limit2 ? '60%' : limit ? '70%' : '90%',
            fontSize: 'x-large',
            outline: 'none',
            paddingLeft: '20px',
            paddingBottom: '10px',
            paddingTop: '10px',
            marginLeft: '30px',
            backgroundColor: 'transparent',
            color: '#FDFDFD',
        },

        send: {
            position: 'absolute',
            right: 10,
            cursor: 'pointer',
        },

        attach: {
            position: 'absolute',
            right: 50,
            cursor: 'pointer',
        },

        image: {
            position: 'absolute',
            right: 90,
            cursor: 'pointer',
        },

        icons: {
            position: 'absolute',
            left: -40,
            cursor: 'pointer',
        }
    }

    const sendMessage = () => {
        if (message.length > 0) {
            setDialogs(message)
        }
    }

    return (
        <div style={style.input}>
            <FormControl fullWidth sx={{ m: 1 }}>
                <TextField
                    style={style.textField}
                    value={message}
                    onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                            sendMessage()
                            setMessage('')
                        }
                    }}
                    id="outlined-basic"
                    variant="outlined"
                    placeholder='Type a new message...'
                    onChange={(e) => setMessage(e.target.value)}
                    autoComplete="off"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position='end'>
                                <InsertEmoticonIcon
                                    color='primary'
                                    fontSize='large'
                                    style={style.icons}
                                />

                                <SendIcon
                                    onClick={() => {
                                        sendMessage()
                                        setMessage('')
                                    }}
                                    color='primary'
                                    fontSize='large'
                                    style={style.send}
                                />

                                <AttachFileIcon
                                    color='primary'
                                    fontSize='large'
                                    style={style.attach}
                                />

                                <ImageIcon
                                    color='primary'
                                    fontSize='large'
                                    style={style.image}
                                />

                            </InputAdornment>

                        )
                    }}
                />
            </FormControl>
        </div>
    )
}

export default Input