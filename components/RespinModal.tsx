import React from 'react';
import { Article } from '../types';
import { CloseIcon } from './Icons';
import { Spinner } from './Spinner';

interface RespinModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
  respunContent: string;
  isLoading: boolean;
  error: string | null;
}

// Basic markdown to HTML renderer
const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
  const createMarkup = (markdownText: string) => {
    let html = markdownText;

    // Process lists first to avoid converting their newlines to <br>
    html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
    html = html.replace(/(<\/li>)\n(<li>)/g, '$1$2'); // handle adjacent list items
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc pl-5 space-y-1">$1</ul>'); // wrap in ul

    // Process other markdown
    html = html
      .replace(/### (.*)/g, '<h3 class="text-md font-bold mt-4 mb-2 text-primary-dark dark:text-primary-light">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />'); // Convert remaining newlines

    // Clean up extra breaks around lists
    html = html.replace(/<br \/><ul>/g, '<ul>');
    html = html.replace(/<\/ul><br \/>/g, '</ul>');

    return { __html: html };
  };

  return <div className="prose prose-sm dark:prose-invert max-w-none text-text-secondary-light dark:text-text-secondary-dark" dangerouslySetInnerHTML={createMarkup(text)} />;
};

export const RespinModal: React.FC<RespinModalProps> = ({ isOpen, onClose, article, respunContent, isLoading, error }) => {
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">AI Content Respin</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
            <CloseIcon className="w-6 h-6 text-text-secondary-light dark:text-text-secondary-dark" />
          </button>
        </header>
        
        <div className="p-6 overflow-y-auto">
          <div className="mb-6">
            <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-1">Original Content</h3>
            <div className="p-3 bg-background-light dark:bg-background-dark rounded-md border border-gray-200 dark:border-gray-600">
              <p className="font-bold text-sm mb-1">{article.title}</p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{article.excerpt}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">Gemini's Version</h3>
            <div className="p-3 min-h-[150px] bg-background-light dark:bg-background-dark rounded-md border border-gray-200 dark:border-gray-600">
              {isLoading && <Spinner />}
              {error && <p className="text-red-500">{error}</p>}
              {!isLoading && !error && respunContent && (
                 <SimpleMarkdown text={respunContent} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};