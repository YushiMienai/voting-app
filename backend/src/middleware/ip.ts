import {FastifyRequest} from 'fastify'

export const getClientIP = (request: FastifyRequest): string => {
  const forwarded = request.headers['x-forwarded-for']
  if (forwarded) {
    const firstIP = Array.isArray(forwarded) ? forwarded[0] : forwarded
    return firstIP.split(',')[0].trim()
  }
  return request.ip || 'unknown'
}