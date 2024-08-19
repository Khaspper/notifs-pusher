import React, { useEffect, useState } from 'react'
import Pusher from 'pusher-js'

function GetNotifications({ notifications }) {
  //! Tracks all notifications, both from Pusher and props
  
  const [allNotifications, setAllNotifications] = useState([]) 
  
  //! Controls the visibility of the dropdown for notifications
  const [isDropdownVisible, setIsDropdownVisible] = useState(false) 

  useEffect(() => {
    const pusher = new Pusher('71bd9119a09ce218beaf', {
      cluster: 'us3',
    })

    const channel = pusher.subscribe('pusher_notifs')
    //! Ignore the bottom code
    //? You can add more events here so you listen to specific events
    //? If you comment out the code below then when you click on the button you won't get a notification
    //? So I was thinking maybe we can like have only 1 channel? and have multiple events???? like a list 
    //? of events and add the specific events to the user if the user statisfies a specific criteria or sumn idk
    //! The problem with the "solution" above is that everyone else will get the same notification even if it isn't meant for them

    //TODO: DO THIS!!!!! 
    //! Edit: 
    //? Maybe have the event be the users' id???? yk what I mean? and have another event be called "general-notification"
    //? so Sunny and other people can notify the everyone on nexus????!!!!
    //! The above "solution" is better so we can target specific users and we can also target everyone if we need to
    //! But obviously we need the userID or maybe just use their email address? idk

    channel.bind('button-notification', (data) => {
      setAllNotifications((prevNotifications) => [
        ...prevNotifications,
        data,
      ])
      //! Adds the button-notification
    })

    channel.bind('expired-listing', (data) => {
      setAllNotifications((prevNotifications) => [
        ...prevNotifications,
        data,
      ])
      //! Same thing for expired listings
    })

    channel.bind('draft-timeout', (data) => {
      setAllNotifications((prevNotifications) => [
        ...prevNotifications,
        data,
      ])
      //! Handles draft-timeout events
    })

    channel.bind('general-notification', (data) => {
      setAllNotifications((prevNotifications) => [
        ...prevNotifications,
        data,
      ])
      //! This could be used for broadcasting general notifications to everyone
    })

    return () => {
      channel.unbind_all() 
      //! Cleans up all event bindings when the component unmounts
      channel.unsubscribe() 
      //! Unsubscribes from the Pusher channel to avoid memory leaks
      pusher.disconnect() 
      //! Disconnects Pusher entirely;
    }
  }, [])

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      setAllNotifications((prevNotifications) => [
        ...prevNotifications,
        ...notifications.filter(
          (notification) =>
            !prevNotifications.some(
              (prevNotification) => prevNotification.message === notification.message
            )
        ),
      ])
      //! Avoiding duplicates
    }
  }, [notifications])

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible) 
    //! Toggles the visibility of the notifications dropdown
  }

  const markAllAsRead = () => {
    setAllNotifications((prevNotifications) =>
      prevNotifications.map(notification => ({ ...notification, status: 'read' }))
    )
    //! Marks all notifications as read by setting their status
  }

  const getUnreadNotifications = () => {
    return allNotifications.filter(notification => !notification.status)
    //! Filters out the unread notifications to display them separately
  }

  const getReadNotifications = () => {
    return allNotifications.filter(notification => notification.status === 'read')
    //! Filters out the read notifications so they show up in a different section
  }

  return (
    <div>
      <h1>Real-Time Notifications</h1>
        {/* Toggles between showing and hiding the notifications */}
      <button onClick={toggleDropdown}>
        {isDropdownVisible ? 'Hide Notifications' : 'Show Notifications'}
      </button>
      {isDropdownVisible && (
        <div className="dropdown">
          <button onClick={markAllAsRead}>Read All</button>
          {/* Button to mark all notifications as read */}
          <div>
            <h2>Unread</h2>
            {getUnreadNotifications().slice().reverse().map((notification, index) => (
              <div key={index}>
                {notification.message}
                {/* Displays each unread notification, reversing the order so newest is on top */}
              </div>
            ))}
          </div>
          <div>
            <h2>Read</h2>
            {getReadNotifications().slice().reverse().map((notification, index) => (
              <div key={index}>
                {notification.message}
                {/* Displays each read notification, also reversed for consistency */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default GetNotifications
