import Dialog from './Dialog'
import { useEffect, useRef } from 'react'
// import { padding } from '@mui/system'

const Dialogs = ({socket, room, dialogs, deleteMessage}) => {
    const style = {
        display: 'block',
        width: '100%',
        height: '77vh',
        overflow: 'auto',
        margin: '10px 0px 0px 10px',
    }

    const MessEnding = useRef(null)

    useEffect(() => {
        MessEnding.current.scrollIntoView({ behavior: 'smooth' })
    }, [dialogs])

    return (
        <div style={style}>
            {dialogs.map((dialog) => {
                return <Dialog key={dialog._id} socket={socket} dialog={dialog} onDelete={deleteMessage} room={room}></Dialog>
            })}
            <div ref={MessEnding} />
        </div>
    )
}

export default Dialogs