# Rotas da API - Área do Cliente

Este documento detalha todas as rotas da API relacionadas à área do cliente para gerenciamento de artigos e notícias.

## Base URL
```
/api/client
```

---

## Artigos do Cliente

### 1. Criar Artigo
**POST** `/api/client/articles`

**Descrição:** Cria um novo artigo associado ao usuário autenticado.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Payload:**
```json
{
  "category": "string (obrigatório)",
  "title": "string (obrigatório, mínimo 5 caracteres)",
  "description": "string (obrigatório)",
  "text": "string (obrigatório)",
  "summary": [
    {
      "text": "string",
      "level": "number (1-5)"
    }
  ],
  "keyWords": ["string"],
  "theme": "string (opcional)",
  "themeColor": "string (opcional, padrão: #00D2FF)",
  "usuario_id": "number (obrigatório, obtido do token)"
}
```

**Resposta de Sucesso (201 Created):**
```json
{
  "id": 1,
  "category": "Marvel",
  "title": "Título do Artigo",
  "description": "Descrição do artigo",
  "text": "Conteúdo completo do artigo",
  "summary": [
    {
      "text": "Resumo item",
      "level": 1
    }
  ],
  "keyWords": ["heroi", "marvel"],
  "theme": "Marvel",
  "themeColor": "#00D2FF",
  "usuario_id": 123,
  "created_at": "2026-01-13T10:00:00.000Z",
  "updated_at": "2026-01-13T10:00:00.000Z"
}
```

---

### 2. Listar Artigos do Usuário
**GET** `/api/client/articles?usuario_id={userId}`

**Descrição:** Retorna todos os artigos criados pelo usuário autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `usuario_id` (number, obrigatório): ID do usuário obtido do token

**Resposta de Sucesso (200 OK):**
```json
{
  "articles": [
    {
      "id": 1,
      "category": "Marvel",
      "title": "Título do Artigo",
      "description": "Descrição",
      "text": "Conteúdo",
      "summary": [],
      "keyWords": [],
      "theme": "Marvel",
      "themeColor": "#00D2FF",
      "usuario_id": 123,
      "created_at": "2026-01-13T10:00:00.000Z",
      "updated_at": "2026-01-13T10:00:00.000Z",
      "views": 0
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

---

### 3. Buscar Artigo por ID
**GET** `/api/client/articles/{id}`

**Descrição:** Retorna um artigo específico do usuário autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id` (number): ID do artigo

**Resposta de Sucesso (200 OK):**
```json
{
  "id": 1,
  "category": "Marvel",
  "title": "Título do Artigo",
  "description": "Descrição",
  "text": "Conteúdo",
  "summary": [],
  "keyWords": [],
  "theme": "Marvel",
  "themeColor": "#00D2FF",
  "usuario_id": 123,
  "created_at": "2026-01-13T10:00:00.000Z",
  "updated_at": "2026-01-13T10:00:00.000Z"
}
```

---

### 4. Atualizar Artigo
**PUT** `/api/client/articles/{id}`

**Descrição:** Atualiza um artigo existente do usuário autenticado.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters:**
- `id` (number): ID do artigo

**Payload:** (mesmos campos do POST, todos opcionais exceto `usuario_id`)
```json
{
  "category": "string (opcional)",
  "title": "string (opcional)",
  "description": "string (opcional)",
  "text": "string (opcional)",
  "summary": [],
  "keyWords": [],
  "theme": "string (opcional)",
  "themeColor": "string (opcional)",
  "usuario_id": "number (obrigatório)"
}
```

**Resposta de Sucesso (200 OK):**
```json
{
  "id": 1,
  "category": "Marvel",
  "title": "Título Atualizado",
  // ... outros campos atualizados
  "updated_at": "2026-01-13T11:00:00.000Z"
}
```

---

### 5. Excluir Artigo
**DELETE** `/api/client/articles/{id}`

