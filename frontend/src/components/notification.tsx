import React from 'react'
import {NotificationMessageType} from '@types'

interface NotificationType {
  message: string
  type?: NotificationMessageType
}

export const Notification: React.FC<NotificationType> = ({message, type = NotificationMessageType.SUCCESS}) => {

  return (
    <div className={`notification notification-${type}`}>
      {message}
    </div>
  )
}