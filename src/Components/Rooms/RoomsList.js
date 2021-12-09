import CreateRoom from "./CreateRoom"
import Room from "../Room/Room"

const RoomsList = ({rooms, joinRoom, leaveRoom, switchRoom, roomManage, currentRoom}) => {
    const style = {
        roomList: {
            overflow: 'auto',
            height: '77%',
            backgroundColor: '#E3F6FC',
            borderRadius: '14px',
            marginLeft: '10px',
            width: '100%',
        },
    }

    return (
        <div style={style.roomList}>
          {/* <CreateRoom joinRoom={joinRoom}></CreateRoom> */}
          {rooms?.map((room) => {
            return (
              <Room key={room?._id} choosen={currentRoom?._id === room?._id} room={room} leaveHandle={leaveRoom} onClick={switchRoom} roomManage={roomManage}></Room>
            )
          })}
        </div>
    )
}

export default RoomsList