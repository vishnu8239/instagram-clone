import "./css/Login.css"
import api from "../config/backend"
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import logo from '../assets/Images/Instagram.png'
import facebookIcon from '../assets/Icons/Facebook.png'
import { Spinner } from "../assets/svg/Icons"

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const [click, setClick] = useState(0)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const canLogin = username.length > 4 && password.length > 4

    const user = { username, password }

    useEffect(() => {
        const loginUser = async () => {
            setLoading(true)

            const response = await fetch(`${api}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })

            const data = await response.json()

            if (data.status == "fail") {
                setLoading(false)
                setMessage(data.reason)
            } else {
                localStorage.setItem("token", data.token)
                setSuccess(true)
            }
        }
        if (click) {
            loginUser()
        }
    }, [click])

    useEffect(() => {
        if (success) {
            navigate('/dashboard')
        }
    }, [success])

    return (
        <div className="home__login">
            <div className="login">
                <img src={logo} alt="Instagram logo" />
                <div className="login_input">
                    <label className={username ? 'label-u__hover-in' : 'label__hover-out'}>
                        Phone number, username, or email
                    </label>
                    <input
                        type="text" 
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <div className="login_input">
                    <label className={password ? 'label__hover-in' : 'label__hover-out'}>
                        Password
                    </label>
                    <input
                        type="password" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <button
                    className={canLogin ? "clickable" : undefined}
                    onClick={() => setClick(prev => prev + 1)}
                >
                    {loading ? <Spinner /> : "Log In"}
                </button>
                <div className="seperator">
                    <div></div>
                    <div className="seperator-text">OR</div>
                    <div></div>
                </div>
                <button className='facebook-login'>
                    <img src={facebookIcon} alt='Facebook icon'/>
                    <span>Log in with Facebook</span>
                </button>
                <div className={message ? "message-box" : "message-box hidden"}>
                    <span>{message}</span>
                </div>
                <Link to="/reset-password">
                    Forgot password?
                </Link>
            </div>
            <div className="register">
                <p>Don't have an account?</p>
                <Link to="/register">
                    Sign up
                </Link>
            </div>
        </div>
    )
}

export default Login
