const express = require('express')
const Pusher = require('pusher')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const pusher = new Pusher({
  appId: '1833066',
  key: '71bd9119a09ce218beaf',
  secret: '4b4637053318139f3521',
  cluster: 'us3',
  useTLS: true
})

// General function to get listings older than 10 seconds
async function getOldListings() {
  const tenSecondsAgo = new Date(Date.now() - 10000)

  // Mock data for testing: Pretend these listings were created at different times
  const listings = [
    { id: 1, status: 'active', createdAt: new Date(Date.now() - 15000) }, // 15 seconds ago
  ]

  // Filter listings that are older than 10 seconds
  const oldListings = listings.filter(listing => listing.createdAt < tenSecondsAgo)

  return oldListings.length // Return the count of listings
}

// Route for sending a custom notification based on listings
app.post('/api/expired-listing', async (req, res) => {
  try {
    const listingCount = await getOldListings()
    const notification = {
      message: `You have ${listingCount} listing(s) active for more than 10 seconds`,
    }

    pusher.trigger('pusher_notifs', 'expired-listing', notification)
      .then(() => {
        res.status(200).send('Notification sent')
      })
      .catch(error => {
        console.error(error)
        res.status(500).send('Error sending notification')
      })

  } catch (error) {
    console.error(error)
    res.status(500).send('Error retrieving listings')
  }
})

app.post('/api/draft-timeout', async (req, res) => {
  try {
    const { listingId } = req.body;
    const notification = {
      message: `Draft listing #${listingId} has been in draft for over 5 seconds and is now active.`,
    };

    // Trigger a notification for the draft timeout
    pusher.trigger('pusher_notifs', 'draft-timeout', notification)
      .then(() => {
        res.status(200).send('Draft timeout notification sent');
      })
      .catch(error => {
        console.error('Error sending draft timeout notification:', error);
        res.status(500).send('Error sending draft timeout notification');
      });

  } catch (error) {
    console.error('Error handling draft timeout:', error);
    res.status(500).send('Error handling draft timeout');
  }
});



app.post('/api/send-notification', (req, res) => {
  const notification = {
    message: 'The button has been clicked!',
  }

  pusher.trigger('pusher_notifs', 'button-notification', notification)
    .then(() => {
      res.status(200).send('Notification sent')
    })
    .catch(error => {
      console.error(error)
      res.status(500).send('Error sending notification')
    })
})

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
