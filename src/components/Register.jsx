import "./css/Register.css"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import instagramLogo from "../assets/Images/Instagram.png"
import facebookIcon from "../assets/Icons/facebookWhite.png"
import api from "../config/backend"
import { Spinner } from "../assets/svg/Icons"

const Register = () => {
    const [contact, setContact] = useState("")
    const [fullname, setFullname] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const [click, setClick] = useState(0)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const canRegister = contact.length > 4 && fullname.length > 4 && username.length > 4 && password.length > 4

    const user = { contact, fullname, username, password }

    const navigate = useNavigate()
    
    useEffect(() => {
        document.title = "Sign up • Instagram"
        const token = localStorage.getItem("token")
        if (token) {
            navigate("/dashboard")
        }
    }, [])

    useEffect(() => {
        const registerUser = async () => {
            const response = await fetch(`${api}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })

            const data = await response.json()

            setLoading(false)

            if (data.status == "fail") {
                setMessage(data.reason)
            } else {
                localStorage.setItem("token", data.token)
                setSuccess(true)
            }
        }
        if (click) {
            setLoading(true)
            registerUser()
        }
    }, [click])

    useEffect(() => {
        if (success) {
            navigate('/dashboard')
        }
    }, [success])
    
    return (
        <>
            <div className="register__container">
                <img src={instagramLogo} alt="Instagram logo" />
                <h2>
                    Sign up to see photos and videos from your friends.
                </h2>
                <div className="register__facebook_login">
                    <img src={facebookIcon} alt="Facebook icon" />
                    Log in with Facebook
                </div>
                <div className="register__seperator">
                    <h2>OR</h2>
                </div>
                <div className="register__inputs">
                    <div>
                        <label className={contact ? 'label-c__hover-in' : 'label__hover-out'}>
                            Mobile Number or Email
                        </label>
                        <input
                            type="text"
                            name="contact"
                            value={contact}
                            onChange={e => setContact(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className={fullname ? 'label__hover-in' : 'label__hover-out'}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullname"
                            value={fullname}
                            onChange={e => setFullname(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className={username ? 'label__hover-in' : 'label__hover-out'}>
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className={password ? 'label__hover-in' : 'label__hover-out'}>
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                <div className="register__terms">
                    <p>
                        People who use our service may have uploaded your contact information to Instagram. <span>Learn More</span>
                    </p>
                    <p>
                        By signing up, you agree to our <span>Terms</span> , <span>Privacy Policy</span> and <span>Cookies Policy</span> .
                    </p>
                </div>
                <button 
                    className={canRegister ? "clickable" : undefined}
                    onClick={() => {
                        setClick(prev => prev + 1)
                    }}
                >
                    {loading ? <Spinner /> : "Sign up"}
                </button>
                <div className={message ? "message-box" : "message-box hidden"}>
                    <span>{message}</span>
                </div>
            </div>
            <div className="register__hint">
                <p>Have an account?</p>
                <Link to="/">Log in</Link>
            </div>
        </>
    )
}

export default Register
