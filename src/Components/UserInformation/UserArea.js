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
      borderBottom: '2px solid #4a336e',
      height: '15%',
      marginBottom: '10px',
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
      margin: '0px',
      fontSize: '25px',
      fontWeight: 'bold',
      paddingBottom: '5px',
    },
  }

  return (
    <div style={style.userInformation}>
      <Avatar style={style.avatar} className={classes.large}>{user.fullname.toUpperCase()[0]}</Avatar>
      <div style={style.info}>
        <p style={{ margin: '0px', fontSize: '25px', fontWeight: 'bold', paddingBottom: '5px', display: limit ? 'none' : 'block' }}>{user.fullname}</p>
        <p style={style.username}>{user.username}</p>
      </div>
      <Icon icon="ion:log-out-outline" style={{ fontSize: '30px', marginRight: '20px', marginLeft: '20px', cursor: 'pointer' }} onClick={logout} />
    </div>
  )
}

export default UserArea