import { NextResponse } from 'next/server';

export async function GET() {
    const response = await fetch('http://localhost:3000/api/events', {
        method: 'GET',
        headers: {
            'x-api-key': process.env.API_KEY || 'supersecretkey',
        },
    });

    const data = await response.json();
    return NextResponse.json(data);
}
