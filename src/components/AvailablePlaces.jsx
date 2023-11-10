import Places from './Places.jsx';
import { useState, useEffect } from 'react';
import Error from './Error.jsx';
import {sortPlacesByDistance} from '../loc.js';
import {fetchAvailablePlaces} from '../http.js';
export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isFetching, setFetching] = useState(false);
  const [error, setError] = useState();
  useEffect(()=>{
    async function fetchPlaces() {
      setFetching(true);
      try {
        const places = await fetchAvailablePlaces();
        navigator.geolocation.getCurrentPosition((position)=>{
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
          setFetching(false);
        })
      } catch (error) {
        setError({
          message: error.message || 'Could not fetch places, please try again later..'})
          setFetching(false);
      }
    }
   fetchPlaces();   
  },[])

      if(error) {
        return <Error title='An error occurred' message={error.message}/>
      }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText='Fetching place data...'
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
