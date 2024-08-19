import React, { useEffect, useState } from 'react'
import Pusher from 'pusher-js'
import './App.css'
import NotificationButton from './NotificationButton'
import GetNotifications from './GetNotifications'
import CreateListingButton from './CreateListingButton'

const App = () => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const pusher = new Pusher('71bd9119a09ce218beaf', {
      cluster: 'us3',
    })

    const channel = pusher.subscribe('pusher_notifs')
    
    channel.bind('button-notification', (data) => {
      setNotifications((prev) => [data, ...prev])
      setUnreadCount((prev) => prev + 1)
      console.log('Button Notification received:', data)
    })

    channel.bind('expired-listing', (data) => {
      setNotifications((prev) => [data, ...prev])
      setUnreadCount((prev) => prev + 1)
      console.log('Listing Notification received:', data)
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [])

  const markAsRead = () => {
    setUnreadCount(0)
  }

  // Function to trigger notification with listings
  const triggerActiveListings = async () => {
    console.log('Listing has been Activated')
    try {
      const response = await fetch('http://localhost:5000/api/expired-listing', {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      console.log('Notification with listings sent successfully')
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }

  const triggerDraftTimeout = async (listingId) => {
    try {
      const response = await fetch('http://localhost:5000/api/draft-timeout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listingId }), // Send the listingId in the request body
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('Draft timeout notification sent successfully');
    } catch (error) {
      console.error('Error sending draft timeout notification:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <NotificationButton unreadCount={unreadCount} markAsRead={markAsRead} />
        <GetNotifications notifications={notifications} />
        <CreateListingButton onListingActivated={triggerActiveListings} onDraftTimeout={triggerDraftTimeout}/>
      </header>
    </div>
  )
}

export default App
