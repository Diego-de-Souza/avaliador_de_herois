const fs = require('fs');
const path = require('path');

function generateEnvironment(isProduction = false) {
  const envDir = path.join(__dirname, '..', 'src', 'environments');

  // ✅ GARANTIR que a pasta exista
  fs.mkdirSync(envDir, { recursive: true });

  // Pegando API_URL do ambiente
  let apiURL = process.env.API_URL || (isProduction ? '' : 'http://localhost:3020');

  // ✅ Garantir protocolo absoluto
  if (!/^http?:\/\//.test(apiURL) && apiURL !== '') {
    apiURL = 'http://' + apiURL;
  }

  // ✅ Remover barra final
  apiURL = apiURL.replace(/\/+$/, '');

  const envVars = {
    production: isProduction,
    apiURL,
    ID_CLIENTE_GOOGLE: process.env.ID_CLIENTE_GOOGLE || '',
    SECRET_KEY_GOOGLE: process.env.SECRET_KEY_GOOGLE || '',
    stripePublicKey: process.env.STRIPE_PUBLIC_KEY || '',
    encryptionKey: process.env.ENCRYPTION_KEY || ''
  };

  const content = `export const environment = ${JSON.stringify(envVars, null, 2)};`;

  const fileName = isProduction ? 'environment.prod.ts' : 'environment.ts';
  const filePath = path.join(envDir, fileName);

  fs.writeFileSync(filePath, content, { encoding: 'utf8' });

  console.log(`✅ ${fileName} gerado com sucesso em ${filePath}`);
}

// Gerar ambos os environments
generateEnvironment(false);
generateEnvironment(true);
