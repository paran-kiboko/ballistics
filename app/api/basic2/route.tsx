import { NextResponse } from 'next/server';

export async function POST(request: Request) {

    console.log('Backend : /api/exportData');
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
}

export async function GET(request: Request) {

    console.log('Backend : /api/exportData');
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
}