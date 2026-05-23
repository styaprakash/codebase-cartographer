'use client'

import { Search } from 'lucide-react'

interface RepoSearchProps {
    value: string
    onChange: (value: string) => void
}

export default function RepoSearch({ value, onChange }: RepoSearchProps) {
    return (
        <div className="relative w-full">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search repositories..."
                className="cc-dashboard-search w-full rounded-xl border border-border-dark bg-[#111118] py-3 pl-12 pr-4 text-text-primary outline-none transition-all placeholder:text-text-muted"
            />
        </div>
    )
}
