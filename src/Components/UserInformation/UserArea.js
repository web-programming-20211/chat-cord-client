import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from "@material-ui/core"
import { useMediaQuery } from 'react-responsive'
import { Icon } from '@iconify/react'

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10)
  },
}))

const UserArea = ({ user, logout }) => {
  const classes = useStyles()

  const limit = useMediaQuery({ maxWidth: 1300 })

  const style = {
    userInformation: {
      display: 'flex',
      alignItems: 'center',
      alignContent: 'flex-start',
      justifyContent: 'flex-end',
      height: '100px',
      width: '100%',
      backgroundColor: '#E3F6FC',
      borderRadius: '14px',
      margin: '10px',
      marginLeft: '10px',
    },
    avatar: {
      fontSize: 'xx-large',
      marginRight: '20px',
      marginLeft: '20px',
      background: '#' + user.color,
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

    }
  }

  return (
    <div style={style.userInformation}>
      <Avatar style={style.avatar} className={classes.large}>{user.fullname.toUpperCase()[0]}</Avatar>
      <div style={style.info}>
        <p style={style.fullname}>{user.fullname}</p>
        <p style={style.username}>{user.username}</p>
      </div>
      <Icon icon="ion:log-out-outline" style={{ fontSize: '30px', marginRight: '20px', marginLeft: '20px', cursor: 'pointer' }} onClick={logout} />
    </div>
  )
}

export default UserArea