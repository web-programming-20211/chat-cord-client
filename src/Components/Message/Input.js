import SendIcon from '@material-ui/icons/Send'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import ImageIcon from '@mui/icons-material/Image'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import { useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { TextField, FormControl, InputAdornment } from "@material-ui/core"

import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

import { storage } from "../../firebase/index"

const Input = ({ setDialogs }) => {
    const [message, setMessage] = useState('')
    const [showEmoji, setShowEmoji] = useState(false)
    const [files, setFiles] = useState([]);
    const [urls, setUrls] = useState([]);

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
            right: 100,
            cursor: 'pointer',
        },

        image: {
            position: 'absolute',
            right: 50,
            cursor: 'pointer',
        },

        icons: {
            fontSize: '30px',
            position: 'absolute',
            left: -50,
            cursor: 'pointer',
        }
    }

    const handleEmojiSelect = (e) => { setMessage((message) => (message += e.native)) }

    const handleChange = (e) => {
        for (let i = 0; i < e.target.files.length; i++) {
            const newFile = e.target.files[i]
            newFile["id"] = Math.random()
            setFiles((prevState) => [...prevState, newFile])
        }
    }

    const sendMessage = () => {
        if (message.length > 0) {
            const promises = []
            files.map((file) => {
                const promise = new Promise((resolve, reject) => {
                    const metadata = {
                        contentType: file.type
                    }
                    const storageRef = storage.ref(`files/${file.name}`)
                    storageRef.put(file, metadata).then((snapshot) => {
                        snapshot.ref.getDownloadURL().then((url) => {
                            resolve(url)
                        })
                    })
                })
                promises.push(promise)
            })
            Promise.all(promises).then((urls) => {
                setUrls((prevState) => [...prevState, urls])
                setDialogs(message, urls)
            })
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
                                <div style={style.icons} onClick={() => {setShowEmoji(!showEmoji)}}>😂</div>
                                <SendIcon
                                    onClick={() => {
                                        sendMessage()
                                        setMessage('')
                                    }}
                                    color='primary'
                                    fontSize='large'
                                    style={style.send}
                                />
                                <input type="file" multiple onChange={handleChange} />
                                {showEmoji && (
                                    <div>
                                        <Picker
                                            onSelect={handleEmojiSelect}
                                            emojiSize={20} />
                                    </div>
                                )}
                            </InputAdornment>
                        )
                    }}
                />
            </FormControl>
        </div>
    )
}

export default Input