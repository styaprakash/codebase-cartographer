import { NextRequest } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

export async function GET(
    req: NextRequest,
    { params }: { params: { repoId: string } }
) {
    const authHeader = req.headers.get('Authorization') ?? ''

    const encoder = new TextEncoder()

    const stream = new ReadableStream({
        async start(controller) {
            try {
                const backendRes = await fetch(
                    `${BACKEND_URL}/api/sse/indexing/${params.repoId}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: authHeader,
                            Accept: 'text/event-stream',
                            'Cache-Control': 'no-cache',
                        },
                    }
                )

                if (!backendRes.ok || !backendRes.body) {
                    controller.enqueue(encoder.encode(`data: error\n\n`))
                    controller.close()
                    return
                }

                const reader = backendRes.body.getReader()
                const decoder = new TextDecoder()

                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break
                    const text = decoder.decode(value, { stream: true })
                    controller.enqueue(encoder.encode(text))
                }
            } catch (err) {
                console.error('SSE proxy error:', err)
            } finally {
                controller.close()
            }
        },
        cancel() {
            // Client disconnected
        },
    })

    return new Response(stream, {
        status: 200,
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'X-Accel-Buffering': 'no',
            'Connection': 'keep-alive',
        },
    })
}

export const dynamic = 'force-dynamic'