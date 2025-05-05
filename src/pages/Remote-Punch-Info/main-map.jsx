import {
  GoogleMap,
  Marker,
  Polyline,
  CircleF,
  InfoWindow,
  DirectionsRenderer, //add
} from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import axios from "axios";

const MainMap = ({ punchData, isLoaded, geofencingCircleData, taskData }) => {
  console.log("taskData in mainMap", taskData);

  const [waypoints, setWaypoints] = useState([]);
  const [acceptedByLocations, setAcceptedByLocations] = useState([]);
  console.log("acceptedByLocations", acceptedByLocations);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [directions, setDirections] = useState(null); //add

  useEffect(() => {
    if (punchData && punchData.data && punchData.data.length > 0) {
      const newWaypoints = punchData.data.map((punch) => ({
        lat: parseFloat(punch.lat),
        lng: parseFloat(punch.lng),
      }));
      setWaypoints(newWaypoints);
    } else {
      setWaypoints([]);
    }
  }, [punchData]);
  ////************* */
  // Fetch shortest route using Google Maps Directions API
  useEffect(() => {
    if (punchData?.missPunchRequest && punchData?.data?.length > 1) {
      const waypoints = punchData.data.slice(1, -1).map((punch) => ({
        location: { lat: punch.lat, lng: punch.lng },
        stopover: true,
      }));

      const origin = punchData.data[0];
      const destination = punchData.data[punchData.data.length - 1];

      if (window.google && window.google.maps) {
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
          {
            origin: { lat: origin.lat, lng: origin.lng },
            destination: { lat: destination.lat, lng: destination.lng },
            waypoints: waypoints,
            travelMode: window.google.maps.TravelMode.DRIVING,
            optimizeWaypoints: true, // 🚀 Auto optimize shortest route
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              setDirections(result);
            } else {
              console.error("Error fetching directions:", status);
            }
          }
        );
      }
    }
  }, [punchData]);

  // Calculate total distance from shortest route
  useEffect(() => {
    if (directions) {
      let totalDistance = 0;
      const legs = directions.routes[0].legs;
      legs.forEach((leg) => {
        totalDistance += leg.distance.value / 1000; // Convert meters to KM
      });
      setTotalDistance(totalDistance.toFixed(2));
    }
  }, [directions]);

  // Function to fetch the location name using Google Maps Geocoding API
  const getLocationName = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
      );
      if (response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      } else {
        return "Unknown location";
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
      return "Unknown location";
    }
  };

  useEffect(() => {
    if (taskData && taskData.length > 0) {
      const locations = taskData.flatMap((task) =>
        task.taskName.flatMap((taskName) =>
          taskName.acceptedBy.map(async (entry) => {
            const locationName = await getLocationName(
              entry.location.lat,
              entry.location.long
            );
            return {
              lat: entry.location.lat,
              lng: entry.location.long,
              comments: entry.comments,
              locationName: locationName,
              taskName: taskName.taskName, // Add Task Name
              status: entry.status, // Add Status
            };
          })
        )
      );

      // Resolve all location promises
      Promise.all(locations).then((resolvedLocations) => {
        setAcceptedByLocations(resolvedLocations);
      });
    } else {
      setAcceptedByLocations([]);
    }
  }, [taskData]);

  // Function to calculate Haversine distance
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (angle) => (angle * Math.PI) / 180;

    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  // Calculate total Polyline distance
  useEffect(() => {
    if (waypoints.length > 1) {
      let distance = 0;

      for (let i = 0; i < waypoints.length - 1; i++) {
        distance += haversineDistance(
          waypoints[i].lat,
          waypoints[i].lng,
          waypoints[i + 1].lat,
          waypoints[i + 1].lng
        );
      }

      setTotalDistance(distance.toFixed(2));
    }
  }, [waypoints]);

  // Custom InfoWindow component
  const CustomInfoWindow = ({ location }) => (
    <div
      style={{
        width: "500px",
        maxHeight: "150px",
        overflowY: "auto",
        padding: "10px",
      }}
    >
      <p>
        <strong style={{ fontSize: "16px", fontWeight: "600" }}>
          Task Name:
        </strong>{" "}
        {location.taskName || "N/A"}
      </p>
      <p>
        <strong style={{ fontSize: "16px", fontWeight: "600" }}>Status:</strong>{" "}
        {location.status || "N/A"}
      </p>
      <p>
        <strong style={{ fontSize: "16px", fontWeight: "600" }}>
          Comments:
        </strong>{" "}
        {location.comments || "No comments"}
      </p>
      <p>
        <strong style={{ fontSize: "16px", fontWeight: "600" }}>
          Location:
        </strong>{" "}
        {location.locationName || "Unknown location"}
      </p>
    </div>
  );

  return (
    <div>
      <div>Total Distance: {totalDistance} km</div>
      <GoogleMap
        key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        mapContainerStyle={{
          width: "100%",
          height: "91.8vh",
        }}
        center={{
          lat: waypoints[0]?.lat,
          lng: waypoints[0]?.lng,
        }}
        zoom={18}
      >
        {isLoaded && (
          <>
            {punchData?.missPunchRequest
              ? // Show shortest route only when missPunchRequest is true
                directions && (
                  <DirectionsRenderer
                    directions={directions}
                    options={{
                      polylineOptions: {
                        strokeColor: "blue",
                        strokeWeight: 4,
                      },
                    }}
                  />
                )
              : // Otherwise, show normal waypoints-based Polyline
                waypoints.length > 0 && (
                  <>
                    <Marker
                      position={{
                        lat: waypoints[0]?.lat,
                        lng: waypoints[0]?.lng,
                      }}
                      label={"Source"}
                    />
                    <Polyline
                      path={waypoints}
                      options={{
                        strokeColor: "green",
                        strokeWeight: 4,
                      }}
                    />
                    <Marker
                      position={{
                        lat: waypoints[waypoints.length - 1]?.lat,
                        lng: waypoints[waypoints.length - 1]?.lng,
                      }}
                      label={"End Position"}
                    />
                  </>
                )}

            {/* Accepted Locations Markers */}
            {acceptedByLocations.map((location, index) => (
              <Marker
                key={index}
                position={{
                  lat: location?.lat,
                  lng: location?.lng,
                }}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
                }}
                label={"Accepted"}
                onMouseOver={() => setSelectedLocation(location)}
              >
                {selectedLocation &&
                  selectedLocation.lat === location.lat &&
                  selectedLocation.lng === location.lng && (
                    <InfoWindow
                      position={{
                        lat: location?.lat,
                        lng: location?.lng,
                      }}
                      onCloseClick={() => setSelectedLocation(null)}
                    >
                      <CustomInfoWindow location={location} />
                    </InfoWindow>
                  )}
              </Marker>
            ))}

            {/* Geofencing Circle */}
            {geofencingCircleData && (
              <CircleF
                center={{
                  lat: geofencingCircleData?.center?.coordinates[0],
                  lng: geofencingCircleData?.center?.coordinates[1],
                }}
                radius={geofencingCircleData?.radius}
                options={{
                  strokeColor: "#0033ff",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: "#0033ff",
                  fillOpacity: 0.35,
                }}
              />
            )}
          </>
        )}
      </GoogleMap>
    </div>
  );
};

