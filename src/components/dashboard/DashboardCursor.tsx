'use client'

import { useEffect, useState } from 'react'

export default function DashboardCursor() {
    const [position, setPosition] = useState({ x: -100, y: -100 })

    useEffect(() => {
        const onMove = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY })
        window.addEventListener('mousemove', onMove)
        return () => window.removeEventListener('mousemove', onMove)
    }, [])

    return (
        <div
            className="cc-dashboard-cursor"
            style={{ left: position.x, top: position.y }}
            aria-hidden
        />
    )
}
