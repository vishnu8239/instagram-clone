import "./css/MessageUser.css"
import { Close } from "../assets/svg/Icons"
import { useState, useEffect, useContext } from "react"
import { UserContext } from "../pages/Dashboard"
import api from "../config/backend"

const MessageUser = ({ setPopup }) => {
    const [search, setSearch] = useState("")
    const [debounce, setDebounce] = useState("")
    const [users, setUsers] = useState([])

    const {state, actions} = useContext(UserContext)

    useEffect(() => {
        document.title = "New message • Chats"

        return () => document.title = "Inbox • Chats"
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(debounce)
        }, 1000)

        return () => clearTimeout(timer)
    }, [debounce])

    // Search username in databse
    useEffect(() => {
        const token = localStorage.getItem("token")

        const init = async () => {
            const response = await fetch(`${api}/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ search, token })
            })

            const data = await response.json()

            if (data.status == "success") {
                setUsers(data.data)
            }
        }

        if (search) {
            init()
        }
    }, [search])

    return (
        <div className="message__user">
            <div className="message_box">
                <div className="box_header">
                    <Close 
                        onClick={() => setPopup({open: false, origin: null})}
                    />
                    <h2>New Message</h2>
                    <span>Next</span>
                </div>
                <div className="search_flask">
                    <h2>To:</h2>
                    <input 
                        value={debounce}
                        placeholder="Search..."
                        onChange={e => setDebounce(e.target.value)}
                    />
                </div>
                <div className="box_search_result">
                    {users.map((user,index) => {
                        return (
                            <div 
                                key={index} 
                                className="individual_user"
                                onClick={() => {
                                    setPopup({open: false, origin: null})
                                    actions.setInbox({username: user.username})
                                }}
                            >
                                <h2>{user.fullname}</h2>
                                <span>{user.username}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default MessageUser
