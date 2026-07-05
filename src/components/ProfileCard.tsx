import React from 'react';
import { GitHubUser } from '../types';
import { formatDate } from '../utils';
import { MapPin, Link as LinkIcon, Twitter, Briefcase, Calendar, Users, FolderGit2, Sparkles } from 'lucide-react';

interface ProfileCardProps {
  user: GitHubUser;
  totalStars?: number; // Optional stars if fetched
}

export default function ProfileCard({ user, totalStars }: ProfileCardProps) {
  // Helpers to check availability
  const renderMetaItem = (
    icon: React.ReactNode,
    value: string | null,
    isLink = false,
    linkUrl = ''
  ) => {
    const isAvailable = !!value;
    const displayText = isAvailable ? value : 'Not Available';
    
    return (
      <div className={`flex items-center gap-3 text-sm ${isAvailable ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-600'}`}>
        <div className="shrink-0">{icon}</div>
        <div className="truncate">
          {isAvailable && isLink ? (
            <a
              href={linkUrl || (value.startsWith('http') ? value : `https://${value}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline font-medium transition-colors"
            >
              {displayText}
            </a>
          ) : (
            <span className={isAvailable ? 'font-medium' : 'italic'}>{displayText}</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 md:p-8 transition-colors duration-300">
      {/* Upper Profile Info */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start mb-6 md:mb-8">
        {/* Avatar */}
        <div className="relative shrink-0 mx-auto md:mx-0">
          <img
            src={user.avatar_url}
            alt={`${user.login}'s Avatar`}
            className="w-24 h-24 md:w-28 md:h-28 rounded-2xl border-4 border-slate-50 dark:border-slate-950 object-cover shadow-sm bg-slate-100 dark:bg-slate-800"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-1 -right-1 p-1 bg-indigo-600 dark:bg-indigo-500 rounded-lg text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Profile Header Information */}
        <div className="flex-1 w-full text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
            <div>
              <h2 className="font-display font-bold text-2xl text-slate-900 dark:text-white tracking-tight">
                {user.name || user.login}
              </h2>
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 font-mono text-sm hover:underline font-medium"
              >
                @{user.login}
              </a>
            </div>

            {/* Join Date */}
            <div className="flex items-center justify-center md:justify-end gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono mt-1 md:mt-0">
              <Calendar className="w-3.5 h-3.5" />
              <span>Joined {formatDate(user.created_at)}</span>
            </div>
          </div>

          {/* Bio */}
          <p className={`text-sm mt-4 leading-relaxed ${user.bio ? 'text-slate-600 dark:text-slate-400' : 'text-slate-400 dark:text-slate-600 italic'}`}>
            {user.bio || 'This profile has no bio.'}
          </p>
        </div>
      </div>

      {/* Stats Board Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 p-4 md:p-5 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-850 rounded-2xl mb-6 md:mb-8 text-center md:text-left transition-colors duration-300">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
            <FolderGit2 className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider">Repos</span>
          </div>
          <span className="font-mono text-lg md:text-2xl font-bold text-slate-900 dark:text-white">
            {user.public_repos}
          </span>
        </div>

        <div>
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
            <Users className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider">Followers</span>
          </div>
          <span className="font-mono text-lg md:text-2xl font-bold text-slate-900 dark:text-white">
            {user.followers}
          </span>
        </div>

        <div>
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
            <Users className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider">Following</span>
          </div>
          <span className="font-mono text-lg md:text-2xl font-bold text-slate-900 dark:text-white">
            {user.following}
          </span>
        </div>

        <div className="col-span-3 sm:col-span-1 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 pt-3 sm:pt-0 sm:pl-4">
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">Stars</span>
          </div>
          <span className="font-mono text-lg md:text-2xl font-bold text-amber-600 dark:text-amber-400">
            {totalStars !== undefined ? totalStars : '...'}
          </span>
        </div>
      </div>

      {/* Meta Grid / Footer Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 border-t border-slate-100 dark:border-slate-850 pt-6">
        {renderMetaItem(<MapPin className="w-4 h-4 text-indigo-500" />, user.location)}
        {renderMetaItem(
          <LinkIcon className="w-4 h-4 text-indigo-500" />,
          user.blog,
          true
        )}
        {renderMetaItem(
          <Twitter className="w-4 h-4 text-indigo-500" />,
          user.twitter_username,
          true,
          user.twitter_username ? `https://twitter.com/${user.twitter_username}` : ''
        )}
        {renderMetaItem(<Briefcase className="w-4 h-4 text-indigo-500" />, user.company)}
      </div>
    </div>
  );
}
