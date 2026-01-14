export interface Comment {
  id: number;
  articleId: number;
  userId: number;
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
  parentId?: number; // Para respostas aninhadas
  userLiked?: boolean; // Se o usuário atual deu like
  userDisliked?: boolean; // Se o usuário atual deu dislike
}

export interface CommentCreate {
  articleId: number;
  content: string;
  parentId?: number;
}

export interface CommentUpdate {
  content: string;
}

export interface CommentFilters {
  articleId?: number;
  userId?: number;
  sortBy?: 'newest' | 'oldest' | 'mostLiked';
  limit?: number;
  offset?: number;
}
