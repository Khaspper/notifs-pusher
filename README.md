# notifs-pusher
for backend i used <npm install express pusher body-parser cors>
for frontend i used <npm install pusher-js>
for server.js i cd to server and started it with <node server.js>
and in another terminal i did <npm start>

this is what my file system looked like
![image](https://github.com/user-attachments/assets/10de7702-6f85-458f-87de-5b7446a8a895)

Create a pusher account 
under "Channels" click get started
name the app "pusher_notifs" leave everything else untouched and press create app
on the left side clicj Debug Console (this is how you send notifications online)
for channel put "pusher_notifs"
for event put "new-notification"
for data put
{
"message": "put whatever in here"
}

MAKE SURE YOU DONT PUT A COMMA AFTER THE LAST VALUE IN THE JSON!!! IT WON'T SHOW UP

LIKE THIS (BAD EXAMPLE):
{
"message": "put whatever in here",
}
do it LIKE THIS (GOOD EXAMPLES):
{
"message": "put whatever in here"
}
or 
{
"another key": "whatever",
"another key": "whatever",
"another key": "whatever",
"message": "put whatever in here"
}

before pressing send event make sure you start your server and the site is up on your local host
