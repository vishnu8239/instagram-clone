import "./css/CreatePost.css"
import { Gallary, Close, Spinner } from "../assets/svg/Icons"
import api from "../config/backend"
import { useState, useEffect, useRef } from "react"
import Avatar from '../assets/Images/avatar.jpg'
import { useContext } from "react"
import { UserContext } from '../pages/Dashboard'

const CreatePost = () => {
    const { state, actions } = useContext(UserContext)

    const username = state.user && state.user.username

    // const [selected, setSelected] = useState(false)
    const [details, setDetails] = useState(null)
    const [image, setImage] = useState(null)
    const [click, setClick] = useState(0)
    const [textarea, setTextarea] = useState("")
    const [loading, setLoading] = useState(false)

    const input = useRef()

    const selectFile = (e) => {
        const file = e.target.files[0]

        setDetails(file)
        setImage(URL.createObjectURL(file));
    }

    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem('token')
            const form = new FormData()
    
            form.append('image', details)

            form.append('caption', textarea)
    
            const response = await fetch(`${api}/post`, {
                method: 'POST',
                headers: {
                    token
                },
                body: form
            })
    
            const data = await response.json()

            if (data.status == "success") {
                setLoading(false)
                actions.setPopup({open: false, origin: null})
                actions.setUser(data.profile)
            }
        }
  
        if (click) {
            setLoading(true)
            init()
        }
    }, [click])

    return (
        <div className="dashboard__create">
            <div 
                className="close-button"
                onClick={() => actions.setPopup({open: false, origin: null})}
            >
                <Close />
            </div>
            <div className="create_box">
                <div>
                    Create new post
                </div>
                    {image ? (
                        <div className="image-container">
                            <img className="uploaded-image" src={image} alt="Uploaded image" />
                            <div className="comments-box">
                                <div className="profile-info">
                                    <div>
                                        <img src={Avatar} alt="" />
                                        <h3>{username}</h3>
                                    </div>
                                    <button onClick={() => setClick(prev => prev + 1)}>
                                        { loading ? <Spinner /> : "Share"}
                                    </button>
                                </div>
                                <textarea 
                                    className="comment" 
                                    placeholder="Write a caption..." 
                                    value={textarea}
                                    onChange={e => setTextarea(e.target.value)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="picker">
                            <Gallary />
                            <button onClick={() => input.current.click()}>
                                Select from computer
                            </button>
                            <input 
                                ref={input}
                                type="file" 
                                name="image" 
                                onChange={selectFile} 
                            />
                        </div>
                    )}
            </div>
        </div>
    )
}

export default CreatePost
