import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

@Component({
  selector: 'app-why-choose',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './why-choose.component.html',
  styleUrl: './why-choose.component.css'
})
export class WhyChooseComponent {
  theme = input<string>('dark');

  features: Feature[] = [
    {
      icon: '🎮',
      title: 'Jogos Exclusivos',
      description: 'Jogue games únicos criados especialmente para fãs de heróis. Hero Battle, Memory Game e muito mais!',
      color: '#00d2ff'
    },
    {
      icon: '📚',
      title: 'Conteúdo Original',
      description: 'Artigos exclusivos, análises profundas e conteúdo que você não encontra em nenhum outro lugar.',
      color: '#ff6b6b'
    },
    {
      icon: '🧩',
      title: 'Quizzes Gamificados',
      description: 'Teste seus conhecimentos com quizzes interativos. Ganhe XP, desbloqueie níveis e competa com outros fãs!',
      color: '#4ecdc4'
    },
    {
      icon: '⭐',
      title: 'Comunidade Ativa',
      description: 'Conecte-se com outros fãs, comente artigos, compartilhe opiniões e faça parte de uma comunidade apaixonada!',
      color: '#ffe66d'
    },
    {
      icon: '🎯',
      title: 'Atualizações Constantes',
      description: 'Novo conteúdo toda semana! Artigos, eventos, curiosidades e muito mais para você nunca ficar sem novidades.',
      color: '#a78bfa'
    },
    {
      icon: '🏆',
      title: '100% Brasileiro',
      description: 'Feito por fãs, para fãs. Conteúdo em português com foco no público brasileiro e na cultura geek nacional.',
      color: '#fb7185'
    }
  ];
}
