'use client'

import { Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'cc-dashboard-helper-dismissed'

export default function OnboardingBanner() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setVisible(localStorage.getItem(STORAGE_KEY) !== '1')
    }, [])

    const dismiss = () => {
        localStorage.setItem(STORAGE_KEY, '1')
        setVisible(false)
    }

    if (!visible) return null

    return (
        <div className="cc-first-time-helper flex items-center justify-between rounded-r-xl p-4">
            <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 shrink-0 text-indigo" />
                <p className="text-sm text-text-primary/80">
                    Select a repo to index it. Once indexed, you can ask the AI questions about it.
                </p>
            </div>
            <button
                type="button"
                onClick={dismiss}
                className="ml-4 shrink-0 text-text-muted transition-colors hover:text-text-primary"
                aria-label="Dismiss"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}
