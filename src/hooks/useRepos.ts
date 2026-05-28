
/* *****Fetchers***** */

import { GithubRepo, BackendRepo, DashboardRepo } from "@/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import useSWR from "swr";

//Fetches All user repo from the Github API
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


//fetches indexed repos from backend
async function fetchBackendRepos(backendToken: string): Promise<BackendRepo[]> {
    const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/repos`,
        {
            headers: {
                Authorization: `Bearer ${backendToken}`,
            }
        }
    )
    return res.data;
}




/* *****Merge Logic***** */
//Combines github repos + backend status into one unified list
function mergeRepos(githubRepos: GithubRepo[], backendRepos: BackendRepo[]): DashboardRepo[] {
    return githubRepos.map((gr) => {
        //find the matching backend repo with the github repo
        const backend = backendRepos.find(
            (br) => br.githubRepoId === String(gr.id)
        )

        return{
            githubId: gr.id,
            backendId: backend?.id ?? null,
            name: gr.name,
            fullName: gr.full_name,
            description: gr.description ?? 'No description provided.',
            language: gr.language,
            branch: gr.default_branch,
            status: backend ? backend.status : 'NOT_INDEXED', //If in backend → use backend status, else NOT_INDEXED
            totalFiles: backend?.totalFiles ?? 0,
            indexedFiles: backend?.indexedFiles ?? 0,
            errorMessage: backend?.errorMessage ?? null
        }
    })
}



/* ***** Custom Hook ***** */
export function useRepos(){
    const { data:session } = useSession()

    const githubToken = (session as any)?.githubAccessToken as 
        | string
        | undefined

    const backendToken = (session as any)?.backendToken as
        | string
        | undefined

    // SWR key — null means "don't fetch yet" (tokens not ready)
    const key = githubToken && backendToken
        ? ['repos', githubToken, backendToken]
        : null

    const { data, error, isLoading, mutate } = 
        useSWR<DashboardRepo[]>(
            key,
            async () => {
                //Fetch both in parallel — each failure handled independently
                const [githubResult, backendResult] = await Promise.allSettled([
                    fetchGithubRepos(githubToken!),
                    fetchBackendRepos(backendToken!)
                ])

                const githubRepos = githubResult.status === 'fulfilled'
                    ? githubResult.value
                    : []
                const backendRepos = backendResult.status === 'fulfilled'
                    ? backendResult.value
                    : []

                return mergeRepos(githubRepos, backendRepos)
            },
            //Refresh every 5 secs if any repo is INDEXING
            //this keeps the progress bar updaing live
            {
                refreshInterval: (data) => {
                    const hasIndexing = data?.some(
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
        repos: data ?? [],
        isLoading,
        error,
        refresh: mutate,    // call this to force refresh
    }
}