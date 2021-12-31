/* eslint-disable react-hooks/exhaustive-deps */
import Input from "./Message/Input"
import Dialogs from "./Message/Dialogs"
import ChatHeader from "./ChatHeader"
import axios from 'axios'
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
// import Snackbar from '@material-ui/core/Snackbar'
// import MuiAlert from '@material-ui/lab/Alert'

// const Alert = (props) => {
//     return <MuiAlert elevation={6} variant='filled' {...props} />
// }

const ChatWindow = ({ socket, room, setLastMsgRoomId, rooms, setRooms, leave }) => {
    const [dialogs, setDialogs] = useState([])
    const [currentRoom, setRoom] = useState(room)
    const [newMessage, setNewMessage] = useState(null)
    const [userOnlines, setUserOnlines] = useState([])

    // const style = {
    //     container: {
    //         height: '100vh',
    //         width: '90%',
    //         background: '#E3F6FC',
    //         borderRadius: '10px',
    //         margin: '50px 50px 50px 30px'
    //     },

    // }

    const dialogsUpdate = (message, urls) => {
        socket.emit('chat', message, urls, Cookies.get('userId'), room._id)
    }

    const deleteMessage = (dialog, creator) => {
        const cookie = Cookies.get('userId')
        const index = cookie.indexOf('"')
        let userId = cookie.slice(index + 1, cookie.length - 1)
        if (dialog.from.userId === userId || creator === userId) {
            const temp = [...dialogs]
            temp.every((d, index) => {
                if (d._id === dialog._id) {
                    temp.splice(index, 1)
                    return false
                }
                return true
            })
            setDialogs([...temp])
            socket.emit('delete', dialog._id, room)
        }
    }

    useEffect(() => {
        setRoom(room)
        if (room?._id !== -1)
            axios.get('/message/room/' + room?._id, { withCredentials: true }).then(response => {
                setDialogs(response.data.msg)
            })
    }, [room])

    useEffect(() => {
        socket.on('your_new_message', (dialog, ctRoom) => {
            setLastMsgRoomId(ctRoom)
            setLastMsgRoomId('')
            if (ctRoom === room?._id)
                setNewMessage(dialog)
        })
        socket.on('dialog-deleted', (id) => {
            const temp = [...dialogs]
            temp.every((d, index) => {
                if (d._id === id) {
                    temp.splice(index, 1)
                    return false
                }
                return true
            })
            setDialogs([...temp])
        })
        return () => {
            // socket.off('logged')
            socket.off('your_new_message')
            socket.off('dialog-deleted')
        }
    }, [dialogs, socket])

    useEffect(() => {
        if (newMessage) {
            setDialogs([...dialogs, newMessage])
        }
    }, [newMessage])

    useEffect(() => {
        socket.on('loggedIn', (users) => {
            setUserOnlines([...users])
        })

        socket.on('loggedOut', (users) => {
            setUserOnlines([...users])
        })

        return () => {
            socket.off('loggedIn')
            socket.off('loggedOut')
        }

    }, [userOnlines,socket])

    return (
        <div>
            <ChatHeader userOnlines={userOnlines} room={room} dialogs={dialogs} leave={leave} socket={socket} />
            <div>
                <Dialogs room={currentRoom} socket={socket} dialogs={dialogs} setDialogs={setDialogs} deleteMessage={deleteMessage} ></Dialogs>
                <Input room={currentRoom} setDialogs={dialogsUpdate} socket={socket}></Input>
            </div>
        </div>
    )
}

export default ChatWindow