import useSWR from "swr";
import { useSession } from "next-auth/react";
import { DependencyGraph } from "@/types";
import { graphApi } from "@/lib/api";

export function useDependencyGraph(repoId: string) {
    const { data: session } = useSession();
    const token = (session as any)?.backendToken as string | undefined;

    const { data, error, isLoading, mutate } = useSWR<DependencyGraph>(
        token ? `depGraph-${repoId}` : null,
        async () => {
            const res = await graphApi.getGraph(repoId);
            return res.data;
        },
        {
            revalidateOnFocus: false,
        }
    );

    return {
        graph: data,
        isLoading,
        error,
        refresh: mutate,
    };
}
