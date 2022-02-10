import Room from "../Room/Room"

const RoomsList = ({rooms, joinRoom, leaveRoom, switchRoom, roomManage, currentRoom, lastMsgRoomId, setLastMsgRoomId}) => {
    const style = {
        roomList: {
            overflow: 'auto',
            width: '100%',
            height: '77%',
            backgroundColor: '#E3F6FC',
        },
    }


    return (
        <div style={style.roomList}>
          {rooms?.map((room, index) => {
            return (
              <Room key={index} choosen={currentRoom?._id === room?._id} room={room} lastMsgRoomId={lastMsgRoomId} setLastMsgRoomId={setLastMsgRoomId} leaveHandle={leaveRoom} onClick={switchRoom} roomManage={roomManage}></Room>
            )
          })}
        </div>
    )
}

export default RoomsList