import { GitHubUser, GitHubRepo } from './types';

/**
 * Formats an ISO date string (e.g., "2023-01-25T12:00:00Z") to "25 Jan 2023"
 */
export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    
    const day = date.getUTCDate();
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    
    return `${day} ${month} ${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A';
  }
}

/**
 * Retrieves the stored GitHub Personal Access Token if any
 */
export function getStoredToken(): string {
  return localStorage.getItem('github_pat') || '';
}

/**
 * Stores the GitHub Personal Access Token
 */
export function setStoredToken(token: string): void {
  if (token) {
    localStorage.setItem('github_pat', token);
  } else {
    localStorage.removeItem('github_pat');
  }
}

/**
 * Fetches a GitHub user profile.
 * Throws errors with appropriate message for 404, rate limits, etc.
 */
export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  const cleanUsername = username.trim();
  if (!cleanUsername) {
    throw new Error('Please enter a username');
  }

  const token = getStoredToken();
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  const response = await fetch(`https://api.github.com/users/${cleanUsername}`, { headers });

  if (response.status === 404) {
    throw new Error('User Not Found');
  }

  if (response.status === 403) {
    const rateLimitLimit = response.headers.get('x-ratelimit-remaining');
    if (rateLimitLimit === '0') {
      throw new Error('GitHub API rate limit exceeded. Please add a Personal Access Token in the settings to continue.');
    }
    throw new Error('Access forbidden or rate limited by GitHub');
  }

  if (!response.ok) {
    throw new Error(`API Error: Status ${response.status}`);
  }

  return response.json();
}

/**
 * Fetches repositories for a GitHub user.
 * Grabs up to 100 repositories to analyze total stargazers accurately.
 */
export async function fetchGitHubUserRepos(reposUrlOrUsername: string, isUrl = true): Promise<GitHubRepo[]> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  const url = isUrl 
    ? `${reposUrlOrUsername}?sort=updated&per_page=100`
    : `https://api.github.com/users/${reposUrlOrUsername}/repos?sort=updated&per_page=100`;

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`Failed to fetch repositories: Status ${response.status}`);
  }

  return response.json();
}
