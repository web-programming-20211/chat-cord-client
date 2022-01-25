import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useState } from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import Intro from '../Intro/Intro'
import { useMediaQuery } from 'react-responsive';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { authService } from '../../service/auth'
import { Icon } from '@iconify/react';
import { Form, Input } from 'antd';
toast.configure({
    autoClose: 2000,
    draggable: false,
    position: toast.POSITION.BOTTOM_RIGHT
})

const Login = ({ logIn, invalid, errorToggle, message }) => {
    const [error, setError] = useState(false)
    const [user, setUser] = useState({ email: '', fullname: '', username: '', password: '' })
    const [hover, setHover] = useState(false)
    const [hoverLogin, setHoverLogin] = useState(false)
    const [verifyUser, setUserVerify] = useState({ email: '', code: '' })
    const [formId, setFormId] = useState('login')
    const [registerForm] = Form.useForm();
    const limit = useMediaQuery({ maxWidth: 1300 })
    const style = {
        textField: {
            display: 'block',
            marginBottom: '20px',
        },

        div: {
            position: 'relative',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(88,63,243,1) 0%, rgba(255,77,0,0.7962535355939251) 100%)',
        },

        button: {
            width: '100%',
            backgroundColor: hoverLogin ? '#ffffff' : 'rgb(101, 136, 222)',
            border: '1px solid rgb(101, 136, 222)',
            color: hoverLogin ? 'rgb(101, 136, 222)' : '#ffffff',
            height: '3em',
            marginBottom: '1em'
        },

        loginForm: {
            width: '350px',
            overflow: 'hidden',
            background: '#ffffff',
            padding: '50px 0px 30px 0px',
            borderRadius: '10px',
            height: '550px',
            maxWidth: '350px',
            transition: 'max-width 200ms'
        },

        signupForm: {
            width: '350px',
            overflow: 'hidden',
            background: '#ffffff',
            padding: '50px 0px 30px 0px',
            borderRadius: '10px',
            height: '650px',
            maxWidth: '350px',
            transition: 'max-width 200ms',
        },

        header: {
            fontWeight: 'bold',
            fontSize: '40px',
            marginBottom: '1.5em',
            color: 'rgb(101, 136, 222)'
        },

        createAccount: {
            fontWeight: 'bold',
            cursor: 'pointer',
            // color: 'rgb(101, 136, 222)',
            color: hover ? 'rgb(101, 136, 222)' : '#000000',
            transition: 'color 300ms'
        },

        buttons: {
            display: 'flex',
            flexDirection: 'column',
            margin: 'auto',
            width: '50%',
            paddingTop: '2em',
            marginBottom: '4em',
        },

        forms: {
            textAlign: 'center',
            position: 'absolute',
            right: limit ? 0 : '10em',
            left: limit ? 0 : 'auto',
            margin: 'auto',
            top: '5em',
            display: 'flex',
            justifyContent: 'center'
        },

        alertText: {
            color: 'red',
            fontWeight: 'bold',
        },

        alert: {
            color: '#ff0000',
            opacity: invalid ? 1 : 0,
            transition: 'opacity 250ms'
        },

        icon: {
            color: 'rgb(101, 136, 222)',

        }
    }

    const registation = async () => {
        try {
            let result = await authService.register(user)
            toast.success(`${result.data.msg}`)
            setFormId('verify')
        } catch (error) {
            setError(true)
            toast.error(`${error.response.data.msg}`)
        }
    }

    const verify = async () => {
        let result = await authService.verify(verifyUser)
        if (result.status === 200) {
            toast.success(`${result.data.msg}`)
            setFormId('login')
        }
        else {
            toast.error(`${error.response.data.msg}`,)
        }
    }

    return (
        <div style={style.div}>
            <Intro />
            <div style={style.forms}>
                {/* Login Form */}
                {formId === 'login' && <form autoComplete='off' noValidate style={style.loginForm}>
                    <h1 style={style.header}>LOGIN</h1>
                    <TextField
                        required
                        value={user.email}
                        id='input-with-icon-textfield'
                        style={style.textField}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        placeholder='email'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Icon icon="carbon:email" style={style.icon} />
                                </InputAdornment>
                            ),
                        }}
                    ></TextField>

                    <TextField
                        required
                        value={user.password}
                        id='standard-basic'
                        style={style.textField}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                logIn(user)
                            }
                        }}
                        placeholder='password'
                        type='password'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Icon icon='ant-design:lock-outlined' style={style.icon} />
                                </InputAdornment>
                            )
                        }}
                    ></TextField>
                    <h4 style={style.alert}>Something went wrong</h4>
                    <div style={style.buttons}>
                        <Button 
                            style={style.button} 
                            variant='contained' 
                            color='primary' 
                            onClick={(e) => {
                                e.preventDefault()
                                logIn(user)
                            }}
                            onMouseEnter={() => setHoverLogin(true)}
                            onMouseLeave={() => setHoverLogin(false)}
                        >Log in</Button>
                    </div>

                    <p style={style.createAccount}
                        // style={}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        onClick={e => {
                            e.preventDefault()
                            setUser({ email: '', password: '' })
                            // setAccount(false)
                            setFormId('signup')
                            // errorToggle(false)
                        }}
                    >Create account ?</p>
                </form>}


                {/* verify */}
                {formId === 'verify' && <form autoComplete='off' noValidate style={style.loginForm}>
                    <h1 style={style.header}>Verify</h1>
                    <TextField
                        required
                        value={verifyUser.email}
                        id='input-with-icon-textfield'
                        style={style.textField}
                        onChange={(e) => setUserVerify({ ...verifyUser, email: e.target.value })}
                        placeholder='email'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Icon icon="carbon:email" style={style.icon} />

                                </InputAdornment>
                            ),
                        }}
                    ></TextField>

                    <TextField
                        required
                        id='standard-basic'
                        style={style.textField}
                        onChange={(e) => setUserVerify({ ...verifyUser, code: e.target.value })}
                        placeholder='verify code'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Icon icon='ant-design:lock-outlined' style={style.icon} />
                                </InputAdornment>
                            )
                        }}
                    ></TextField>

                    {error ? <h4 style={style.alert}>Something went wrong</h4> : null}
                    <div style={style.buttons}>
                        <Button style={style.button} variant='contained' color='primary' onClick={(e) => {
                            e.preventDefault()
                            verify()
                        }}>Confirm</Button>
                    </div>

                    {/* <p style={style.createAccount}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        onClick={e => {
                            e.preventDefault()
                            setUser({ username: '', password: '' })
                            setAccount(false)
                            errorToggle(false)
                        }}
                    >Create account ?</p> */}
                </form>}

                {/* create account */}
                {formId === 'signup' && 
                
                <form autoComplete='off' style={style.signupForm}>
                    <h1 style={style.header}>Create account</h1>

                    <TextField
                        required
                        value={user.email}
                        id='standard-basic'
                        style={style.textField}
                        onChange={(e) => setUser(user => ({ ...user, email: e.target.value }))}
                        placeholder='email'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Icon icon="carbon:email" style={style.icon} />

                                </InputAdornment>
                            ),
                        }}
                    ></TextField>

                    <TextField
                        required
                        value={user.fullname}
                        id='standard-basic'
                        style={style.textField}
                        onChange={(e) => setUser(user => ({ ...user, fullname: e.target.value }))}
                        placeholder='fullname'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Icon style={style.icon} icon='bx:bx-user' />
                                </InputAdornment>
                            ),
                        }}
                    ></TextField>

                    <TextField
                        required
                        value={user.username}
                        id='standard-basic'
                        style={style.textField}
                        onChange={(e) => setUser(user => ({ ...user, username: e.target.value }))}
                        placeholder='username'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Icon style={style.icon} icon='carbon:user-avatar' />
                                </InputAdornment>
                            ),
                        }}
                    ></TextField>

                    <TextField
                        required
                        value={user.password}
                        id='standard-basic'
                        style={style.textField}
                        type='password'
                        onChange={(e) => setUser(user => ({ ...user, password: e.target.value }))}
                        placeholder='password'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Icon icon='ant-design:lock-outlined' style={style.icon} />
                                </InputAdornment>
                            )
                        }}
                    ></TextField>

                    <TextField
                        required
                        error={error}
                        id={error ? 'standard-error-helper-text' : 'standard-basic'}
                        style={style.textField}
                        type='password'
                        onChange={(e) => {
                            setError(e.target.value !== user.password)
                        }}
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                registation()
                            }
                        }}
                        placeholder='confirm password'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Icon icon='ant-design:lock-outlined' style={style.icon} />
                                </InputAdornment>
                            )
                        }}
                    ></TextField>
                    <div style={style.buttons}>
                        <Button style={style.button} variant='contained' color='primary' onClick={(e) => {
                            e.preventDefault()
                            registation()
                            setUserVerify({ email: user.email })
                        }}>Create Account</Button>
                        <Button style={{ background: '#ffffff', color: '#000000', border: '3px solid black' }} variant='contained' color='primary' onClick={(e) => {
                            e.preventDefault()
                            setFormId('login')
                        }}>Back</Button>
                    </div>
                </form>
                }

            </div>
        </div>
    )
}

export default Login