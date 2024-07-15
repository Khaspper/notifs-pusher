
# notifs-pusher

For the backend, I used:
```
npm install express pusher body-parser cors
```

For the frontend, I used:
```
npm install pusher-js
```

To start the server, I navigated to the `server` directory and started it with:
```
node server.js
```

In another terminal, I started the frontend with:
```
npm start
```

This is what my file system looked like:
![image](https://github.com/user-attachments/assets/10de7702-6f85-458f-87de-5b7446a8a895)

Create a Pusher account. Under "Channels," click "Get Started." Name the app `pusher_notifs`, leave everything else untouched, and press "Create App."

On the left side, click "Debug Console" (this is how you send notifications online). For the channel, put:
```
pusher_notifs
```

For the event, put:
```
new-notification
```

For the data, put:
```
{
  "message": "put whatever in here"
}
```

**MAKE SURE YOU DON'T PUT A COMMA AFTER THE LAST VALUE IN THE JSON!!! IT WON'T SHOW UP**

**BAD EXAMPLE:**
```
{
  "message": "put whatever in here",
}
```

**GOOD EXAMPLES:**
```
{
  "message": "put whatever in here"
}
```

or

```
{
  "another key": "whatever",
  "another key": "whatever",
  "another key": "whatever",
  "message": "put whatever in here"
}
```

Before pressing "Send Event," make sure you start your server and the site is up on your localhost.
