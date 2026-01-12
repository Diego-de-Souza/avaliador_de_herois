# 📊 Especificação de Banco de Dados - Hero Battle Game

## 📋 **Estrutura da Tabela: `user_game_progress`**

### **Campos Principais (Obrigatórios)**

| Campo | Tipo | Descrição | Observações |
|-------|------|-----------|-------------|
| `id` | INT/BIGINT | Chave primária | AUTO_INCREMENT |
| `user_id` | INT | ID do usuário | FK para tabela `users` |
| `game_id` | INT | ID do jogo | Valor fixo: **2** (Hero Battle) |
| `lvl_user` | INT | Nível atual do jogo | Nível/fase que o jogador alcançou |
| `score` | INT | Pontuação total | Score calculado dinamicamente |
| `attempts` | INT | Número de tentativas | Quantas vezes o jogador tentou |
| `metadata` | JSON/TEXT | Dados adicionais do jogo | Objeto JSON com detalhes |
| `created_at` | TIMESTAMP | Data de criação | AUTO |
| `updated_at` | TIMESTAMP | Data de atualização | AUTO UPDATE |

---

## 📦 **Estrutura do Campo `metadata` (JSON)**

O campo `metadata` armazena um objeto JSON com os seguintes dados:

### **Estrutura Completa do Metadata:**

```json
{
  "classe_escolhida": "string",
  "tempo_jogado": "number",
  "nivel_personagem": "number",
  "experiencia_total": "number",
  "vida_atual": "number",
  "vida_maxima": "number",
  "ultima_fase": "string",
  "inimigo_atual": "string"
}
```

### **Detalhamento dos Campos do Metadata:**

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `classe_escolhida` | STRING | Nome da classe escolhida pelo jogador | `"Guerreiro"`, `"Mago"`, `"Arqueiro"`, etc. |
| `tempo_jogado` | NUMBER | Tempo de jogo em segundos | `1250` (20 minutos e 50 segundos) |
| `nivel_personagem` | NUMBER | Nível atual do personagem/jogador | `5` |
| `experiencia_total` | NUMBER | Experiência total acumulada | `450` |
| `vida_atual` | NUMBER | Vida atual do jogador | `85` |
| `vida_maxima` | NUMBER | Vida máxima do jogador | `120` |
| `ultima_fase` | STRING | Última fase/estado do jogo | `"vitoria"`, `"batalha"`, `"level-up"`, `"derrota"` |
| `inimigo_atual` | STRING | Nome do último inimigo enfrentado | `"Goblin"`, `"Dragão"`, `"Nenhum"` |

---

## 🔢 **Exemplo de Dados Enviados**

### **Request Body (POST `/api/games/user-game-progress`):**

```json
{
  "user_id": 123,
  "game_id": 2,
  "lvl_user": 5,
  "score": 875,
  "attempts": 3,
  "metadata": {
    "classe_escolhida": "Guerreiro",
    "tempo_jogado": 1250,
    "nivel_personagem": 5,
    "experiencia_total": 450,
    "vida_atual": 85,
    "vida_maxima": 120,
    "ultima_fase": "vitoria",
    "inimigo_atual": "Goblin"
  }
}
```

---

## 🗄️ **Script SQL de Criação (PostgreSQL)**

