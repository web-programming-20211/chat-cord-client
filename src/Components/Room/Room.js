// import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive'
import moment from 'moment';
import { Avatar } from 'antd';
import { Icon } from '@iconify/react';
import { roomService } from "../../service/room"


const useStyles = makeStyles((theme) => ({
    large: {
        width: theme.spacing(10),
        height: theme.spacing(10)
    },

    small: {
        width: theme.spacing(6),
        height: theme.spacing(6)
    }
}))

const Room = ({ room, onClick, lastMsgRoomId, setLastMsgRoomId, leaveHandle, roomManage, choosen }) => {
    const classes = useStyles()
    const [option, setOption] = useState(false)
    const [hover, setHover] = useState(false)
    const [lastMsg, setLastMsg] = useState('')
    const [lastMsgTime, setLastMsgTime] = useState(null)
    const [updateMsg, setUpdateMsg] = useState(false)
    const limit = useMediaQuery({ maxWidth: 1300 })

    const style = {
        room_container: {
            position: 'relative',
            marginTop: '18px',
        },

        room: {
            position: 'relative',
            width: limit ? '12em' : '90%',
            margin: 'auto',
            background: (choosen || hover) ? '#6588DE' : '#E3F6FC',
            padding: '10px',
            borderRadius: '14px',
            boxShadow: (choosen || hover) ? '0px 8px 40px rgba(0, 72, 251, 0.3)' : 'none',
            overflow: 'hidden',
            marginBottom: 10,
            maxHeight: option ? limit ? '250px' : '220px' : '100px',
            transition: 'max-height 250ms, border 250ms, background 250ms',
            height: '74px',
        },

        roomInfo: {
            margin: '0px',
            padding: '0px',
            display: 'flex',
            cursor: 'pointer',
            alignItems: 'center',
            alignContent: 'center',
            flexDirection: 'row',
            gap: '10px',
        },

        avatar: {
            fontSize: '20px',
            flexShrink: 0,
            background: '#' + room?.color,
        },

        roomMessage: {
            flexGrow: '1',
        },

        roomMessageName: {
            margin: '0px',
            padding: '0px',
            fontSize: '18px',
            fontWeight: 'bold',
            color: (choosen || hover) ? '#FDFDFE' : '#52585D',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '150px',
            workBreak: 'break-word',
        },

        roomMessageLastMessage: {
            margin: '0px',
            padding: '0px',
            fontSize: '12px',
            color: (choosen || hover) ? '#F2F6F7' : '#96A9BA',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '150px',
            workBreak: 'break-word',
        },

        messageTime: {
            color: (choosen || hover) ? '#FDFDFE' : '#96A9BA',
        },

        button: {
            position: 'absolute',
            fontSize: '50px',
            color: '#5b5b5b',
            right: '0.5em',
            top: 40,
            margin: 'auto',
            transform: option ? 'rotate(90deg)' : 'none',
            transition: 'transform 200ms'
        },

        roomOption: {
            background: '#c4c4c4',
            fontSize: 'large',
            marginBottom: '0',
            marginTop: '0.1em',
            borderRadius: '5px',
            cursor: 'pointer',
            paddingLeft: '1em',
        },

        private: {
            position: 'absolute',
            fontSize: '30px',
            right: 0,
            top: 0,
            color: '#52585D',
        }
    }

    useEffect(() => {
        async function getLastMsg() {

           if (option && !choosen) {
                setOption(false)
            }
            if (room?._id === lastMsgRoomId) {
                let res = await roomService.getRoom(lastMsgRoomId)
                if (res.status === 200) {
                    setLastMsg(res.data.msg.lastMessage)
                    setLastMsgTime(res.data.msg.lastMessageDate)
                    setUpdateMsg(true)
                }
            } 

        }
        getLastMsg()
    }, [lastMsgRoomId])

    return (
        <div style={style.room_container} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <div style={style.room}>
                <div style={style.roomInfo} onClick={() => onClick(room)}>
                    <Avatar size={56} style={style.avatar} src={room.avatar}></Avatar>
                    <div style={style.roomMessage}>
                        <p style={style.roomMessageName}>{room?.name}</p>
                        <p style={style.roomMessageLastMessage}>{updateMsg ? lastMsg : room?.lastMessage}</p>
                    </div>
                    <span style={style.messageTime}>{moment(`${updateMsg ? lastMsgTime : room?.lastMessageDate}`).fromNow()}</span>
                    {room.isPrivate && <Icon style={style.private} icon="ri:chat-private-line" />}
                </div>
            </div>
        </div>
    )
}

export default Room