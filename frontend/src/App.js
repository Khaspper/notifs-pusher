import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import './App.css';
import NotificationButton from './NotificationButton';
import GetNotifications from './GetNotifications';

const App = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const pusher = new Pusher('71bd9119a09ce218beaf', {
      cluster: 'us3',
    });

    const channel = pusher.subscribe('pusher_notifs');
    channel.bind('new-notification', (data) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);
      {console.log('hi')}
      {console.log(data)}
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const markAsRead = () => {
    setUnreadCount(0);
  };

  return (
    <div className="App">
      <header className="App-header">
        <NotificationButton />
        <GetNotifications notifications={notifications} />
      </header>
    </div>
  );
};

export default App;
