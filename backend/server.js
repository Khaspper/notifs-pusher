const express = require('express');
const Pusher = require('pusher');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const pusher = new Pusher({
  appId: '1833066',
  key: '71bd9119a09ce218beaf',
  secret: '4b4637053318139f3521',
  cluster: 'us3',
  useTLS: true
});

app.post('/api/send-notification', (req, res) => {
  const notification = {
    message: 'The button has been clicked!',
  };

  pusher.trigger('pusher_notifs', 'new-notification', notification)
    .then(() => {
      res.status(200).send('Notification sent');
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error sending notification');
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
