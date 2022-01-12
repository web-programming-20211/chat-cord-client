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
import RoomsList from "./Components/Rooms/RoomsList";
import RoomsHeader from "./Components/Rooms/RoomsHeader";
import Guide from './Components/Guide/Guide';
import { useMediaQuery } from 'react-responsive'
import { toast } from 'react-toastify'
import SearchRoom from './Components/List/SearchRoom';
import { userService } from './service/user';
import { roomService } from './service/room';
import { authService } from './service/auth';

function App() {
  const [connected, setConnect] = useState(false)
  const [error, setError] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [roomPanel, setPanel] = useState(false)
  const [currentRoom, setCurrentRoom] = useState({
    _id: -1,
    name: " ",
    color: ''
  })
  const [lastMsgRoomId, setLastMsgRoomId] = useState('')
  const [rooms, setRooms] = useState([])
  const [login, setLogin] = useState(false)
  const [message, setMessage] = useState('')
  const [showSearchRoom, setShowSearchRoom] = useState(false)
  const [token, setToken] = useState('')

  axios.defaults.baseURL = process.env.REACT_APP_API_URL || '';
  axios.defaults.withCredentials = true;
  const socket = io.connect(process.env.REACT_APP_API_URL || '');

  const limit = useMediaQuery({ maxWidth: 1300 })
  const style = {
    left: {
      width: limit ? '15em' : '25%',
      float: 'left',
      // height: '100%',
      boxSizing: 'border-box',
      // background: '#E5E5E5',
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
    let userId = ''
    try {
      const result = await authService.login(user)
      toast.success('logged in successfully')
      setAuthenticated(result.data.token !== null)
      setError(result.data.token === null)
      localStorage.setItem("token", result.data.token);
      userId = result.data.user._id
    } catch (err) {
      toast.error(`${err?.response?.data?.msg}`)
    }
    const listOfRooom = await roomService.getRooms()
    setRooms(listOfRooom.data.msg)
    if (listOfRooom.data.length !== 0)
      setCurrentRoom(listOfRooom.data[0])
    await socket.emit('login', userId)
  }

  const leaveRoom = async (id) => {
    axios.post('/room/' + id + '/leave', { withCredentials: true }).then(result => {
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
      try {
        const response = await axios.post('/room/create', room, { withCredentials: true })
        setRooms([response.data.msg, ...rooms])
        setCurrentRoom(response.data.msg)
      } catch (err) {
        toast.error(`${err?.response?.data?.msg}`)
      }
    }
  }

  const switchRoom = (newRoom) => {
    if (newRoom?._id !== currentRoom?._id) {
      socket.emit('leaveRoom', currentRoom?._id, newRoom?._id)
      setCurrentRoom(newRoom)
    }
    setCurrentRoom(newRoom)
    setShowSearchRoom(false)
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
    const cookie = Cookies.get('userId')
    let index = cookie.indexOf('"')
    let new_cookie = cookie.slice(index + 1, cookie.length - 1)
    await socket.emit('logout', new_cookie)
    Cookies.remove('userId')
    window.location.reload()
  }

  const roomManage = (room) => {
    setPanel(true)
  }

  useEffect(async () => {
    let token = localStorage.getItem("token")
    setLogin(token !== null)
    console.log(token)
    console.log(authenticated)
    console.log(connected)
    if (token !== null && !authenticated) {
      let res = await userService.getUser()
      if (res) {
        setAuthenticated(true)
        setUser(res.data.msg)
      }
      res = await roomService.getRooms()
      if (res) setRooms(res.data.msg)
      if (res.data.length !== 0) {
        setCurrentRoom(res.data.msg[0])
      }
      // let index = cookie.indexOf('"')
      // let new_cookie = cookie.slice(index + 1, cookie.length - 1)
      socket.emit('login', token)
      socket.once('connected', () => setConnect(true))
    }
  }, [user, rooms, authenticated])

  useEffect(() => {
    if (currentRoom) {
      socket.emit('joinRoom', currentRoom)
    }
  }, [currentRoom])

  useEffect(() => {
    if (lastMsgRoomId) {
      try {
        axios.get(`/room/${lastMsgRoomId}`, { withCredentials: true }).then((res) => {
          if (currentRoom?._id !== lastMsgRoomId) {
            setRooms([res.data.msg, ...rooms.filter(el => el._id !== res.data.msg._id)])
            setCurrentRoom(currentRoom)
          }
        })
      } catch (err) {
        console.log(err)
      }
    }
  }, [lastMsgRoomId])

  return (
    <div className="App">
      {authenticated ?
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <div style={{ height: '100%', display: 'flex' }}>
            <div style={style.left}>
              <UserArea user={user} logout={logout}></UserArea>
              {showSearchRoom && <SearchRoom currentRoom={currentRoom} rooms={rooms} joinRoom={joinRoom} leaveRoom={leaveRoom} switchRoom={switchRoom} roomManage={roomManage} handleSearchRoom={setShowSearchRoom} />}
              {!showSearchRoom && <RoomsHeader joinRoom={joinRoom} findRoom={findRoom} handleSearchRoom={setShowSearchRoom}></RoomsHeader>}
              {!showSearchRoom && <RoomsList currentRoom={currentRoom} rooms={rooms} joinRoom={joinRoom} lastMsgRoomId={lastMsgRoomId} setLastMsgRoomId={setLastMsgRoomId} leaveRoom={leaveRoom} switchRoom={switchRoom} roomManage={roomManage} />}
            </div>
            {currentRoom ? <div style={style.right}>
              <ChatWindow socket={socket} room={currentRoom} rooms={rooms} setRooms={setRooms} setLastMsgRoomId={setLastMsgRoomId} leave={leaveRoom}></ChatWindow>
            </div> : <Guide></Guide>}
          </div>
        </div> : <Login message={message} logIn={logIn} invalid={error} errorToggle={setError}></Login>}
    </div>
  );
}

export default App;