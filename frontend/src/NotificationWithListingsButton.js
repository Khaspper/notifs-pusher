import React from 'react'

const NotificationWithListingsButton = () => {
  const triggerNotificationWithListings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/expired-listing', {
        method: 'POST',
      })
      console.log(response)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }

  return (
    <button onClick={triggerNotificationWithListings}>
      Trigger Notification with Listings
    </button>
  )
}

export default NotificationWithListingsButton
