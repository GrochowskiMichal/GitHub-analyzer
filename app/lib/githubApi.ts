import axios from 'axios';

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
const cache: { [key: string]: { data: any; timestamp: number } } = {};

// Paste your GitHub token here
const GITHUB_TOKEN = ''; // Replace this with your actual GitHub token

console.log('GITHUB_TOKEN:', GITHUB_TOKEN); // Check if this logs your token

// Function to fetch data with retry mechanism
async function fetchWithRetry(url: string, retries = 3, delay = 1000, headers = {}): Promise<any> {
    try {
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        if (retries > 0 && error.response && error.response.status === 500) {
            console.warn(`Retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(url, retries - 1, delay * 2, headers);
        } else {
            throw error;
        }
    }
}

// Main function to fetch GitHub data
export async function fetchGithubData(username: string) {
    const now = Date.now();

    // Check cache
    if (cache[username] && now - cache[username].timestamp < CACHE_DURATION) {
        return cache[username].data;
    }

    const headers = { Authorization: `Bearer ${GITHUB_TOKEN}` }; // Always use authenticated headers

    // Log the headers being used for the requests
    console.log('Request Headers:', headers);

    let data: any;

    try {
        // Make authenticated requests
        console.log('Attempting authenticated request...');
        const userResponse = await fetchWithRetry(`https://api.github.com/users/${username}`, 1, 1000, headers);
        const reposResponse = await fetchWithRetry(`https://api.github.com/users/${username}/repos?per_page=100`, 1, 1000, headers);
        const contributionsResponse = await fetchWithRetry(`https://github-contributions-api.jogruber.de/v4/${username}`, 1, 1000, headers);

        data = {
            user: userResponse,
            repos: reposResponse,
            contributions: contributionsResponse,
        };

        cache[username] = { data, timestamp: now };
        return data;

    } catch (error) {
        console.error('Error with authenticated request:', error);
        throw new Error('Failed to fetch GitHub data with authenticated request.');
    }
}