import SendIcon from '@material-ui/icons/Send'
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
    const [previewImage, setPreviewImage] = useState([{ id: null, url: null, name: null, fileUrl: null }]);

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
            // width: '90%',
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
            color: '#6082B6',
            fontSize: '30px',
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
            // left: 12,
            bottom: 14
        },

        fileImage: {
            color: '#6082B6',
            fontSize: '30px',
            position: 'absolute',
            cursor: 'pointer',
            right: 50,
            // left: 12,
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
            width: '100px',
            height: '100px',
            borderRadius: '10px'
        },

        deletePreviewIcon: {
            color: 'red',
            fontSize: '20px',
            cursor: 'pointer',
            position: 'relative',
            top: '-56px',
        },

        fileName: {
            position: 'relative',
            left: '50px',
            top: '5px',
            color: 'white'
        },

        addFile: {
            display: 'grid',
            placeItems: 'center',
            position: 'relative',
            bottom: 18,
            left: 18,
            width: '100px',
            height: '100px',
            borderRadius: '10px',
            border: '1px dashed #F9FBFB',
            boxSizing: 'border-box',
            // bottom: '10px'
        },

        addIcon: {
            fontSize: '50px',
            color: '#F9FBFB',
        }
    }

    const handleEmojiSelect = (e) => { setMessage((message) => (message += e.native)) }

    const deletePreview = (id) => {
        setPreviewImage(previewImage.filter(item => item.id !== id))
        // setPreviewFile(previewFile.filter(item => item.id !== id))
        setFiles(files.filter(item => item.id !== id))
    }

    const handleImageChange = (e) => {
        // convert to base64
        for (let i = 0; i < e.target.files.length; i++) {
            const newFile = e.target.files[i]
            newFile["id"] = Math.random()
            let fileUrl = ''
            let name = ''
            // check file type is not image
            if (newFile.type.split('/')[0] !== 'image') {
                fileUrl = 'file.png'
                name = `file ${i + 1}`
            } else {
                fileUrl = null
                name = `image ${i + 1}`
            }


            const reader = new FileReader()
            reader.readAsDataURL(newFile)
            reader.onloadend = () => {
                setPreviewImage((prevState) => [...prevState, { id: newFile["id"], url: reader.result, name, fileUrl }])
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
        // setPreviewFile([])
        setPreviewImage([])
        setFiles([])
    }
    const PreviewSelectedFiles = () => {
        if (previewImage) {
            return (
                <div style={style.preview}>
                    {previewImage.map((item) => {
                        return (
                            <div key={item.id}>
                                <Icon onClick={() => deletePreview(item.id)} style={style.deletePreviewIcon} icon="ep:circle-close" />
                                <img style={style.thumbnail} src={item.fileUrl ? item.fileUrl : item.url} alt="thumb" />
                                <p style={style.fileName}>{item.name}</p>

                            </div>
                        )
                    })}
                    <div style={style.addFile}>
                        <label htmlFor="files"><Icon style={style.addIcon} icon="carbon:add-alt" /></label>
                    </div>
                </div>
            )
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
                                {/* <SendIcon
                                    onClick={() => {
                                        sendMessage()
                                        setMessage('')
                                    }}
                                    color='primary'
                                    fontSize='large'
                                    style={style.send}
                                /> */}
                                <Icon onClick={() => {
                                    sendMessage()
                                    setMessage('')
                                }}

                                    style={style.send} icon="akar-icons:send" />

                                <Icon icon="fluent:emoji-24-regular" style={style.icons} onClick={() => { setShowEmoji(!showEmoji) }}></Icon>
                                <label htmlFor="files"><Icon style={style.fileImage} icon="akar-icons:image" /></label>
                                <input id="files" style={{ visibility: "hidden" }} type="file" multiple onChange={handleImageChange} />
                                {/* <label htmlFor="files"><Icon style={style.file} icon="eva:attach-fill" /></label>
                                <input id="files" style={{ visibility: "hidden" }} type="file" accept=".pdf, .txt, .docx" multiple onChange={handleFileChange} /> */}
                                {files.length > 0 && <PreviewSelectedFiles />}
                                {showEmoji && (
                                    <div style={{ position: "fixed", bottom: "80px", left: "20%", zIndex: "1" }}>
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