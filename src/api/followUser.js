import api from "../config/backend"

// username => person to be followed
// action => "follow" or "unfollow"
const followUser = async (username, action) => {
    const token = localStorage.getItem('token')

    const response = await fetch(`${api}/follow`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            action,
            token
        })
    })

    const data = await response.json()

    return data
}

export default followUser
