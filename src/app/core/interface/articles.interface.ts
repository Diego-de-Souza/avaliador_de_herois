export interface ListItem {
  text: string;
  level: number;
}

export interface articlesProps {
    id: string;
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
    /** Fonte ou atribuição da imagem principal */
    image_source?: string;
    author: string;
}
