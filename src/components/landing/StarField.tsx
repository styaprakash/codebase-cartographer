'use client'

// useEffect = run code after component mounts (like a <script> tag)
// useRef    = get a reference to a DOM element without getElementById
import { useEffect, useRef } from 'react'

interface Star {
    element: HTMLDivElement
    x: number  // stored as percentage (0-100)
    y: number
}

export default function StarField() {
    // useRef gives us a safe handle to the <div> below
    // without useRef, we'd have to use getElementById (bad in React)
    const containerRef  = useRef<HTMLDivElement>(null)
    const starsRef      = useRef<Star[]>([])
    const timeoutRef    = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        // ── Build 150 stars ──────────────────────────────────────────
        // This is the same loop as the HTML <script>, just inside useEffect
        // so it runs AFTER React renders the <div> into the DOM
        for (let i = 0; i < 150; i++) {
            const el   = document.createElement('div')
            const size = Math.random() * 2 + 1
            const x    = Math.random() * 100
            const y    = Math.random() * 100

            // We use cssText to batch all styles in one operation (faster)
            el.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${Math.random() > 0.7 ? '#ADD8E6' : 'white'};
        left: ${x}%;
        top: ${y}%;
        opacity: ${0.3 + Math.random() * 0.7};
      `
            container.appendChild(el)
            starsRef.current.push({ element: el, x, y })
        }

        // ── Mouse move handler ───────────────────────────────────────
        const handleMouseMove = (e: MouseEvent) => {
            // Convert pixel position to percentage for comparison with star positions
            const mxPct     = (e.clientX / window.innerWidth)  * 100
            const myPct     = (e.clientY / window.innerHeight) * 100
            // Convert 120px radius to percentage so it works on all screen sizes
            const radiusPct = (120 / window.innerWidth) * 100

            starsRef.current.forEach(({ element, x, y }) => {
                // Pythagorean theorem: distance between cursor and star
                const dist = Math.sqrt((x - mxPct) ** 2 + (y - myPct) ** 2)
                // If star is within 120px of cursor → shake it
                element.style.animation = dist < radiusPct ? 'cc-shake 0.1s infinite' : 'none'
            })

            // Clear previous timeout — this is called "debouncing"
            // It means: only stop shaking 120ms AFTER the cursor stops moving
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            timeoutRef.current = setTimeout(() => {
                starsRef.current.forEach(({ element }) => {
                    element.style.animation = 'none'
                })
            }, 120)

            // Parallax: stars move LESS than earth (they're "further away")
            container.style.transform =
                `translate(${-(e.clientX / window.innerWidth  - 0.5) * 15}px,
                   ${-(e.clientY / window.innerHeight - 0.5) * 15}px)`
        }

        // ── Attach + detach listener ─────────────────────────────────
        // The RETURN function is React's cleanup mechanism
        // It runs when the component is removed from the page (unmounted)
        // Without this, the listener would keep running even after navigating away
        // causing memory leaks and bugs
        window.addEventListener('mousemove', handleMouseMove)
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, []) // ← empty array means "run once on mount, never again"

    return (
        <div
            ref={containerRef}   // ← this connects the ref to the actual DOM element
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 2 }}
        />
    )
}