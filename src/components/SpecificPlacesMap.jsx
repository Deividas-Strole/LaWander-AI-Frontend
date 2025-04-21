// code with containers for travel descriptions
// // src/components/SpecificPlacesMap.jsx
// import React, { useState, useEffect } from "react";
// import {
//   GoogleMap,
//   useLoadScript,
//   Marker,
//   InfoWindow,
// } from "@react-google-maps/api";
// import "./SpecificPlaces.css";

// const SpecificPlacesMap = ({ travelData }) => {
//   const [placeCoordinates, setPlaceCoordinates] = useState([]);
//   const [center, setCenter] = useState({ lat: 0, lng: 0 });
//   const [selectedPlace, setSelectedPlace] = useState(null);

//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
//     libraries: ["places"],
//   });

//   useEffect(() => {
//     if (isLoaded && Array.isArray(travelData.generatedItinerary)) {
//       const geocoder = new window.google.maps.Geocoder();
//       const placePromises = travelData.generatedItinerary.map((place) => {
//         const placeName = typeof place === "string" ? place : place.name;
//         return new Promise((resolve) => {
//           geocoder.geocode({ address: placeName }, (results, status) => {
//             if (status === "OK" && results[0]) {
//               const location = results[0].geometry.location;
//               resolve({
//                 name: placeName,
//                 description: place.description || "",
//                 lat: location.lat(),
//                 lng: location.lng(),
//               });
//             } else {
//               console.warn(`Geocode failed for ${placeName}: ${status}`);
//               resolve(null);
//             }
//           });
//         });
//       });

//       Promise.all(placePromises).then((results) => {
//         const validResults = results.filter((res) => res !== null);
//         if (validResults.length > 0) {
//           setPlaceCoordinates(validResults);
//           setCenter({
//             lat: validResults[0].lat,
//             lng: validResults[0].lng,
//           });
//         }
//       });
//     }
//   }, [isLoaded, travelData]);

//   if (loadError) return <div className="error">Error loading maps</div>;
//   if (!isLoaded) return <div className="loading">Loading maps...</div>;

//   return (
//     <div className="specific-places-container">
//       {/* LEFT PANEL */}
//       <div className="left-panel">
//         <div className="travel-data">
//           <h2>Travel Plan Details</h2>
//           <div className="data-item">
//             <strong>Current City:</strong> {travelData.currentCity}
//           </div>
//           <div className="data-item">
//             <strong>Destination:</strong> {travelData.destination}
//           </div>
//           <div className="data-item">
//             <strong>Days:</strong> {travelData.days}
//           </div>
//           {Array.isArray(travelData.generatedItinerary) && (
//             <div className="data-item">
//               <strong>Generated Itinerary:</strong>
//               <div className="itinerary-list">
//                 {travelData.generatedItinerary.map((item, index) => {
//                   let name, description;
//                   if (typeof item === "string") {
//                     name = item;
//                     description = "";
//                   } else if (typeof item === "object") {
//                     name = item.name;
//                     description = item.description;
//                   }

//                   return (
//                     <div key={index} className="itinerary-item">
//                       <h3>{name}</h3>
//                       {description && (
//                         <p>
//                           {description.split("\n").map((line, i) => (
//                             <span key={i}>
//                               {line}
//                               <br />
//                             </span>
//                           ))}
//                         </p>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* RIGHT PANEL (MAP) */}
//       <div className="right-panel">
//         <GoogleMap
//           mapContainerStyle={{ width: "100%", height: "100%" }}
//           zoom={8}
//           center={center}
//           onClick={() => setSelectedPlace(null)}
//         >
//           {placeCoordinates.map((place, index) => (
//             <Marker
//               key={index}
//               position={{ lat: place.lat, lng: place.lng }}
//               onClick={() => setSelectedPlace(place)}
//             />
//           ))}

//           {selectedPlace && (
//             <InfoWindow
//               position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
//               onCloseClick={() => setSelectedPlace(null)}
//             >
//               <div>
//                 <strong>{selectedPlace.name}</strong>
//               </div>
//             </InfoWindow>
//           )}
//         </GoogleMap>
//       </div>
//     </div>
//   );
// };

// export default SpecificPlacesMap;

// old working version
import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import "./SpecificPlaces.css";
const SpecificPlacesMap = ({ travelData }) => {
  const [placeCoordinates, setPlaceCoordinates] = useState([]);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [selectedPlace, setSelectedPlace] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    if (isLoaded && Array.isArray(travelData.generatedItinerary)) {
      const geocoder = new window.google.maps.Geocoder();
      const placePromises = travelData.generatedItinerary.map((place) => {
        return new Promise((resolve) => {
          geocoder.geocode({ address: place }, (results, status) => {
            if (status === "OK" && results[0]) {
              const location = results[0].geometry.location;
              resolve({
                name: place,
                lat: location.lat(),
                lng: location.lng(),
              });
            } else {
              console.warn(`Geocode failed for ${place}: ${status}`);
              resolve(null);
            }
          });
        });
      });

      Promise.all(placePromises).then((results) => {
        const validResults = results.filter((res) => res !== null);
        if (validResults.length > 0) {
          setPlaceCoordinates(validResults);
          setCenter({
            lat: validResults[0].lat,
            lng: validResults[0].lng,
          });
        }
      });
    }
  }, [isLoaded, travelData]);

  if (loadError) return <div className="error">Error loading maps</div>;
  if (!isLoaded) return <div className="loading">Loading maps...</div>;

  return (
    <div
      className="specific-places-container"
      style={{ display: "flex", gap: "2rem", width: "100%" }}
    >
      {/* LEFT PANEL */}

      <div style={{ flex: 1, minWidth: "300px" }}>
        <div className="travel-data">
          <h2>Travel Plan Details</h2>
          <div className="data-item">
            <strong>Current City:</strong> {travelData.currentCity}
          </div>
          <div className="data-item">
            <strong>Destination:</strong> {travelData.destination}
          </div>
          <div className="data-item">
            <strong>Days:</strong> {travelData.days}
          </div>
          {Array.isArray(travelData.generatedItinerary) && (
            <div className="data-item">
              <strong>Generated Itinerary:</strong>
              <ul>
                {(() => {
                  const items = [];
                  for (
                    let i = 0;
                    i < travelData.generatedItinerary.length;
                    i++
                  ) {
                    items.push(
                      <li key={i}>{travelData.generatedItinerary[i]}</li>
                    );
                  }
                  return items;
                })()}
              </ul>
            </div>
          )}
        </div>

        {/* <div style={{ marginTop: "20px" }}>
          <h2>Specific Places</h2>
          <ul>
            {placeCoordinates.map((place, index) => (
              <li key={index}>
                <strong>{place.name}</strong>
                <p>
                  Lat: {place.lat.toFixed(4)}, Lng: {place.lng.toFixed(4)}
                </p>
              </li>
            ))}
          </ul>
        </div> */}
      </div>

      {/* RIGHT PANEL (MAP) */}
      <div style={{ flex: 1, minWidth: "300px", height: "100vh" }}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          zoom={8}
          center={center}
          onClick={() => setSelectedPlace(null)}
        >
          {placeCoordinates.map((place, index) => (
            <Marker
              key={index}
              position={{ lat: place.lat, lng: place.lng }}
              onClick={() => setSelectedPlace(place)}
            />
          ))}

          {selectedPlace && (
            <InfoWindow
              position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
              onCloseClick={() => setSelectedPlace(null)}
            >
              <div>
                <strong>{selectedPlace.name}</strong>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default SpecificPlacesMap;
