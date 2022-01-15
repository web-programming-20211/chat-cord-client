import { Input, Select, Avatar, Drawer, Tabs, Space, Form, Switch, Button } from 'antd';
import { useEffect, useState } from 'react';
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify'
import { Icon } from '@iconify/react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { storage } from "../firebase/index"
import { roomService } from "../service/room"

const { TabPane } = Tabs;


const ChatHeader = ({ userOnlines, room, dialogs, leave, socket }) => {
    const [users, setUsers] = useState([])
    const [currentRoom, setRoom] = useState(room)
    const [visible, setVisible] = useState(false)
    const [updateVisible, setUpdateVisible] = useState(false)
    const [pinnedMessage, setPinnedMessage] = useState(false);
    const [showPinnedMessage, setShowPinnedMessage] = useState(false);
    var user = []
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
            // opacity: showPinnedMessage || room?.pinnedMessages?.length > 0 ? 1 : 0,
            position: 'absolute',
            backgroundColor: '#E3F6FC',
            bottom: '-67px',
            left: '0px',
            zIndex: '1',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
        },

        pinMessageIcon: {

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
        }

    }


    const { Option } = Select;

    const selectBefore = (
        <Select defaultValue="Message">
            <Option value="Message">Message</Option>
            <Option value="User">User</Option>
        </Select>
    );

    useEffect(async () => {
        setRoom(room)
        if (room?._id !== -1) {
            let res = await roomService.getMembers(room?._id)
            if (res.status === 200)
                setUsers(res.data.msg)
        }
        room?.pinnedMessages?.length > 0 && setShowPinnedMessage(true)
    }, [room])

    useEffect(() => {
        socket.on('new-pinned-message', (dialog, roomId, r) => {
            if (roomId === room._id) {
                if (r.pinnedMessages.length === 0)
                    setShowPinnedMessage(false)
                else {
                    setShowPinnedMessage(true)
                    setPinnedMessage(r.pinnedMessages.at(-1))
                }
            }
        })
    }, [room])

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


    return (
        <>
            <div style={style.chatHeader}>
                <div style={style.chatInfo} onClick={showDrawer}>
                    <p style={style.chatName}>{room?.name} <Icon style={style.infoIcon} icon="ant-design:info-circle-outlined" /></p>
                    <p style={style.numberOfUser}>{users?.length + ' members'}</p>
                </div>
                <div style={style.chatTool}>
                    <Input style={style.input} autoComplete='off' addonBefore={selectBefore} placeholder="Type user or a message you what to search..." />
                </div>
                <Drawer
                    placement="right"
                    onClose={onClose}
                    visible={visible}
                    extra={
                        <Space>
                            <button onClick={handleEditInfo} style={style.buttonEditDrawer}>Edit</button>
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
                                                            <p style={style.des}>{url.split('%2F').pop().split('?')[0]}</p>
                                                        </a>
                                                    )
                                                } else if (format === 'docx') {
                                                    return (
                                                        <a style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} key={index} href={url} target="_blank" rel="noopener noreferrer">
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
                                                                {/* <MinusCircleOutlined onClick={() => remove(name)} /> */}
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
                                                        {userOnlines.includes(user?._id) && <span style={style.dot}></span>}
                                                    </div>
                                                    <p style={{ fontSize: '16px' }}>{user?.fullname}</p>
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
                    <Icon style={style.pinMessageIcon} icon="bi:pin-angle-fill" />
                    <div style={style.pinMessageInfo}>
                        <div style={style.pinMessageTitle}>Pinned message</div>
                        <div style={style.pinMessageContent}>
                            <Avatar style={style.pinMessageAvatar} src={pinnedMessage ? pinnedMessage?.avatar : room?.pinnedMessages?.at(-1)?.avatar}></Avatar>
                            <div>
                                <p style={style.pinMessageName}>{pinnedMessage ? pinnedMessage?.username : room?.pinnedMessages?.at(-1)?.username}</p>
                                <p style={style.pinMessageContentText}>{pinnedMessage ? pinnedMessage?.message : room?.pinnedMessages?.at(-1)?.message}</p>
                            </div>
                        </div>
                    </div>
                </div>
                }
            </div>
        </>
    )
}
export default ChatHeader