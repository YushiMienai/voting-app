import {startServer} from 'app'

// Загружаем environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
  require('tsconfig-paths/register')
}

// Обработка graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down gracefully...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down gracefully...')
  process.exit(0)
})

// Запускаем сервер
startServer().catch(error => {
  console.error('Ошибка запуска сервера:', error)
  process.exit(1)
})