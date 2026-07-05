import { GitHubRepo } from '../types';
import { formatDate } from '../utils';
import { Star, GitFork, BookOpen, ExternalLink, Calendar } from 'lucide-react';

interface RepoListProps {
  repos: GitHubRepo[];
  isLoading: boolean;
}

// Simple helper to return colors for popular languages
const getLanguageColorClass = (language: string | null): string => {
  if (!language) return 'bg-slate-400';
  const lang = language.toLowerCase();
  switch (lang) {
    case 'javascript':
      return 'bg-amber-400';
    case 'typescript':
      return 'bg-blue-500';
    case 'html':
      return 'bg-orange-500';
    case 'css':
      return 'bg-purple-500';
    case 'python':
      return 'bg-emerald-500';
    case 'go':
      return 'bg-cyan-500';
    case 'rust':
      return 'bg-orange-600';
    case 'ruby':
      return 'bg-rose-600';
    case 'java':
      return 'bg-amber-700';
    case 'c++':
    case 'cpp':
      return 'bg-pink-600';
    default:
      return 'bg-indigo-400';
  }
};

export default function RepoList({ repos, isLoading }: RepoListProps) {
  // Sort the repos to ensure we have the Top 5 Latest (by updated_at)
  const topRepos = [...repos]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="w-full mt-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">
          Latest Repositories
        </h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3"></div>
              <div className="h-4 bg-slate-100 dark:bg-slate-850 rounded-md w-2/3"></div>
              <div className="h-4 bg-slate-100 dark:bg-slate-850 rounded-md w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (topRepos.length === 0) {
    return (
      <div className="w-full mt-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400">
        <BookOpen className="w-8 h-8 mx-auto text-slate-400 mb-2" />
        <p className="font-medium text-sm">No public repositories found for this user.</p>
      </div>
    );
  }

  return (
    <div className="w-full mt-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-display font-bold text-lg md:text-xl text-slate-900 dark:text-white">
            Top 5 Latest Repositories
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-950 dark:text-slate-400 px-2.5 py-1 rounded-full border border-slate-200/50 dark:border-slate-800">
          Sorted by Update Time
        </span>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-850">
        {topRepos.map((repo) => (
          <div key={repo.id} className="py-5 first:pt-0 last:pb-0 group">
            <div className="flex items-start justify-between gap-4 mb-2">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                id={`repo-link-${repo.id}`}
              >
                <span className="underline decoration-transparent group-hover:decoration-indigo-600/30 dark:group-hover:decoration-indigo-400/30 transition-all">
                  {repo.name}
                </span>
                <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>

              {/* Stars & Forks Badges */}
              <div className="flex items-center gap-3 font-mono text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1" title="Stars">
                  <Star className="w-3.5 h-3.5 text-amber-500" />
                  <span>{repo.stargazers_count}</span>
                </div>
                <div className="flex items-center gap-1" title="Forks">
                  <GitFork className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{repo.forks_count}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 leading-relaxed line-clamp-2">
              {repo.description || 'No description provided.'}
            </p>

            {/* Language & Update Date */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${getLanguageColorClass(repo.language)}`} />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {repo.language || 'Markdown/Unknown'}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs font-mono text-slate-500 dark:text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>Updated {formatDate(repo.updated_at)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
