import { Icon } from '@iconify/react';
import { Modal, Button, Form, Input, Switch } from 'antd';
import { useState } from 'react';


const RoomsHeader = ({ joinRoom, findRoom }) => {
    const [visibleCreate, setVisibleCreate] = useState(false)
    const [visibleJoin, setVisibleJoin] = useState(false)
    const [isPrivate, setIsPrivate] = useState(false)
    const [room, setRoom] = useState({ name: '', description: '', isPrivate: false })

    const [shortId, setShortId] = useState('')


    const style = {
        roomHeaderContainer: {
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#E3F6FC',
            borderRadius: '14px',
            marginBottom: '10px',
            marginLeft: '10px',
            width: '100%',
        },
        input: {
            width: '100%',
            outline: 'none',
            fontSize: '1.2rem',
            borderRadius: '8px',
            height: '40px',
            backgroundColor: '#FDFDFD',
            border: '1px solid #6588DE',
            boxSizing: 'border-box',
            margin: '5px',
            marginLeft: '15px',
        },

        add: {
            color: '#6588DE',
            fontSize: '60px',
            margin: '2.5px 5px',
            cursor: 'pointer',
        },
        join: {
            color: '#6588DE',
            fontSize: '60px',
            margin: '2.5px 5px',
            cursor: 'pointer',
        },
    }

    const showModalCreate = () => {
        setVisibleCreate(true);
    }

    const hideModalCreate = () => {
        setVisibleCreate(false);
    }

    const creatRoom = () => {
        joinRoom(room)
        hideModalCreate()
    }

    const showModalJoin = () => {
        setVisibleJoin(true);
    }

    const hideModalJoin = () => {
        setVisibleJoin(false);
    }

    const joinWithRoomId = () => {
        findRoom(shortId)
        hideModalJoin()
    }


    return (
        <>
            <div style={style.roomHeaderContainer}>
                <input style={style.input} type='text' placeholder='Type a room...' />
                <Icon style={style.add} icon="akar-icons:chat-add" onClick={showModalCreate} />
                <Icon style={style.join} icon="fluent:chat-arrow-back-16-regular" onClick={showModalJoin} />
            </div>
            <Modal title="Create room" closable={false} visible={visibleCreate} footer={[
                <Button onClick={hideModalCreate}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={creatRoom} >
                    Create
                </Button>,
            ]}>
                <Form name="control-hooks">
                    <Form.Item label="Room name" name="roomName" rules={[{ required: true }]} onChange={(e) => setRoom(room => ({ ...room, name: e.target.value }))}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Description" name="description" rules={[{ required: true }]} onChange={(e) => setRoom(room => ({ ...room, description: e.target.value }))}>
                        <Input />
                    </Form.Item>

                    <Switch checkedChildren="Private" unCheckedChildren="Public" onChange={(e) => setRoom(room => ({ ...room, isPrivate: !isPrivate }))} />

                </Form>
            </Modal>

            <Modal title="Join room" closable={false} visible={visibleJoin} footer={[
                <Button onClick={hideModalJoin}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={joinWithRoomId} >
                    Join
                </Button>,
            ]}>
                <Form name="control-hooks">
                    <Form.Item label="Room ID" name="roomShortId" rules={[{ required: true }]} onChange={(e) => setShortId(e.target.value)}>
                    
                        <Input />
                    </Form.Item>

                </Form>
            </Modal>

        </>
    )
};

export default RoomsHeader