import "./css/Profile.css"
import Footer from "../components/Footer"
import { DownArrow, Settings, Spinner, ThreeDots, Unfollow, Close } from "../assets/svg/Icons"
import ProfilePhoto from "../assets/Images/avatar-large.jpg"
import { useState, useEffect, useContext } from "react"
import api from "../config/backend"
import { UserContext } from "./Dashboard"
import { useLocation } from "react-router-dom"
import followUser from "../api/followUser"
import Avatar from "../assets/Images/avatar.jpg"

const Profile = () => {
    // User's own data set globally
    const { state, actions } = useContext(UserContext)

    const user = state.user
    
    const location = useLocation()

    const [profile, setProfile] = useState(null)
    const [click, setClick] = useState({count: 0, control: null})
    const [loading, setLoading] = useState(false)

    const following = profile && profile.followers.includes(user && user.username)

    // Handle user follow and unfollow
    useEffect(() => {
        const init = async () => {
            const data = await followUser(
                profile.username,
                following ? "unfollow" : "follow"
            )

            setLoading(false)

            if (data.status == "success") {
                setProfile(data.data)
                actions.setUser(data.profile)
            }
        }

        if (profile && click.count !== 0 && click.control == "follow") {
            setLoading(true)
            init()
        }
    }, [click])

    // Handle search for another user profile
    // Note - location.state contains username of searched user
    useEffect(() => {
        const token = localStorage.getItem("token")

        const init = async () => {
            const response = await fetch(`${api}/info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token, 
                    username: location.state.username 
                })
            })

            const data = await response.json()

            if (data.status == "success") {
                setProfile(data.data)
                document.title = `${data.data.fullname} (@${data.data.username})`
            }
        }

        if (location.state) {
            init()
        } else {
            setProfile(null)
        }
    }, [location.state])

    // Handle user profile
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
                actions.setUser(data.data)
            }
        }

        if (user === null) {
            init()
        } else {
            document.title = `${user.fullname} (@${user.username})`
        }
    }, [user])

    // Handle posts, followers and following count
    // Profile isn't null   => user searched for another profile
    //                      => const 'profile' stores searched profile data
    // Profile is null      => return user his/her own data
    const length = (link) => {
        if (profile) {
            return profile.profile == "Private" ? profile[link] : profile[link].length
        }

        return user ? user[link].length : 0
    }

    // control => "followers-list", "following-list"
    const followList = (control) => {
        return profile ? profile[control.slice(0,-5)] : user[control.slice(0,-5)]
    }

    return (
        <div className="profile__container">
            {click.count !== 0 && (click.control == "followers-list" || click.control == "following-list") ? (
                <div className="followers-list">
                    <div className="followers-container">
                        <div className="followers-heading">
                            <h3>
                                {click.control == "followers-list" ? "Followers" : "Following"}
                            </h3>
                            <Close onClick={() => setClick({
                                count: 0, control: null
                            })}
                            />
                        </div>
                        <div className="list">
                            {followList(click.control).map(person => {
                                return (
                                    <div className="person">
                                        <div>
                                            <img src={Avatar} alt=""/>
                                            <h4>{person}</h4>
                                        </div>
                                        <button>
                                            {click.control === "following-list" ? 
                                                    "Following" :
                                                    followList("following-list").includes(person) ? "Following" : "Follow"
                                            }
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            ) : undefined}
            <div className="profile_user">
                <div className="user_photo">
                    <img src={ProfilePhoto} alt="" />
                </div>
                <div className="user_info">
                    <div>
                        <h2>
                            {profile ? profile.username : user ? user.username : ""}
                        </h2>
                        {profile ? (
                            <div className="follow">
                                <button>
                                    Message
                                </button>
                                <button 
                                    className={following ? "unfollow-btn" : "follow-btn"}
                                    onClick={() => setClick(prev => {
                                        return {count: prev.count + 1, control: "follow"}
                                    })}
                                >
                                    {loading ? <Spinner className="spinner" /> : (
                                        following ? <Unfollow /> : "Follow"
                                    )}
                                </button>
                                <div className={following ? "down-arrow brown-box" : "down-arrow"}>
                                    <DownArrow />
                                </div>
                                <ThreeDots />
                            </div>
                        ) : (
                            <>
                                <button>Edit profile</button>
                                <Settings />
                            </>
                        )}
                    </div>
                    <div className="user_follow">
                        <div>
                            <span>{length("posts")}</span>
                            <span>posts</span>
                        </div>
                        <div
                            onClick={() => setClick(prev => {
                                return {count: prev.count + 1, control: "followers-list"}
                            })}
                        >
                            <span>{length("followers")}</span>
                            <span>followers</span>
                        </div>
                        <div
                            onClick={() => setClick(prev => {
                                return {count: prev.count + 1, control: "following-list"}
                            })}
                        >
                            <span>{length("following")}</span>
                            <span>following</span>
                        </div>
                    </div>
                    <div className="profile_username">
                        <h2>
                            {profile ? profile.fullname : user ? user.fullname : "Guest"}
                        </h2>
                    </div>
                </div>
            </div>
            <div className="profile_posts">
                Getting Started
            </div>
            <Footer />
        </div>
    )
}

export default Profile
