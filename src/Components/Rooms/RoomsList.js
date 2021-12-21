// import CreateRoom from "./CreateRoom"
import Room from "../Room/Room"

const RoomsList = ({rooms, joinRoom, leaveRoom, switchRoom, roomManage, currentRoom, lastMsgRoomId, setLastMsgRoomId}) => {
    const style = {
        roomList: {
            overflow: 'auto',
            width: '100%',
            height: '77%',
            backgroundColor: '#E3F6FC',
            // borderRadius: '5px',
            // marginLeft: '10px',
        },
    }

    return (
        <div style={style.roomList}>
          {/* <CreateRoom joinRoom={joinRoom}></CreateRoom> */}
          {rooms?.map((room) => {
            return (
              <Room key={room?._id} choosen={currentRoom?._id === room?._id} room={room} lastMsgRoomId={lastMsgRoomId} setLastMsgRoomId={setLastMsgRoomId} leaveHandle={leaveRoom} onClick={switchRoom} roomManage={roomManage}></Room>
            )
          })}
        </div>
    )
}

export default RoomsList