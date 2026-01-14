import { Injectable, inject } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';

// Nota: DOMPurify precisa ser instalado: npm install dompurify @types/dompurify
// Se não puder instalar, usar sanitização básica do Angular
let DOMPurify: any = null;
if (typeof window !== 'undefined') {
  try {
    // Tentar importar DOMPurify se disponível (opcional)
    // Por enquanto, usaremos apenas o sanitizer do Angular
    DOMPurify = null;
  } catch {
    DOMPurify = null;
  }
}

@Injectable({
  providedIn: 'root'
})
export class SanitizationService {
  private readonly sanitizer = inject(DomSanitizer);

  // Tags permitidas para conteúdo de artigos
  private readonly allowedTagsForArticles = [
    'p', 'br', 'strong', 'em', 'u', 'b', 'i', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre', 'span', 'div',
    'table', 'thead', 'tbody', 'tr', 'td', 'th'
  ];

  // Atributos permitidos
  private readonly allowedAttributes = [
    'href', 'src', 'alt', 'title', 'class', 'id', 'style', 'target', 'rel'
  ];

  /**
   * Sanitiza HTML de forma robusta
   * @param html - HTML a ser sanitizado
   * @param strict - Se true, usa apenas tags básicas
   * @returns HTML sanitizado e seguro
   */
  sanitizeHtml(html: string, strict: boolean = false): SafeHtml {
    if (!html) {
      return this.sanitizer.bypassSecurityTrustHtml('');
    }

    // Se DOMPurify estiver disponível, usar ele
    if (DOMPurify) {
      const config: any = {
        ALLOWED_TAGS: strict 
          ? ['p', 'br', 'strong', 'em', 'u', 'a']
          : this.allowedTagsForArticles,
        ALLOWED_ATTR: this.allowedAttributes,
        ALLOW_DATA_ATTR: false,
        ALLOW_UNKNOWN_PROTOCOLS: false
      };

      // Para artigos, permitir mais formatação
      if (!strict) {
        config.ALLOWED_TAGS.push('img', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote');
      }

      const clean = DOMPurify.sanitize(html, config);
      return this.sanitizer.bypassSecurityTrustHtml(clean);
    }

    // Fallback: usar sanitização básica do Angular
    return this.sanitizer.sanitize(1, html) as SafeHtml;
  }

  /**
   * Sanitiza e valida URLs
   * @param url - URL a ser validada
   * @returns URL sanitizada ou string vazia se inválida
   */
  sanitizeUrl(url: string): string {
    if (!url) {
      return '';
    }

    try {
      // Se não começar com http/https, adicionar https
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      const parsed = new URL(url);
      
      // Permitir apenas http e https
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return '';
      }

      // Bloquear javascript: e data: URLs perigosas
      if (parsed.protocol === 'javascript:' || parsed.protocol === 'data:') {
        return '';
      }

      return parsed.toString();
    } catch {
      return '';
    }
  }

  /**
   * Sanitiza URL como SafeUrl
   */
  sanitizeUrlSafe(url: string): SafeUrl {
    const sanitized = this.sanitizeUrl(url);
    return this.sanitizer.bypassSecurityTrustUrl(sanitized);
  }

  /**
   * Sanitiza conteúdo de comentários (mais restritivo)
   */
  sanitizeComment(comment: string): SafeHtml {
    return this.sanitizeHtml(comment, true);
  }

  /**
   * Sanitiza conteúdo de artigos (menos restritivo)
   */
  sanitizeArticle(article: string): SafeHtml {
    return this.sanitizeHtml(article, false);
  }

  /**
   * Remove tags HTML e retorna texto puro
   */
  stripHtml(html: string): string {
    if (!html) {
      return '';
    }

    if (DOMPurify) {
      return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
    }

    // Fallback básico
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  /**
   * Valida se uma string contém apenas texto seguro
   */
  isSafeText(text: string): boolean {
    if (!text) {
      return true;
    }

    // Verificar se contém tags HTML
    const htmlTagRegex = /<[^>]*>/g;
    if (htmlTagRegex.test(text)) {
      return false;
    }

    // Verificar se contém scripts
    const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    if (scriptRegex.test(text)) {
      return false;
    }

    return true;
  }
}
