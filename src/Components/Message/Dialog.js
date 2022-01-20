// import Avatar from '@material-ui/core/Avatar'
import { useState, useEffect } from 'react'
import Emoji from '../Emoji/Emoji';
import EmojiIcon from '../Emoji/EmojiIcon';
import DeleteIcon from '@material-ui/icons/Delete';
import PushPinIcon from '@mui/icons-material/PushPin';
import moment from 'moment';
import { reactionService } from "../../service/reaction"
import { Avatar, Tooltip } from 'antd';


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
        <div style={style.iconsInfo}>
            <div style={style.icons}>
                {reactions.map((reaction) => {
                    if (reaction.from.length !== 0) {
                        return <EmojiIcon key={reaction.reaction_type} emojiIndex={reaction.reaction_type}></EmojiIcon>
                    }
                    return null
                })}
            </div>
        </div>
    )
}


const Dialog = ({ dialog, onDelete, room, socket, kickUser }) => {
    const [widget, setWidget] = useState(false)
    const [enter, setEnter] = useState(false)
    const [reactions, setReaction] = useState([])
    const [self, setSelf] = useState(null)
    const [showTime, setShowTime] = useState(false)
    const [selfAndCreator, setSelfAndCreator] = useState(null)
    const [fileNumber, setFileNumber] = useState(0)
    const [showInfoUser, setShowInfoUser] = useState(false)
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
            borderRadius: '25px',
            maxWidth: '100%',
            position: 'relative',
        },

        avatar: {
            position: 'relative',
            marginTop: '15px',
            background: `#${dialog.from.color}`,
            flexShrink: 0,
        },

        widget: {
            flexShrink: 0,
            opacity: widget ? 1 : 0,
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
            borderRadius: '50%',
            padding: '1px',
            cursor: 'pointer',
        },

        pinIcon: {
            borderRadius: '50%',
            padding: '1px',
            cursor: 'pointer',
        },

        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: self ? 'flex-end' : 'flex-start',
            rowGap: '1em',
            padding: '10px',
            borderRadius: '14px',
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
            display: 'grid',
            gridTemplateColumns: fileNumber === 1 ? 'repeat(1, 1fr)' : fileNumber == 2 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: '10px',
        },

        des: {
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '150px',
            workBreak: 'break-word',
        },

        subInfo: {
            position: 'absolute',
            backgroundColor: 'rgb(227, 246, 252)',
            bottom: '80px',
            left: !self ? '-11px': 'none',
            right: self ? '-11px': 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            padding: '10px',
            borderRadius: '20px',
            alignContent: 'flex-end',
            alignItems: 'center',
        },

        subInfoContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },

        subInfoFullNameandUsername: {
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
        },

        subInfoFullName: {
            fontSize: '20px',
            color: 'rgb(82, 88, 93)',
        },

        subInfoUsername: {
            color: 'rgb(255, 255, 255)',
            background: 'rgb(101, 136, 222)',
            padding: '4px',
            borderRadius: '10px',
            fontSize: '10px',
            textAlign: 'center',
        },

        kick: {
            fontSize: '15px',
            margin: '0',
            border: '1px solid red',
            fontWeight: 600,
            color: 'red',
            width: '100%',
            textAlign: 'center',
            borderRadius: '10px',
            cursor: 'pointer',
        }
    }

    const react = (reaction_id, id) => {
        const user_id = localStorage.getItem('userId')
        const tmp = [...reactions]
        let pre_react = 0

        tmp.every(react => {
            const index = react.from.findIndex(user => user.userId === user_id)
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
                tmp[index].from.push({ userId: user_id, username: ' ' })
            } else {
                tmp.push({
                    reaction_type: reaction_id,
                    from: [{
                        userId: user_id,
                        username: ' '
                    }]
                })
            }
        }

        setReaction([...tmp])

        socket.emit('get-reaction', dialog, reaction_id, user_id, room._id)
    }

    const setPin = () => {
        socket.emit('set-pin', dialog, room._id)
    }

    useEffect(() => {
        socket.on('return-reaction', (return_dialog) => {
            if (dialog._id === return_dialog._id) {
                setReaction(return_dialog.data)
            }
        })

        if (self === null) {
            const userId = localStorage.getItem('userId')
            setSelf(userId === dialog.from.userId)
            if (userId === room.creator)
                setSelfAndCreator(true)
        }

        return () => {
            socket.off('return-reaction')
        }
    }, [dialog, socket])


    useEffect(async () => {
        let res = await reactionService.getReactionsByMessage(dialog._id)
        if (res.status === 200)
            setReaction(res.data.data)

    }, [])

    useEffect(() => {
        setFileNumber(dialog.urls.length)
    }, [])

    return (
        <div style={style.dialogDiv} onMouseEnter={() => setShowTime(true)} onMouseLeave={() => setShowTime(false)}>
            {!self &&
                <div>
                    <Avatar onMouseEnter={() => setShowInfoUser(!showInfoUser)} size={60} style={style.avatar} src={dialog.from.avatar}></Avatar>
                    {showInfoUser && <div style={style.subInfo}>
                        <div style={style.subInfoContainer}>
                            <Avatar size={70} style={style.subInfoAvatar} src={dialog.from.avatar}></Avatar>
                            <div style={style.subInfoFullNameandUsername}>
                                <div style={style.subInfoFullName}>{dialog.from.fullname}</div>
                                <div style={style.subInfoUsername}>{dialog.from.username}</div>
                            </div>
                        </div>
                        {localStorage.getItem("userId") === room.creator && <p style={style.kick} onClick={() => kickUser(dialog.from.userId, room._id)} >Kick</p>}
                    </div>}
                </div>
            }
            {self &&
                <div>
                    <Avatar onMouseEnter={() => setShowInfoUser(!showInfoUser)} size={60} style={style.avatar} src={dialog.from.avatar}></Avatar>
                    {showInfoUser && <div style={style.subInfo}>
                        <div style={style.subInfoContainer}>
                            <Avatar size={70} style={style.subInfoAvatar} src={dialog.from.avatar}></Avatar>
                            <div style={style.subInfoFullNameandUsername}>
                                <div style={style.subInfoFullName}>{dialog.from.fullname}</div>
                                <div style={style.subInfoUsername}>{dialog.from.username}</div>
                            </div>
                        </div>
                        <p style={style.kick} onClick={() => kickUser(dialog.from.userId, room._id)} >Kick</p>
                    </div>}
                </div>
            }
            <div style={style.container} onMouseEnter={() => setWidget(true)} onMouseLeave={() => setWidget(false)}>
                {self && <div style={style.dialogDivInfoNameTime}>
                    <div style={style.dialogDivInfoName}>{dialog.from.username}</div>
                    <div style={style.dialogDivInfoTime}>{moment(dialog.createdAt).calendar()}</div>
                </div>}
                {!self && <div style={style.dialogDivInfoNameTime}>
                    <div style={style.dialogDivInfoName}>{dialog.from.username}</div>
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
                                            <video key={index} onClick={(e) => { e.target.classList.toggle("zoom") }} style={{ width: '500px', marginBottom: '10px', transition: '1s' }} controls>
                                                <source src={url} type="video/mp4" />
                                            </video>
                                        )
                                    } else if (format === 'pdf') {
                                        return (
                                            <a style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} key={index} href={url} target="_blank" rel="noopener noreferrer">
                                                <img src='https://firebasestorage.googleapis.com/v0/b/chat-cord-712bf.appspot.com/o/default-avatar%2Fpdf_file_icon.png?alt=media&token=f12bd4a4-9d41-4096-9596-b3dfeb8d24b5' style={{ width: '50px', marginBottom: '10px', marginRight: '10px' }} />
                                                <p style={style.des}>{url.split('%2F').pop().split('?')[0]}</p>
                                            </a>
                                        )
                                    } else if (format === 'docx' || format === 'doc') {
                                        return (
                                            <a style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} key={index} href={url} target="_blank" rel="noopener noreferrer">
                                                <img src='https://firebasestorage.googleapis.com/v0/b/chat-cord-712bf.appspot.com/o/default-avatar%2Fdocx_file_icon.png?alt=media&token=8c3eeb46-718b-4277-862f-da3236fb6182' style={{ width: '50px', marginBottom: '10px', marginRight: '10px', }} />
                                                <p style={style.des}>{url.split('%2F').pop().split('?')[0]}</p>
                                            </a>
                                        )
                                    }
                                    else if (format === 'jpg' || format === 'png' || format === 'jpeg') {
                                        return (
                                            <img key={index} onClick={(e) => { e.target.classList.toggle("zoom") }} src={url} style={{ width: '100%', height: '150px', objectFit: 'cover', marginBottom: '10px', transition: '1s' }} />
                                        )
                                    }
                                })

                            }
                        </div>
                    </div>

                    <div style={style.widget}>
                        <Emoji dialog={dialog} react={react} self={self}></Emoji>
                        <PushPinIcon style={style.pinIcon} onClick={() => {
                            setPin()
                        }}></PushPinIcon>
                        {(self || selfAndCreator) &&
                            <DeleteIcon
                                style={style.deleteIcon}
                                onClick={() => {
                                    onDelete(dialog, room.creator)
                                }}
                            >
                            </DeleteIcon>
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Dialog