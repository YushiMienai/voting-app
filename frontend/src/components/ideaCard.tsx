import React from 'react'
import type {Idea} from '@types'

interface IdeaCardProps {
  idea: Idea
  onVote: (ideaId: number) => void
  hasVoted: boolean
  canVote: boolean
}

export const IdeaCard: React.FC<IdeaCardProps> = ({idea, onVote, hasVoted, canVote}) => {
  const handleVote = () => {
    if (canVote && !hasVoted) {
      onVote(idea.id)
    }
  }

  const getButtonText = () => {
    if (hasVoted) return 'Проголосовано'
    if (!canVote) return 'Лимит исчерпан'
    return 'Проголосовать'
  }

  const getButtonClass = () => {
    if (hasVoted) return 'vote-button-voted'
    if (!canVote) return 'vote-button-disabled'
    return 'vote-button-default'
  }

  return (
    <div className='idea-card'>
      <div className='idea-header'>
        <h3 className='idea-title'>{idea.title}</h3>
        <div className='vote-count'>{idea.vote_count}</div>
      </div>
      <p className='idea-description'>{idea.description}</p>
      <button
        onClick={handleVote}
        disabled={hasVoted || !canVote}
        className={`vote-button ${getButtonClass()}`}
      >
        {getButtonText()}
      </button>
    </div>
  )
}