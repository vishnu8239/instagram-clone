import "./css/Error.css"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

const Error = () => {
    const navigate = useNavigate()

    useEffect(() => {
        document.title = "Page not found • Instagram"

        setTimeout(() => {
            navigate("/")
        }, 2000)
    }, [])

    return (
        <div className="error__container">
            <h1>404</h1>
            <span>Page not found</span>
        </div>
    )
}

export default Error
