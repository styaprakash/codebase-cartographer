import useSWR from "swr";
import { useSession } from "next-auth/react";
import { FileNode } from "@/types";
import { graphApi } from "@/lib/api";

export function useFileTree(repoId: string) {
    const { data: session } = useSession();
    const token = (session as any)?.backendToken as string | undefined;

    const { data, error, isLoading, mutate } = useSWR<FileNode[]>(
        token ? `fileTree-${repoId}` : null,
        async () => {
            const res = await graphApi.getFiles(repoId);
            return res.data;
        },
        {
            revalidateOnFocus: false,
        }
    );

    return {
        files: data ?? [],
        isLoading,
        error,
        refresh: mutate,
    };
}
