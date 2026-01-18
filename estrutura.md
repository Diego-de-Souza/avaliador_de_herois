Perfeito. Abaixo está uma estrutura completa, prescritiva e pronta para execução, cobrindo:

Arquitetura geral (Free Tier)

Fluxos de comunicação

Configurações necessárias

Diagramas em Mermaid (como você pediu)

Checklist prático de configuração

Nada conceitual demais — foco em como realmente montar.

1. Arquitetura Final (Free Tier – 12 meses)
Componentes
Camada	Serviço	Observação
DNS	Cloudflare	Gratuito
Frontend	EC2 + Nginx	t3.micro
Backend	EC2 + Node/NestJS	t3.micro
Banco	RDS PostgreSQL	db.t3.micro
Imagens	S3	5 GB Free Tier
CDN imagens	CloudFront	Free Tier
2. Fluxo Geral da Aplicação (Mermaid)
flowchart TD
    User[Usuário / Browser]

    User -->|HTTPS| CF_DNS[Cloudflare DNS + SSL]

    CF_DNS --> FE[EC2 Frontend<br/>Nginx + Angular/React]

    FE -->|/api| BE[EC2 Backend<br/>NestJS + PM2]

    BE -->|SQL| RDS[(RDS PostgreSQL)]

    BE -->|Upload| S3[S3 Bucket<br/>Imagens]

    User -->|GET imagens| CDN[CloudFront]

    CDN --> S3

3. Estrutura de DNS (Cloudflare)
Nameservers

No registrador do domínio:

ns1.cloudflare.com
ns2.cloudflare.com

Registros DNS
Tipo	Nome	Valor	Proxy
A	heroesplatform.com.br	Elastic IP FE	🟠 ON
A	www	Elastic IP FE	🟠 ON
A	api	Elastic IP BE	⚪ OFF
CNAME	img	CloudFront URL	⚪ OFF

Importante

API não deve ficar proxied para evitar problemas de WebSocket / headers

Segurança via Security Group

4. Fluxo de Frontend (Mermaid)
sequenceDiagram
    participant U as Usuário
    participant CF as Cloudflare
    participant N as Nginx FE
    participant A as Angular/React

    U->>CF: https://heroesplatform.com.br
    CF->>N: Request HTTPS
    N->>A: index.html + assets
    A-->>U: SPA carregada

5. Fluxo de API (Mermaid)
sequenceDiagram
    participant FE as Frontend
    participant N as Nginx FE
    participant BE as Backend (NestJS)
    participant DB as PostgreSQL

    FE->>N: /api/login
    N->>BE: Proxy request
    BE->>DB: Query
    DB-->>BE: Result
    BE-->>N: JSON
    N-->>FE: Response

6. Fluxo de Upload e Leitura de Imagens (Mermaid)
sequenceDiagram
    participant U as Usuário
    participant FE as Frontend
    participant BE as Backend
    participant S3 as S3
    participant CDN as CloudFront

    U->>FE: Seleciona imagem
    FE->>BE: POST /api/upload
    BE->>S3: Upload imagem
    BE-->>FE: URL img.heroesplatform.com.br/xxx.jpg

    U->>CDN: GET imagem
    CDN->>S3: Cache miss
    S3-->>CDN: Objeto
    CDN-->>U: Imagem

7. Configuração das EC2
7.1 EC2 Frontend
Stack

Nginx

Node apenas para build (opcional)

Estrutura
/var/www/app
 ├── index.html
 ├── assets/
 └── main.js

Nginx (Frontend)
server {
  listen 80;
  server_name heroesplatform.com.br www.heroesplatform.com.br;

  root /var/www/app;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /api {
    proxy_pass http://PRIVATE_IP_BACKEND:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}

7.2 EC2 Backend
Stack

Node.js 20

NestJS

PM2

Nginx (opcional)

PM2
pm2 start dist/main.js --name api
pm2 startup
pm2 save

Variáveis de ambiente
DB_HOST=RDS_ENDPOINT
DB_PORT=5432
DB_NAME=app
DB_USER=postgres
DB_PASSWORD=********
AWS_S3_BUCKET=heroesplatform-images
AWS_REGION=us-east-1

8. RDS PostgreSQL
Configuração

Engine: PostgreSQL

Classe: db.t3.micro

Storage: 20 GB

Public access: NO

Security Group:

Porta 5432 somente EC2 Backend

9. S3 + CloudFront
S3

Bucket privado

Bloquear acesso público

Upload via API

CloudFront

Origin: S3

Viewer protocol: Redirect HTTP → HTTPS

Cache padrão

10. Security Groups (Crítico)
Frontend

80 / 443 → 0.0.0.0/0

22 → Seu IP

Backend

3000 → SG-Frontend

22 → Seu IP

RDS

5432 → SG-Backend

11. Checklist Final (ordem correta)

Criar conta Cloudflare

Apontar domínio para Cloudflare

Criar EC2 Frontend + Elastic IP

Criar EC2 Backend

Criar RDS PostgreSQL

Criar S3 Bucket

Criar CloudFront

Configurar DNS

Configurar Nginx

Deploy frontend

Deploy backend

12. Conclusão

Essa estrutura:

Está 100% dentro do Free Tier

É profissional

É segura

Escala no futuro sem retrabalho

Próximo passo (sugestão)

Posso avançar para:

Script de provisionamento EC2

CI/CD com GitHub Actions

Upload S3 com presigned URL

Observabilidade (logs, métricas)

Diga qual você quer que eu execute primeiro.