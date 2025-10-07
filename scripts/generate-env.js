const fs = require('fs');
const path = require('path');

// Função para gerar environment.ts
function generateEnvironment(isProduction = false) {
  const envVars = {
    production: isProduction,
    apiURL: process.env.API_URL || (isProduction ? '' : 'http://localhost:3020'),
    ID_CLIENTE_GOOGLE: process.env.ID_CLIENTE_GOOGLE || '',
    SECRET_KEY_GOOGLE: process.env.SECRET_KEY_GOOGLE || '',
    stripePublicKey: process.env.STRIPE_PUBLIC_KEY || '',
    encryptionKey: process.env.ENCRYPTION_KEY || ''
  };

  const content = `export const environment = ${JSON.stringify(envVars, null, 2)};`;
  
  const fileName = isProduction ? 'environment.prod.ts' : 'environment.ts';
  const filePath = path.join(__dirname, '..', 'src', 'environments', fileName);
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ ${fileName} gerado com sucesso!`);
}

// Gerar ambos os arquivos
generateEnvironment(false); // environment.ts
generateEnvironment(true);  // environment.prod.ts