/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import { Input, Select, Avatar, Drawer, Tabs } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify'
import { Icon } from '@iconify/react';

const { TabPane } = Tabs;


const ChatHeader = ({ userOnlines, room, dialogs }) => {
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
            // borderRadius: '14px',
            height: '20px',
            width: '100%',
            margin: '0px 0px 0px 10px'
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
            fontSize: '20px',
        },

        roomInfo: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },

        roomTitle: {
            marginBottom: '30px',
            fontWeight: 600,
            fontSize: '18px',
            lineHeight: '27px',
            color: '#6588DE',
        },

        roomAvatar: {
            marginBottom: '20px',
            border: '4px solid #' + room.color,
            borderRadius: '100px',
        },

        roomName: {
            marginBottom: '6px',
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: '24px',
            color: '#6588DE',
        },

        roomDescription: {
            marginBottom: '20px',
            fontSize: '12px',
            lineHeight: '150.5%',
            color: '#52585D',
        },

        roomShortId: {
            cursor: 'pointer',
            fontSize: '20px',
            marginBottom: '30px',
        },

        line: {
            width: '280px',
            height: '0px',
            borderBottom: '1px solid #D0D9DF',
            marginBottom: '20px',
        },

        media: {
            height: '400px',
            overflowY: 'auto',
            display: 'block',
        },

        mediaGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            maxWidth: '100%',
        },

        file: {
            // overflow: 'auto',
            display: 'flex',
            height: '400px',
            flexDirection: 'column',
            alignItems: 'flex-start',
        },

        members: {
            display: 'flex',
            height: '400px',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '10px',
        },

        member: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: '10px',
        },


        leaveRoom: {
            display: 'flex',
            flexDirection: 'row',
            cursor: 'pointer',
            fontSize: '20px',
            borderRadius: '8px',
            alignItems: 'center',
            gap: '11px',
            border: '1px solid #6588DE',
            height: '39px',
        },

        leaveRoomIcon: {
            color: '#6588DE',
            with: '18px',
            height: '20px',
            marginLeft: '14px',
        },

        leaveRoomText: {
            margin: '0px',
            with: '72px',
            fontWeight: 500,
            fontSize: '12px',
            lineHeight: '18px',
            color: '#6588DE'
        },

        avatar : {
            position: 'relative',
        },

        dot : {
            position: 'absolute',
            bottom: '6px',
            right: '3px',
            height: '8px',
            width: '8px',
            borderRadius: '50%',
            backgroundColor: '#46D362',
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

    const copyToClipboard = () => {
        copy(room?.shortId)
        toast.success('Copied to clipboard')
    }

    return (
        <>
            <div style={style.chatHeader}>
                <div style={style.chatInfo} onClick={showDrawer}>
                    <p style={style.chatName}>{room?.name}</p>
                    <p style={style.numberOfUser}>{users?.length + ' members'}</p>
                </div>
                <div style={style.chatTool}>
                    <Input style={style.input} autoComplete='off' addonBefore={selectBefore} placeholder="Type user or a message you what to search..." />
                </div>
                <Drawer placement="right" onClose={onClose} visible={visible}>
                    <div style={style.roomInfo}>
                        <div style={style.roomTitle}>Room Info</div>
                        <div style={style.roomAvatar}><Avatar size={100} src="https://joeschmoe.io/api/v1/random"></Avatar></div>
                        <div style={style.roomName}>{room?.name}</div>
                        <div style={style.roomDescription}>{room?.description}</div>
                        <div style={style.roomShortId} onClick={copyToClipboard}>{room?.shortId}</div>
                        <div style={style.line}></div>
                    </div>
                    <Tabs style={{ marginBottom: '25px' }} defaultActiveKey="1">
                        <TabPane tab="Image" key="1">
                            <div style={style.media}>
                                <div style={style.mediaGrid}>
                                    {
                                        dialogs.map(dialog => {
                                            return dialog.urls.length > 0 && dialog.urls.map((url, index) =>{
                                                let format = url.split('.').pop().split('?')[0]
                                                if (format === 'jpg' || format === 'png' || format === 'jpeg') {
                                                    return <img src={url} onClick={(e) => { e.target.classList.toggle("zoom") }} style={{ width: '100%', height: '100px', objectFit: 'cover', marginBottom: '10px', transition: '1s' }} />
                                                }
                                            })
                                        })
                                    }
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="Videos" key="2">
                            <div style={style.media}>
                                <div style={style.mediaGrid}>
                                    {
                                        dialogs.map(dialog => {
                                            return dialog.urls.length > 0 && dialog.urls.map((url, index) => {
                                                let format = url.split('.').pop().split('?')[0]
                                                if (format === 'mp4') {
                                                    return (
                                                        <video key={index} onClick={(e) => { e.target.classList.toggle("zoom") }} style={{ width: '100%', height: '100px', objectFit: 'cover', marginBottom: '10px', transition: '1s' }} controls>
                                                            <source src={url} type="video/mp4" />
                                                        </video>
                                                    )
                                                }
                                            })
                                        })
                                    }
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="Files" key="3">
                            <div style={style.file}>
                                {
                                    dialogs.map(dialog => {
                                        return dialog.urls.length > 0 && dialog.urls.map((url, index) => {
                                            let format = url.split('.').pop().split('?')[0]
                                            if (format === 'pdf') {
                                                return (
                                                    <a style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} key={index} href={url} target="_blank" rel="noopener noreferrer">
                                                        <p>{url.split('%2F').pop().split('?')[0]}</p>
                                                    </a>
                                                )
                                            } else if (format === 'docx') {
                                                return (
                                                    <a style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} key={index} href={url} target="_blank" rel="noopener noreferrer">
                                                        <p>{url.split('%2F').pop().split('?')[0]}</p>
                                                    </a>
                                                )
                                            }
                                        })
                                    })
                                }
                            </div>
                        </TabPane>
                        <TabPane tab="Members" key="4">
                            <div style={style.members}>
                                {
                                    users?.map((user, index) => {
                                        return (
                                            <div key={index} style={style.member}>
                                                <div style={style.avatar}>
                                                    <Avatar style={{ backgroundColor: '#' + user.color }} size={50}>{user.fullname?.toUpperCase()[0]}</Avatar>
                                                    {userOnlines.includes(user._id) && <span style={style.dot}></span>}
                                                </div>
                                                <p style={{ fontSize: '16px' }}>{user.fullname}</p>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                        </TabPane>
                    </Tabs>
                    <div style={style.leaveRoom}>
                        <Icon style={style.leaveRoomIcon} icon="pepicons:leave" />
                        <p style={style.leaveRoomText}>Leave Room</p>
                    </div>
                </Drawer>
            </div>
        </>
    )
}
export default ChatHeader