import { Component, input, output, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentHttpService } from '../../../core/service/http/comment-http.service';
import { Comment, CommentCreate } from '../../../core/interface/comment.interface';
import { AuthService } from '../../../core/service/auth/auth.service';
import { ThemeService } from '../../../core/service/theme/theme.service';
import { SanitizationService } from '../../../core/service/sanitization/sanitization.service';
import { ToastService } from '../../../core/service/toast/toast.service';
import { CommentItemComponent } from '../comment-item/comment-item.component';

@Component({
  selector: 'app-article-comments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CommentItemComponent],
  templateUrl: './article-comments.component.html',
  styleUrl: './article-comments.component.css'
})
export class ArticleCommentsComponent implements OnInit {
  private readonly commentService = inject(CommentHttpService);
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly sanitizationService = inject(SanitizationService);
  private readonly toastService = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  articleId = input.required<string>();
  theme = input<string>('dark');

  commentForm!: FormGroup;
  comments = signal<Comment[]>([]);
  loading = signal<boolean>(false);
  submitting = signal<boolean>(false);
  isLoggedIn = signal<boolean>(false);
  editingCommentId = signal<string | null>(null);
  replyingToCommentId = signal<string | null>(null);

  ngOnInit() {
    this.isLoggedIn.set(this.authService.isLoggedIn());
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]],
      parentId: [null]
    });
    this.loadComments();
  }

  loadComments() {
    this.loading.set(true);
    this.commentService.getComments({
      articleId: this.articleId(),
      sortBy: 'newest'
    }).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.comments.set(this.buildCommentTree(response.data));
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar comentários:', error);
        this.toastService.error('Erro ao carregar comentários', 'Erro');
        this.loading.set(false);
      }
    });
  }

  buildCommentTree(comments: Comment[]): Comment[] {
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // Primeiro, mapear todos os comentários
    comments.forEach(comment => {
      comment.replies = [];
      commentMap.set(comment.id, comment);
    });

    // Depois, construir a árvore
    comments.forEach(comment => {
      if (comment.parentId && commentMap.has(comment.parentId)) {
        const parent = commentMap.get(comment.parentId)!;
        if (!parent.replies) {
          parent.replies = [];
        }
        parent.replies.push(comment);
      } else {
        rootComments.push(comment);
      }
    });

    return rootComments;
  }

  onSubmit() {
    if (this.commentForm.invalid || !this.isLoggedIn()) {
      return;
    }

    this.submitting.set(true);
    const formValue = this.commentForm.value;
    const commentData: CommentCreate = {
      articleId: this.articleId(),
      content: this.sanitizationService.stripHtml(formValue.content),
      parentId: formValue.parentId || undefined
    };

    this.commentService.createComment(commentData).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.loadComments();
          this.commentForm.reset({ content: '', parentId: null });
          this.replyingToCommentId.set(null);
          this.toastService.success('Comentário adicionado com sucesso!', 'Sucesso');
        }
        this.submitting.set(false);
      },
      error: (error) => {
        console.error('Erro ao adicionar comentário:', error);
        this.toastService.error('Erro ao adicionar comentário', 'Erro');
        this.submitting.set(false);
      }
    });
  }

  startReply(parentId: string) {
    if (!this.isLoggedIn()) {
      this.toastService.warning('Faça login para comentar', 'Atenção');
      return;
    }
    this.replyingToCommentId.set(parentId);
    this.commentForm.patchValue({ parentId });
  }

  cancelReply() {
    this.replyingToCommentId.set(null);
    this.commentForm.patchValue({ parentId: null });
  }

  likeComment(commentId: string) {
    if (!this.isLoggedIn()) {
      this.toastService.warning('Faça login para curtir comentários', 'Atenção');
      return;
    }

    this.commentService.likeComment(commentId).subscribe({
      next: () => {
        this.loadComments();
      },
      error: (error) => {
        console.error('Erro ao curtir comentário:', error);
        this.toastService.error('Erro ao curtir comentário', 'Erro');
      }
    });
  }

  dislikeComment(commentId: string) {
    if (!this.isLoggedIn()) {
      this.toastService.warning('Faça login para descurtir comentários', 'Atenção');
      return;
    }

    this.commentService.dislikeComment(commentId).subscribe({
      next: () => {
        this.loadComments();
      },
      error: (error) => {
        console.error('Erro ao descurtir comentário:', error);
        this.toastService.error('Erro ao descurtir comentário', 'Erro');
      }
    });
  }

  editComment(commentId: string) {
    if (!this.isLoggedIn()) {
      this.toastService.warning('Faça login para editar comentários', 'Atenção');
      return;
    }
    // Implementar lógica de edição se necessário
    this.editingCommentId.set(commentId);
  }

  deleteComment(commentId: string) {
    if (!this.isLoggedIn()) {
      this.toastService.warning('Faça login para deletar comentários', 'Atenção');
      return;
    }

    if (!confirm('Tem certeza que deseja excluir este comentário?')) {
      return;
    }

    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.loadComments();
        this.toastService.success('Comentário excluído com sucesso!', 'Sucesso');
      },
      error: (error) => {
        console.error('Erro ao excluir comentário:', error);
        this.toastService.error('Erro ao excluir comentário', 'Erro');
      }
    });
  }

  formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  }

  getReplies(comment: Comment): Comment[] {
    return comment.replies || [];
  }
}
