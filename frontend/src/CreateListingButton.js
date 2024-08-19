import React, { useState, useEffect } from 'react'

const CreateListingButton = ({ onListingActivated, onDraftTimeout }) => {
  //! Tracks all listings that are still in draft status
  const [draftListings, setDraftListings] = useState([])

  //! Tracks listings that have been activated
  const [activeListings, setActiveListings] = useState([]) 

  const createListing = () => {
    const newListing = {
      //! Simple way to generate an ID
      id: draftListings.length + 1, 

      //! Since it’s a draft, we don’t set the creation date
      createdAt: null, 
      
      //! Capture the exact time when the draft was created
      draftStartTime: new Date(), 
    }

    //! Adds the new draft listing to our array of drafts
    setDraftListings((prevDrafts) => [...prevDrafts, newListing]) 
  }

  const activateListing = (listingId) => {
    const listingToActivate = draftListings.find((listing) => listing.id === listingId)
    //! This finds the listing in our drafts that matches the given ID
    if (listingToActivate) {
      listingToActivate.createdAt = new Date() 
      //! When we activate, we finally set the creation date
      //! Move the listing from drafts to active listings
      setActiveListings((prevActive) => [...prevActive, listingToActivate]) 
      
      //! Remove the listing from the drafts
      setDraftListings((prevDrafts) => prevDrafts.filter((listing) => listing.id !== listingId)) 

      setTimeout(() => {
        onListingActivated() 
        //! Trigger a notification 10 seconds after activation
      }, 10000)
      //? Customization of this timeout duration
    }
  }

  const activateOldestListing = () => {
    if (draftListings.length > 0) {
      const oldestListing = draftListings[0] 
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
            !listing.notified && 
            //! Only notify if we haven’t already done so
            now - new Date(listing.draftStartTime) > 5000 
            //! Check if the draft has been around for more than 5 seconds
          ) {
            onDraftTimeout(listing.id) 
            //! Trigger a notification if the draft has been in the drafts too long
            listing.notified = true 
            //! Mark this listing as notified so we don’t repeat notifications
          }
          return listing
        })
      })
    }, 1000) 
    //! Check every second if any drafts have timed out

    return () => clearInterval(interval) 
    //! Clean up the interval timer when the component unmounts
  }, [onDraftTimeout])
  

  return (
    <div>
        {/* // Creates a new draft listing when clicked */}
      <button onClick={createListing}>
        Create Listing
      </button>
      <button onClick={activateOldestListing}>
        Activate Oldest Listing
        {/* // Activates the oldest draft listing when clicked */}
      </button>
      <h3>Draft Listings</h3>
      <ul>
        {draftListings.map((listing) => (
          <li key={listing.id}>
            Listing #{listing.id} 
            {/* // Display the listing ID */}
            <button onClick={() => activateListing(listing.id)}>Activate</button>
            {/* // Button to activate this specific listing */}
          </li>
        ))}
      </ul>
      <h3>Active Listings</h3>
      <ul>
        {activeListings.map((listing) => (
          <li key={listing.id}>Listing #{listing.id} (Active)</li>
          //! Show the active listings with their IDs
        ))}
      </ul>
    </div>
  )
}

export default CreateListingButton
