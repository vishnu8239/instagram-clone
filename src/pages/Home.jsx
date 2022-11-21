import './css/Home.css'
import { useEffect } from 'react'

import Footer from '../components/Footer'
import Login from '../components/Login'
import Phone from '../components/Phone'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()

    useEffect(() => {
        document.title = "Instagram"
        const token = localStorage.getItem("token")
        if (token) {
            navigate("/dashboard")
        }
    }, [])

    return (
        <div className='home'>
            <div className='home__container'>
                <Phone />
                <Login />
            </div>
            <Footer />
        </div>
    )
}

export default Home
