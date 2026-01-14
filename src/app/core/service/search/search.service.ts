import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { articlesProps } from '../../interface/articles.interface';

export interface SearchFilters {
  query?: string;
  category?: string;
  author?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'relevance' | 'newest' | 'oldest' | 'mostViewed';
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  articles: articlesProps[];
  total: number;
  query?: string;
  filters?: SearchFilters;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiURL;

  private searchHistorySubject = new BehaviorSubject<string[]>([]);
  public searchHistory$ = this.searchHistorySubject.asObservable();

  /**
   * Buscar artigos com filtros
   */
  searchArticles(filters: SearchFilters): Observable<any> {
    let params = new HttpParams();
    
    if (filters.query) params = params.set('query', filters.query);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.author) params = params.set('author', filters.author);
    if (filters.tags && filters.tags.length > 0) {
      filters.tags.forEach(tag => {
        params = params.append('tags', tag);
      });
    }
    if (filters.dateFrom) params = params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params = params.set('dateTo', filters.dateTo);
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.offset) params = params.set('offset', filters.offset.toString());

    return this.http.get<any>(`${this.apiUrl}/articles/search`, { params });
  }

  /**
   * Buscar sugestões de busca (autocomplete)
   */
  getSearchSuggestions(query: string, limit: number = 5): Observable<any> {
    const params = new HttpParams()
      .set('query', query)
      .set('limit', limit.toString());

    return this.http.get<any>(`${this.apiUrl}/articles/search/suggestions`, { params });
  }

  /**
   * Adicionar termo ao histórico de busca
   */
  addToSearchHistory(query: string): void {
    if (!query || query.trim().length === 0) return;

    const currentHistory = this.searchHistorySubject.value;
    const trimmedQuery = query.trim();
    
    // Remover se já existir
    const filtered = currentHistory.filter(q => q !== trimmedQuery);
    
    // Adicionar no início
    const newHistory = [trimmedQuery, ...filtered].slice(0, 10); // Máximo 10 termos
    
    this.searchHistorySubject.next(newHistory);
    
    // Salvar no localStorage
    try {
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Erro ao salvar histórico de busca:', e);
    }
  }

  /**
   * Carregar histórico de busca do localStorage
   */
  loadSearchHistory(): void {
    try {
      const saved = localStorage.getItem('searchHistory');
      if (saved) {
        const history = JSON.parse(saved);
        this.searchHistorySubject.next(history);
      }
    } catch (e) {
      console.error('Erro ao carregar histórico de busca:', e);
    }
  }

  /**
   * Limpar histórico de busca
   */
  clearSearchHistory(): void {
    this.searchHistorySubject.next([]);
    try {
      localStorage.removeItem('searchHistory');
    } catch (e) {
      console.error('Erro ao limpar histórico de busca:', e);
    }
  }

  /**
   * Buscar heróis/personagens
   */
  searchHeroes(query: string): Observable<any> {
    const params = new HttpParams().set('query', query);
    return this.http.get<any>(`${this.apiUrl}/heroes/search`, { params });
  }
}
