import { Icon } from '@iconify/react';
import { Modal, Button, Form, Input, Switch } from 'antd';
import { useState } from 'react';


const RoomsHeader = ({ joinRoom }) => {
    const [visible, setVisible] = useState(false)
    const [isPrivate, setIsPrivate] = useState(false)
    const [room, setRoom] = useState({ name: '', description: '', isPrivate: false })


    const style = {
        roomHeaderContainer: {
            display: 'flex',
            alignItems: 'center',
            margin: '10px',
            backgroundColor: '#c4c4c4',
        },
        input: {
            width: '100%',
            outline: 'none',
            fontSize: '1.2rem',
            borderRadius: '10px',
            height: '40px',
            backgroundColor: '#f5f5f5',
        },

        add: {
            fontSize: '60px',
            margin: '5px',
            cursor: 'pointer',
        },
        join: {
            fontSize: '60px',
            margin: '5px',
            cursor: 'pointer',
        },
    }

    const showModal = () => {
        setVisible(true);
    }

    const hideModal = () => {
        setVisible(false);
    }

    const onChange = () => {
        setIsPrivate(!isPrivate);
    }

    const [form] = Form.useForm();

    const creatRoom = () => {
        joinRoom(room)
        hideModal()
    }

    return (
        <>
            <div style={style.roomHeaderContainer}>
                <input style={style.input} type='text' placeholder='Type a room...' />
                <Icon style={style.add} icon="akar-icons:chat-add" onClick={showModal} />
                <Icon style={style.join} icon="fluent:chat-arrow-back-16-regular" />
            </div>
            <Modal title="Creat room" visible={visible} footer={[
                <Button onClick={hideModal}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={creatRoom} >
                    Create
                </Button>,
            ]}>
                <Form form={form} name="control-hooks">
                    <Form.Item label="Room name" name="roomName" rules={[{ required: true }]} onChange={(e) => setRoom(room => ({ ...room, name: e.target.value }))}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Description" name="description" rules={[{ required: true }]} onChange={(e) => setRoom(room => ({ ...room, description: e.target.value }))}>
                        <Input />
                    </Form.Item>

                    <Switch checkedChildren="Private" unCheckedChildren="Public" defaultUnCheck onChange={(e) => setRoom(room => ({ ...room, description: e.target.value }))} />

                </Form>
            </Modal>

        </>
    )
};

export default RoomsHeader