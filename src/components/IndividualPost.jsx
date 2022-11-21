import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Buffer } from 'buffer'
import { Comment, Heart, HeartRed, Share, Smiley, Spinner } from "../assets/svg/Icons"
import ReactTimeAgo from 'react-time-ago'
import api from '../config/backend'
import Avatar from '../assets/Images/avatar.jpg'

const IndividualPost = ({postInfo, state}) => {
    const [textarea, setTextarea] = useState("")
    const [height, setHeight] = useState(17)
    const [post, setPost] = useState(postInfo)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const text = useRef()

    // Handle resize comment box
    useEffect(() => {
        if (text.current) {
            const offsetHeight = text.current.offsetHeight
            const scrollHeight = text.current.scrollHeight

            if (scrollHeight > offsetHeight) {
                setHeight(scrollHeight)
            }
        }
        
        if (textarea === "") { setHeight(17) }
    }, [textarea])

    const handleLikePost = async (hash, action) => {
        const token = localStorage.getItem('token')
  
        const response = await fetch(`${api}/like`, {
           method: 'POST',
           headers: {
              'Content-Type': 'application/json'
           },
           body: JSON.stringify({ hash, action, token })
        })
  
        const data = await response.json()

        if (data.status == "success") {
            setPost(data.post)
        }
    }

    const handleAddComment = async (hash, comment) => {
        setLoading(true)
        const token = localStorage.getItem('token')
  
        const response = await fetch(`${api}/comment`, {
           method: 'POST',
           headers: {
              'Content-Type': 'application/json'
           },
           body: JSON.stringify({ hash, comment, token })
        })
  
        const data = await response.json()

        setLoading(false)

        if (data.status == "success") {
            setPost(data.post)
            setTextarea("")
        }
    }

    return (
        <div className="post-box">
            <div className="post-username">
                <img src={Avatar} alt="" />
                <span 
                    onClick={() => navigate('/profile', state.user.username == post.username ? undefined : { state: {username: post.username} })}
                >
                    {post.username}
                </span>
            </div>
            <div className="post-photo">
                <img
                    src={"data:" + post.photo.contentType + ";base64, " + Buffer.from(post.photo.data).toString('base64')}
                    alt=""
                />
            </div>
            <div className="post-comments">
                <div className="post-reactions">
                    {state.user && post.likes.includes(state.user.username) ? 
                        <HeartRed 
                            className="heart-red"
                            onClick={() => handleLikePost(post.hash, "unlike")}
                        /> : <Heart onClick={() => handleLikePost(post.hash, "like")}/>
                    }
                    <Comment />
                    <Share />
                </div>
                {post.likes.length !== 0 && 
                    <div className="post-likes">
                        {post.likes.length} like{post.likes.length > 1 && "s"}
                    </div>
                }
                {post.caption && (
                    <div className="post-caption">
                        <span>{post.username}</span>
                        <span>{post.caption}</span>
                    </div>
                )}
                {post.comments.length !== 0 && 
                    <div className="post-total-comments">
                        {post.comments.length < 5 ? post.comments.map((info, index) => {
                            return (
                                <div key={index} className='individual-comment'>
                                    <h3>{info.username}</h3>
                                    <span>{info.comment}</span>
                                </div>
                            )
                        }) : <h3>View all {post.comments.length} comments</h3>}
                    </div>
                }
                <div className="post-date">
                    <ReactTimeAgo date={Date.parse(post.date)} locale="en-US" />
                </div>
            </div>
            <div className="post-add-comment">
                <div>
                    <Smiley />
                    <textarea 
                        ref={text}
                        style={{height: height + 'px'}}
                        className='comment-box'
                        placeholder="Add a comment..." 
                        value={textarea}
                        onChange={e => setTextarea(e.target.value)}
                    />
                </div>
                <span
                    className={textarea ? "active" : "disabled"}
                    onClick={() => {
                        textarea && handleAddComment(post.hash, textarea)
                    }}
                >
                    {loading ? <Spinner /> : "Post"}
                </span>
            </div>
            </div>
    )
}

export default IndividualPost
