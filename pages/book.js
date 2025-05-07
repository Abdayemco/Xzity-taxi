import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";

export default function BookRide() {
  const [pickup, setPickup] = useState(null);

  const handleBookRide = async () => {
    try {
      await setDoc(doc(db, "rides", Date.now().toString()), {
        pickup,
        status: "requested",
        timestamp: new Date(),
      });
      alert("Ride booked successfully!");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div>
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_KEY">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "400px" }}
          center={{ lat: 37.7749, lng: -122.4194 }} // Default to San Francisco
          zoom={13}
          onClick={(e) => setPickup({
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
          })}
        >
          {pickup && <Marker position={pickup} />}
        </GoogleMap>
      </LoadScript>

      <button 
        onClick={handleBookRide}
        style={{ padding: "10px", margin: "10px" }}
      >
        Confirm Ride
      </button>
    </div>
  );
}