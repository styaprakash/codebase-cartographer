import { CheckCircle, Loader2 } from "lucide-react";

interface Phase{
    label: string
    done: boolean
    active: boolean
}

interface Props {
    phase: Phase[]
}

export default function PhaseChecklist({phase} : Props){
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {phase.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {p.done ? (
                        <CheckCircle style={{ width: '18px', height: '18px', color: '#10B981', flexShrink: 0 }}/>
                    ): p.active ? (
                        <Loader2 style={{ width: '18px', height: '18px', color: '#6366F1', flexShrink: 0, animation: 'spin 1s linear infinite' }}/>
                    ) :(
                        <div style={{ width: '18px', height: '18px', borderRadius: '9999px', border: '1px solid #2D2D3F', flexShrink: 0 }}/>
                    )}

                    <span
                        style={{
                            fontSize: '14px',
                            fontWeight: p.done ? 500 : p.active ? 500 : 400,
                            color: p.done ? '#F1F5F9' : p.active ? '#F1F5F9' : '#475569'
                        }}
                    >{p.label}</span>
                </div>  
            ))}
        </div>
    )
}
