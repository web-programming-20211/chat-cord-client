import { useState } from "react";
import { Icon } from '@iconify/react';
import RoomsList from "../Rooms/RoomsList";

const SearchRoom = ({ rooms, joinRoom, leaveRoom, switchRoom, roomManage, currentRoom, handleSearchRoom, lastMsgRoomId, setLastMsgRoomId }) => {
    const [resultRoom, setResultRoom] = useState([]);

    const styles = {
        inputSection: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        input: {
            width: '100%',
            height: '40px',
            borderRadius: '10px',
            borderColor: '#6588DE',
        },
        searchRoom: {
            width: "100%",
            height: "102%",
            overflowY: 'hidden'
        },
        add: {
            color: '#6588DE',
            fontSize: '60px',
            margin: '2.5px 5px',
            cursor: 'pointer',
        },

    }

    const handleChange = (e) => {
        const value = e.target.value;
        setResultRoom(rooms.filter(room => room.name.toLowerCase().includes(value.toLowerCase()) || room.lastMessage.toLowerCase().includes(value.toLowerCase())));
    }



    return (
        <div style={styles.searchRoom}>
            <div style={styles.inputSection}>
                <Icon style={styles.add} icon="bx:bx-arrow-back" onClick={() => handleSearchRoom()} />
                <input style={styles.input} placeholder="search room" onChange={handleChange} />
            </div>
            <RoomsList currentRoom={currentRoom} rooms={resultRoom} joinRoom={joinRoom} leaveRoom={leaveRoom} switchRoom={switchRoom} roomManage={roomManage} handleSearchRoom={handleSearchRoom} lastMsgRoomId={lastMsgRoomId} setLastMsgRoomId={setLastMsgRoomId} />
        </div>
    )
}

export default SearchRoom;