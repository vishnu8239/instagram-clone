import "./css/Header.css"
import { useState, useEffect, useContext } from "react"
import Avatar from "../../assets/Images/avatar.jpg"
import {
    Instagram,
    DownArrow,
    Search,
    Home,
    Messenger,
    NewPost,
    FindPeople,
    ActivityFeed,
    Profile,
    Saved,
    Spinner
} from "../../assets/svg/Icons"
import { useNavigate, Link } from "react-router-dom"
import api from "../../config/backend"
import CreatePost from "../CreatePost"
import { UserContext } from "../../pages/Dashboard"
import Activity from "../../assets/Icons/Activity.png"
import { nanoid } from "nanoid"
import MessageUser from "../MessageUser"

const DashboardHeader = () => {
    const [search, setSearch] = useState("")
    const [debounce, setDebounce] = useState("")
    const [hidden, setHidden] = useState(true)
    const [click, setClick] = useState({ count: 0, control: "notifications" })
    const [searchResult, setSearchResult] = useState([])
    const [notifications, setNotifications] = useState([])

    const { state, actions } = useContext(UserContext)

    const { popup } = state

    const navigate = useNavigate()

    // Debouncing
    // Reduce the amount of api calls as state "search" will
    //      change only afer one second
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(debounce)
        }, 1000)

        return () => clearTimeout(timer)
    }, [debounce])
    
    // Handle notifications and logout
    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem('token')

            const response = await fetch(`${api}/notifications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token })
            })

            const data = await response.json()

            if (data.status == "success") {
                setNotifications(data.notification)
            }
        }

        if (click.count !== 0 && click.control !== null) {
            if (click.control == "logout") {
                localStorage.removeItem("token")
                navigate("/")
            } else {
                init()
            }
        }
    }, [click])

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
                setSearchResult(data.data)
            }
        }

        if (search) {
            init()
        }
    }, [search])

    // Handle click on like, comment or follow notification
    const handleNotification = (person) => {
        // Close notification window
        setClick(prev => {
            return { count: prev.count + 1, control: null }
        })

        // Redirect to follower profile
        if (person.action === "follow") {
            navigate('/profile', {state: {username: person.from}})
        }

        /*
            Todo: display liked, commented post
        */
    }

    return (
        <>
            {popup.open && popup.origin == "post" && <CreatePost />}
            {popup.open && popup.origin == "new-message" && <MessageUser setPopup={actions.setPopup} />}
            <div className="dashboard__header">
                <div className="header_logo">
                    <div>
                        <Link to="/dashboard">
                            <Instagram />
                        </Link>
                    </div>
                    <DownArrow />
                </div>
                <div className="header_search">
                    <div>
                        <input
                            className={debounce ? "text" : undefined}
                            type="text"
                            value={debounce}
                            onChange={e => setDebounce(e.target.value)}
                        />
                        {!debounce && (
                            <div className="search_icon">
                                <Search />
                                <label>Search</label>
                            </div>
                        )}
                        <div className={debounce ? "arrow" : "hidden"}></div>
                        <div className={debounce ? "search_results" : "hidden"}>
                            {searchResult.length ? (
                                searchResult.map((user, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="result"
                                            onClick={
                                                () => {
                                                    setDebounce("")
                                                    navigate('/profile', { state: { username: user.username } })
                                                }}
                                        >
                                            <div className="result_profile">
                                                <img src={Avatar} alt="avatar" />
                                            </div>
                                            <div className="result_info">
                                                <h2>{user.username}</h2>
                                                <h3>{user.fullname}</h3>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : search ? (
                                <div className="non-existing">
                                    <span>
                                        Username @{search} doesn't exist
                                    </span>
                                </div>
                            ) : <Spinner />}
                        </div>
                    </div>
                </div>
                <div className="header_buttons">
                    <Link to="/dashboard">
                        <Home />
                    </Link>
                    <Messenger
                        onClick={() => navigate('/inbox')}
                    />
                    <NewPost
                        onClick={() => actions.setPopup({ open: true, origin: "post" })}
                    />
                    <FindPeople />
                    <ActivityFeed
                        onClick={() => setClick(prev => {
                            return {
                                count: prev.count + 1,
                                control: prev.control == "notification" ? null : "notification"
                            }
                        })}
                    />
                    { click.count != 0 && click.control == "notification" ?
                        <>
                            <div className="activity-arrow"></div>
                            <div className="activity-container">
                                {notifications.length ? 
                                    <div className="activity-fill">
                                        {notifications.map(pop => {
                                            const head = "@" + pop.from

                                            let message

                                            pop.action == "comment" ?
                                                message = "commented on your post"
                                                    : message = "started following you"
                                                       
                                            return (
                                                <div 
                                                    key={nanoid()} 
                                                    className="fill-notification"
                                                    onClick={() => handleNotification(pop)}
                                                >
                                                    <img src={Avatar} alt=""/>
                                                    <h3>{head}</h3>
                                                    <span>
                                                        {pop.action == "like" ? "likes your post" : message}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div> : 
                                    <div className="activity-blank">
                                        <div>
                                            <img src={Activity} alt="" />
                                            <h4>Activity on your posts</h4>
                                        </div>
                                        <span>
                                            When someone likes or comments on one of your posts, you'll see it here.
                                        </span>
                                    </div>
                                }
                            </div>
                        </> : undefined }
                    <div
                        className="header_avatar"
                        onClick={() => setHidden(prev => !prev)}
                    >
                        <img src={Avatar} alt="avatar" />
                        <div className={hidden ? "arrow hidden" : "arrow"}></div>
                        <div className={hidden ? "avatar_menu hidden" : "avatar_menu"}>
                            <ul>
                                <Link to="/profile">
                                    <li>
                                        <Profile />
                                        <span>Profile</span>
                                    </li>
                                </Link>
                                <li>
                                    <Saved />
                                    <span>Saved</span>
                                </li>
                                <li
                                    onClick={() => setClick(prev => {
                                        return {
                                            count: prev.count + 1,
                                            control: "logout"
                                        }
                                    })}
                                >Logout</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardHeader
