import "./css/Footer.css"

const Footer = () => {
    return (
        <div className='footer'>
            <div className='footer-links'>
                <div>
                    <a href="#">Meta</a>
                    <a href="#">About</a>
                    <a href="#">Blog</a>
                    <a href="#">Jobs</a>
                    <a href="#">Help</a>
                    <a href="#">API</a>
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                    <a href="#">Top Accounts</a>
                    <a href="#">Hashtags</a>
                    <a href="#">Locations</a>
                    <a href="#">Instagram Lite</a>
                    <a href="#">Contact Uploading & Non-Users</a>
                </div>
                <div>
                    <a href="#">Dance</a>
                    <a href="#">Food & Drink</a>
                    <a href="#">Home & Garden</a>
                    <a href="#">Music</a>
                    <a href="#">Visual Arts</a>
                </div>
            </div>
            <div className="footer-base">
                <div className="footer-language">
                    English
                    <svg viewBox="0 0 24 24">
                        <path d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502z" />
                    </svg>
                </div>
                <div>
                    © 2022 Instagram from Meta
                </div>
            </div>
        </div>
    )
}

export default Footer
