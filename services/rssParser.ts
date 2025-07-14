import { Article, Feed } from '../types';

function createExcerpt(html: string, wordLimit: number): string {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
}

export function parseRssJsonResponse(data: any, feed: Feed): Article[] {
  if (data.status !== 'ok' || !data.items) {
    console.error(`Invalid response for feed ${feed.name}:`, data.message || 'No items found');
    return [];
  }

  return data.items.map((item: any): Article => {
    const link = item.link || item.guid || '#';
    const pubDate = new Date(item.pubDate || new Date().toISOString());
    const description = item.description || item.content || "";

    let faviconUrl = '';
    try {
      const originUrl = data.feed.link || link;
      if (originUrl && originUrl !== '#') {
        faviconUrl = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${new URL(originUrl).origin}&size=32`;
      }
    } catch (e) {
      console.warn(`Could not create favicon URL for link: ${link}`);
    }

    return {
      id: link + pubDate.toISOString(),
      title: item.title || "No title",
      link,
      pubDate,
      excerpt: createExcerpt(description, 50),
      feedName: feed.name,
      faviconUrl,
      category: feed.category,
    };
  }).slice(0, 10); // Return latest 10 items
}