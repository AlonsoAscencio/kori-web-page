const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../src/environments');
const targetPath = path.join(targetDir, 'env.ts');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const requiredEnvVars = [
  'NG_APP_FIREBASE_API_KEY',
  'NG_APP_FIREBASE_AUTH_DOMAIN',
  'NG_APP_FIREBASE_PROJECT_ID',
  'NG_APP_FIREBASE_STORAGE_BUCKET',
  'NG_APP_FIREBASE_MESSAGING_SENDER_ID',
  'NG_APP_FIREBASE_APP_ID',
];

const missing = requiredEnvVars.filter((key) => !process.env[key]);

if (missing.length) {
  throw new Error(`Missing environment variables: ${missing.join(', ')}`);
}

const envFileContent = `
export const environment = {
  production: true,
  firebase: {
    apiKey: '${process.env.NG_APP_FIREBASE_API_KEY}',
    authDomain: '${process.env.NG_APP_FIREBASE_AUTH_DOMAIN}',
    projectId: '${process.env.NG_APP_FIREBASE_PROJECT_ID}',
    storageBucket: '${process.env.NG_APP_FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${process.env.NG_APP_FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${process.env.NG_APP_FIREBASE_APP_ID}',
    measurementId: '${process.env.NG_APP_FIREBASE_MEASUREMENT_ID || ''}',
  },
};
`;

fs.writeFileSync(targetPath, envFileContent);
console.log('env.ts created');
