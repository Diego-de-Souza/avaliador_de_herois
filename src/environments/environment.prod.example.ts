export const environment = {
  production: true,
  apiURL: process.env['API_URL'] || '',
  ID_CLIENTE_GOOGLE: process.env['ID_CLIENTE_GOOGLE'] || '',
  SECRET_KEY_GOOGLE: process.env['SECRET_KEY_GOOGLE'] || '',
  stripePublicKey: process.env['STRIPE_PUBLIC_KEY'] || '',
  encryptionKey: process.env['ENCRYPTION_KEY'] || ''
};