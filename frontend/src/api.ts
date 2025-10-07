import axios from 'axios'
import type {Idea,VoteStatus} from '@types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Таймаут запроса')
    }
    if (!error.response) {
      throw new Error('Нет соединения с сервером')
    }
    throw error
  }
)

export const votingAPI = {
  getIdeas: async (): Promise<Idea[]> => {
    const response = await api.get('/ideas')
    if (!response.data.success) {
      throw new Error(response.data.error)
    }
    return response.data.data
  },

  voteForIdea: async (ideaId: number): Promise<{ message: string; remainingVotes: number }> => {
    const response = await api.post('/vote', { ideaId })
    if (!response.data.success) {
      throw new Error(response.data.error)
    }
    return response.data
  },

  getVoteStatus: async (): Promise<VoteStatus> => {
    const response = await api.get('/vote-status')
    if (!response.data.success) {
      throw new Error(response.data.error)
    }
    return response.data.data
  }
}
