// Deployment Configuration
export const DEPLOYMENT_CONFIG = {
  // Frontend Configuration
  frontend: {
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    nodeVersion: '18.x',
    installCommand: 'npm ci'
  },
  
  // Backend Configuration  
  backend: {
    startCommand: 'node server.js',
    nodeVersion: '18.x',
    installCommand: 'npm ci'
  },
  
  // Environment Variables for Production
  environment: {
    NODE_ENV: 'production',
    PORT: '3001',
    CORS_ORIGIN: 'https://your-domain.com',
    SMTP_HOST: 'smtp.gmail.com',
    SMTP_PORT: '587',
    SMTP_SECURE: 'false',
    SMTP_USER: 'cavebeatindia@gmail.com',
    // SMTP_PASS will be set in hosting platform
  }
}