**Descrição:** Exclui um artigo específico do usuário autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id` (number): ID do artigo

**Resposta de Sucesso (200 OK):**
```json
{
  "message": "Artigo excluído com sucesso"
}
```

---

### 6. Excluir Múltiplos Artigos
**POST** `/api/client/articles/delete-many`

**Descrição:** Exclui múltiplos artigos do usuário autenticado em uma única requisição.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Payload:**
```json
{
  "ids": [1, 2, 3]
}
```

**Resposta de Sucesso (200 OK):**
```json
{
  "message": "Artigos excluídos com sucesso",
  "deletedCount": 3
}
```

---

## Notícias do Cliente

### 7. Criar Notícia
**POST** `/api/client/news`

**Descrição:** Cria uma nova notícia associada ao usuário autenticado.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Payload:**
```json
{
  "title": "string (obrigatório, mínimo 5 caracteres)",
  "description": "string (obrigatório)",
  "content": "string (obrigatório)",
  "type_news_letter": "string (obrigatório)",
  "theme": "string (obrigatório)",
  "usuario_id": "number (obrigatório, obtido do token)"
}
```

**Resposta de Sucesso (201 Created):**
```json
{
  "id": 1,
  "title": "Título da Notícia",
  "description": "Descrição da notícia",
  "content": "Conteúdo completo da notícia",
  "type_news_letter": "Novidades",
  "theme": "Marvel",
  "usuario_id": 123,
  "created_at": "2026-01-13T10:00:00.000Z",
  "updated_at": "2026-01-13T10:00:00.000Z"
}
```

---

### 8. Listar Notícias do Usuário
**GET** `/api/client/news?usuario_id={userId}`

**Descrição:** Retorna todas as notícias criadas pelo usuário autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `usuario_id` (number, obrigatório): ID do usuário obtido do token

**Resposta de Sucesso (200 OK):**
```json
{
  "news": [
    {
      "id": 1,
      "title": "Título da Notícia",
      "description": "Descrição",
      "content": "Conteúdo",
      "type_news_letter": "Novidades",
      "theme": "Marvel",
      "usuario_id": 123,
      "created_at": "2026-01-13T10:00:00.000Z",
      "updated_at": "2026-01-13T10:00:00.000Z",
      "views": 0
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

---

### 9. Buscar Notícia por ID
**GET** `/api/client/news/{id}`

**Descrição:** Retorna uma notícia específica do usuário autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id` (number): ID da notícia

**Resposta de Sucesso (200 OK):**
```json
{
  "id": 1,
  "title": "Título da Notícia",
  "description": "Descrição",
  "content": "Conteúdo",
  "type_news_letter": "Novidades",
  "theme": "Marvel",
  "usuario_id": 123,
  "created_at": "2026-01-13T10:00:00.000Z",
  "updated_at": "2026-01-13T10:00:00.000Z"
}
```

---

### 10. Atualizar Notícia
**PUT** `/api/client/news/{id}`

**Descrição:** Atualiza uma notícia existente do usuário autenticado.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters:**
- `id` (number): ID da notícia

**Payload:** (todos os campos opcionais exceto `usuario_id`)
```json
{
  "title": "string (opcional)",
  "description": "string (opcional)",
  "content": "string (opcional)",
  "type_news_letter": "string (opcional)",
  "theme": "string (opcional)",
  "usuario_id": "number (obrigatório)"
}
```

**Resposta de Sucesso (200 OK):**
```json
{
  "id": 1,
  "title": "Título Atualizado",
  // ... outros campos atualizados
  "updated_at": "2026-01-13T11:00:00.000Z"
}
```

---

### 11. Excluir Notícia
**DELETE** `/api/client/news/{id}`

**Descrição:** Exclui uma notícia específica do usuário autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `id` (number): ID da notícia

**Resposta de Sucesso (200 OK):**
```json
{
  "message": "Notícia excluída com sucesso"
}
```

---

### 12. Excluir Múltiplas Notícias
**POST** `/api/client/news/delete-many`

**Descrição:** Exclui múltiplas notícias do usuário autenticado em uma única requisição.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Payload:**
```json
{
  "ids": [1, 2, 3]
}
```

**Resposta de Sucesso (200 OK):**
```json
{
  "message": "Notícias excluídas com sucesso",
  "deletedCount": 3
}
```

---

## Códigos de Erro

### 400 Bad Request
- Campos obrigatórios faltando
- Validação de dados falhou

### 401 Unauthorized
- Token não fornecido ou inválido
- Usuário não autenticado

### 403 Forbidden
- Usuário não tem permissão para acessar/modificar o recurso
- Artigo/Notícia pertence a outro usuário

### 404 Not Found
- Artigo/Notícia não encontrado
- ID inválido

### 500 Internal Server Error
- Erro interno do servidor

---

## Observações Importantes

1. **Autenticação:** Todas as rotas requerem autenticação via token Bearer
2. **Isolamento:** Usuários só podem visualizar/modificar seus próprios artigos e notícias
3. **Validação:** O backend deve validar que `usuario_id` corresponde ao usuário do token
4. **Permissões:** Verificar no backend se o usuário tem permissão para realizar a ação
5. **Paginação:** As rotas de listagem podem suportar paginação com `page` e `limit` (implementação opcional)
