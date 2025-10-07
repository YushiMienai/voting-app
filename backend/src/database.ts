import {Pool} from 'pg'
import {config} from '@config'

const pool = new Pool(config.db)

export const db = {
  query: (text: string, params?: any[]) => {
    if (params) {
      return pool.query(text, params)
    } else {
      return pool.query(text)
    }
  },
  connect: () => pool.connect(),

  async init() {
    const client = await this.connect()
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS ideas (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          vote_count INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      await client.query(`
        CREATE TABLE IF NOT EXISTS votes (
          id SERIAL PRIMARY KEY,
          idea_id INTEGER REFERENCES ideas(id) ON DELETE CASCADE,
          ip_address INET NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(idea_id, ip_address)
        )
      `)

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_votes_ip ON votes(ip_address)
      `)

      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_ideas_votes ON ideas(vote_count DESC)
      `)

      console.log('База данных инициализирована')
    } finally {
      client.release()
    }
  }
}
