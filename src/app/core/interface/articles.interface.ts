export interface ListItem {
  text: string;
  level: number;
}

export interface articlesProps {
    id: number;
    category: string;
    title: string;
    description: string;
    text: string;
    summary: ListItem[];
    thumbnail: string;
    keyWords: string[];
    created_at: string;
}
