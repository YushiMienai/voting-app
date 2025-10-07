export interface VoteResult {
  success: boolean
  message?: string
  remainingVotes?: number
  error?: string
}

export interface VoteStatus {
  totalVotes: number
  remainingVotes: number
  votedIdeaIds: number[]
  ipAddress: string
}

export interface Idea {
  id: number
  title: string
  description: string
  vote_count: number
  created_at: string
}

export interface VoteStatus {
  totalVotes: number
  remainingVotes: number
  votedIdeaIds: number[]
  ipAddress: string
}

export enum NotificationMessageType {
  SUCCESS = 'success',
  ERROR = 'error',
}
