import { useState, useEffect, useCallback } from 'react';
import { Article } from '../types';

export function useSavedArticles(): [string[], (articleId: string) => boolean, (article: Article) => void] {
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedIds = localStorage.getItem('savedArticleIds');
      if (storedIds) {
        setSavedArticleIds(JSON.parse(storedIds));
      }
    } catch (error) {
      console.error("Could not parse saved articles from localStorage", error);
      localStorage.removeItem('savedArticleIds');
      setSavedArticleIds([]);
    }
  }, []);

  const isArticleSaved = useCallback((articleId: string): boolean => {
    return savedArticleIds.includes(articleId);
  }, [savedArticleIds]);

  const toggleSaveArticle = useCallback((article: Article) => {
    setSavedArticleIds(prevIds => {
      let newIds;
      if (prevIds.includes(article.id)) {
        newIds = prevIds.filter(id => id !== article.id);
      } else {
        newIds = [...prevIds, article.id];
      }
      localStorage.setItem('savedArticleIds', JSON.stringify(newIds));
      return newIds;
    });
  }, []);

  return [savedArticleIds, isArticleSaved, toggleSaveArticle];
}
