import {useState, useCallback} from 'react'
import type {Idea, VoteStatus} from '@types'
import {votingAPI} from '@api'

export const useVoting = () => {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [voteStatus, setVoteStatus] = useState<VoteStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)
      await Promise.all([
        votingAPI.getIdeas().then((data: Idea[]) => setIdeas(data)),
        votingAPI.getVoteStatus().then((data: VoteStatus) => setVoteStatus(data))
      ])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка при загрузке данных'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const voteForIdea = useCallback(async (ideaId: number): Promise<boolean> => {
    try {
      await votingAPI.voteForIdea(ideaId)
      await fetchData()
      return true
    } catch (err: any) {
      const message = err.response?.data?.error || 'Ошибка при голосовании'
      setError(message)
      return false
    }
  }, [fetchData])

  return {ideas, voteStatus, loading, error, fetchData, voteForIdea}
}
