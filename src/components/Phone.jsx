import { useState, useEffect, useRef } from 'react'
import "./css/Phone.css"
import phone from '../assets/Images/Phone.png'
import slideOne from '../assets/Images/Slideshow/good-times.png'
import slideTwo from '../assets/Images/Slideshow/screenshot.png'
import slideThree from '../assets/Images/Slideshow/profile.png'
import slideFour from '../assets/Images/Slideshow/story.png'

const slides = [slideOne, slideTwo, slideThree, slideFour]

const Phone = () => {
    const [active, setActive] = useState([0, 3])
    const timeoutRef = useRef(null)

    function resetTimeout() {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
    }

    useEffect(() => {
        resetTimeout()
        timeoutRef.current = setTimeout(() => {
            setActive(prev => {
                let first
                let second

                active[0] + 1 === 4 ? first = 0 : first = active[0] + 1

                active[1] + 1 === 4 ? second = 0 : second = active[1] + 1
                
                return [first, second]
            })
        }, 5000)

        return () => {
            resetTimeout()
        }
    }, [active])

    return (
        <div className='home__phone'>
            <img src={phone} alt="" />
            <div className='slides'>
                {slides.map((slide, index) => {
                    if (index === active[0]) {
                        return <img key={index} className='slide-in' src={slide} alt="" />
                    }
                    else if (index === active[1]) {
                        return <img key={index} className='slide-out' src={slide} alt="" />
                    } else {
                        return <img key={index} src={slide} alt="" />
                    }
                })}
            </div>
        </div>
    )
}

export default Phone
