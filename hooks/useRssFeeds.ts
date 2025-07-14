import { useState, useCallback, useEffect } from 'react';
import { Article, Feed } from '../types';
import { FEEDS, RSS_API_URL } from '../constants';
import { parseRssJsonResponse } from '../services/rssParser';

export function useRssFeeds() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeeds = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allArticles: Article[] = [];
      const fetchPromises = FEEDS.map(async (feed: Feed) => {
        const fetchUrl = `${RSS_API_URL}${encodeURIComponent(feed.url)}`;
        try {
          const response = await fetch(fetchUrl);
          if (!response.ok) {
            throw new Error(`API request failed for ${feed.name} with status: ${response.statusText}`);
          }
          const data = await response.json();
          
          if (data.status !== 'ok') {
            console.error(`Could not process feed ${feed.name}:`, data.message);
            return; // Skip this feed
          }

          const parsedArticles = parseRssJsonResponse(data, feed);
          allArticles.push(...parsedArticles);
        } catch (e) {
          console.error(`Failed to fetch or parse feed ${feed.name}:`, e);
        }
      });
      
      await Promise.all(fetchPromises);

      if(allArticles.length === 0 && FEEDS.length > 0) {
        setError('Could not fetch any content. The sources may be temporarily unavailable or blocking requests. Please try again later.');
      }

      allArticles.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
      setArticles(allArticles);
    } catch (e) {
      setError('A critical error occurred while fetching RSS feeds.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeeds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { articles, isLoading, error, refetchFeeds: fetchFeeds };
}