```sql
CREATE TABLE user_game_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    game_id INTEGER NOT NULL,
    lvl_user INTEGER NOT NULL DEFAULT 1,
    score INTEGER NOT NULL DEFAULT 0,
    attempts INTEGER NOT NULL DEFAULT 1,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key
    CONSTRAINT fk_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    
    -- Índices para performance
    CONSTRAINT idx_user_game 
        UNIQUE (user_id, game_id)
);

-- Índice adicional para consultas por game_id
CREATE INDEX idx_game_id ON user_game_progress(game_id);

-- Índice para consultas por score (ranking)
CREATE INDEX idx_score ON user_game_progress(game_id, score DESC);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_game_progress_updated_at 
    BEFORE UPDATE ON user_game_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

## 🗄️ **Script SQL de Criação (MySQL/MariaDB)**

```sql
CREATE TABLE user_game_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    game_id INT NOT NULL,
    lvl_user INT NOT NULL DEFAULT 1,
    score INT NOT NULL DEFAULT 0,
    attempts INT NOT NULL DEFAULT 1,
    metadata JSON NOT NULL DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Key
    CONSTRAINT fk_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    
    -- Índice único para garantir um registro por usuário/jogo
    UNIQUE KEY idx_user_game (user_id, game_id),
    
    -- Índices adicionais
    KEY idx_game_id (game_id),
    KEY idx_score (game_id, score DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 📝 **Campos do Metadata - Validação**

### **Tipos de Valores Esperados:**

1. **`classe_escolhida`** (STRING):
   - Valores possíveis: Nomes das classes disponíveis no jogo
   - Exemplos: `"Guerreiro"`, `"Mago"`, `"Arqueiro"`, `"Ladino"`, etc.
   - Não pode ser nulo

2. **`tempo_jogado`** (NUMBER):
   - Em segundos (inteiro)
   - Mínimo: `0`
   - Máximo: Sem limite prático
   - Exemplo: `1250` (20 minutos e 50 segundos)

3. **`nivel_personagem`** (NUMBER):
   - Nível do personagem/jogador
   - Mínimo: `1`
   - Máximo: Sem limite teórico (praticamente 1-100)
   - Incrementa ao ganhar experiência suficiente

4. **`experiencia_total`** (NUMBER):
   - Experiência total acumulada
   - Mínimo: `0`
   - Usado para calcular level-up

5. **`vida_atual`** (NUMBER):
   - Vida atual do jogador
   - Mínimo: `0` (morte)
   - Máximo: Igual a `vida_maxima`
   - Pode estar entre 0 e `vida_maxima`

6. **`vida_maxima`** (NUMBER):
   - Vida máxima do jogador
   - Mínimo: `> 0`
   - Aumenta com level-up

7. **`ultima_fase`** (STRING):
   - Valores possíveis:
     - `"selecao-classe"` - Escolhendo classe
     - `"batalha"` - Em batalha
     - `"vitoria"` - Vitória no nível
     - `"level-up"` - Subiu de nível
     - `"derrota"` - Foi derrotado

8. **`inimigo_atual`** (STRING):
   - Nome do último inimigo enfrentado
   - Pode ser `"Nenhum"` se não houver inimigo ativo
   - Exemplos: `"Goblin"`, `"Orc"`, `"Dragão"`, etc.

---

## 🔍 **Consultas Úteis**

### **Buscar progresso de um usuário:**
```sql
SELECT * FROM user_game_progress 
WHERE user_id = 123 AND game_id = 2;
```

### **Buscar ranking do jogo:**
```sql
SELECT 
    u.id,
    u.nickname,
    ugp.score,
    ugp.lvl_user,
    ugp.metadata->>'nivel_personagem' as nivel_personagem,
    ugp.attempts
FROM user_game_progress ugp
JOIN users u ON u.id = ugp.user_id
WHERE ugp.game_id = 2
ORDER BY ugp.score DESC
LIMIT 10;
```

### **Buscar estatísticas do usuário:**
```sql
SELECT 
    metadata->>'classe_escolhida' as classe,
    metadata->>'nivel_personagem' as nivel,
    metadata->>'tempo_jogado' as tempo_segundos,
    score,
    attempts,
    updated_at
FROM user_game_progress
WHERE user_id = 123 AND game_id = 2;
```

---

## 📊 **Resumo dos Dados**

### **Dados Principais (Campos da Tabela):**
- ✅ `user_id` - Identificação do usuário
- ✅ `game_id` - ID do jogo (fixo: 2)
- ✅ `lvl_user` - Nível/fase alcançado no jogo
- ✅ `score` - Pontuação total calculada
- ✅ `attempts` - Número de tentativas
- ✅ `metadata` - Dados detalhados em JSON

### **Dados no Metadata (JSON):**
- ✅ `classe_escolhida` - Classe escolhida
- ✅ `tempo_jogado` - Tempo em segundos
- ✅ `nivel_personagem` - Nível do personagem
- ✅ `experiencia_total` - XP acumulada
- ✅ `vida_atual` - Vida atual
- ✅ `vida_maxima` - Vida máxima
- ✅ `ultima_fase` - Estado do jogo
- ✅ `inimigo_atual` - Último inimigo

---

## 🎯 **Observações Importantes**

1. **Game ID Fixo**: O Hero Battle sempre usa `game_id = 2`

2. **Score Calculado**: O score é calculado dinamicamente no frontend:
   ```typescript
   scoreBase = nivel * 100
   bonusVida = (vida_atual / vida_maxima) * 50
   bonusNivel = nivel_personagem * 25
   score = scoreBase + bonusVida + bonusNivel
   ```

3. **Atualização vs Inserção**: 
   - Se o registro já existe (user_id + game_id), deve ser **atualizado** (UPSERT)
   - Se não existe, deve ser **inserido**

4. **Metadata é JSON**: 
   - Use tipo `JSON` ou `JSONB` (PostgreSQL) para melhor performance
   - Use tipo `JSON` (MySQL 5.7+) ou `TEXT` (MySQL antigo)

5. **Timestamps**: 
   - `created_at`: Data de criação (não muda)
   - `updated_at`: Data da última atualização (atualiza a cada save)

---

## ✅ **Checklist para Implementação do Banco**

- [ ] Tabela `user_game_progress` criada
- [ ] Campo `metadata` é do tipo JSON/JSONB
- [ ] Índice único em (user_id, game_id)
- [ ] Índice em game_id para consultas
- [ ] Índice em score para ranking
- [ ] Foreign Key para tabela users
- [ ] Trigger ou constraint para updated_at
- [ ] Endpoint implementa UPSERT (INSERT ... ON DUPLICATE KEY UPDATE)
- [ ] Validação dos campos do metadata
- [ ] Testes de inserção/atualização

---

**Documento criado para facilitar a implementação do backend!** 🚀
