'use client'

import { useEffect, useState } from 'react'

export default function CustomCursor() {
    // Initial position off-screen so it doesn't blink in the corner
    const [position, setPosition] = useState({ x: -100, y: -100 })

    useEffect(() => {
        const updatePosition = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener('mousemove', updatePosition)
        return () => window.removeEventListener('mousemove', updatePosition)
    }, [])

    return (
        <div
            className="cc-cursor transition-transform duration-75"
            style={{
                left: position.x,
                top: position.y,
            }}
        />
    )
}
