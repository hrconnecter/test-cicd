// import { CircleF, GoogleMap, PolylineF, OverlayView } from "@react-google-maps/api";
// import React, { useState, useEffect } from "react";
// import useGeoFencingCircle from "./useGeoFencingCircle";

// const MapComponent = ({ isLoaded, data, locationArray }) => {
//     const { employeeGeoArea } = useGeoFencingCircle();
//     const [currentLocation, setCurrentLocation] = useState(null);

//     useEffect(() => {
//         let watchId;
//         if (navigator.geolocation) {
//             // Watch user's location
//             watchId = navigator.geolocation.watchPosition(
//                 (position) => {
//                     setCurrentLocation({
//                         lat: position.coords.latitude,
//                         lng: position.coords.longitude,
//                     });
//                 },
//                 (error) => console.error("Error fetching location:", error),
//                 {
//                     enableHighAccuracy: true,
//                     maximumAge: 0,
//                     timeout: 10000,
//                 }
//             );
//         }

//         // Cleanup watcher when component unmounts
//         return () => {
//             if (watchId !== undefined) {
//                 navigator.geolocation.clearWatch(watchId);
//             }
//         };
//     }, []);

//     return isLoaded ? (
//         <GoogleMap
//             key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
//             mapContainerStyle={{
//                 width: "100%",
//                 height: "91.8vh",
//             }}
//             center={currentLocation || { lat: data?.latitude, lng: data?.longitude }}
//             zoom={18}
//             options={{
//                 mapTypeControl: false,
//                 zoomControl: true,
//                 streetViewControl: false,
//                 fullscreenControl: false,
//                 clickableIcons: true,
//                 myLocationEnabled: true,
//             }}
//         >
//             {/* Marker for the initial start position */}
//             {/* <MarkerF
//                 position={{ lat: data?.latitude, lng: data?.longitude }}
//                 label={"Start Position"}
//             /> */}

//             {/* Polyline for location array path */}
//             {locationArray?.length > 0 && (
//                 <PolylineF
//                     path={locationArray}
//                     options={{ strokeColor: "#7a3eff", strokeWeight: 5 }}
//                 />
//             )}

//             {/* Marker for the starting position in the path */}
//             {/* {locationArray?.length > 0 && (
//                 <MarkerF
//                     position={{
//                         lat: locationArray[0]?.latitude,
//                         lng: locationArray[0]?.longitude,
//                     }}
//                     label={"Starting Position"}
//                 />
//             )} */}

//             {/* Circles for geofencing areas */}
//             {employeeGeoArea?.area?.map((area) => (
//                 <CircleF
//                     key={`${area.center.coordinates[0]}-${area.center.coordinates[1]}`}
//                     center={{
//                         lat: area?.center?.coordinates[0],
//                         lng: area?.center?.coordinates[1],
//                     }}
//                     radius={area?.radius}
//                     options={{
//                         strokeColor: "#0033ff",
//                         strokeOpacity: 0.8,
//                         strokeWeight: 2,
//                         fillColor: "#0033ff",
//                         fillOpacity: 0.35,
//                     }}
//                 />
//             ))}

//             {/* Live location marker */}
//             {currentLocation && (
//                 <OverlayView
//                     position={currentLocation}
//                     mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
//                 >
//                     <div
//                         style={{
//                             width: "15px",
//                             height: "15px",
//                             backgroundColor: "#0000FF",
//                             borderRadius: "50%",
//                             boxShadow: "0 0 10px rgba(0, 0, 255, 0.5)",
//                             transform: "translate(-50%, -50%)",
//                         }}
//                     ></div>
//                 </OverlayView>
//             )}
//         </GoogleMap>
//     ) : (
//         <></>
//     );
// };

// export default MapComponent;


import { CircleF, GoogleMap, PolylineF, OverlayView } from "@react-google-maps/api";
import React, { useState, useEffect } from "react";
import useGeoFencingCircle from "./useGeoFencingCircle";
import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";

