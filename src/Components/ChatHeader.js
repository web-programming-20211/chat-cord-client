import { Input, Select, Avatar, Drawer, Tabs, Space, Form, Switch, Button } from 'antd';
import { useEffect, useState } from 'react';
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify'
import { Icon } from '@iconify/react';
import { storage } from "../firebase/index"
import { roomService } from "../service/room"
import moment from 'moment';
import curRoom from './Room/CurrentRoom'
const { TabPane } = Tabs;


const ChatHeader = ({ userOnline, userOffline, setUserOnline, setUserOffline, room, dialogs, leave, socket }) => {
    const [users, setUsers] = useState([])
    const [visible, setVisible] = useState(false)
    const [updateVisible, setUpdateVisible] = useState(false)
    const [pinnedMessage, setPinnedMessage] = useState(false);
    const [showPinnedMessage, setShowPinnedMessage] = useState(false);
    var user = []
    let typeSearch = 'All'
    const [roomAvatarPreview, setRoomAvatarPreview] = useState(null)
    const [roomAvatar, setRoomAvatar] = useState()
    const currentUser = localStorage.getItem('userId')
    const [roomUpdateInfo, setRoomUpdateInfo] = useState({
        name: '',
        description: '',
        isPrivate: room.isPrivate,
        avatar: '',
    })
    const [isPrivate, setIsPrivate] = useState(room.isPrivate)
    const [dialogResult, setDialogResult] = useState([])
    const [showDialogResult, setShowDialogResult] = useState(false)

    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };
    const handleEditInfo = () => {
        setUpdateVisible(!updateVisible);
    }

    const handleUpdateRoomAvatar = (e) => {
        const newRoomAvatar = e.target.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(newRoomAvatar)
        reader.onloadend = () => {
            setRoomAvatarPreview(reader.result)
        }
        setRoomAvatar(newRoomAvatar)
    }


    const handleUpdateRoomInfo = async () => {
        let roomUpdateInfo_ = roomUpdateInfo
        try {
            if (roomAvatar) {
                const metadata = {
                    contentType: roomAvatar.type
                }
                const storageRef = storage.ref(`roomAvatars/${roomAvatar.name}`)
                const snapshot = await storageRef.put(roomAvatar, metadata)
                const url = await snapshot.ref.getDownloadURL()
                roomUpdateInfo_.avatar = url
            }
            let res = await roomService.updateRoom(room?._id, roomUpdateInfo_)
            
            if (res.status === 200)
                toast.success(res?.data?.msg)
        } catch (err) {
            toast.error(err?.response?.data?.msg)
        }
        setRoomAvatarPreview(roomUpdateInfo.avatar)
        setRoomAvatar(null)
        setUpdateVisible(false)
    }

    const style = {
        chatHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '50px',
            backgroundColor: '#6588DE',
            height: '20px',
            width: '100%',
            margin: '0px 0px 0px 10px',
            position: 'relative',
        },

        pinMessageContainer: {
            position: 'absolute',
            backgroundColor: '#E3F6FC',
            top: '110px',
            left: '0px',
            zIndex: '1',
            width: '68%',
            height: '50px',
            display: 'flex',
            gap: '10px',
        },

        pinMessageIcon: {
            position: 'relative',
            left: '5px',
            top: '15px',
            color: 'rgb(101, 136, 222)',
            fontSize: '20px',
        },

        pinMessageInfo: {
            width: '90%',
            display: 'flex',
            flexFlow: 'column',
            padding: '2px'
        },

        pinMessageContentText: {
            height: '100%',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '107%',
            workBreak: 'break-word',
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
            width: '30%',
            position: 'relative',
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
            borderRadius: '115px',
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
            overflowY: 'auto',
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

        avatar: {
            position: 'relative',
        },

        dot: {
            position: 'absolute',
            bottom: '6px',
            right: '3px',
            height: '8px',
            width: '8px',
            borderRadius: '50%',
            backgroundColor: '#46D362',
        },

        des: {
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '320px',
            workBreak: 'break-word',
        },

        infoIcon: {
            position: 'relative',
            top: '5px'
        },

        buttonEditDrawer: {
            border: 'none',
            backgroundColor: '#E3F6FC',
            color: '#6588DE',
            cursor: 'pointer',
        },

        buttonUpdateDrawer: {
            position: 'relative',
            left: '50%',
            marginRight: '5px',
        },

        roomAvatarEdit: {
            width: 'fit-content',
            display: 'block',
            margin: 'auto',
            border: '4px solid #' + room.color,
            borderRadius: '115px',
            cursor: 'pointer',
        },

        plusIconContainer: {
            width: 55,
            height: 55,
            borderRadius: '50%',
            border: '1px dashed #6ECB63',
            display: 'grid',
            placeItems: 'center',
            backgroundColor: 'rgb(227, 246, 252)'
        },

        plusIcon: {
            fontSize: '20px',
        },

        removeIcon: {
            fontSize: '18px',
            color: '#E74C3C',
        },

        submitButton: {
            borderRadius: '5px'
        },

        searchResultContainer: {
            position: 'absolute',
            top: '76px',
            left: '0px',
            right: '0px',
            backgroundColor: 'rgb(227, 246, 252)',
            padding: '10px',
            borderRadius: '0px 0px 10px 10px',
            zIndex: '1',
        },

        searchResultOption: {
            display: 'flex',
            gap: '50px',
            alignItems: 'center',
            justifyContent: 'center',
        },

        searchOption: {
            color: 'rgb(82, 88, 93)',
            cursor: 'pointer',
            fontSize: '20px',
            fontWeight: 'bold',
        },

        closeIcon: {
            fontSize: '24px',
            position: 'absolute',
            top: '2px',
            right: '6px',
            color: 'rgb(82, 88, 93)',
            cursor: 'pointer',
        }
    }

    useEffect(() => {
        let user = users.find(user => user._id === userOnline)
        if (user) {
            user.online = true
            setUsers([...users])
        }
        setUserOnline('')
    }, [userOnline])

    useEffect(() => {
        let user = users.find(user => user._id === userOffline)
        if (user) {
            user.online = false
            setUsers([...users])
        }
        setUserOffline('')
    }, [userOffline])

    useEffect(async () => {
        let res = await roomService.getMembers(room?._id)
        if (res.status === 200)
            setUsers(res.data.msg)

        res = await roomService.getRoom(room?._id)
        let r = res.data.msg
        if (r?.pinnedMessages?.length > 0) {
            setShowPinnedMessage(true)
            setPinnedMessage(r.pinnedMessages.at(-1))
        }
        else
            setShowPinnedMessage(false)
    }, [room])

    useEffect(() => {
        socket.on('new-pinned-message', (roomId, r) => {
            if (roomId === curRoom.getCurrentRoom()?._id) {
                if (r.pinnedMessages.length === 0)
                    setShowPinnedMessage(false)
                else {
                    setShowPinnedMessage(true)
                    setPinnedMessage(r.pinnedMessages.at(-1))
                }
            }
        })
    }, [socket])

    const copyToClipboard = () => {
        copy(room?.shortId)
        toast.success('Copied to clipboard')
    }

    const onFinish = async (values) => {
        user = []
        for (let i = 0; i < values.usersList.length; i++) {
            user.push(values.usersList[i].first)
        }
        try {
            let res = await roomService.addMember(room?._id, { emails: user.join(',') })
            if (res.status === 200) {
                toast.success(res.data.msg)
            }
        } catch (e) {
            toast.error(`${e.response.data.msg}`)
        }
    }

    const getTypeSearch = (v) => {
        typeSearch = v
    }
    const { Option } = Select;

    const selectBefore = (
        <Select defaultValue="All" onChange={getTypeSearch}>
            <Option value="All">All</Option>
            <Option value="Message">Message</Option>
            <Option value="User">User</Option>
        </Select>
    );


    const Dialog = ({ dialog }) => {
        const [search, setSearch] = useState(false)

        const style = {
            dialogContainer: {
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '15px',
                backgroundColor: search ? 'rgb(101, 136, 222)' : '',
                padding: '10px',
                borderRadius: '10px',
            },
    
            dialogNameAndTime: {
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
            },
    
            dialogName: {
                color: search ? 'white': 'rgb(82, 88, 93)',
                fontSize: '20px',
                fontWeight: '600',
            },
    
            dialogTime: {
                color: search ? 'white': 'rgb(82, 88, 93)',
                fontWeight: '600',
            },
    
            dialogMessage: {
                fontSize: '16px',
                color: search ? 'white': 'rgb(82, 88, 93)',
                fontWeight: '600',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '280px',
                workBreak: 'break-word',
            },
        }
        return (
            <a href={'#' + dialog.messageId} onClick={() => { colorOfDialog(dialog.messageId) }} >
            <div style={style.dialogContainer} onMouseEnter={() => setSearch(true)} onMouseLeave={() => setSearch(false)}>
                <Avatar src={dialog.avatar} size={60} style={style.dialogContainerAvatar} />

                <div style={style.dialogContainerInfo}>
                    <div style={style.dialogNameAndTime}>
                        <span style={style.dialogName}>{dialog.username}</span>
                        <span style={style.dialogTime}>{moment(dialog.createdAt).calendar()}</span>
                    </div>
                    {/* <div onClick={() => { colorOfDialog(dialog.messageId) }}>
                        <a href={'#' + dialog.messageId} style={style.dialogMessage}>
                            {dialog.content}
                        </a>
                    </div> */}
                    <span style={style.dialogMessage}>{dialog.content}</span>
                </div>
            </div>
            </a>
        )
    }

    const colorOfDialog = (msgId) => {
        setShowDialogResult(false)
        var element = document.getElementById(msgId);
        element.style.backgroundColor = 'LightBlue'
        element.style.borderRadius = '10px'
        element.style.paddingRight = '10px'
        setTimeout(() => { element.style.backgroundColor = 'White' }, 1000)
    }

    return (
        <div style={style.chatHeader}>
            <div style={style.chatInfo} onClick={showDrawer}>
                <p style={style.chatName}>{room?.name} <Icon style={style.infoIcon} icon="ant-design:info-circle-outlined" /></p>
                <p style={style.numberOfUser}>{users?.length + ' members'}</p>
            </div>
            <div style={style.chatTool}>

                <Input style={style.input} addonBefore={selectBefore} autoComplete='off' placeholder="Type user or a message you want to search..." onKeyPress={async (e) => {
                    if (e.key === 'Enter') {
                        await roomService.searchMessages(room._id, e.target.value).then(
                            (res) => {
                                if (res.data.msg.length > 0) {
                                    setShowDialogResult(true)
                                    if (typeSearch === 'All')
                                        setDialogResult(res.data.msg)
                                    else if (typeSearch === 'Message')
                                        setDialogResult(res.data.msg.filter(m => m.content.includes(e.target.value)))
                                    else if (typeSearch === 'User')
                                        setDialogResult(res.data.msg.filter(m => m.username.includes(e.target.value)))
                                }
                                else setShowDialogResult(false)
                            }
                        );
                    }
                }} />

                {showDialogResult && dialogResult.length > 0 && <div style={style.searchResultContainer}>
                    <Icon style={style.closeIcon} onClick={() => setShowDialogResult(false)} icon="ant-design:close-circle-outlined" />

                    <div style={style.searchResultOption}>
                        <div style={style.searchOption} onClick={() => {
                            var temp = [...dialogResult.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1)]
                            setDialogResult(temp)
                        }}>Old</div>
                        <div style={style.searchOption} onClick={() => {
                            var temp = [...dialogResult.sort((a, b) => (a.createdAt < b.createdAt) ? 1 : -1)]
                            setDialogResult(temp)
                        }}>New</div>
                    </div>
                    <div style={{ overflow: "scroll", maxHeight: "500px", overflowX: "hidden" }}>
                        {
                            dialogResult?.map((dialog, i) => {
                                return (
                                    <Dialog key={i} dialog={dialog}></Dialog>
                                )
                            })
                        }
                    </div>
                </div>}
            </div>
            <Drawer
                placement="right"
                onClose={onClose}
                visible={visible}
                extra={
                    <Space>
                        {
                            room.isPrivate && localStorage.getItem('userId') === room.creator && <button onClick={handleEditInfo} style={style.buttonEditDrawer}>Edit</button>}
                        {!room.isPrivate && <button onClick={handleEditInfo} style={style.buttonEditDrawer}>Edit</button>}
                    </Space>
                }
            >
                <div style={style.roomInfo}>
                    <div style={style.roomTitle}>Room Info</div>
                    {!updateVisible && <div style={style.roomAvatar}><Avatar size={200} src={room.avatar}></Avatar></div>}
                    {updateVisible &&
                        <div>
                            <label style={style.roomAvatarEdit} htmlFor="roomAvatar"><Avatar size={200} src={roomAvatarPreview ? roomAvatarPreview : room.avatar}></Avatar></label>
                            <input id="roomAvatar" style={{ visibility: "hidden" }} accept='image' type="file" onChange={handleUpdateRoomAvatar} />
                        </div>
                    }
                    {!room.isPrivate && <div style={style.roomShortId} onClick={copyToClipboard}>{room?.shortId}</div>}
                    <div style={style.roomName}>{room?.name}</div>
                    <div style={style.roomDescription}>{room?.description}</div>
                    <div style={style.line}></div>
                </div>
                {updateVisible ?
                    <Form
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 20 }}
                        onFinish={handleUpdateRoomInfo}
                    >
                        <Form.Item label="Room name" rules={[
                            {
                                required: true,
                                message: 'Please input room name!'
                            },
                        ]}>
                            <Input defaultValue={room.name} onChange={(e) => setRoomUpdateInfo({ ...roomUpdateInfo, name: e.target.value })} />
                        </Form.Item>

                        <Form.Item label="Description" rules={[
                            {
                                required: true,
                                message: 'Please input room description!'
                            },
                        ]}>
                            <Input defaultValue={room.description} onChange={(e) => setRoomUpdateInfo({ ...roomUpdateInfo, description: e.target.value })} />
                        </Form.Item>

                        {
                            currentUser == room.creator && <Form.Item label="Mode">
                                <Switch defaultChecked={isPrivate} checkedChildren="Private" unCheckedChildren="Public" onClick={(e) => { setIsPrivate(pre => !pre); setRoomUpdateInfo(prevRoomUpdateInfo => { return ({ ...prevRoomUpdateInfo, isPrivate: !prevRoomUpdateInfo.isPrivate }) }) }} />
                            </Form.Item>
                        }

                        <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Save
                            </Button>
                        </Form.Item>
                    </Form>
                    :
                    <Tabs style={{ marginBottom: '25px' }} defaultActiveKey="1">
                        <TabPane tab="Images" key="1">
                            <div style={style.media}>
                                <div style={style.mediaGrid}>
                                    {
                                        dialogs.map(dialog => {
                                            return dialog.urls.length > 0 && dialog.urls.map((url, index) => {
                                                let format = url.split('.').pop().split('?')[0]
                                                if (format === 'jpg' || format === 'png' || format === 'jpeg') {
                                                    return <img key={index} src={url} onClick={(e) => { e.target.classList.toggle("zoom") }} style={{ width: '100%', height: '100px', objectFit: 'cover', marginBottom: '10px', transition: '1s' }} />
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
                                                    <a key={index} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} key={index} href={url} target="_blank" rel="noopener noreferrer">
                                                        <p style={style.des}>{url.split('%2F').pop().split('?')[0]}</p>
                                                    </a>
                                                )
                                            } else if (format === 'docx') {
                                                return (
                                                    <a key={index} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} key={index} href={url} target="_blank" rel="noopener noreferrer">
                                                        <p style={style.des}>{url.split('%2F').pop().split('?')[0]}</p>
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
                                    ((currentUser == room.creator && room.isPrivate) || !room.isPrivate) &&
                                    <Form name="add user dynamic form" autoComplete="off" onFinish={onFinish}>
                                        <Form.List name="usersList">
                                            {(fields, { add, remove }) => (
                                                <>
                                                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                                                        <Space key={key} style={{ display: 'flex', marginBottom: 2 }} align="baseline">
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'first']}
                                                                fieldKey={[fieldKey, 'first']}
                                                                rules={[{ type: 'email', required: true, message: 'Email is required!' }]}
                                                            >
                                                                <Input placeholder="Email" />
                                                            </Form.Item>
                                                            <Icon style={style.removeIcon} icon="gg:remove" onClick={() => remove(name)} />
                                                        </Space>
                                                    ))}
                                                    <Form.Item>
                                                        <Button onClick={() => add()} block style={style.plusIconContainer}><Icon style={style.plusIcon} icon="carbon:add" /></Button>
                                                    </Form.Item>
                                                </>
                                            )}
                                        </Form.List>
                                        <Form.Item>
                                            <Button style={style.submitButton} type='primary' htmlType="submit">
                                                Add
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                }
                                {
                                    users?.map((user, index) => {
                                        return (
                                            <div key={index} style={style.member}>
                                                <div style={style.avatar}>
                                                    <Avatar style={{ backgroundColor: '#' + user?.color }} size={50} src={user?.avatar}></Avatar>
                                                    {user.online && <span style={style.dot}></span>}
                                                </div>
                                                <p style={{ fontSize: '16px' }}>{user?.username}</p>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                        </TabPane>
                    </Tabs>
                }
                {!updateVisible &&
                    <div style={style.leaveRoom}>
                        <Icon style={style.leaveRoomIcon} icon="pepicons:leave" />
                        <p style={style.leaveRoomText} onClick={() => {
                            onClose()
                            leave(room._id)
                        }
                        }>Leave Room</p>
                    </div>
                }
            </Drawer>
            {showPinnedMessage && <div style={style.pinMessageContainer}>
                <Icon style={style.pinMessageIcon} icon="entypo:pin" />
                <div style={style.pinMessageInfo} onClick={() => { colorOfDialog(pinnedMessage.messageId) }}>
                    <a href={'#' + pinnedMessage.messageId}>
                        <b>Pinned Message</b>
                        <p style={style.pinMessageContentText}>{pinnedMessage ? pinnedMessage?.message : room?.pinnedMessages?.at(-1)?.message}</p>
                    </a>
                </div>
            </div>
            }
        </div>
    )
}
export default ChatHeader