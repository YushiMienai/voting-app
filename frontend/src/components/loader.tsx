import React from 'react'

export const Loader = () => {

  return (
    <div className='loading-container'>
      <div className='text-center'>
        <div className='loading-spinner'></div>
        <p className='loading-text'>Загрузка...</p>
      </div>
    </div>
  )
}