
export enum Category {
  HerbalRemedies = "Herbal Remedies",
  NaturalWellness = "Natural Wellness",
  GardeningTips = "Gardening Tips",
}

export interface Feed {
  url: string;
  category: Category;
  name: string;
}

export interface Article {
  id: string;
  title: string;
  link: string;
  pubDate: Date;
  excerpt: string;
  feedName: string;
  faviconUrl: string;
  category: Category;
}
