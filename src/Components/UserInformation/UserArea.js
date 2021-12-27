import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from "@material-ui/core"
// import { useMediaQuery } from 'react-responsive'
import { Icon } from '@iconify/react'
import { useState } from 'react'
import {Modal, Form, Input, Avatar as UserAvatar} from 'antd'

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10)
  },
}))

const UserArea = ({ user, logout }) => {
  const classes = useStyles()
  const [updateVisible, setUpdateVisible] = useState(false)

  const handleEditUserInfo = () => {
    setUpdateVisible(!updateVisible)
  }

  // TODO: update user info
  const handleUpdateUserInfo = () => {}
  const handleUpdateUserAvatar = () => {}
  // const limit = useMediaQuery({ maxWidth: 1300 })

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

    userAvaterEdit: {
      width: 'fit-content',
      display: 'block',
      margin: 'auto',
      border: '4px solid #' + user.color,
      borderRadius: '100px',
      cursor: 'pointer',
    }
  }

  return (
    <div style={style.userInformation}>
      <Avatar onClick={handleEditUserInfo} style={style.avatar} className={classes.large}>{user.fullname.toUpperCase()[0]}</Avatar>
      

      <Modal visible={updateVisible} closable={false} title="Update User Info" onCancel={handleEditUserInfo} onOk={handleUpdateUserInfo}>
        {updateVisible &&
            <div>
                <label style={style.userAvaterEdit} for="files"><UserAvatar size={200} src="https://joeschmoe.io/api/v1/random"></UserAvatar></label>
                <input id="files" style={{ visibility: "hidden" }} accept='image/*' type="file" onChange={handleUpdateUserAvatar} />
            </div>
        }
        <Form 
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item label="Full Name">
            <Input defaultValue={user.fullname} />
          </Form.Item>
          <Form.Item label="User Name">
            <Input defaultValue={user.username} />
          </Form.Item>
          <Form.Item label="Password">
            <Input.Password />
          </Form.Item>
          <Form.Item label="Confirm Password">
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
      
      <div style={style.info}>
        <p style={style.fullname}>{user.fullname}</p>
        <p style={style.username}>{user.username}</p>
      </div>
      <Icon icon="ion:log-out-outline" style={{ fontSize: '30px', marginRight: '20px', marginLeft: '20px', cursor: 'pointer' }} onClick={logout} />
    </div>
  )
}

export default UserArea