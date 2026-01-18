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

# **[1.1.9]- 2026-01-18**

### **✨ Added**

- Sistema completo de notificações em tempo real com ícone no header visível apenas para usuários logados.
- Componente de ícone de notificações (`notification-icon`) no header entre o carrinho de compras e o botão de tema.
- Dropdown de notificações no header com lista reduzida, scroll independente (máximo 50vh) e indicadores visuais de não lidas.
- Modal de notificações renderizado no nível superior da aplicação (`app.component`) com layout de dois painéis (lista à esquerda, detalhes à direita).
- Serviço de modal de notificações (`NotificationModalService`) para gerenciamento centralizado do estado do modal usando signals.
- Componente de modal de notificações (`NotificationModalComponent`) com visualização completa de título, mensagem, imagem, autor e data.
- Suporte para diferentes tipos de notificações: `info`, `success`, `warning`, `error`, `system` com cores específicas para cada tipo.
- Funcionalidades de marcar como lida (manual e automática ao abrir) e excluir notificações (individual e em lote).
- Integração com WebSocket (`NotificationWebSocketService`) para recebimento de notificações em tempo real.
- Badge de contador de notificações não lidas no ícone do header (exibe até 99+).
- Métodos auxiliares para mapeamento de datas (`getNotificationDate`) suportando formato camelCase (`createdAt`) e snake_case (`created_at`) da API.
- Página de FAQ (`/webmain/client-area/faq`) na área do cliente com perguntas frequentes em formato de accordion.
- Página de SAC (`/webmain/client-area/sac`) na área do cliente com formulário de contato (suporte, reclamação, elogio) e suporte a anexos.
- Link para SAC no footer na seção "Políticas e Diretrizes".
- Sistema de bloqueio de scroll do body quando o modal de notificações está aberto.

### **🛠️ Changed**

- Header atualizado com ícone de notificações posicionado entre o carrinho e o botão de tema.
- Componente raiz da aplicação (`app.component`) atualizado para renderizar o modal de notificações no nível superior.
- Mapeamento automático de dados da API convertendo `createdAt`/`updatedAt` (camelCase) para `created_at`/`updated_at` (snake_case) no carregamento de notificações.
- Dashboard da área do cliente atualizado com botões para FAQ e SAC.
- Footer atualizado com link para SAC na seção de políticas.

### **🐛 Fixed**

- Corrigido problema onde apenas a primeira notificação era exibida devido à incompatibilidade de formato de datas (`createdAt` vs `created_at`).
- Corrigido erro de compilação relacionado ao uso de type casting (`as any`) diretamente nos templates do Angular.
- Corrigido problema de posicionamento do modal que aparecia dentro do container de notificações ao invés do nível superior.
- Corrigido problema de navegação onde botões de FAQ e SAC redirecionavam para lista de notícias ao invés das páginas corretas.
- Corrigido fechamento automático do dropdown ao clicar fora do componente de notificações.

### **⚠️ Deprecated**

-

### **❌ Removed**

- Removido renderização do modal de notificações do componente `notification-icon`, agora renderizado no nível superior da aplicação.

### **🛑 Security**

- Sistema de notificações restrito apenas a usuários autenticados.
- Validação e sanitização de dados recebidos da API de notificações.
- WebSocket configurado com autenticação baseada em `usuario_id` para isolamento de notificações por usuário.

---

# **[1.1.8]- 2026-01-17**

### **✨ Added**

- Página completa do Manual do Redator HEROES (`/webmain/manual-redator`) com guia completo de ética e boas práticas jornalísticas.
- Página completa do Código de Conduta da Comunidade (`/webmain/codigo-conduta`) estabelecendo diretrizes para ambiente seguro e inclusivo.
- Seção "Diretrizes e Políticas" na página About com cards visuais para acesso rápido ao Manual do Redator e Código de Conduta.
- Seção "Políticas e Diretrizes" no footer com links para documentos de compliance.
- Conteúdo profissional e abrangente nos documentos de compliance, seguindo padrões de grandes empresas.
- Integração de SEO (meta tags e structured data) nas novas páginas de políticas.

### **🛠️ Changed**

- Footer atualizado com nova seção dedicada a políticas e diretrizes da plataforma.
- Página About expandida com seção informativa sobre diretrizes e políticas da plataforma.

### **🐛 Fixed**

- Corrigido erro de compilação relacionado à propriedade `url` obrigatória em `StructuredDataComponent.createArticleData` nos componentes de políticas.

### **⚠️ Deprecated**

-

### **❌ Removed**

-

### **🛑 Security**

- Documentos de compliance estabelecem políticas claras de combate à desinformação, não-apologia e respeito à diversidade.
- Diretrizes editoriais promovem integridade informacional e responsabilidade no conteúdo publicado.

---

# **[1.1.7]- 2026-01-16**

### **✨ Added**

- Área do cliente completa para gerenciamento de conteúdo criado pelo usuário.
- Dashboard do cliente (`client-dashboard`) com seleção entre gerenciar artigos ou notícias.
- Componentes de gerenciamento de artigos: `client-article-list`, `client-article-form` para listagem, criação e edição.
- Componentes de gerenciamento de notícias: `client-news-list`, `client-news-form` para listagem, criação e edição.
- Interfaces dedicadas: `client-article.interface.ts` e `client-news.interface.ts` para tipagem de dados do cliente.
- Serviços HTTP: `ClientArticleHttpService` e `ClientNewsHttpService` para comunicação com API de artigos e notícias do cliente.
- Rotas da área do cliente: `/webmain/client-area` com sub-rotas para artigos e notícias (listagem, criação, edição).
- Link "Minha Área" no header (desktop e mobile) visível apenas para usuários autenticados.
- Funcionalidade de seleção múltipla para exclusão em lote de artigos e notícias.
- Documentação completa das rotas da API (`ROTAS_API_CLIENT_AREA.md`) com especificação de payload, respostas e propósitos.
- Processamento automático de artigos para definir `imageDefault` quando `route` for `null` nos componentes de listagem e detalhes.

### **🛠️ Changed**

- Header atualizado com novo item de navegação "Minha Área" (visível apenas para usuários logados).
- Componente `artigos` atualizado para usar `imageDefault` quando `route` for `null`.
- Componente `article-detail` atualizado para usar `imageDefault` quando `route` for `null`.
- Componente `hero-section` atualizado: estatísticas numéricas substituídas por diferenciais descritivos (Conteúdo Exclusivo, Games Interativos, Quizzes Gamificados).

### **🐛 Fixed**

- Corrigido tratamento de resposta da API no formato `{ status, message, data: [...] }` para listagem de artigos e notícias.
- Corrigido tratamento de resposta da API no formato `{ status, message, dataUnit: {...} }` para busca individual de artigos e notícias.
- Corrigido caminhos de importação nos componentes da área do cliente.
- Corrigido preenchimento de formulários de edição que não carregavam dados corretamente.
- Corrigido problema onde artigos sem `route` não exibiam imagem padrão.

### **⚠️ Deprecated**

-

### **❌ Removed**

-

### **🛑 Security**

- Rotas da área do cliente protegidas com `plansGuard` para garantir que apenas usuários autenticados possam acessar.
- Validação no backend deve garantir isolamento de dados (usuários só visualizam/modificam seus próprios conteúdos).

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
