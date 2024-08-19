import React from 'react'

const NotificationButton = () => {
  const sendNotification = async () => {
    console.log('Button has been pressed')
    try {
      const response = await fetch('http://localhost:5000/api/send-notification', {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }

  return (
    <button onClick={sendNotification}>Click me to get a notification</button>
  )
}

export default NotificationButton
