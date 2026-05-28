import useSWR from "swr";
import { useSession } from "next-auth/react";

export function useIndexingStatus(repoId: string) {
    const { data: session } = useSession();
    const token = (session as any)?.backendToken as string | undefined;

    const { data, error } = useSWR(
        token ? `indexing-${repoId}` : null,
        async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/repos/${repoId}/status`,
                { headers: { Authorization: `Bearer ${token}` } },
            );
            if (!res.ok) throw new Error("Failed to fetch status");
            return res.json();
        },
        {
            // Poll every 3 seconds
            refreshInterval: 3000,
            revalidateOnFocus: false,
        },
    );

    return {
        status: data?.status ?? "PENDING",
        totalFiles: data?.totalFiles ?? 0,
        indexedFiles: data?.indexedFiles ?? 0,
        errorMessage: data?.errorMessage ?? null,
        repoName: data?.name ?? "",
    };
}
