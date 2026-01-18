import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { ThemeService } from '../../../../core/service/theme/theme.service';
import { CommonModule } from '@angular/common';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FAQComponent implements OnInit {
  private readonly themeService = inject(ThemeService);

  public theme: string = 'dark';
  public selectedCategory: string = 'all';
  public expandedItems: Set<number> = new Set();

  public faqItems: FAQItem[] = [
    {
      question: 'Como posso criar um artigo na plataforma?',
      answer: 'Para criar um artigo, acesse a "Minha Área" no menu superior quando estiver logado. Clique em "Gerenciar Artigos" e depois em "Criar Novo Artigo". Preencha todos os campos obrigatórios e clique em "Salvar".',
      category: 'artigos'
    },
    {
      question: 'Posso editar artigos que já publiquei?',
      answer: 'Sim, você pode editar seus artigos a qualquer momento. Acesse a lista de seus artigos em "Minha Área" > "Gerenciar Artigos" e clique em "Editar" no artigo desejado.',
      category: 'artigos'
    },
    {
      question: 'Como funciona o processo de aprovação de conteúdo?',
      answer: 'Todo conteúdo publicado passa por uma revisão editorial antes de ser publicado na plataforma. Nossa equipe verifica a qualidade, precisão e conformidade com nossas diretrizes editoriais. O processo geralmente leva de 24 a 48 horas.',
      category: 'publicacao'
    },
    {
      question: 'Posso usar imagens de terceiros nos meus artigos?',
      answer: 'Você deve ter os direitos de uso das imagens ou utilizar imagens com licença apropriada (Creative Commons, domínio público, etc.). Sempre atribua crédito adequado às imagens quando necessário. Não toleramos violação de direitos autorais.',
      category: 'conteudo'
    },
    {
      question: 'O que acontece se meu conteúdo for identificado como fake news?',
      answer: 'Conteúdo identificado como desinformação será removido imediatamente. Dependendo da gravidade e intencionalidade, o autor pode sofrer penalidades que variam desde advertência até suspensão permanente da plataforma.',
      category: 'moderacao'
    },
    {
      question: 'Como recebo notificações sobre meus artigos?',
      answer: 'Você receberá notificações através do ícone de sino no header quando houver atualizações sobre seus artigos, como aprovação, necessidade de revisão ou comentários. Certifique-se de verificar regularmente suas notificações.',
      category: 'notificacoes'
    },
    {
      question: 'Posso deletar múltiplos artigos de uma vez?',
      answer: 'Sim, na lista de artigos você pode selecionar múltiplos itens usando as caixas de seleção e depois clicar em "Excluir Selecionados" para remover todos de uma vez.',
      category: 'artigos'
    },
    {
      question: 'Como entro em contato com o suporte?',
      answer: 'Você pode entrar em contato através do SAC (Serviço de Atendimento ao Cliente) disponível em "Minha Área". Lá você pode enviar reclamações, elogios ou solicitar suporte técnico.',
      category: 'suporte'
    }
  ];

  public categories: string[] = ['all', 'artigos', 'publicacao', 'conteudo', 'moderacao', 'notificacoes', 'suporte'];

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this.theme = theme;
    });
  }

  toggleItem(index: number): void {
    if (this.expandedItems.has(index)) {
      this.expandedItems.delete(index);
    } else {
      this.expandedItems.add(index);
    }
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.expandedItems.clear();
  }

  get filteredItems(): FAQItem[] {
    if (this.selectedCategory === 'all') {
      return this.faqItems;
    }
    return this.faqItems.filter(item => item.category === this.selectedCategory);
  }

  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      'all': 'Todas',
      'artigos': 'Artigos',
      'publicacao': 'Publicação',
      'conteudo': 'Conteúdo',
      'moderacao': 'Moderação',
      'notificacoes': 'Notificações',
      'suporte': 'Suporte'
    };
    return labels[category] || category;
  }
}
