'use client'

import Link from "next/link";
import { ChevronDown, LogOut, MapPin, Settings } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

function userHandle(
    name: string | null | undefined,
    email: string | null | undefined,
) {
    if (name) {
        const handle = name.toLowerCase().replace(/\s+/g, "_");
        return `@${handle}`;
    }
    if (email) return `@${email.split("@")[0]}`;
    return "@user";
}

export default function DashboardNav() {
    const { data: session } = useSession();
    const displayName = userHandle(session?.user?.name, session?.user?.email);
    const avatarUrl = session?.user?.image;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const SCROLL_THRESHOLD = 20;
    const MOUSE_REVEAL_ZONE = 80;

    const lastScrollY = useRef(0);
    const [navVisible, setNavVisible] = useState(true);
    const [mouseNearTop, setMouseNearTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            const delta = currentY - lastScrollY.current;

            if (currentY <= 0) {
                setNavVisible(true);
            } else if (Math.abs(delta) > SCROLL_THRESHOLD) {
                if (delta > 0) {
                    setNavVisible(false);
                } else {
                    setNavVisible(true);
                }
            }

            lastScrollY.current = currentY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMouseNearTop(e.clientY <= MOUSE_REVEAL_ZONE);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const isVisible = navVisible || mouseNearTop;

    return (
        <nav style={{ transform: isVisible ? "translateY(0)" : "translateY(-100%)", transition: "transform 0.4s ease" }} className="fixed top-0 w-full z-50 bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-[#1E1E2E]">
            <div
                style={{
                    marginLeft: "1.5rem",
                    marginRight: "1.5rem",
                }}
                className="flex h-16 items-center justify-between"
            >
                {/* LEFT SIDE - Logo */}
                <div className="flex items-center">
                    <Link
                        href="/"
                        id="nav-logo"
                        className="flex items-center gap-2 group"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#06B6D4] flex items-center justify-center">
                            <MapPin className="text-white w-4 h-4" strokeWidth={2.5} />
                        </div>

                        <span className="text-xl font-bold tracking-tight">
                            <span className="text-[#F1F5F9]">Codebase</span>
                            <span className="text-[#06B6D4]"> Cartographer</span>
                        </span>
                    </Link>
                </div>

                {/* RIGHT SIDE - User Menu */}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div ref={dropdownRef} style={{ position: 'relative' }}>
                        <button
                            id="user-menu-btn"
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                borderRadius: '9999px',
                                padding: '6px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                            aria-haspopup="true"
                        >
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '9999px',
                                border: '1px solid #1E1E2E',
                                overflow: 'hidden',
                                backgroundColor: '#111118',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt="User avatar"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{
                                        display: 'flex',
                                        height: '100%',
                                        width: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        color: '#6366F1',
                                    }}>
                                        {(session?.user?.name?.[0] ?? "U").toUpperCase()}
                                    </div>
                                )}
                            </div>

                            <span style={{
                                fontSize: '14px',
                                fontWeight: 500,
                                color: '#F1F5F9',
                            }}>
                                {displayName}
                            </span>

                            <ChevronDown style={{ 
                                width: '16px', 
                                height: '16px', 
                                color: '#64748B',
                                transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s',
                            }} />
                        </button>

                        {isDropdownOpen && (
                            <div 
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '100%',
                                    zIndex: 50,
                                    marginTop: '12px',
                                    width: '224px',
                                    borderRadius: '12px',
                                    border: '1px solid #1E1E2E',
                                    backgroundColor: 'rgba(10, 10, 15, 0.95)',
                                    backdropFilter: 'blur(12px)',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <div style={{ padding: '8px' }}>
                                    <Link
                                        href="/settings"
                                        id="menu-settings"
                                        onClick={() => setIsDropdownOpen(false)}
                                        style={{
                                            display: 'flex',
                                            width: '100%',
                                            alignItems: 'center',
                                            gap: '12px',
                                            borderRadius: '8px',
                                            padding: '10px 16px',
                                            fontSize: '14px',
                                            color: '#F1F5F9',
                                            textDecoration: 'none',
                                            transition: 'background-color 0.2s',
                                            cursor: 'pointer',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        <Settings style={{ width: '16px', height: '16px' }} />
                                        Settings
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            signOut({ callbackUrl: "/" });
                                        }}
                                        style={{
                                            display: 'flex',
                                            width: '100%',
                                            alignItems: 'center',
                                            gap: '12px',
                                            borderRadius: '8px',
                                            padding: '10px 16px',
                                            fontSize: '14px',
                                            color: '#F87171',
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(248, 113, 113, 0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        <LogOut style={{ width: '16px', height: '16px' }} />
                                        Disconnect
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}