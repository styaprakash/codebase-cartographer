import RepoCard, { RepoCardProps } from './RepoCard'

interface RepoGridProps {
    repos: RepoCardProps[]
}

export default function RepoGrid({ repos }: RepoGridProps) {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                width: '100%',
            }}
        >
            {repos.map((repo) => (
                <RepoCard key={repo.title} {...repo} />
            ))}
        </div>
    )
}