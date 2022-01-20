import Input from "./Message/Input"
import Dialogs from "./Message/Dialogs"
import ChatHeader from "./ChatHeader"
import { useEffect, useState } from "react"
import { messageService } from "../service/message"

const ChatWindow = ({ socket, currentRoom, setLastMsgRoomId, leave, kickUser }) => {
    const [dialogs, setDialogs] = useState([])
    const [userOnline, setUserOnline] = useState('')
    const [isLoading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState(null)

    const dialogsUpdate = (message, urls) => {
        socket.emit('chat', message, urls, localStorage.getItem('userId'), currentRoom._id)
    }

    const deleteMessage = (dialog, creator) => {
        const userId = localStorage.getItem('userId')
        if (dialog.from.userId === userId || creator === userId) {
            // const temp = [...dialogs]
            // temp.every((d, index) => {
            //     if (d._id === dialog._id) {
            //         temp.splice(index, 1)
            //         return false
            //     }
            //     return true
            // })
            // setDialogs([...temp])
            socket.emit('delete', dialog._id, currentRoom?._id)
        }
    }

    useEffect(async () => {
        if (currentRoom?._id !== -1) {
            setLoading(true)
            let res = await messageService.getMessages(currentRoom?._id)
            if (res.status === 200) {
                setDialogs(res.data.msg)
                setLoading(false)
            }
        }
    }, [currentRoom])

    useEffect(() => {
        socket.on('new_message', (dialog, ctRoom) => {
            setLastMsgRoomId(ctRoom)
            setLastMsgRoomId('')
            if (ctRoom === currentRoom?._id)
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
            socket.off('your_new_message')
            socket.off('dialog-deleted')
        }
    }, [socket])

    useEffect(() => {
        socket.on('loggedIn', (userId) => {
            setUserOnline(userId)
        })

        socket.on('loggedOut', (userId) => {
            setUserOnline(userId)
        })

        return () => {
            socket.off('loggedIn')
            socket.off('loggedOut')
        }

    }, [socket])

    useEffect(() => {
        if (newMessage)
            setDialogs([...dialogs, newMessage])

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newMessage])

    useEffect(() => {
        if (newMessage)
            setDialogs([...dialogs, newMessage])

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newMessage])

    return (
        <div>
            <ChatHeader userOnline={userOnline} room={currentRoom} dialogs={dialogs} leave={leave} socket={socket} />
            {!isLoading && <div><Dialogs room={currentRoom} socket={socket} dialogs={dialogs} setDialogs={setDialogs} deleteMessage={deleteMessage} kickUser={kickUser}></Dialogs>
                < Input setDialogs={dialogsUpdate} /></div>}
        </div>
    )
}

export default ChatWindow