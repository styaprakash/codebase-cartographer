'use client'

import { useEffect, useRef } from 'react'

export default function DashboardStarfield() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const fragment = document.createDocumentFragment()
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div')
            const size = Math.random() * 2
            star.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: white;
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.5};
            `
            fragment.appendChild(star)
        }
        container.appendChild(fragment)
    }, [])

    return <div ref={containerRef} className="cc-dashboard-star-bg" aria-hidden />
}
