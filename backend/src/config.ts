export const config = {
  db: {
    user: process.env.DB_USER || 'user',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'name',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT || '5432')
  },
  server: {
    port: parseInt(process.env.SERVER_PORT || '8000'),
    host: process.env.SERVER_HOST || '0.0.0.0'
  }
}