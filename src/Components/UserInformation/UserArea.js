import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from "@material-ui/core"
// import { useMediaQuery } from 'react-responsive'
import { Icon } from '@iconify/react'
import { useState } from 'react'
import { Avatar as UserAvatar,Drawer, Space, Input, Form, Button } from 'antd'

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10)
  },
}))

const UserArea = ({ user, logout }) => {
  const classes = useStyles()
  const [visible, setVisible] = useState(false)
  const [updateVisible, setUpdateVisible] = useState(false)

  // const limit = useMediaQuery({ maxWidth: 1300 })
  const handleDrawer = () => {
    setVisible(!visible)
  }
  const onClose = () => {
    setVisible(!visible)
  }

  const handleEditInfo = () => {
    setUpdateVisible(!updateVisible)
  }

  
  const handleUpdateInfo = () => {
    // TODO: update user info
  }

  const handleUpdateUserAvatar = () => {
    // TODO: update user avatar
  }

  const UpdateUserInfo = () => {
    return (
      <Form 
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item label="Fullname" name="fullname">
          <Input defaultValue={user.fullname} />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item label="Confirm Password" name="confirm-password" rules={[{ required: true, message: 'Please input your confirm password!' }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button onClick={handleEditInfo} style={style.buttonUpdateDrawer} type="primary" danger>
            Cancel
          </Button>
          <Button onClick={handleUpdateInfo} style={style.buttonUpdateDrawer} type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    )
  }
  const style = {
    userInformation: {
      display: 'flex',
      alignItems: 'center',
      alignContent: 'flex-start',
      justifyContent: 'flex-end',
      height: '100px',
      width: '100%',
      backgroundColor: '#E3F6FC',
      // borderRadius: '14px',
      marginBottom: '10px',
      // marginLeft: '10px',
    },
    avatar: {
      fontSize: 'xx-large',
      marginRight: '20px',
      marginLeft: '20px',
      background: '#' + user.color,
      cursor: 'pointer',
    },
    info: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'start',
    },
    fullname: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: '20px',
      /* identical to box height */
      color: '#52585D',
      margin: '0px',
    },
    username: {
      fontStyle: 'normal',
      fontFamily: 'Poppins',
      padding: '5px 10px',
      backgroundColor: '#6588DE',
      borderRadius: '14px',
      color: '#FFFFFF',
      fontSize: '10px',
    },
    userInfo: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    userTitle: {
      marginBottom: '30px',
      fontWeight: 600,
      fontSize: '18px',
      lineHeight: '27px',
      color: '#6588DE',
    },
    userAvatar: {
      marginBottom: '20px',
      border: '4px solid #' + user.color,
      borderRadius: '100px',
      hidden: 'true',
    },
    userAvatarEdit: {
      width: 'fit-content',
      display: 'block',
      margin: 'auto',
      border: '4px solid #' + user.color,
      borderRadius: '100px',
      cursor: 'pointer',
    },
    userName: {
      marginBottom: '6px',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '24px',
      color: '#6588DE',
    },
    buttonUpdateDrawer: {
      position: 'relative',
      left: '50%',
      marginRight: '5px',
    },
    buttonEditDrawer: {
      border: 'none',
      backgroundColor: '#E3F6FC',
      color: '#6588DE'
    },
    fullnameInput: {
      width: '200px'
    }
  }

  console.log(user)

  return (
    <div style={style.userInformation}>
      <Avatar onClick={handleDrawer} style={style.avatar} className={classes.large}>{user.fullname.toUpperCase()[0]}</Avatar>
      <div style={style.info}>
        <p style={style.fullname}>{user.fullname}</p>
        <p style={style.username}>{user.username}</p>
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
        <div style={style.userInfo}>
          <p style={style.userTitle}>User Info</p>
          {!updateVisible && <div style={style.userAvatar}><UserAvatar size={200} src="https://joeschmoe.io/api/v1/random"></UserAvatar></div>}
          {updateVisible && 
            <div>
              <label style={style.userAvatarEdit} for="files"><UserAvatar size={200} src="https://joeschmoe.io/api/v1/random"></UserAvatar></label>
              <input id="files" style={{ visibility: "hidden" }} type="file" onChange={handleUpdateUserAvatar} />
            </div>
          }
          <p>{user.username}</p>
          <p>{user.email}</p>
          {!updateVisible && <p style={style.userName}>{user.fullname}</p>}
          {updateVisible ? <UpdateUserInfo style={{ margin: '0px 500px' }} /> : null}
        </div>
      </Drawer>
      <Icon icon="ion:log-out-outline" style={{ fontSize: '30px', marginRight: '20px', marginLeft: '20px', cursor: 'pointer' }} onClick={logout} />
    </div>
  )
}

export default UserArea