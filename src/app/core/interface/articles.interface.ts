export interface ListItem {
  text: string;
  level: number;
}

export interface articlesProps {
    id: number;
    // category: string[];
    category: string;
    title: string;
    description: string;
    text: string;
    summary: ListItem[];
    thumbnail: string;
    keyWords: string[];
    route: string;
    created_at: string;
    updated_at: string;
    views?: number;
    theme?: string;       
    themeColor?: string; 
    image?: string; 
    author: string;
}
