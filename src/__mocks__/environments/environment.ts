// Mock do módulo environment que usa variáveis de ambiente ou valores padrão
// Este arquivo substitui o environment.ts durante os testes do Jest
export const environment = {
  production: process.env.NODE_ENV === 'production',
  apiURL: process.env.API_URL || process.env['API_URL'] || 'http://localhost:3020/api',
  ID_CLIENTE_GOOGLE: process.env.ID_CLIENTE_GOOGLE || process.env['ID_CLIENTE_GOOGLE'] || '',
  SECRET_KEY_GOOGLE: process.env.SECRET_KEY_GOOGLE || process.env['SECRET_KEY_GOOGLE'] || '',
  stripePublicKey: process.env.STRIPE_PUBLIC_KEY || process.env['STRIPE_PUBLIC_KEY'] || '',
  encryptionKey: process.env.ENCRYPTION_KEY || process.env['ENCRYPTION_KEY'] || '',
};
