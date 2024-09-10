// Next.js API route handler
import { NextResponse } from 'next/server';
import { fetchGithubData } from '../../lib/githubApi';

const requestQueue: Set<string> = new Set();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    // Check if username is provided
    if (!username) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Check if request for this username is already in progress
    if (requestQueue.has(username)) {
        return NextResponse.json({ error: 'Request already in progress' }, { status: 429 });
    }

    // Add username to the request queue
    requestQueue.add(username);

    try {
        // Fetch data using the updated fetchGithubData function
        const data = await fetchGithubData(username);

        // Remove username from the request queue after fetching data
        requestQueue.delete(username);

        // Return the fetched data
        return NextResponse.json(data);
    } catch (error) {
        // Ensure to remove the username from the queue even if an error occurs
        requestQueue.delete(username);
        console.error('Internal Server Error:', error);

        // Return a user-friendly error message
        return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: 500 });
    }
}