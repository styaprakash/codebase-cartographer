import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ExplorerLayout from "@/components/explorer/ExplorerLayout";

export default async function RepoExplorerPage({
    params,
}: {
    params: Promise<{ repoId: string }>;
}) {
    const session = await auth();

    // If not logged in -> redirect to login
    if (!session) {
        redirect("/auth/login");
    }

    const resolvedParams = await params;
    const repoId = resolvedParams.repoId;

    return <ExplorerLayout repoId={repoId} />;
}
