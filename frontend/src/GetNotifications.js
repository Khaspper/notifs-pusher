import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

function GetNotifications({ notifications }) {
  const [allNotifications, setAllNotifications] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    const pusher = new Pusher('71bd9119a09ce218beaf', {
      cluster: 'us3',
      encrypted: true,
      forceTLS: true,
    });

    const channel = pusher.subscribe('pusher_notifs');
    channel.bind('new-notification', (data) => {
      setAllNotifications((prevNotifications) => [
        ...prevNotifications,
        data,
      ]);
    });

    return () => {
      channel.unbind('new-notification');
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

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
      ]);
    }
  }, [notifications]);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const markAllAsRead = () => {
    setAllNotifications((prevNotifications) =>
      prevNotifications.map(notification => ({ ...notification, status: 'read' }))
    );
  };

  const getUnreadNotifications = () => {
    return allNotifications.filter(notification => !notification.status);
  };

  const getReadNotifications = () => {
    return allNotifications.filter(notification => notification.status === 'read');
  };

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
  );
}

export default GetNotifications;
