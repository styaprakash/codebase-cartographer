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
        <div id="helper-banner" className="first-time-helper p-4 rounded-r-xl flex items-center justify-between group">
            <div className="flex items-center gap-3">
                <Sparkles className="text-[#6366F1] w-4 h-4" />
                <p className="text-sm text-[#F1F5F9]/80">
                    Select a repo to index it. Once indexed, you can ask the AI questions about it.
                </p>
            </div>
            <button
                type="button"
                onClick={dismiss}
                className="text-[#64748B] hover:text-white transition-colors"
                aria-label="Dismiss"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    )
}
