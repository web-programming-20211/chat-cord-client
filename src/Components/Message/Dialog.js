// import Avatar from '@material-ui/core/Avatar'
import { useState, useEffect } from 'react'
import Emoji from '../Emoji/Emoji';
import EmojiIcon from '../Emoji/EmojiIcon';
import DeleteIcon from '@material-ui/icons/Delete';
import Cookies from 'js-cookie';
import axios from 'axios'
import moment from 'moment';

import { Avatar } from 'antd';


const Icons = ({ reactions, self }) => {
    const style = {
        icons: {
            display: 'flex',

            position: 'absolute',
            right: self && 0,
            left: !self && 0,
            bottom: -9,
            borderRadius: '25px',
            backgroundColor: '#aaa',
            paddingLeft: 5,
            paddingRight: 5,
        }
    }

    return (
        <div style={style.icons}>
            {reactions.map((reaction) => {
                if (reaction.from.length !== 0) {
                    return <EmojiIcon key={reaction.reaction_type} emojiIndex={reaction.reaction_type}></EmojiIcon>
                }
                return null
            })}
        </div>
    )
}


const Dialog = ({ dialog, onDelete, room, socket }) => {
    const [widget, setWidget] = useState(false)
    const [enter, setEnter] = useState(false)
    const [reactions, setReaction] = useState([])
    const [self, setSelf] = useState(null)
    const [showTime, setShowTime] = useState(false)

    const style = {
        dialogDiv: {
            width: '95%',
            position: 'relative',
            display: 'flex',
            flexDirection: self ? 'row-reverse' : 'row',
            marginLeft: '20px',
            marginRight: '20px',
            alignItems: 'flex-start',
            padding: '0px',
            marginBottom: '30px',
        },

        bubble: {
            backgroundColor: self ? '#32a6b8' : '#c27f67',
            color: '#ffffff',
            padding: '5px 10px',
            margin: '0px',
            // margin: '10px 0px 25px 0px',
            borderRadius: '25px',
            maxWidth: '100%',
            position: 'relative',
        },

        avatar: {
            position: 'relative',
            marginLeft: self ? '10px' : '0px',
            marginRight: self ? '0px' : '10px',
            marginTop: '5px',
            background: `#${dialog.from.color}`,
            flexShrink: 0,
        },

        widget: {
            flexShrink: 0,
            // opacity: widget ? 1 : 0,
            transition: 'opacity 250ms',
            display: 'flex',
            flexDirection: self ? 'row-reverse' : 'flex',
            flexShrink: 0,
        },

        widgetItem: {
            cursor: 'pointer',
            borderRadius: '50%',
        },

        deleteIcon: {
            background: enter ? '#999999' : '',
            borderRadius: '50%',
            padding: '1px',
            cursor: 'pointer',
            transition: 'background 300ms',
            marginRight: '5px',
        },

        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: self ? 'flex-end' : 'flex-start',
            rowGap: '1em',
        },

        reply: {
            display: 'block',
        },

        dialogDivInfoNameTime: {
            display: 'flex',
            flexDirection: self ? 'row-reverse' : 'flex',
            alignItems: 'baseline',
            width: '100%',
            marginBottom: '-10px',
        },
        dialogDivInfoName: {
            fontFamily: 'Poppins',
            color: '#52585D',
            fontSize: '20px',
            fontWeight: '600',
            marginLeft: self ? '10px' : '0px',
        },
        dialogDivInfoTime: {
            fontFamily: 'Poppins',
            opacity: showTime ? 1 : 0,
            transition: 'opacity 250ms',
            color: '#52585D',
            fontSize: '16px',
            marginLeft: self ? '0px' : '10px',
        },

        dialogDivInfoMessageWidget: {
            display: 'flex',
            flexDirection: self ? 'row-reverse' : 'flex',
        },

        dialogDivInfoMessage: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: self ? 'flex-end' : 'flex-start',
            margin: '0xp',
        },

        dialogDivInfoFiles: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: self ? 'flex-end' : 'flex-start',
        }
    }

    const react = (reaction_id, id) => {
        const cookie = Cookies.get('userId')
        const index = cookie.indexOf('"')
        const new_cookie = cookie.slice(index + 1, cookie.length - 1)

        //edit reactions array
        const tmp = [...reactions]
        let pre_react = 0

        tmp.every(react => {
            const index = react.from.findIndex(user => user.userId === new_cookie)
            if (index !== -1) {
                react.from.splice(index, 1)
                pre_react = react.reaction_type
                return false
            }
            return true
        })

        if (pre_react !== reaction_id) {
            const index = tmp.findIndex(react => react.reaction_type === reaction_id)
            if (index !== -1) {
                tmp[index].from.push({ userId: new_cookie, username: ' ' })
            } else {
                tmp.push({
                    reaction_type: reaction_id,
                    from: [{
                        userId: new_cookie,
                        username: ' '
                    }]
                })
            }
        }

        setReaction([...tmp])

        socket.emit('get-reaction', dialog, reaction_id, new_cookie, room._id)
    }

    useEffect(() => {
        socket.on('return-reaction', (return_dialog) => {
            if (dialog._id === return_dialog._id) {
                setReaction(return_dialog.data)
            }
        })

        if (self === null) {
            const cookie = Cookies.get('userId')
            const index = cookie.indexOf('"')
            setSelf(cookie.slice(index + 1, cookie.length - 1) === dialog.from.userId)
        }

        return () => {
            socket.off('return-reaction')
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dialog])

    useEffect(() => {
        axios.post('/reaction/retrieve', { id: dialog._id }, { withCredentials: true }).then(result => {
            setReaction(result.data.data)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div style={style.dialogDiv} onMouseEnter={() => setShowTime(true)} onMouseLeave={() => setShowTime(false)}>
            {!self && <Avatar size={60} style={style.avatar}>{dialog.from.fullname?.toUpperCase()[0]}</Avatar>}
            {self && <Avatar size={60} style={style.avatar}>{dialog.from.fullname?.toUpperCase()[0]}</Avatar>}
            <div style={style.container} onMouseEnter={() => setWidget(true)} onMouseLeave={() => setWidget(false)}>
                {self && <div style={style.dialogDivInfoNameTime}>
                    <div style={style.dialogDivInfoName}>{dialog.from.fullname}</div>
                    <div style={style.dialogDivInfoTime}>{moment(dialog.createdAt).calendar()}</div>
                </div>}
                {!self && <div style={style.dialogDivInfoNameTime}>
                    <div style={style.dialogDivInfoName}>{dialog.from.fullname}</div>
                    <div style={style.dialogDivInfoTime}>{moment(dialog.createdAt).calendar()}</div>
                </div>}

                <div style={style.dialogDivInfoMessageWidget}>

                    <div style={style.dialogDivInfoMessage}>
                        {dialog.content && <p style={style.bubble}>{dialog.content}</p>}
                        <Icons reactions={reactions} self={self} />
                        <div style={style.dialogDivInfoFiles}>
                            {
                                dialog.urls.length > 0 && dialog.urls.map((url, index) => {
                                    let format = url.split('.').pop().split('?')[0]
                                    if (format === 'mp4') {
                                        return (
                                            <video key={index} style={{ width: '500px', marginBottom: '10px' }} controls>
                                                <source src={url} type="video/mp4" />
                                            </video>
                                        )
                                    } else if (format === 'pdf') {
                                        return (
                                            <a style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} key={index} href={url} target="_blank" rel="noopener noreferrer">
                                                <img src='pdf_file_icon.png' style={{ width: '50px', marginBottom: '10px', marginRight: '10px' }} />
                                                <p>{url.split('%2F').pop().split('?')[0]}</p>
                                            </a>
                                        )
                                    } else if (format === 'docx') {
                                        return (
                                            <a style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} key={index} href={url} target="_blank" rel="noopener noreferrer">
                                                <img src='docx_file_icon.png' style={{ width: '50px', marginBottom: '10px', marginRight: '10px' }} />
                                                <p>{url.split('%2F').pop().split('?')[0]}</p>
                                            </a>
                                        )
                                    }
                                    else if (format === 'jpg' || format === 'png' || format === 'jpeg') {
                                        return <img key={index} src={url} style={{ width: '500px', marginBottom: '10px' }} />
                                    }
                                })
                            }
                        </div>
                    </div>

                    <div style={style.widget}>
                        <Emoji dialog={dialog} react={react} self={self}></Emoji>
                        <DeleteIcon
                            style={style.deleteIcon}
                            onMouseEnter={() => setEnter(true)}
                            onMouseLeave={() => setEnter(false)}
                            onClick={() => onDelete(dialog)}
                        >
                        </DeleteIcon>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Dialog