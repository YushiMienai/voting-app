import {db} from '@database'
import {VoteResult, VoteStatus} from '@types'

export class VotingService {
  async getIdeas() {
    const result = await db.query(`
      SELECT id, title, description, vote_count, created_at 
      FROM ideas 
      ORDER BY vote_count DESC, created_at ASC
    `)
    return result.rows
  }

  async vote(ideaId: number, ipAddress: string): Promise<VoteResult> {
    const client = await db.connect()

    try {
      await client.query('BEGIN')

      const ideaCheck = await client.query('SELECT id FROM ideas WHERE id = $1', [ideaId])
      if (ideaCheck.rows.length === 0) {
        await client.query('ROLLBACK')
        return {
          success: false,
          error: 'Идея не найдена'
        }
      }

      const voteCheck = await client.query(
        'SELECT id FROM votes WHERE idea_id = $1 AND ip_address = $2',
        [ideaId, ipAddress]
      )
      if (voteCheck.rows.length > 0) {
        await client.query('ROLLBACK')
        return {
          success: false,
          error: 'Вы уже проголосовали за эту идею'
        }
      }

      const voteCount = await client.query(
        'SELECT COUNT(*) as count FROM votes WHERE ip_address = $1',
        [ipAddress]
      )
      const totalVotes = parseInt(voteCount.rows[0].count)
      if (totalVotes >= 10) {
        await client.query('ROLLBACK')
        return {
          success: false,
          error: 'Превышен лимит голосования (максимум 10 голосов от одного IP)'
        }
      }

      await client.query(
        'INSERT INTO votes (idea_id, ip_address) VALUES ($1, $2)',
        [ideaId, ipAddress]
      )

      await client.query(
        'UPDATE ideas SET vote_count = vote_count + 1 WHERE id = $1',
        [ideaId]
      )

      await client.query('COMMIT')

      return {
        success: true,
        message: 'Голос успешно засчитан',
        remainingVotes: 10 - (totalVotes + 1)
      }

    } catch (error) {
      await client.query('ROLLBACK')
      console.error('Ошибка голосования:', error)
      throw new Error('Не удалось проголосовать')
    } finally {
      client.release()
    }
  }

  async getVoteStatus(ipAddress: string): Promise<VoteStatus> {
    const voteCount = await db.query(
      'SELECT COUNT(*) as count FROM votes WHERE ip_address = $1',
      [ipAddress]
    )

    const votedIdeas = await db.query(
      'SELECT idea_id FROM votes WHERE ip_address = $1',
      [ipAddress]
    )

    const totalVotes = parseInt(voteCount.rows[0].count)
    const votedIdeaIds = votedIdeas.rows.map(row => row.idea_id)

    return {
      totalVotes,
      remainingVotes: Math.max(0, 10 - totalVotes),
      votedIdeaIds,
      ipAddress
    }
  }
}
