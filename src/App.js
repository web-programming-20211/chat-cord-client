/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import '../src/App.css';
import io from 'socket.io-client';
import axios from "axios";
import Cookies from "js-cookie";
import ChatWindow from "./Components/ChatWindow";
import Login from './Components/Login/Login';
import Loading from './Components/Loading';
import UserArea from "./Components/UserInformation/UserArea";
// import FindRoom from "./Components/Rooms/FindRoom";
// import RoomManage from "./Components/Room/RoomManage";
import RoomsList from "./Components/Rooms/RoomsList";
import RoomsHeader from "./Components/Rooms/RoomsHeader";
import Guide from './Components/Guide/Guide';
import { useMediaQuery } from 'react-responsive'
import { toast } from 'react-toastify'

const socket = io.connect('/')

function App() {
  const [connected, setConnect] = useState(false)
  const [error, setError] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [roomId, setRoomId] = useState('')
  const [roomPanel, setPanel] = useState(false)
  const [currentRoom, setCurrentRoom] = useState({
    _id: -1,
    name: " ",
    color: ''
  })

  const [lastMsgRoomId, setLastMsgRoomId] = useState('')

  const [rooms, setRooms] = useState([])
  const [login, setLogin] = useState(false)

  const limit = useMediaQuery({ maxWidth: 1300 })

  const [message, setMessage] = useState('')

  const style = {
    left: {
      width: limit ? '15em' : '25%',
      float: 'left',
      height: '100%',
      boxSizing: 'border-box',
      background: '#E5E5E5',
      // borderRight: '2px solid #4a336e'
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
      const result = await axios.post('/auth/login', user, { withCredentials: true })
      toast.success('Logged in successfully')
      setAuthenticated(result.data.user._id !== undefined)
      setError(result.data.user._id === undefined)
      setUser(result.data.user)
    } catch (err) {
      toast.error(`${err.response.data.msg}`)
    }
    const listOfRooom = await axios.get('/room/retrieve', { withCredentials: true })
    setRooms(listOfRooom.data.msg)
    if (listOfRooom.data.length !== 0)
      setCurrentRoom(listOfRooom.data[0])
  }

  const leaveRoom = async (id) => {
    axios.post('/room/leave', { id: id }, { withCredentials: true }).then(result => {
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
        if (rooms.length !== 0)
          setCurrentRoom(rooms[0])
        else
          setCurrentRoom({
            _id: -1,
            name: " ",
            color: ''
          })
      }
    })

  }

  const findRoom = async (shortId) => {
    const index = rooms.findIndex(room => room.shortId === shortId)
    if (index === -1) {
      const res = await axios.post('/room/' + shortId + '/attend', { withCredentials: true })
      if (res.status === 200) {
        setRooms([res.data.msg, ...rooms])
        setCurrentRoom(res.data.msg)

      } else if (res.status === 400) {
        setCurrentRoom(res.data.msg)
      } else {
        toast.error(`${res.data.msg}`)
      }
    }
  }

  const joinRoom = async (room) => {
    if (room) {
      const response = await axios.post('/room/create', room, { withCredentials: true })
      if (response.status === 200) {
        setRooms([response.data.msg, ...rooms])
        setCurrentRoom(response.data.msg)
      }
    }
  }

  const switchRoom = (newRoom) => {
    if (newRoom?._id !== currentRoom?._id) {
      socket.emit('leaveRoom', currentRoom?._id, newRoom?._id)
      setCurrentRoom(newRoom)
    }
    setCurrentRoom(newRoom)
  }

  const logout = async () => {
    // const response = await axios.get('/user/logout', { withCredentials: true })
    // if (response) {
    //   setAuthenticated(false)
    //   setLogin(false)
    //   setCurrentRoom({
    //     _id: -1,
    //     name: " ",
    //     color: ''
    //   })
    //   setRooms([])
    // }
    Cookies.remove('userId')
    window.location.reload()
  }

  const roomManage = (room) => {
    setPanel(true)
  }

  useEffect(() => {
    setLogin(Cookies.get('userId') !== undefined)
    if (Cookies.get('userId') !== undefined && !authenticated) {
      axios.get('/user/find', { withCredentials: true }).then((res) => {
        setUser(res.data.msg)
      })
      axios.get('/room/retrieve', { withCredentials: true }).then((res) => {
        setRooms(res.data.msg)
        if (res.data.length !== 0) {
          setCurrentRoom(res.data.msg[0])
        }
      })
      setAuthenticated(true)
    }
    socket.once('connected', () => setConnect(true))
  }, [user, rooms, authenticated])

  useEffect(() => {
    if (currentRoom) {
      socket.emit('joinRoom', currentRoom)
    }
  }, [currentRoom])

  return (
    <div className="App">
      {!connected ? <Loading></Loading> : (((authenticated || login) && user) ?
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <div style={{ height: '100%', display: 'flex' }}>
            <div style={style.left}>
              <UserArea user={user} logout={logout}></UserArea>
              <RoomsHeader joinRoom={joinRoom} findRoom={findRoom}></RoomsHeader>
              <RoomsList currentRoom={currentRoom} rooms={rooms} joinRoom={joinRoom} lastMsgRoomId={lastMsgRoomId} setLastMsgRoomId={setLastMsgRoomId} leaveRoom={leaveRoom} switchRoom={switchRoom} roomManage={roomManage} />
              {/* <FindRoom roomId={roomId} setRoomId={setRoomId} findRoom={findRoom}></FindRoom> */}
            </div>
            {currentRoom ? <div style={style.right}>
              <ChatWindow socket={socket} room={currentRoom} rooms={rooms} setRooms={setRooms} setLastMsgRoomId={setLastMsgRoomId} leave={leaveRoom}></ChatWindow>
            </div> : <Guide></Guide>}
          </div>
          {/* <RoomManage room={currentRoom} manageToggle={roomPanel} setPanel={setPanel}></RoomManage> */}
        </div> : <Login message={message} logIn={logIn} invalid={error} errorToggle={setError}></Login>)}
    </div>
  );
}

export default App;