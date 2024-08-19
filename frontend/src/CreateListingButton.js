import React, { useState, useEffect } from 'react'

const CreateListingButton = ({ onListingActivated, onDraftTimeout }) => {
  const [draftListings, setDraftListings] = useState([])
  const [activeListings, setActiveListings] = useState([])

  const createListing = () => {
    const newListing = {
      id: draftListings.length + 1,
      createdAt: null, // Listing is in draft, so no creation date yet
      draftStartTime: new Date(), // Track when the listing was created as a draft
    }

    setDraftListings((prevDrafts) => [...prevDrafts, newListing])
  }

  const activateListing = (listingId) => {
    const listingToActivate = draftListings.find((listing) => listing.id === listingId)
    if (listingToActivate) {
      listingToActivate.createdAt = new Date() // Set the creation date to now
      setActiveListings((prevActive) => [...prevActive, listingToActivate])
      setDraftListings((prevDrafts) => prevDrafts.filter((listing) => listing.id !== listingId))

      setTimeout(() => {
        onListingActivated() // Trigger the notification after 10 seconds
      }, 10000)
    }
  }

  const activateOldestListing = () => {
    if (draftListings.length > 0) {
      const oldestListing = draftListings[0] // Since listings are added sequentially, the first one should be the oldest
      activateListing(oldestListing.id)
    } else {
      console.log("No draft listings available to activate.")
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setDraftListings((prevDraftListings) => {
        return prevDraftListings.map((listing) => {
          if (
            listing.draftStartTime &&
            !listing.notified && // Check if notification hasn't been sent yet
            now - new Date(listing.draftStartTime) > 5000
          ) {
            onDraftTimeout(listing.id) // Notify that a draft has been longer than 5 seconds
            listing.notified = true // Mark this listing as notified
          }
          return listing
        })
      })
    }, 1000)
  
    return () => clearInterval(interval) // Clear the interval when the component is unmounted
  }, [onDraftTimeout])
  

  return (
    <div>
      <button onClick={createListing}>
        Create Listing
      </button>
      <button onClick={activateOldestListing}>
        Activate Oldest Listing
      </button>
      <h3>Draft Listings</h3>
      <ul>
        {draftListings.map((listing) => (
          <li key={listing.id}>
            Listing #{listing.id} 
            <button onClick={() => activateListing(listing.id)}>Activate</button>
          </li>
        ))}
      </ul>
      <h3>Active Listings</h3>
      <ul>
        {activeListings.map((listing) => (
          <li key={listing.id}>Listing #{listing.id} (Active)</li>
        ))}
      </ul>
    </div>
  )
}

export default CreateListingButton
