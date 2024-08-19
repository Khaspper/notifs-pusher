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
    //! This code runs only once when the component mounts
  
    const pusher = new Pusher('71bd9119a09ce218beaf', {
      cluster: 'us3', //? This connects to the Pusher cluster
    })
  
    const channel = pusher.subscribe('pusher_notifs') 
    //? We’re subscribing to a channel named 'pusher_notifs' to listen for events
  
    //? Listening for a 'button-notification' event
    channel.bind('button-notification', (data) => {
      //! Adds the new notification to the top of the list
      setNotifications((prev) => [data, ...prev]) 

      //! This increases the unread count by 1 every time we get a new notification
      setUnreadCount((prev) => prev + 1)

      console.log('Button Notification received:', data) 
    })
  
    //! Same as above, just for a different event
    channel.bind('expired-listing', (data) => {
      setNotifications((prev) => [data, ...prev])
      setUnreadCount((prev) => prev + 1)
      console.log('Listing Notification received:', data)
    })
  
    return () => {
      channel.unbind_all() 
      //! This removes all event bindings when the component unmounts to prevent memory leaks
      channel.unsubscribe() 
      //! Unsubscribes from the channel to clean up when we're done
      //TODO: Do we need more cleanup or is this enough?
    }
  }, []) 

  const triggerActiveListings = async () => {
    console.log('Listing has been Activated') 
    //! This just logs when we trigger a listing activation
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

  const markAsRead = () => {
    setUnreadCount(0)
  }
  
  const triggerDraftTimeout = async (listingId) => {
    try {
      const response = await fetch('http://localhost:5000/api/draft-timeout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          //! We're sending the data as JSON, so we need this header
          //! This also shows the user which listing has been in draft
        },
        body: JSON.stringify({ listingId }), 
        //! We send the listingId in the request body
      })
      if (!response.ok) {
        throw new Error('Network response was not ok') 
      }
      console.log('Draft timeout notification sent successfully') 
    } catch (error) {
      console.error('Error sending draft timeout notification:', error) 
      //? Should we retry or just show an error?
    }
  }

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