const MapComponent = ({ isLoaded, data }) => {
    const { employeeGeoArea } = useGeoFencingCircle();
    const [currentLocation, setCurrentLocation] = useState(null);
    const [coveredPath, setCoveredPath] = useState([]);
    const { setDistance, start } = useSelfieStore();

    // Haversine Formula for Distance Calculation
    const calculateDistance = (point1, point2) => {
        const toRadians = (degrees) => (degrees * Math.PI) / 180;
        const R = 6371; // Earth's radius in km

        const lat1 = toRadians(point1.lat);
        const lon1 = toRadians(point1.lng);
        const lat2 = toRadians(point2.lat);
        const lon2 = toRadians(point2.lng);

        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in km
    };

    // Track the user's location
    useEffect(() => {
        let watchId;
        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const newLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setCurrentLocation(newLocation);

                    // Update path and calculate distance
                    setCoveredPath((prevPath) => {
                        const updatedPath = [...prevPath, newLocation];
                        if (updatedPath.length > 1) {
                            const lastPoint = updatedPath[updatedPath.length - 2];
                            const newPoint = updatedPath[updatedPath.length - 1];
                            const distance = calculateDistance(lastPoint, newPoint);
                            setDistance((prevDistance) => prevDistance + distance);
                        }
                        return updatedPath;
                    });
                },
                (error) => console.error("Error fetching location:", error),
                {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 10000,
                }
            );
        } else {
            console.error("Geolocation not supported by this browser.");
            alert("Geolocation not supported by this browser.");
        }

        return () => {
            if (watchId !== undefined) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [setDistance]);

    // Check for geofencing breach
    useEffect(() => {
        if (currentLocation && employeeGeoArea?.area?.length > 0) {
            employeeGeoArea.area.forEach((area) => {
                const distance = calculateDistance(currentLocation, {
                    lat: area.center.coordinates[0],
                    lng: area.center.coordinates[1],
                });
                if (distance > area.radius) {
                    alert("You are outside the geofenced area!");
                }
            });
        }
    }, [currentLocation, employeeGeoArea]);

    return isLoaded ? (
        <GoogleMap
            key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            mapContainerStyle={{
                width: "100%",
                height: "91.8vh",
            }}
            center={
                currentLocation
                    ? { lat: currentLocation.lat, lng: currentLocation.lng }
                    : { lat: data?.latitude, lng: data?.longitude }
            }
            zoom={18}
            options={{
                mapTypeControl: false,
                zoomControl: true,
                streetViewControl: false,
                fullscreenControl: false,
                clickableIcons: true,
                myLocationEnabled: true,
            }}
        >
            {/* Polyline for location array path */}
            {start && coveredPath.length > 1 && (
                <PolylineF
                    path={coveredPath.filter(
                        (point) =>
                            Number.isFinite(point.lat) && Number.isFinite(point.lng)
                    )}
                    options={{ strokeColor: "#00FF00", strokeWeight: 5 }}
                />
            )}

            {/* Circles for geofencing areas */}
            {employeeGeoArea?.area?.map((area) => (
                <CircleF
                    key={`${area.center.coordinates[0]}-${area.center.coordinates[1]}`}
                    center={{
                        lat: area?.center?.coordinates[0],
                        lng: area?.center?.coordinates[1],
                    }}
                    radius={area?.radius}
                    options={{
                        strokeColor: "#0033ff",
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: "#0033ff",
                        fillOpacity: 0.35,
                    }}
                />
            ))}

            {/* Live location marker */}
            {currentLocation && (
                <OverlayView
                    position={currentLocation}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                    <div
                        style={{
                            width: "15px",
                            height: "15px",
                            backgroundColor: "#0000FF",
                            borderRadius: "50%",
                            boxShadow: "0 0 10px rgba(0, 0, 255, 0.5)",
                            transform: "translate(-50%, -50%)",
                        }}
                    ></div>
                </OverlayView>
            )}
        </GoogleMap>
    ) : (
        <></>
    );
};

export default MapComponent;