export default MainMap;

// import { GoogleMap, Marker, Polyline, CircleF, InfoWindow, DirectionsRenderer } from "@react-google-maps/api";
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const MainMap = ({ punchData, isLoaded, geofencingCircleData, taskData }) => {
//   const [waypoints, setWaypoints] = useState([]);
//   const [snappedWaypoints, setSnappedWaypoints] = useState([]);
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [totalDistance, setTotalDistance] = useState(0);

//   useEffect(() => {
//     if (punchData?.data?.length > 0) {
//       const newWaypoints = punchData.data.map((punch) => ({
//         lat: parseFloat(punch.lat),
//         lng: parseFloat(punch.lng),
//       }));
//       setWaypoints(newWaypoints);
//     } else {
//       setWaypoints([]);
//     }
//   }, [punchData]);

//   // Function to call Snap to Roads API in chunks of 100
//   const snapToRoads = async (coordinates) => {
//     const chunkSize = 100;
//     let snappedPoints = [];
//     for (let i = 0; i < coordinates.length; i += chunkSize) {
//       const chunk = coordinates.slice(i, i + chunkSize);
//       const path = chunk.map(({ lat, lng }) => `${lat},${lng}`).join("|");
//       try {
//         const response = await axios.get(
//           `https://roads.googleapis.com/v1/snapToRoads`,
//           {
//             params: {
//               path,
//               interpolate: true,
//               key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
//             },
//           }
//         );
//         snappedPoints = [...snappedPoints, ...response.data.snappedPoints.map(p => ({
//           lat: p.location.latitude,
//           lng: p.location.longitude,
//         }))];
//       } catch (error) {
//         console.error("Snap to Roads API error:", error);
//       }
//     }
//     setSnappedWaypoints(snappedPoints);
//   };

//   useEffect(() => {
//     if (waypoints.length > 0) {
//       snapToRoads(waypoints);
//     }
//   }, [waypoints]);

//   return (
//     <div>
//       <div>Total Distance: {totalDistance} km</div>
//       <GoogleMap
//         key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
//         mapContainerStyle={{ width: "100%", height: "91.8vh" }}
//         center={waypoints[0] || { lat: 0, lng: 0 }}
//         zoom={18}
//       >
//         {isLoaded && (
//           <>
//             {/* Start Marker */}
//             {waypoints.length > 0 && (
//               <Marker position={waypoints[0]} label={"Source"} />
//             )}
//             {/* End Marker */}
//             {waypoints.length > 1 && (
//               <Marker
//                 position={waypoints[waypoints.length - 1]}
//                 label={"End Position"}
//               />
//             )}
//             {/* Snapped Route Polyline */}
//             {snappedWaypoints.length > 0 && (
//               <Polyline
//                 path={snappedWaypoints}
//                 options={{
//                   strokeColor: "blue",
//                   strokeWeight: 4,
//                 }}
//               />
//             )}
//             {/* Geofencing Circle */}
//             {geofencingCircleData && (
//               <CircleF
//                 center={{
//                   lat: geofencingCircleData?.center?.coordinates[0],
//                   lng: geofencingCircleData?.center?.coordinates[1],
//                 }}
//                 radius={geofencingCircleData?.radius}
//                 options={{
//                   strokeColor: "#0033ff",
//                   strokeOpacity: 0.8,
//                   strokeWeight: 2,
//                   fillColor: "#0033ff",
//                   fillOpacity: 0.35,
//                 }}
//               />
//             )}
//           </>
//         )}
//       </GoogleMap>
//     </div>
//   );
// };

// export default MainMap;
