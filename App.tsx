import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { ArticleCard } from './components/ArticleCard';
import { Spinner } from './components/Spinner';
import { RespinModal } from './components/RespinModal';
import { useTheme } from './hooks/useTheme';
import { useRssFeeds } from './hooks/useRssFeeds';
import { useSavedArticles } from './hooks/useSavedArticles';
import { respinArticleContent, getAiInitializationError } from './services/geminiService';
import { Category, Article } from './types';
import { CATEGORIES } from './constants';

type FilterCategory = Category | 'All' | 'Saved';

const App: React.FC = () => {
  const [theme, toggleTheme] = useTheme();
  const { articles, isLoading, error: fetchError } = useRssFeeds();
  const [savedArticleIds, isArticleSaved, toggleSaveArticle] = useSavedArticles();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('All');

  // AI Respin Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [respunContent, setRespunContent] = useState('');
  const [isRespinning, setIsRespinning] = useState(false);
  const [respinError, setRespinError] = useState<string | null>(null);
  
  const aiInitError = getAiInitializationError();

  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'Saved') {
      return articles
        .filter(article => savedArticleIds.includes(article.id))
        .filter(article => 
          searchQuery.trim() === '' ||
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    return articles.filter(article => {
      const categoryMatch = selectedCategory === 'All' || article.category === selectedCategory;
      const searchMatch =
        searchQuery.trim() === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [articles, selectedCategory, searchQuery, savedArticleIds]);

  const handleRespinClick = async (article: Article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
    setIsRespinning(true);
    setRespunContent('');
    setRespinError(null);
    try {
      const content = await respinArticleContent(article.title, article.excerpt);
      setRespunContent(content);
    } catch (e: any) {
      setRespinError(e.message);
    } finally {
      setIsRespinning(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  const filterButtons: FilterCategory[] = ['All', ...CATEGORIES, 'Saved'];

  return (
    <div className="min-h-screen font-sans text-text-primary-light dark:text-text-primary-dark transition-colors duration-300">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {filterButtons.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary-light text-white dark:bg-primary-dark'
                  : 'bg-card-light dark:bg-card-dark hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading && <Spinner />}
        {fetchError && (
          <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">
            <p className="font-bold">An error occurred</p>
            <p>{fetchError}</p>
          </div>
        )}
        {!isLoading && !fetchError && (
          <>
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredArticles.map(article => (
                  <ArticleCard 
                    key={article.id} 
                    article={article}
                    isSaved={isArticleSaved(article.id)}
                    onToggleSave={toggleSaveArticle}
                    onRespin={handleRespinClick}
                    aiInitError={aiInitError}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-xl font-semibold text-text-secondary-light dark:text-text-secondary-dark">
                  No Articles Found
                </h3>
                <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">
                  Try adjusting your search or filters.
                  {selectedCategory === 'Saved' && ' You have not saved any articles yet.'}
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <RespinModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        article={selectedArticle}
        respunContent={respunContent}
        isLoading={isRespinning}
        error={respinError}
      />
    </div>
  );
};

export default App;