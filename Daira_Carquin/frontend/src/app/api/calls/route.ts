import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const queueId = searchParams.get('queue_id');

    const apiUrl = `http://localhost:3000/api/calls`;
    const urlWithParams = `${apiUrl}?${new URLSearchParams({
        ...(status && { status }),
        ...(queueId && { queue_id: queueId }),
    })}`;

    try {
        const response = await fetch(urlWithParams, {
            headers: {
                'x-api-key': process.env.API_KEY ?? 'tu-api-key-aqui',
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching calls: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    }  catch (error: unknown) {
        let message = 'Unknown error';
    
        if (error instanceof Error) {
            message = error.message;
        }
    
        return NextResponse.json(
            { error: 'Failed to fetch calls', details: message },
            { status: 500 }
        );
    }
}
