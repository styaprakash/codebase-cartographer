import useSWR from "swr";
import { useSession } from "next-auth/react";
import { ChatMessage } from "@/types";
import { querApi } from "@/lib/api";

export function useChat(repoId: string) {
    const { data: session } = useSession();
    const token = (session as any)?.backendToken as string | undefined;

    const { data, error, isLoading, mutate } = useSWR<ChatMessage[]>(
        token ? `chat-${repoId}` : null,
        async () => {
            const res = await querApi.getHistory(repoId);
            return res.data;
        },
        {
            revalidateOnFocus: false,
        }
    );

    const sendMessage = async (question: string, llmProvider?: string) => {
        const provider = llmProvider || 'OPENROUTER_DEEPSEEK_V4_PRO';
        const res = await querApi.ask(repoId, question, provider);
        mutate(); // Re-fetch history after sending
        return res.data;
    };

    return {
        messages: data ?? [],
        isLoading,
        error,
        sendMessage,
        refresh: mutate,
    };
}
