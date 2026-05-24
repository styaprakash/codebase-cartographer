'use client'

import { Search } from 'lucide-react'

interface RepoSearchProps {
    value: string
    onChange: (value: string) => void
}

export default function RepoSearch({ value, onChange }: RepoSearchProps) {
    return (
        <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search repositories..."
                className="search-input w-full pl-12 pr-4 py-3 h-12 rounded-2xl bg-[#111118] border border-[#1E1E2E] text-[#F1F5F9] placeholder-[#64748B] outline-none transition-all"
            />
        </div>
    )
}
