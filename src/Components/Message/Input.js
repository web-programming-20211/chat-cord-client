/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import SendIcon from '@material-ui/icons/Send'
// import AttachFileIcon from '@mui/icons-material/AttachFile'
// import ImageIcon from '@mui/icons-material/Image'
// import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import { useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { TextField, FormControl, InputAdornment } from "@material-ui/core"

import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

import { storage } from "../../firebase/index"
import { Icon } from '@iconify/react'

const Input = ({ setDialogs }) => {
    const [message, setMessage] = useState('')
    const [showEmoji, setShowEmoji] = useState(false)
    const [files, setFiles] = useState([]);
    const [urls, setUrls] = useState([]);
    const [previewImage, setPreviewImage] = useState([{id: null, url: null}]);

    const limit = useMediaQuery({ maxWidth: 900 })
    const limit2 = useMediaQuery({ maxWidth: 600 })
    const style = {
        input: {
            display: 'block',
            position: 'relative',
            // right: '-16px',
            // bottom: '16px',
            // borderSizing: 'border-box',
            left: '10px',
            top: '20px',
            width: '108%',
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
            left: -45,
            color: '#6082B6',
            cursor: 'pointer',
        },

        file: {
            color: '#6082B6',
            fontSize: '30px',
            position: 'absolute',
            cursor: 'pointer',
            right: 45,
            bottom: 14
        },

        preview: {
            zIndex: 1,
            position: 'absolute',
            width: '100%',
            height: '200px',
            right: '1px',
            bottom: '60px',
            background: '#6588DE',
            boxShadow: '0px 8px 40px rgba(0, 72, 251, 0.3)',
            borderRadius: '14px',
            padding: '20px',
            display: 'flex',
            // justifyContent: 'center',
            alignItems: 'center',
        },

        thumbnail: {
            width: '120px',
            height: '100px'
        },

        deletePreviewIcon: {
            color: 'red',
            fontSize: '20px',
            cursor: 'pointer',
            position: 'relative',
            top: '-56px',
        }
    }

    const handleEmojiSelect = (e) => { setMessage((message) => (message += e.native)) }

    const deletePreview = (id) => {
        setPreviewImage(previewImage.filter(item => item.id !== id))
        setFiles(files.filter(item => item.id !== id))
    }
    
    const handleChange = (e) => {
        // convert to base64
        for (let i = 0; i < e.target.files.length; i++) {
            const newFile = e.target.files[i]
            console.log(newFile)
            newFile["id"] = Math.random()
            const reader = new FileReader()
            reader.readAsDataURL(newFile)
            reader.onloadend = () => {
                setPreviewImage((prevState) => [...prevState, { id: newFile["id"], url: reader.result}])
            }
            setFiles((prevState) => [...prevState, newFile])
        }
    }

    const sendMessage = () => {
        if (message.length > 0 || files.length > 0) {
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
        setPreviewImage([])
        setFiles([])
    }
    const PreviewSelectedFiles = () => {
        // const reader = new FileReader()
        return (
            <div style={style.preview}>
                {previewImage.map((item) => {
                    return (
                        <div key={item.id}>
                            <Icon onClick={() => deletePreview(item.id)} style={style.deletePreviewIcon} icon="ep:circle-close" />
                            <img style={style.thumbnail} src={item.url} alt="thumb" />
                        </div>
                    )
                })}
            </div>
        )
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
                                <Icon icon="fluent:emoji-24-regular" style={style.icons} onClick={() => {setShowEmoji(!showEmoji)}}></Icon>
                                <SendIcon
                                    onClick={() => {
                                        sendMessage()
                                        setMessage('')
                                    }}
                                    color='primary'
                                    fontSize='large'
                                    style={style.send}
                                />
                                <label htmlFor="files"><Icon style={style.file} icon="akar-icons:folder" /></label>
                                <input id="files" style={{ visibility: "hidden" }} type="file" multiple onChange={handleChange} />
                                {files.length > 0 && <PreviewSelectedFiles />}
                                {showEmoji && (
                                    <div style={{ position: "fixed", bottom: "80px", left: "20%"}}>
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