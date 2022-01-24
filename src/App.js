/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import '../src/App.css';
import io from 'socket.io-client';
import ChatWindow from "./Components/ChatWindow";
import Login from './Components/Login/Login';
import Loading from './Components/Loading';
import UserArea from "./Components/UserInformation/UserArea";
import RoomsList from "./Components/Rooms/RoomsList";
import RoomsHeader from "./Components/Rooms/RoomsHeader";
import Guide from './Components/Guide/Guide';
import { useMediaQuery } from 'react-responsive'
import { toast } from 'react-toastify'
import SearchRoom from './Components/List/SearchRoom';
import { userService } from './service/user';
import { roomService } from './service/room';
import { authService } from './service/auth';
import curRoom from './Components/Room/CurrentRoom'
require('dotenv').config()

function App() {
  const [connected, setConnect] = useState(false)
  const [error, setError] = useState(false)
  const [isLoading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [roomPanel, setPanel] = useState(false)
  const [currentRoom, setCurrentRoom] = useState(null)
  const [lastMsgRoomId, setLastMsgRoomId] = useState({
    roomId: '',
    msg: '',
    date: null
  })
  const [rooms, setRooms] = useState([])
  const [message, setMessage] = useState('')
  const [showSearchRoom, setShowSearchRoom] = useState(false)
  const [lastMsgRoomId1, setLastMsgRoomId1] = useState({
    roomId: '',
    msg: '',
    date: null
  })

  const socket = io.connect(process.env.REACT_APP_API_URL || 'http://localhost:8080');

  const limit = useMediaQuery({ maxWidth: 1300 })
  const style = {
    left: {
      width: limit ? '15em' : '25%',
      float: 'left',
      boxSizing: 'border-box',
    },

    right: {
      width: '100%',
      height: '100%',
      float: 'right',
      position: 'relative',
      flexGrow: 1,
    },

    userInformation: {
      display: 'flex',
      alignItems: 'center',
      borderBottom: '2px solid #4a336e',
      padding: '20px',
      fontSize: 'large',
      marginBottom: '10px',
    },
  }

  const logIn = async (user) => {
    try {
      const result = await authService.login(user)
      localStorage.setItem("token", result.data.token);
      setError(result.data.token === null)
      let res = await userService.getUser()
      if (res.status === 200) {
        localStorage.setItem("userId", res.data.msg._id)
        setUser(res.data.msg)
        socket.emit('login', res.data.msg._id)
        res = await roomService.getRooms()
        if (res.status === 200) setRooms(res.data.msg)
        socket.once('connected', () => setConnect(true))
      }
      setAuthenticated(true)
      toast.success('logged in successfully')
    } catch (err) {
      toast.error(`${err?.response?.data?.msg}`)
    }
  }

  const leaveRoom = async (id) => {
    let res = await roomService.leaveRoom(id)
    if (res.status === 200) {
      socket.emit('leaveRoom', id)
      toast.success('left room successfully')
      const index = rooms.findIndex(room => room._id === id)
      if (index !== -1) {
        rooms.splice(index, 1)
        const tmp = [...rooms]
        tmp.every((room, index) => {
          if (room._id === id) {
            tmp.splice(index, 1)
            return false
          }
          return true
        })
        setCurrentRoom(null)
        curRoom.setCurrentRoom(null)
      }
    } else {
      toast.error(`${res.response.data.msg}`)
    }
  }

  const kickUser = async (userId, roomId) => {
    socket.emit('kick', userId, roomId)
  }

  useEffect(() => {
    socket.on('kicked', (userId, roomId) => {
      if (localStorage.getItem("userId") === userId) {
        toast.error('you have been kicked from this room')
        socket.emit('leaveRoom', roomId)
        const index = rooms.findIndex(room => room._id === roomId)
        if (index !== -1) {
          rooms.splice(index, 1)
          const tmp = [...rooms]
          tmp.every((room, index) => {
            if (room._id === roomId) {
              tmp.splice(index, 1)
              return false
            }
            return true
          })
          setRooms(tmp)
          setCurrentRoom(null)
          curRoom.setCurrentRoom(null)
        }
      }
    })
  }, [socket])

  const findRoom = async (shortId) => {
    const index = rooms.findIndex(room => room.shortId === shortId)
    if (index === -1) {
      let res = await roomService.attendRoom(shortId)
      if (res.status === 200) {
        setRooms([res.data.msg, ...rooms])
        setCurrentRoom(res.data.msg)
        curRoom.setCurrentRoom(res.data.msg)
      } else if (res.status === 400) {
        setCurrentRoom(res.data.msg)
        curRoom.setCurrentRoom(res.data.msg)
      } else {
        toast.error(`${res.data.msg}`)
      }
    }
  }

  const joinRoom = async (room) => {
    if (room) {
      try {
        let response = await roomService.createRoom(room)
        const newRoom = response.data.msg
        setRooms([newRoom, ...rooms])
        setCurrentRoom(newRoom)
      } catch (err) {
        toast.error(`${err?.response?.data?.msg}`)
      }
    }
  }

  const switchRoom = (newRoom) => {
    setLoading(true)
    if (!currentRoom) {
      socket.emit('joinRoom', newRoom?._id)
    }
    if (currentRoom && newRoom?._id !== currentRoom?._id) {
      socket.emit('leaveRoom', currentRoom?._id)
      socket.emit('joinRoom', newRoom?._id)
    }
    setCurrentRoom({...newRoom})
    curRoom.setCurrentRoom({...newRoom})
    setShowSearchRoom(false)
    setLoading(false)
  }


  const logout = async () => {
    let userId = localStorage.getItem("userId")
    socket.emit('logout', userId)
    localStorage.clear()
    window.location.reload()
  }

  const roomManage = (room) => {
    setPanel(true)
  }

  useEffect(() => {
    async function getUserToken() {
      const token = localStorage.getItem("token")
      if (token !== null) {
        let res = await userService.getUser()
        if (res.status === 200) {
          localStorage.setItem("userId", res.data.msg._id)
          setAuthenticated(true)
          setUser(res.data.msg)
          res = await roomService.getRooms()
          if (res.status === 200) setRooms(res.data.msg)
          socket.emit('login', res.data.msg._id)
          socket.once('connected', () => setConnect(true))
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    getUserToken()
  }, [])

  useEffect(() => {
    if (currentRoom) {
      socket.emit('joinRoom', currentRoom._id)
    }
  }, [currentRoom])

  useEffect(() => {
    if (lastMsgRoomId.roomId.length > 0) {
      let res = rooms.find(room => room._id === lastMsgRoomId.roomId)
      if (lastMsgRoomId.roomId !== rooms[0]?._id) {
        setRooms([res, ...rooms.filter(el => el._id !== res._id)])
      }
    }
    setLastMsgRoomId1({
      roomId: lastMsgRoomId.roomId,
      msg: lastMsgRoomId.msg,
      date: lastMsgRoomId.date
    })
  }, [lastMsgRoomId])


  return (
    <div className="App">
      {isLoading ? <Loading></Loading> : (authenticated ?
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <div style={{ height: '100%', display: 'flex' }}>
            <div style={style.left}>
              <UserArea user={user} logout={logout}></UserArea>
              {showSearchRoom && <SearchRoom currentRoom={currentRoom} rooms={rooms} joinRoom={joinRoom} leaveRoom={leaveRoom} switchRoom={switchRoom} roomManage={roomManage} handleSearchRoom={setShowSearchRoom} lastMsgRoomId={lastMsgRoomId1} setLastMsgRoomId={setLastMsgRoomId1}/>}
              {!showSearchRoom && <RoomsHeader joinRoom={joinRoom} findRoom={findRoom} handleSearchRoom={setShowSearchRoom}></RoomsHeader>}
              {!showSearchRoom && <RoomsList currentRoom={currentRoom} rooms={rooms} joinRoom={joinRoom} lastMsgRoomId={lastMsgRoomId1} setLastMsgRoomId={setLastMsgRoomId1} leaveRoom={leaveRoom} switchRoom={switchRoom} roomManage={roomManage} />}
            </div>
            {currentRoom ? <div style={style.right}>
              <ChatWindow socket={socket} currentRoom={currentRoom} setLastMsgRoomId={setLastMsgRoomId} leave={leaveRoom} kickUser={kickUser}></ChatWindow>
            </div> : <Guide></Guide>}
          </div>
        </div> : <Login message={message} logIn={logIn} invalid={error} errorToggle={setError}></Login>)}
    </div>
  );
}

export default App;