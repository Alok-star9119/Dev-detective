export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  html_url: string;
  repos_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string | null;
  updated_at: string;
  created_at: string;
}

export interface BattleResult {
  user1: GitHubUser;
  user1Repos: GitHubRepo[];
  user1Stars: number;
  user2: GitHubUser;
  user2Repos: GitHubRepo[];
  user2Stars: number;
  winner: 'user1' | 'user2' | 'tie';
}
