import { Component, EventEmitter, inject, OnInit, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SearchService, SearchFilters } from '../../../core/service/search/search.service';
import { ThemeService } from '../../../core/service/theme/theme.service';

@Component({
  selector: 'app-advanced-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './advanced-search.component.html',
  styleUrl: './advanced-search.component.css'
})
export class AdvancedSearchComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly searchService = inject(SearchService);
  private readonly themeService = inject(ThemeService);

  searchPerformed = output<SearchFilters>();
  themeInput = input<string>('dark');
  
  theme: string = 'dark';
  searchForm!: FormGroup;
  showAdvanced = false;
  suggestions: string[] = [];
  showSuggestions = false;
  searchHistory: string[] = [];

  categories = ['Marvel', 'DC', 'Anime', 'Geral'];
  sortOptions = [
    { value: 'relevance', label: 'Mais Relevante' },
    { value: 'newest', label: 'Mais Recente' },
    { value: 'oldest', label: 'Mais Antigo' },
    { value: 'mostViewed', label: 'Mais Visualizado' }
  ];

  ngOnInit() {
    // Usar input se fornecido, senão usar do themeService
    const inputTheme = this.themeInput();
    if (inputTheme) {
      this.theme = inputTheme;
    } else {
      this.themeService.theme$.subscribe(theme => {
        this.theme = theme;
      });
    }

    this.searchService.searchHistory$.subscribe(history => {
      this.searchHistory = history;
    });

    this.searchService.loadSearchHistory();

    this.searchForm = this.fb.group({
      query: [''],
      category: [''],
      author: [''],
      tags: [''],
      dateFrom: [''],
      dateTo: [''],
      sortBy: ['relevance']
    });

    // Observar mudanças no campo query para sugestões
    this.searchForm.get('query')?.valueChanges.subscribe(query => {
      if (query && query.length >= 2) {
        this.getSuggestions(query);
      } else {
        this.suggestions = [];
        this.showSuggestions = false;
      }
    });
  }

  getSuggestions(query: string) {
    this.searchService.getSearchSuggestions(query, 5).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.suggestions = response.data;
          this.showSuggestions = true;
        }
      },
      error: (error) => {
        console.error('Erro ao buscar sugestões:', error);
      }
    });
  }

  selectSuggestion(suggestion: string) {
    this.searchForm.patchValue({ query: suggestion });
    this.showSuggestions = false;
    this.performSearch();
  }

  selectFromHistory(term: string) {
    this.searchForm.patchValue({ query: term });
    this.performSearch();
  }

  toggleAdvanced() {
    this.showAdvanced = !this.showAdvanced;
  }

  performSearch() {
    if (this.searchForm.invalid) {
      return;
    }

    const formValue = this.searchForm.value;
    const filters: SearchFilters = {
      query: formValue.query || undefined,
      category: formValue.category || undefined,
      author: formValue.author || undefined,
      tags: formValue.tags ? formValue.tags.split(',').map((t: string) => t.trim()) : undefined,
      dateFrom: formValue.dateFrom || undefined,
      dateTo: formValue.dateTo || undefined,
      sortBy: formValue.sortBy || 'relevance'
    };

    // Adicionar ao histórico se houver query
    if (filters.query) {
      this.searchService.addToSearchHistory(filters.query);
    }

    this.searchPerformed.emit(filters);
    this.showSuggestions = false;
  }

  clearSearch() {
    this.searchForm.reset({
      query: '',
      category: '',
      author: '',
      tags: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'relevance'
    });
    this.showSuggestions = false;
  }

  clearHistory() {
    this.searchService.clearSearchHistory();
  }

  hideSuggestions() {
    // Delay para permitir clicar nas sugestões
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }
}
