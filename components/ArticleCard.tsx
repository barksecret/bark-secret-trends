import React from 'react';
import { Article } from '../types';
import { BookmarkIcon, SparklesIcon } from './Icons';
import { Tooltip } from './Tooltip';

interface ArticleCardProps {
  article: Article;
  isSaved: boolean;
  onToggleSave: (article: Article) => void;
  onRespin: (article: Article) => void;
  aiInitError: string | null;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, isSaved, onToggleSave, onRespin, aiInitError }) => {
  const formattedDate = article.pubDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col">
      <div className="p-5 flex-grow">
        <div className="flex items-center mb-3">
          <img src={article.faviconUrl} alt={`${article.feedName} favicon`} className="w-5 h-5 mr-2" onError={(e) => (e.currentTarget.style.display = 'none')} />
          <span className="text-sm font-medium text-primary-light dark:text-primary-dark">{article.feedName}</span>
        </div>
        <a href={article.link} target="_blank" rel="noopener noreferrer">
          <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-2 leading-tight hover:underline">
            {article.title}
          </h3>
        </a>
        <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mb-4 flex-grow">
          {article.excerpt}
        </p>
      </div>
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{formattedDate}</p>
        <div className="flex items-center space-x-2">
            <Tooltip text={isSaved ? "Unsave Idea" : "Save Idea"}>
                <button
                    onClick={() => onToggleSave(article)}
                    className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors"
                    aria-label={isSaved ? 'Unsave this article' : 'Save this article'}
                >
                    <BookmarkIcon solid={isSaved} className="w-6 h-6" />
                </button>
            </Tooltip>
            <Tooltip text={aiInitError ? `AI disabled: ${aiInitError}` : "Respin with AI"}>
                <button
                    onClick={() => onRespin(article)}
                    disabled={!!aiInitError}
                    className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Respin article content with AI"
                >
                    <SparklesIcon className="w-6 h-6" />
                </button>
            </Tooltip>
             <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-primary-light dark:text-primary-dark hover:underline"
            >
              Read More
            </a>
        </div>
      </div>
    </div>
  );
};