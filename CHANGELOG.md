# **CHANGELOG.md**

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato segue as convenções de [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/), e este projeto segue [SemVer](https://semver.org/lang/pt-BR/).

---
## [Unreleased]
### **✨ Added**

- (exemplo) Novo endpoint para autenticação com refresh token.

### **🛠️ Changed**

- (exemplo) Melhorada a performace do endpoint.

### **🐛 Fixed**

- (exemplo) Corrigido bug de valização de CPF cadastro de usuário.

### **⚠️ Deprecated**

- (exemplo) Endpoint '/old-login' marcado como obsoleto.

### **❌ Removed**

- (exemplo) Endpoint '/legacy-report' removido. 

### **🛑 Security**

- (exemplo) atualização dependencia do jwttoken para corrigir vuklnerabilidade

---



# **[1.1.6]- 2026-01-13**

### **✨ Added**

- Sistema completo de comentários em artigos com componente `article-comments` e `comment-item`, permitindo comentários aninhados, likes/dislikes e edição.
- Componente de busca avançada (`advanced-search`) para filtros avançados de artigos com múltiplos critérios.
- Serviço de SEO (`SeoService`) para gerenciamento dinâmico de meta tags, Open Graph e Twitter Cards.
- Componente de dados estruturados (`structured-data`) para JSON-LD (Schema.org) visando melhor indexação.
- Serviço de sanitização (`SanitizationService`) para segurança na renderização de conteúdo HTML.
- Serviço HTTP de comentários (`CommentHttpService`) para comunicação com API de comentários.
- Serviço de busca (`SearchService`) para funcionalidades de busca avançada.
- Utilitário de validação de imagens (`ImageValidationUtil`) para validação de tipo, tamanho e dimensões.
- Nova página de detalhes de artigos (`ArticleDetailComponent`) com visualização completa e seção de comentários.
- Componentes da home page: `hero-section` e `why-choose` para melhor apresentação inicial.
- Arquivo `manifest.json` para suporte PWA (Progressive Web App).
- Arquivo `robots.txt` para controle de indexação por buscadores.
- Integração de meta tags SEO em componentes principais (home, about, artigos).
- Suporte a incremento de visualizações de artigos via API.

### **🛠️ Changed**

- Página de artigos (`article-page`) refatorada para usar busca avançada e redirecionar para página de detalhes ao invés de modal.
- Design do login atualizado com novo layout moderno e responsivo.
- Design da tela de recuperação de senha atualizado para seguir padrão do site.
- Home page integrada com `SeoService` para meta tags dinâmicas.
- Página "Sobre" (`about`) integrada com SEO e dados estruturados.
- Rotas de artigos atualizadas para suportar página de detalhes (`/webmain/artigos/:id`).
- Serviço de usuário (`UserService`) atualizado para incluir header `X-Session-Token` no logout.
- Serviço de artigos (`ArticleService`) atualizado com método `incrementViews` para contagem de visualizações.

### **🐛 Fixed**

- Corrigido problema onde o header `x-session-token` não era enviado durante o logout, causando erro 401 Unauthorized.
- Corrigido layout da seção de comentários que estava sobrepondo o conteúdo do artigo.
- Corrigido problema de performance onde `checkAutoSave()` era chamado repetidamente no componente Hero Battle.

### **⚠️ Deprecated**

-

### **❌ Removed**

- Removido uso de modal para exibição de detalhes de artigos, substituído por página dedicada.

### **🛑 Security**

- Implementada sanitização de HTML em comentários e conteúdo de artigos para prevenir XSS.
- Validação de URLs e conteúdo de usuário através do `SanitizationService`.
- Validação de imagens com restrições de tipo, tamanho e dimensões.

---

# **[1.1.5]- 2026-01-07**
### **✨ Added**

- Novo componente `banner-videos` para exibir banners com imagens e vídeos (YouTube), incluindo transição automática e navegação manual.
- Arquivo de interface dedicado: `data-events.interface.ts` para tipagem dos dados do banner e eventos.
- Arquivos de dados: `banner_init.ts` e `events.ts` para inicialização dos banners e eventos.

### **🛠️ Changed**

- Integração do novo banner em eventos (`eventos-page`) e na home (`home.component`).
- Ajuste dos componentes para consumir os novos dados tipados e estrutura de eventos.

### **🐛 Fixed**

-

### **⚠️ Deprecated**

-

### **❌ Removed**

- Removido o componente antigo `banner` e seus arquivos (`banner.component.ts`, `banner.component.html`, `banner.component.css`).

### **🛑 Security**

-

---
# **[1.1.4]- 2026-01-04**
### **✨ Added**

- Criados arquivos de interface dedicados: `stripe.interface.ts` e `payment.interface.ts` para centralizar definições de tipos.

### **🛠️ Changed**

- Refatoração de services: migração de constructor injection para `inject()` function em todos os services (ToastService, MessageService, HeroisService, AuthService, UserService, ProgressService, CepService, PaymentService).
- Templates modernizados: substituição de `ngStyle` e `ngClass` por style e class bindings nativos em componentes carousel e flash-loading.

### **🐛 Fixed**

-

### **⚠️ Deprecated**

-

### **❌ Removed**

- Removidos construtores vazios desnecessários dos services (TeamService, StudioService, CuriosityService).
- Interfaces removidas de services e movidas para arquivos `.interface.ts` dedicados (StripeConfig, CreatePaymentIntentRequest, PaymentIntentResponse, SetupIntentResponse).

### **🛑 Security**

-

---

# **[1.1.3]- 2026-01-03**

### **✨ Added**

-

### **🛠️ Changed**

- Adicionado botão "Ver Todos" no componente de eventos para navegação à página completa de eventos, incluindo estilos e integração com rotas do Angular.

### **🐛 Fixed**

-

### **⚠️ Deprecated**

-

### **❌ Removed**

-

### **🛑 Security**

-

---

# **[1.1.2]- 2026-01-03**

### **✨ Added**

-

### **🛠️ Changed**

-

### **🐛 Fixed**

- Correção na validação de URL para eventos, permitindo letras maiúsculas no path, query string e fragment da URL.

### **⚠️ Deprecated**

-

### **❌ Removed**

-

### **🛑 Security**

-

---
