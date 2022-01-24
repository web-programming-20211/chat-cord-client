const initCurrentRoom = () => {
    var currentRoom = null
    const getCurrentRoom = () => {
        return currentRoom
    }
    const setCurrentRoom = (room) => {
        currentRoom = room
    }
    return {
        getCurrentRoom,
        setCurrentRoom
    }
}

const curRoom = initCurrentRoom()

export default curRoom

