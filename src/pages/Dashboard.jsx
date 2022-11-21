import { Outlet } from "react-router-dom"
import Header from "../components/Dashboard/Header"
import { useState, createContext } from "react"
import { useEffect } from "react"
import api from '../config/backend'

export const UserContext = createContext()

const Dashboard = () => {
    const [user, setUser] = useState(null)
    const [popup, setPopup] = useState({
        open: false,
        origin: null
    })
    const [inbox, setInbox] = useState(null)

    const value = {
        state: { user, popup, inbox },
        actions: { setUser, setPopup, setInbox }
    }

    useEffect(() => {
        const token = localStorage.getItem("token")

        const init = async () => {
            const response = await fetch(`${api}/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token })
            })

            const data = await response.json()

            if (data.status == "success") {
                setUser(data.data)
            }
        }

        if (user === null) {
            init()
        }
    }, [])

    return (
        <div className="dashboard__container">
            <UserContext.Provider value={value}>
                <Header />
                <Outlet />
            </UserContext.Provider>
        </div>
    )
}

export default Dashboard
