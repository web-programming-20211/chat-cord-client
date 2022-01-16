import Input from "./Message/Input"
import Dialogs from "./Message/Dialogs"
import ChatHeader from "./ChatHeader"
import { useEffect, useState } from "react"
import { messageService } from "../service/message"

const ChatWindow = ({ socket, room, setLastMsgRoomId, rooms, setRooms, leave }) => {
    const [dialogs, setDialogs] = useState([])
    const [currentRoom, setRoom] = useState(room)
    const [userOnlines, setUserOnlines] = useState([])

    const dialogsUpdate = (message, urls) => {
        socket.emit('chat', message, urls, localStorage.getItem('userId'), room._id)     
    }

    const deleteMessage =async (dialog, creator) => {
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
            await socket.emit('delete', dialog._id, room)
        }
    }

    useEffect(async () => {
        setRoom(room)
        if (room?._id !== -1) {
            let res = await messageService.getMessages(room?._id)
            if (res.status === 200) {
                setDialogs(res.data.msg)
            }
        }
    }, [room])

    useEffect(() => {
        socket.on('your_new_message', (dialog, ctRoom) => {
            setLastMsgRoomId(ctRoom)
            setLastMsgRoomId('')
            if (ctRoom === room?._id)
                setDialogs([...dialogs, dialog])
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
    }, [dialogs, socket])

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

    }, [userOnlines, socket])

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