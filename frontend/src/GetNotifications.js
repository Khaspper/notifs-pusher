import React, { useEffect, useState } from 'react'
import Pusher from 'pusher-js'

function GetNotifications({ notifications }) {
  const [allNotifications, setAllNotifications] = useState([])
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)

  useEffect(() => {
    const pusher = new Pusher('71bd9119a09ce218beaf', {
      cluster: 'us3',
      encrypted: true,
      forceTLS: true,
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
    })

    channel.bind('expired-listing', (data) => {
      setAllNotifications((prevNotifications) => [
        ...prevNotifications,
        data,
      ])
    })

    channel.bind('draft-timeout', (data) => {
      setAllNotifications((prevNotifications) => [
        ...prevNotifications,
        data,
      ])
    })

    channel.bind('general-notification', (data) => {
      setAllNotifications((prevNotifications) => [
        ...prevNotifications,
        data,
      ])
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
      pusher.disconnect()
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
    }
  }, [notifications])

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible)
  }

  const markAllAsRead = () => {
    setAllNotifications((prevNotifications) =>
      prevNotifications.map(notification => ({ ...notification, status: 'read' }))
    )
  }

  const getUnreadNotifications = () => {
    return allNotifications.filter(notification => !notification.status)
  }

  const getReadNotifications = () => {
    return allNotifications.filter(notification => notification.status === 'read')
  }

  return (
    <div>
      <h1>Real-Time Notifications</h1>
      <button onClick={toggleDropdown}>
        {isDropdownVisible ? 'Hide Notifications' : 'Show Notifications'}
      </button>
      {isDropdownVisible && (
        <div className="dropdown">
          <button onClick={markAllAsRead}>Read All</button>
          <div>
            <h2>Unread</h2>
            {getUnreadNotifications().slice().reverse().map((notification, index) => (
              <div key={index}>
                {notification.message}
              </div>
            ))}
          </div>
          <div>
            <h2>Read</h2>
            {getReadNotifications().slice().reverse().map((notification, index) => (
              <div key={index}>
                {notification.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default GetNotifications
