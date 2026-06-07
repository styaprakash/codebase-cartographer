'use client'

import { useState, useRef, useEffect } from 'react'
import { ShieldCheck, Database, CreditCard, Zap, Bot, User, FileCode, AlertTriangle, Send, Loader2 } from 'lucide-react'
import { useChat } from '@/hooks/useChat'

interface ChatPanelProps {
    repoId: string
    onFileReference?: (path: string) => void
}

export default function ChatPanel({ repoId, onFileReference }: ChatPanelProps) {
    const { messages, isLoading, sendMessage } = useChat(repoId)
    const [input, setInput] = useState('')
    const [isSending, setIsSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const showOnboarding = messages.length === 0

    const handleSend = async () => {
        if (!input.trim() || isSending) return
        
        setIsSending(true)
        const currentInput = input
        setInput('')
        
        try {
            await sendMessage(currentInput)
        } catch (error) {
            console.error("Failed to send message:", error)
            setInput(currentInput) // restore input on failure
        } finally {
            setIsSending(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            handleSend()
        }
    }

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isSending])

    return (
        <div id="ask-ai-view" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', backgroundColor: '#0A0A0F' }}>
            <div id="chat-history" className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {showOnboarding && !isSending && (
                    <div id="onboarding-chips" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px', color: '#818CF8' }}>How can I help you today?</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px', width: '100%', maxWidth: '576px' }}>
                            <button 
                                onClick={() => setInput('How does authentication work?')}
                                className="suggestion-chip"
                                style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #1E1E2E', backgroundColor: '#111118', fontSize: '12px', color: '#64748B', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                            >
                                <ShieldCheck size={16} color="#6366F1" />
                                How does authentication work?
                            </button>
                            <button 
                                onClick={() => setInput('Explain the database schema')}
                                className="suggestion-chip"
                                style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #1E1E2E', backgroundColor: '#111118', fontSize: '12px', color: '#64748B', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                            >
                                <Database size={16} color="#06B6D4" />
                                Explain the database schema
                            </button>
                            <button 
                                onClick={() => setInput('Where is payment flow handled?')}
                                className="suggestion-chip"
                                style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #1E1E2E', backgroundColor: '#111118', fontSize: '12px', color: '#64748B', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                            >
                                <CreditCard size={16} color="#A855F7" />
                                Where is payment flow handled?
                            </button>
                            <button 
                                onClick={() => setInput('What does the entry point do?')}
                                className="suggestion-chip"
                                style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #1E1E2E', backgroundColor: '#111118', fontSize: '12px', color: '#64748B', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                            >
                                <Zap size={16} color="#F59E0B" />
                                What does the entry point do?
                            </button>
                        </div>
                    </div>
                )}

                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: msg.role === 'user' ? '100%' : '896px' }}
                    >
                        {msg.role === 'assistant' && (
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#818CF8' }}>
                                <Bot size={18} />
                            </div>
                        )}
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: msg.role === 'assistant' ? 1 : 'unset', maxWidth: msg.role === 'user' ? '576px' : '100%' }}>
                            <div className="glass-panel" style={{ padding: '16px', fontSize: '14px', lineHeight: 1.6, color: '#F1F5F9', backgroundColor: msg.role === 'user' ? 'rgba(99, 102, 241, 0.1)' : undefined, border: msg.role === 'user' ? '1px solid rgba(99, 102, 241, 0.3)' : undefined, borderRadius: msg.role === 'user' ? '16px 0 16px 16px' : '0 16px 16px 16px' }}>
                                <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{msg.content}</p>
                            </div>
                            
                            {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '12px' }}>
                                    <span style={{ fontSize: '10px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', paddingTop: '6px' }}>Sources:</span>
                                    {msg.sources.map((source, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => onFileReference?.(source.filePath)}
                                            style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#1E1E2E', border: '1px solid transparent', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                                            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)'; e.currentTarget.style.color = '#F1F5F9'; }}
                                            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = '#64748B'; }}
                                        >
                                            <FileCode size={12} />
                                            {source.label || source.filePath.split('/').pop()}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {msg.role === 'user' && (
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#ffffff' }}>
                                <User size={18} />
                            </div>
                        )}
                    </div>
                ))}
                
                {isSending && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', maxWidth: '896px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#818CF8' }}>
                            <Bot size={18} />
                        </div>
                        <div className="glass-panel" style={{ padding: '16px', borderRadius: '0 16px 16px 16px', fontSize: '14px', color: '#F1F5F9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6366F1', animation: 'bounce 1s infinite' }}></span>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6366F1', animation: 'bounce 1s infinite', animationDelay: '150ms' }}></span>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6366F1', animation: 'bounce 1s infinite', animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '24px', borderTop: '1px solid #1E1E2E', backgroundColor: '#0A0A0F' }}>
                <div id="query-banner" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', borderRadius: '8px', backgroundColor: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.2)', fontSize: '10px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EAB308' }}>
                        <AlertTriangle size={12} />
                        You've used 15 of your 20 free daily queries.
                    </span>
                    <span style={{ color: 'rgba(234, 179, 8, 0.6)' }}>Resets at midnight</span>
                </div>
                
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything about this codebase..." 
                        style={{ width: '100%', backgroundColor: '#111118', border: '1px solid #1E1E2E', borderRadius: '12px', padding: '16px 96px 16px 16px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', color: '#F1F5F9' }}
                        onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                        onBlur={(e) => e.target.style.borderColor = '#1E1E2E'}
                        disabled={isSending || isLoading}
                    />
                    <div style={{ position: 'absolute', right: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '10px', color: '#64748B', backgroundColor: '#1E1E2E', padding: '2px 6px', borderRadius: '4px', fontWeight: 500 }}>⌘ Enter</span>
                        <button 
                            onClick={handleSend}
                            disabled={!input.trim() || isSending || isLoading}
                            style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: (!input.trim() || isSending || isLoading) ? 'rgba(99, 102, 241, 0.5)' : '#4F46E5', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: (!input.trim() || isSending || isLoading) ? 'not-allowed' : 'pointer', border: 'none' }}
                        >
                            {isSending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
                        </button>
                    </div>
                </div>
                <p style={{ marginTop: '12px', fontSize: '10px', textAlign: 'center', color: '#64748B', margin: '12px 0 0 0' }}>AI may make mistakes. Always verify with source code.</p>
            </div>
        </div>
    )
}
