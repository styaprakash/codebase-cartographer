import RepoCard, { RepoCardProps } from './RepoCard'

interface RepoGridProps {
    repos: RepoCardProps[]
}

export default function RepoGrid({ repos }: RepoGridProps) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {repos.map((repo) => (
                <RepoCard key={repo.title} {...repo} />
            ))}
        </div>
    )
}
