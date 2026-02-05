export interface Comment {
  id: string;
  articleId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  likes: number;
  dislikes?: number;
  replies?: Comment[];
  isEdited: boolean;
  isDeleted?: boolean;
  parentId?: string; // Para respostas aninhadas
  userLiked?: boolean; // Se o usuário atual deu like
  userDisliked?: boolean; // Se o usuário atual deu dislike
}

export interface CommentCreate {
  articleId: string;
  content: string;
  parentId?: string;
}

export interface CommentUpdate {
  content: string;
}

export interface CommentFilters {
  articleId?: string;
  userId?: string;
  sortBy?: 'newest' | 'oldest' | 'mostLiked';
  limit?: number;
  offset?: number;
}
