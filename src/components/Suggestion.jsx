import Avatar from "../assets/Images/avatar.jpg"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import followUser from "../api/followUser"
import { Spinner } from "../assets/svg/Icons"

const Suggestion = ({ username, description, followed, actions }) => {
    const [click, setClick] = useState({count: 0, control: "follow"})
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        const init = async () => {
            const data = await followUser(username, click.control)

            setLoading(false)

            if (data.status == "success") {
                actions.setUser(data.profile)
            }
        }

        if (click.count !== 0) {
            setLoading(true)
            init()
        }
    }, [click])

    return (
        <div className="suggest">
            <img className="profile-photo" src={Avatar} alt="" />
            <div className="username-box">
                <h3 
                    onClick={() => navigate("/profile", {state: {username}})}
                >
                    {username}
                </h3>
                <span>{description}</span>
            </div>
            {loading ? <Spinner /> : followed ? (
                <h4 className="following-button"
                    onClick={() => setClick(prev => {
                        return {count: prev.count + 1, control: "unfollow"}
                    })}
                >Following</h4>) : (
                <h4 className="follow-button"
                    onClick={() => setClick(prev => {
                        return {count: prev.count + 1, control: "follow"}
                    })}
                >Follow</h4>
            )}
        </div>
    )
}

export default Suggestion
