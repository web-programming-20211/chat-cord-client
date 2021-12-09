import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive'

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

const Room = ({room, onClick, leaveHandle, roomManage, choosen}) => {
    const classes = useStyles()
    const [option, setOption] = useState(false)
    const [hover, setHover] = useState(false)

    const limit = useMediaQuery({maxWidth: 1300})

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
            // border: (choosen || hover) ? '3px solid #ffffff' : '3px solid transparent',
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
            // marginRight: '20px',
            // marginLeft: '20px',
            background: '#' + room?.color,
        },

        roomMessage: {
            flexGrow : '1',
        },

        roomMessageName : {
            margin: '0px',
            padding: '0px',
            fontSize: '18px',
            fontWeight: 'bold',
            color: (choosen || hover) ? '#FDFDFE' : '#52585D',
        },

        roomMessageLastMessage : {
            margin: '0px',
            padding: '0px',
            fontSize: '12px',
            color: (choosen || hover) ? '#F2F6F7' : '#96A9BA',
        },

        messageTime : {
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
        }
    }

    useEffect(() => {
        if(option && !choosen)
        {
            setOption(false)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [choosen])

    return (
        <div style={style.room_container} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <div style={style.room}>
                <div style={style.roomInfo} onClick={() => onClick(room)}>
                    {/* <div style={{display: 'flex', flexDirection: limit ? 'column' : 'row', justifyItems: 'center'}}> */}
                        {/* <Avatar style={style.avatar} className={limit ? classes.small : classes.large} sx={{ width: 44, height: 44 }}>{room?.name[0].toUpperCase()}</Avatar> */}
                        <Avatar sx={{ width: 99, height: 99 }}  style={style.avatar} >{room?.name[0].toUpperCase()}</Avatar>
                        <div style={style.roomMessage}>
                        <p style={style.roomMessageName}>{room?.name}</p>
                        <p style={style.roomMessageLastMessage}>{room?.description}</p>
                        </div>
                        <span style={style.messageTime}>11:10 </span>
                    {/* </div> */}
                    {/* <ArrowRightIcon style={style.button} onClick={() => setOption(!option)}></ArrowRightIcon> */}
                </div>

                {/* <div>
                    <div style={style.roomOption}>
                        <p
                            style={{padding: '10px 0px'}}
                            onClick={() => roomManage(room)}
                        >Room management</p>
                    </div>
                    <div style={style.roomOption} onClick={() => leaveHandle(room._id)}>
                        <p style={{color: 'red', padding: '10px 0px'}}>Leave</p>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default Room