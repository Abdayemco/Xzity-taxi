import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useAuth } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

export default function BookRide() {
  const [user] = useAuth(auth);
  const [pickup, setPickup] = useState(null);

  const handleBookRide = async () => {
    if (!user) return alert('Please login first!');
    
    await setDoc(doc(db, 'rides', Date.now().toString()), {
      pickup,
      userId: user.uid,
      status: 'requested',
      timestamp: new Date()
    });
    alert('Ride booked!');
  };

  return (
    <div>
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={{ lat: 33.8938, lng: 35.5018 }} // Default to Beirut
          zoom={13}
          onClick={(e) => setPickup({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
        >
          {pickup && <Marker position={pickup} />}
        </GoogleMap>
      </LoadScript>
      <button onClick={handleBookRide}>Confirm Pickup</button>
    </div>
  );
            }
