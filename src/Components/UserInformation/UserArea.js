import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from "@material-ui/core"
// import { useMediaQuery } from 'react-responsive'
import { Icon } from '@iconify/react'
import { useState } from 'react'
import { Modal, Form, Input, Avatar as UserAvatar, Button } from 'antd'
import { storage } from "../../firebase/index"
import { toast } from 'react-toastify'
import { userService } from "../../service/user"
import { useEffect } from 'react'
const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10)
  },
}))

const UserArea = ({ user, logout }) => {
  const classes = useStyles()
  const [updateVisible, setUpdateVisible] = useState(false)
  const [userAvatarPreview, setUserAvatarPreview] = useState(null)
  const [userInfo, setUserInfo] = useState({
    fullname: '',
    username: '',
    avatar: '',
    password: '',
  })
  const [userAvatar, setUserAvatar] = useState()

  const handleEditUserInfo = () => {
    setUpdateVisible(!updateVisible)
  }

  // TODO: update user info
  const handleUpdateUserInfo = async () => {
    let userInfoToUpdate = userInfo
    if (userAvatar) {
      const metadata = {
        contentType: userAvatar.type
      }
      const storageRef = storage.ref(`userAvatars/${userAvatar.name}`)
      const snapshot = await storageRef.put(userAvatar, metadata)
      const url = await snapshot.ref.getDownloadURL()
      userInfoToUpdate.avatar = url
    }
    try {
      let res = await userService.updateUser(user?.id, userInfoToUpdate)
      toast.success(res?.data?.msg)
    } catch (err) {
      toast.error(`${err?.response?.data?.msg}`)
    }
    setUserAvatarPreview(userInfo.avatar)
    setUserAvatar(null)
    setUpdateVisible(false)
  }
  const handleUpdateUserAvatar = (e) => {
    const newUserAvatar = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(newUserAvatar)
    reader.onloadend = () => {
      setUserAvatarPreview(reader.result)
    }
    setUserAvatar(newUserAvatar)
  }
  const mediaMatch = window.matchMedia("(min-width: 970px)")
  const [matches, setMatches] = useState(mediaMatch.matches);
  // const limit = useMediaQuery({ maxWidth: 1300 })
  useEffect(() => {
    const handler = e => setMatches(e.matches);
    mediaMatch.addListener(handler);
    return () => mediaMatch.removeListener(handler);
  });
  const style = {
    userInformation: isRowBased => ({
      display: 'flex',
      alignItems: 'center',
      alignContent: 'flex-start',
      justifyContent: 'flex-end',
      height: '100px',
      width: '100%',
      backgroundColor: '#E3F6FC',
      marginBottom: '10px',
    }),
    avatar: isRowBased => ({
      // fontSize: isRowBased ? '24px' : '8px',
      marginRight: isRowBased ? '20px' : '10px',
      marginLeft: isRowBased ? '20px' : '10px',
      background: '#' + user?.color,
      cursor: 'pointer',
    }),
    info: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'start',
    },
    fullname: isRowBased => ({
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: isRowBased ? '18px' : '12px',
      color: '#52585D',
      margin: isRowBased ? '0px' : '5px',
      width: '100%'
    }),
    username: {
      fontStyle: 'normal',
      fontFamily: 'Poppins',
      padding: '5px 8px',
      backgroundColor: '#6588DE',
      borderRadius: '14px',
      color: '#FFFFFF',
      fontSize: '10px',

    },

    userAvaterEdit: {
      width: 'fit-content',
      display: 'block',
      margin: 'auto',
      border: '4px solid #' + user?.color,
      borderRadius: '115px',
      cursor: 'pointer',
    }
  }

  return (
    <div style={style.userInformation(matches)}>
      <Avatar onClick={handleEditUserInfo} style={style.avatar(matches)} className={classes.large} src={user?.avatar}></Avatar>

      <Modal visible={updateVisible} closable={false} title="Update User Info" onCancel={handleEditUserInfo} footer={null}>
        {updateVisible &&
          <div>
            <label style={style.userAvaterEdit} htmlFor="userAvatar"><UserAvatar size={200} src={userAvatarPreview ? userAvatarPreview : user.avatar}></UserAvatar></label>
            <input id="userAvatar" style={{ visibility: "hidden" }} accept='image/*' type="file" onChange={handleUpdateUserAvatar} />
          </div>
        }
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={handleUpdateUserInfo}
        >
          <Form.Item label="Full Name" rules={[
            {
              required: true,
              message: 'Please input your full name!',
            },
          ]}>
            <Input defaultValue={user?.fullname} onChange={(e) => setUserInfo({ ...userInfo, fullname: e.target.value })} />
          </Form.Item>
          <Form.Item label="Username" rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}>
            <Input defaultValue={user?.username} onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })} />
          </Form.Item>
          <Form.Item label="Password" name="password"
            rules={[
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                message: 'Password must be at least 6 characters, contain at least one uppercase letter, one lowercase letter, one number and one special character!',
              }
            ]}>
            <Input.Password onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })} />
          </Form.Item>
          <Form.Item label="Confirm Password" name="confirm"
            rules={[
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                message: 'Password must be at least 6 characters, contain at least one uppercase letter, one lowercase letter, one number and one special character!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}>
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <div style={style.info}>
        <p style={style.fullname(matches)}>{user?.fullname}</p>
        <p style={style.username}>{user?.username}</p>
      </div>
      <Icon icon="ion:log-out-outline" style={{ fontSize: '30px', cursor: 'pointer' }} onClick={logout} />
    </div>
  )
}

export default UserArea