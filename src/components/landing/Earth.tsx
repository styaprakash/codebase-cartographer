'use client'

import { useEffect, useRef } from 'react'

export default function Earth() {
    const earthRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!earthRef.current) return
            // Earth moves MORE than stars (it's the "closest" layer)
            // Negative values make it move OPPOSITE to cursor (parallax feel)
            const x = -(e.clientX / window.innerWidth  - 0.5) * 40
            const y = -(e.clientY / window.innerHeight - 0.5) * 40
            earthRef.current.style.transform = `translate(${x}px, ${y}px)`
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        // Fixed + centered in upper half of screen
        // pointer-events-none means mouse clicks pass through it
        <div
            className="fixed inset-0 pointer-events-none flex justify-center"
            style={{ zIndex: 5, paddingTop: 40, alignItems: 'flex-start' }}
        >
            <div
                ref={earthRef}
                style={{
                    width: 220, height: 220,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.3s ease-out',
                    position: 'relative',
                }}
            >
                {/* Atmosphere glow ring — pure CSS radial gradient */}
                <div style={{
                    position: 'absolute',
                    inset: -15,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, transparent 40%, rgba(6,182,212,.2) 70%, transparent 100%)',
                }} />

                {/* Globe — rotates via cc-rotate-earth keyframe in globals.css */}
                <div style={{
                    width: '100%', height: '100%',
                    borderRadius: '50%',
                    animation: 'cc-rotate-earth 30s linear infinite',
                    boxShadow: `
            inset -30px -30px 50px rgba(0,0,0,.5),
            0 0 80px  rgba(6,182,212,.3),
            0 0 120px rgba(6,182,212,.15)
          `,
                    position: 'relative',
                }}>
                    {/* Lens flare — bright spot at top-right that pulses */}
                    <div style={{
                        position: 'absolute',
                        top: '-5%',
                        right: '-5%',
                        width: '15%',
                        height: '15%',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255,255,255,.9) 0%, rgba(255,255,255,.4) 30%, transparent 70%)',
                        filter: 'blur(8px)',
                        animation: 'cc-lens-flare 3s ease-in-out infinite',
                        zIndex: 2,
                    }} />

                    {/* Land masses via radial gradients — no image needed */}
                    <div style={{
                        width: '100%', height: '100%',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        background: `
              radial-gradient(circle at 20% 80%,#0a4a5c 0%,transparent 15%),
              radial-gradient(circle at 60% 20%,#0d6676 0%,transparent 20%),
              radial-gradient(circle at 80% 60%,#0a4a5c 0%,transparent 18%),
              radial-gradient(circle at 40% 40%,#0d6676 0%,transparent 22%),
              radial-gradient(circle at 15% 30%,#0a4a5c 0%,transparent 12%),
              radial-gradient(circle at 85% 85%,#0d6676 0%,transparent 16%),
              radial-gradient(circle at 50% 90%,#0a4a5c 0%,transparent 14%),
              radial-gradient(circle at 30% 55%,#0d6676 0%,transparent 10%),
              linear-gradient(180deg,#1a5f7a 0%,#0d4a5c 50%,#0a3a4a 100%)
            `,
                        position: 'relative',
                    }}>
                        {/* Specular sheen — 3D highlight across the surface */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            borderRadius: '50%',
                            background: `
                radial-gradient(circle at 30% 30%, transparent 0%, rgba(255,255,255,.4) 2%, transparent 4%),
                radial-gradient(circle at 70% 70%, rgba(0,0,0,.3) 0%, transparent 50%),
                linear-gradient(135deg, transparent 0%, rgba(255,255,255,.15) 50%, transparent 100%)
              `,
                            opacity: 0.8,
                            zIndex: 1,
                        }} />

                        {/* Cloud layer drifts independently */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            borderRadius: '50%',
                            background: `
                radial-gradient(ellipse at 25% 25%,rgba(255,255,255,.15) 0%,transparent 30%),
                radial-gradient(ellipse at 75% 60%,rgba(255,255,255,.10) 0%,transparent 25%),
                radial-gradient(ellipse at 50% 80%,rgba(255,255,255,.12) 0%,transparent 20%)
              `,
                            animation: 'cc-drift-clouds 40s linear infinite',
                        }} />
                    </div>
                </div>
            </div>
        </div>
    )
}