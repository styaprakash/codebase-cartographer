import useSWR from "swr";
import { useSession } from "next-auth/react";
import { FileNode } from "@/types";
import { graphApi } from "@/lib/api";

export function buildFileTree(paths: string[]): FileNode[] {
    const root: FileNode[] = [];

    for (const path of paths) {
        // Split a flat path (e.g. 'src/app/page.tsx') into segments: ['src', 'app', 'page.tsx']
        const parts = path.split('/');
        
        // Start at the root level for each new path
        let currentLevel = root;
        let currentPath = '';

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            
            // Reconstruct the path up to this segment
            currentPath = currentPath ? `${currentPath}/${part}` : part;
            
            // If it's the last segment in the array, it's a file; otherwise it's a directory
            const isFile = i === parts.length - 1;

            // Check if this segment already exists at the current tree level
            let existingNode = currentLevel.find(n => n.name === part);

            if (!existingNode) {
                // Create a new node if it doesn't exist yet
                existingNode = {
                    name: part,
                    path: currentPath,
                    type: isFile ? 'file' : 'directory',
                };
                
                // Directories need a children array to hold nested files/folders
                if (!isFile) {
                    existingNode.children = [];
                }
                
                currentLevel.push(existingNode);
            }

            // Move one level deeper for the next iteration (only if it's a directory)
            if (!isFile) {
                currentLevel = existingNode.children!;
            }
        }
    }

    return root;
}

export function useFileTree(repoId: string) {
    const { data: session } = useSession();
    const token = (session as any)?.backendToken as string | undefined;

    const { data, error, isLoading, mutate } = useSWR<FileNode[]>(
        token ? `fileTree-${repoId}` : null,
        async () => {
            const res = await graphApi.getFiles(repoId);
            // The backend returns a flat List<String> of file paths.
            // We need to build a nested tree structure for the FileTree UI.
            const paths: string[] = res.data;
            return buildFileTree(paths);
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
