/* *****Fetchers***** */

import { GithubRepo, BackendRepo, DashboardRepo } from "@/types";
import axios from "axios";
import api from "@/lib/api";
import { useSession } from "next-auth/react";
import useSWR from "swr";

//Fetches All user repo from the Github API (external — uses raw axios)
async function fetchGithubRepos(githubToken: string): Promise<GithubRepo[]> {
    const res = await axios.get(
    'https://api.github.com/user/repos',
    {
        params: {
            per_page:100,
            sort: 'updated',
            affiliation: 'owner',
        },
        headers: {
            Authorization: `Bearer ${githubToken}`
        }
    })

    return res.data
}


//fetches indexed repos from backend (uses api instance — interceptor handles 401)
async function fetchBackendRepos(): Promise<BackendRepo[]> {
    const res = await api.get(`/repos`)
    return res.data;
}


/* *****Merge Logic***** */
//Combines github repos + backend status into one unified list
function mergeRepos(githubRepos: GithubRepo[], backendRepos: BackendRepo[]): DashboardRepo[] {
    return githubRepos.map((gr) => {
        const backend = backendRepos.find(
            (br) => String(br.githubRepoId) === String(gr.id)
        )

        return{
            githubId: gr.id,
            backendId: backend?.id ?? null,
            name: gr.name,
            fullName: gr.full_name,
            description: gr.description ?? 'No description provided.',
            language: gr.language,
            branch: gr.default_branch,
            status: backend ? backend.status : 'NOT_INDEXED',
            totalFiles: backend?.totalFiles ?? 0,
            indexedFiles: backend?.indexedFiles ?? 0,
            errorMessage: backend?.errorMessage ?? null
        }
    })
}

interface ReposData {
    repos: DashboardRepo[]
    githubRepos: GithubRepo[]
}

/* ***** Custom Hook ***** */
export function useRepos(){
    const { data:session } = useSession()

    const githubToken = (session as any)?.githubAccessToken as
        | string
        | undefined

    const key = githubToken
        ? ['repos', githubToken]
        : null

    const { data, error, isLoading, mutate } =
        useSWR<ReposData>(
            key,
            async () => {
                const [ghResult, backendResult] = await Promise.allSettled([
                    fetchGithubRepos(githubToken!),
                    fetchBackendRepos(),
                ])

                // If the backend call failed with 401, re-throw to trigger
                // the api interceptor's signOut + redirect flow.
                if (backendResult.status === 'rejected') {
                    const err = backendResult.reason
                    if (axios.isAxiosError(err) && err.response?.status === 401) {
                        throw err
                    }
                }

                const githubRepos = ghResult.status === 'fulfilled'
                    ? ghResult.value
                    : []
                const backendRepos = backendResult.status === 'fulfilled'
                    ? backendResult.value
                    : []

                return {
                    githubRepos,
                    repos: mergeRepos(githubRepos, backendRepos),
                }
            },
            {
                refreshInterval: (data) => {
                    const hasIndexing = data?.repos?.some(
                        (r) => r.status === 'INDEXING' || r.status === 'PENDING'
                    )
                    return  hasIndexing ? 5000 : 0;
                },
                revalidateOnMount: true,
                revalidateIfStale: true,
                dedupingInterval: 500,
            }
        )

    return {
        repos: data?.repos ?? [],
        githubRepos: data?.githubRepos ?? [],
        isLoading,
        error,
        refresh: mutate,
    }
}
