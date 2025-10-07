import React, {useEffect, useState} from 'react'
import {useVoting} from '@hooks'
import {IdeaCard, VotingHeader, Loader, Notification} from '@components'
import {NotificationMessageType} from '@types'

const App = () => {
  const {ideas, voteStatus, loading, error, fetchData, voteForIdea} = useVoting()
  const [notification, setNotification] = useState('')

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleVote = async (ideaId: number) => {
    setNotification('')
    const success = await voteForIdea(ideaId)

    if (success) {
      setNotification('Голос успешно учтен!')
      setTimeout(() => setNotification(''), 3000)
    }
  }

  const hasUserVoted = (ideaId: number, votedIds?: number[]): boolean => {
    return votedIds ? votedIds.includes(ideaId) : false
  }

  return (
    <div className='app-container'>
      <div className='app-content'>
        <header className='app-header'>
          <h1 className='app-title'>Система голосования за идеи</h1>
          <p className='app-subtitle'>Выберите самые интересные идеи для развития продукта</p>
        </header>

        {error && (
          <Notification
            type={NotificationMessageType.ERROR}
            message={error}
          />
        )}
        {notification && (<Notification message={notification}/>)}
        {loading ?
          <Loader />
          :
          <>
            <VotingHeader voteStatus={voteStatus} />
            <div className='ideas-grid'>
              {ideas.map(idea => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  onVote={handleVote}
                  hasVoted={hasUserVoted(idea.id, voteStatus?.votedIdeaIds)}
                  canVote={(voteStatus?.remainingVotes || 0) > 0}
                />
              ))}
            </div>

            {ideas.length === 0 && !loading && (
              <div className='empty-state'>
                <p className='empty-text'>Нет доступных идей для голосования</p>
              </div>
            )}
          </>
        }
      </div>
    </div>
  )
}

export default App