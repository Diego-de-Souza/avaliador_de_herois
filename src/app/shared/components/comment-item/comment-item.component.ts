import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment } from '../../../core/interface/comment.interface';

@Component({
  selector: 'app-comment-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comment-item.component.html',
  styleUrl: './comment-item.component.css'
})
export class CommentItemComponent {
  comment = input.required<Comment>();
  theme = input<string>('dark');
  isLoggedIn = input<boolean>(false);

  reply = output<number>();
  like = output<number>();
  dislike = output<number>();
  edit = output<number>();
  delete = output<number>();

  formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'agora';
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(d);
  }

  onReply() {
    this.reply.emit(this.comment().id);
  }

  onLike() {
    this.like.emit(this.comment().id);
  }

  getReplies(): Comment[] {
    return this.comment().replies || [];
  }
}
