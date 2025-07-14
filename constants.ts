import { Category, Feed } from './types';

export const CATEGORIES: Category[] = [
  Category.HerbalRemedies,
  Category.NaturalWellness,
  Category.GardeningTips,
];

export const FEEDS: Feed[] = [
  { url: 'https://theherbalacademy.com/feed/', category: Category.HerbalRemedies, name: 'The Herbal Academy' },
  { url: 'https://learningherbs.com/feed/', category: Category.HerbalRemedies, name: 'LearningHerbs' },
  { url: 'https://rsshub.app/reddit/r/herbalism', category: Category.HerbalRemedies, name: 'r/herbalism' },
  { url: 'https://wellnessmama.com/feed/', category: Category.NaturalWellness, name: 'Wellness Mama' },
  { url: 'https://medium.com/feed/@barksecret', category: Category.NaturalWellness, name: 'Bark Secret on Medium' },
  { url: 'https://gardentherapy.ca/feed/', category: Category.GardeningTips, name: 'Garden Therapy' },
  { url: 'https://www.theprairiehomestead.com/feed', category: Category.GardeningTips, name: 'The Prairie Homestead' },
  { url: 'https://www.growveg.com/growblogrss.aspx', category: Category.GardeningTips, name: 'GrowVeg' },
];

export const RSS_API_URL = 'https://api.rss2json.com/v1/api.json?rss_url=';