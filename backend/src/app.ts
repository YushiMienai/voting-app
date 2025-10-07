import Fastify from 'fastify'
import cors from '@fastify/cors'
import {config} from '@config'
import {db} from '@database'
import {votingRoutes} from '@voting'

const fastify = Fastify({
  logger: true,
  trustProxy: true
})

export const createApp = async () => {
  await fastify.register(cors, {origin: 'http://localhost:3000', credentials: true})

  await fastify.register(votingRoutes, { prefix: '/api' })

  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })

  return fastify
}

export const startServer = async () => {
  try {
    await db.init()

    const app = await createApp()

    await app.listen({
      port: config.server.port,
      host: config.server.host
    })

    console.log(`Сервер запущен по адресу http://localhost:${config.server.port}`)
  } catch (error) {
    console.error('Ошибка запуска сервера:', error)
    process.exit(1)
  }
}
