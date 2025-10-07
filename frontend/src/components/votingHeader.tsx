import React from 'react'
import {v4 as uuidv4} from 'uuid'
import type {VoteStatus} from '@types'

interface VotingHeaderProps {
  voteStatus: VoteStatus | null
}

export const VotingHeader: React.FC<VotingHeaderProps> = ({voteStatus}) => {

  const columns = [
    {label: 'IP-адрес', value: voteStatus?.ipAddress},
    {label: 'Использовано голосов', value: voteStatus?.totalVotes},
    {label: 'Осталось голосов', value: `${voteStatus?.remainingVotes} / 10`},
  ]

  return (
    voteStatus ? (
      <div className='vote-status'>
        <div className='status-grid'>
          {columns.map(({label, value}) =>
            <div
              key={uuidv4()}
              className='status-item'
            >
              <p className='status-label'>{label}</p>
              <p className='status-value'>{value}</p>
            </div>)}
        </div>
      </div>
    ) : ''
  )
}