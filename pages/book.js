import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import dynamic from 'next/dynamic';

// Dynamically import the map component (disables SSR)
const MapWithNoSSR = dynamic(
  () => import('@react-google-maps/api').then((mod) => {
    return function MapComponent(props) {
      return (
        <mod.GoogleMap
          mapContainerStyle={{ width: '100%', height: '400px' }}
          {...props}
        />
      );
    };
  }),
  { ssr: false }
);

export default function BookRide() {
  const [user] = useAuthState(auth);
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
      {/* LoadScript must be inside dynamic import */}
      {process.browser && (
        <MapWithNoSSR
          center={{ lat: 33.8938, lng: 35.5018 }} // Default to Beirut
          zoom={13}
          onClick={(e) => setPickup({ 
            lat: e.latLng.lat(), 
            lng: e.latLng.lng() 
          })}
        >
          {pickup && (
            <Marker position={pickup} />
          )}
        </MapWithNoSSR>
      )}
      
      <button onClick={handleBookRide}>
        {pickup ? 'Confirm Pickup' : 'Select Pickup Location'}
      </button>
    </div>
  );
}

// Marker must also be dynamically imported
const Marker = dynamic(
  () => import('@react-google-maps/api').then((mod) => mod.Marker),
  { ssr: false }
);
