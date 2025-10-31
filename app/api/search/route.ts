import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { chords } = await request.json();

        const apiKey = process.env.DJANGO_API_KEY || "";
        const backendUrl = process.env.DJANGO_BACKEND_URL || "http://localhost:8000";

        const response = await fetch(`${backendUrl}/api/chords/search/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ chords }),
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
