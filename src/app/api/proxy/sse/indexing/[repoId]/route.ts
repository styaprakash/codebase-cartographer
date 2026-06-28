import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ repoId: string }> }
) {
  const { repoId } = await context.params;
  const authHeader = request.headers.get('Authorization');

  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/sse/indexing/${repoId}`;
  const headers = new Headers();
  if (authHeader) headers.set('Authorization', authHeader);

  try {
    const backendResponse = await fetch(backendUrl, { headers });

    if (!backendResponse.body) {
      return new Response('No response body from backend', { status: 500 });
    }

    // THE NUCLEAR FIX: Manual byte-pumping to destroy Next.js buffering
    const stream = new ReadableStream({
      async start(controller) {
        const reader = backendResponse.body!.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            // Force push every single byte chunk immediately
            controller.enqueue(value);
          }
        } catch (err) {
          console.error("Stream reading error:", err);
          controller.error(err);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      status: backendResponse.status,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-store, no-transform, must-revalidate',
        'Connection': 'keep-alive',
        'Content-Encoding': 'none',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    console.error('Error proxying SSE request:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
