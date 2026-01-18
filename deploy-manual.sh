#!/bin/bash

# Script de deploy manual para AWS EC2
# Use este script para fazer deploy quando o GitHub Actions não funcionar

set -e  # Para na primeira erro

echo "🚀 Iniciando deploy manual..."

# Verificar se estamos na branch correta
BRANCH=$(git branch --show-current)
echo "📍 Branch atual: $BRANCH"

# Verificar se o build foi feito
if [ ! -d "dist/avaliador_de_herois" ]; then
    echo "📦 Fazendo build da aplicação..."
    npm run build
else
    echo "✅ Build já existe em dist/avaliador_de_herois"
fi

# Verificar se há arquivos no build
if [ -z "$(ls -A dist/avaliador_de_herois)" ]; then
    echo "❌ ERRO: Pasta dist está vazia!"
    exit 1
fi

echo "✅ Build verificado com sucesso!"

# Configurações (AJUSTE ESTES VALORES!)
SSH_HOST="34.227.188.248"  # IP da sua EC2
SSH_USER="ec2-user"
APP_DIR="/var/www/app"

echo ""
echo "📋 Configurações:"
echo "   SSH Host: $SSH_HOST"
echo "   SSH User: $SSH_USER"
echo "   App Dir: $APP_DIR"
echo ""
read -p "Confirma estas configurações? (s/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[SsYy]$ ]]; then
    echo "Deploy cancelado."
    exit 1
fi

echo ""
echo "📤 Copiando arquivos para o servidor..."

# Criar diretório temporário no servidor
ssh ${SSH_USER}@${SSH_HOST} "sudo mkdir -p /tmp/app && sudo rm -rf /tmp/app/*"

# Copiar arquivos usando rsync
rsync -avz --delete \
    ./dist/avaliador_de_herois/ \
    ${SSH_USER}@${SSH_HOST}:/tmp/app/

echo "✅ Arquivos copiados para /tmp/app"

echo ""
echo "📦 Movendo arquivos para $APP_DIR..."

# Mover arquivos e configurar permissões
ssh ${SSH_USER}@${SSH_HOST} << EOF
    # Criar diretório se não existir
    sudo mkdir -p ${APP_DIR}
    
    # Fazer backup do diretório antigo
    sudo mkdir -p ${APP_DIR}.backup
    sudo cp -r ${APP_DIR}/* ${APP_DIR}.backup/ 2>/dev/null || true
    
    # Limpar diretório antigo
    sudo rm -rf ${APP_DIR}/*
    
    # Mover arquivos novos
    sudo mv /tmp/app/* ${APP_DIR}/
    
    # Configurar permissões
    sudo chown -R nginx:nginx ${APP_DIR}
    sudo chmod -R 755 ${APP_DIR}
    
    # Recarregar nginx
    sudo systemctl reload nginx
    
    echo "✅ Deploy concluído!"
    echo ""
    echo "📊 Verificando arquivos em ${APP_DIR}:"
    sudo ls -la ${APP_DIR} | head -10
EOF

echo ""
echo "🎉 Deploy manual concluído com sucesso!"
echo "🌐 Verifique sua aplicação em: http://${SSH_HOST}"
