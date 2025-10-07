import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'
import {VotingService} from '@votingService'
import {getClientIP} from '@ip'

const votingService = new VotingService()

export const votingRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/ideas', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const ideas = await votingService.getIdeas()
      return { success: true, data: ideas }
    } catch (error) {
      console.error('Ошибка при загрузке идей:', error)
      reply.status(500).send({ success: false, error: 'Не удалось получить идеи' })
    }
  })

  fastify.post('/vote', async (request: FastifyRequest, reply: FastifyReply) => {
    const { ideaId } = request.body as { ideaId: number }
    const clientIP = getClientIP(request)

    try {
      const result = await votingService.vote(ideaId, clientIP)

      if (!result.success) {
        return reply.status(409).send(result)
      }

      reply.send(result)
    } catch (error) {
      console.error('Ошибка контроллера голосования:', error)
      reply.status(500).send({
        success: false,
        error: 'Внутренняя ошибка сервера'
      })
    }
  })

  fastify.get('/vote-status', async (request: FastifyRequest, reply: FastifyReply) => {
    const clientIP = getClientIP(request)

    try {
      const voteStatus = await votingService.getVoteStatus(clientIP)
      reply.send({ success: true, data: voteStatus })
    } catch (error) {
      console.error('Ошибка при получении статуса голосования:', error)
      reply.status(500).send({
        success: false,
        error: 'Не удалось получить статус голосования'
      })
    }
  })
}
