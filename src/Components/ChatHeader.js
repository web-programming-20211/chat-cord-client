import { Input, Select, Space, Cascader } from 'antd';
import { Icon } from '@iconify/react';
import TuneIcon from '@mui/icons-material/Tune';
import axios from 'axios';
import { useEffect, useState } from 'react';

import { Drawer, Button } from 'antd';


const ChatHeader = ({ room }) => {
    const [users, setUsers] = useState([])
    const [currentRoom, setRoom] = useState(room)

    const [visible, setVisible] = useState(false);
    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };

    const style = {
        chatHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '50px',
            backgroundColor: '#6588DE',
            borderRadius: '14px',
            height: '20px',
            width: '98%',
            margin: '10px 5px auto 20px'
        },

        chatInfo: {
            margin: '5px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            cursor: 'pointer',
        },

        chatName: {
            margin: '0px',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#FDFDFE',
        },

        numberOfUser: {
            margin: '0px',
            fontSize: '14px',
            color: '#F2F6F7',
        },

        chatTool: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',

        },

        tuneIcon: {
            cursor: 'pointer',
        },

        roomInfo : {
            "& .antDrawerBody": {
                backgroundColor: '#F2F6F7',
            },
        }
    }


    const { Option } = Select;

    const selectBefore = (
        <Select defaultValue="Message">
            <Option value="Message">Message</Option>
            <Option value="User">User</Option>
        </Select>
    );

    useEffect(() => {
        setRoom(room)
        if (room?._id !== -1)
            axios.get('/room/' + room?._id + '/members', { withCredentials: true }).then(res => {
                setUsers(res.data.msg);
            })
    }, [room])

    return (
        <>
            <div style={style.chatHeader}>
                <div style={style.chatInfo} onClick={showDrawer}>
                    <p style={style.chatName}>{room?.name}</p>
                    <p style={style.numberOfUser}>{users?.length + ' members'}</p>
                </div>
                <div style={style.chatTool}>
                    <Input style={style.input} autoComplete='off' addonBefore={selectBefore} placeholder="Type user or a message you what to search..." />
                    <div><TuneIcon style={style.tuneIcon} color='red' /></div>
                </div>
                

                <Drawer title="Room Info" style={style.roomInfo} placement="right" onClose={onClose} visible={visible}>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Drawer>

            </div>

            
        </>
    )
}

export default ChatHeader