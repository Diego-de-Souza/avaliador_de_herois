import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { MARKED_OPTIONS, provideMarkdown, MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import { Tokens } from 'marked';

import { authInterceptor } from './core/interceptors/auth.interceptor';
import { SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { environment } from '../environments/environment';

/** Renderer customizado para exibir fonte/atribuição em imagens do markdown */
function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();
  const defaultImage = renderer.image.bind(renderer);

  renderer.image = (token: Tokens.Image) => {
    const imgHtml = defaultImage(token);
    if (token.title) {
      const escapedTitle = token.title
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      return `<figure class="article-body-figure">${imgHtml}<figcaption class="article-image-caption">Fonte: ${escapedTitle}</figcaption></figure>`;
    }
    return imgHtml;
  };

  return { renderer, gfm: true };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
    provideMarkdown({
      markedOptions: {
        provide: MARKED_OPTIONS,
        useFactory: markedOptionsFactory
      }
    }),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.ID_CLIENTE_GOOGLE)
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],

};
