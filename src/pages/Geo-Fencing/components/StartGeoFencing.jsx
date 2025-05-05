// import { PlayArrow } from "@mui/icons-material";
// import { Button, Dialog, DialogContent, Fab } from "@mui/material";
// import * as React from "react";
// import { useState, useEffect } from "react";
// import useLocationMutation from "./useLocationMutation";
// import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";
// import useGeoFencingCircle from "./useGeoFencingCircle";
// import StopGeoFencing from "./StopGeoFencing";

// export default function StartGeoFencing() {
//     //hooks
//     const { start, setStart, setStartTime, setGeoFencingArea } = useSelfieStore();
//     const { getUserImage } = useLocationMutation();
//     console.log("getUserImage", getUserImage);

//     const { employeeGeoArea } = useGeoFencingCircle();

//     //state
//     const [open, setOpen] = useState(false);
//     const [isInGeoFence, setIsInGeoFence] = useState(false);
//     const geoFencing = "geoFencing";

//     useEffect(() => {
//         const checkGeoFence = () => {
//             if (!employeeGeoArea || !employeeGeoArea?.area || !navigator?.geolocation) return;

//             navigator.geolocation.getCurrentPosition((position) => {
//                 const { latitude, longitude } = position.coords;
//                 const isWithinGeoFence = employeeGeoArea.area.some((area) => {
//                     const distance = calculateDistance(
//                         latitude,
//                         longitude,
//                         area.center.coordinates[0],
//                         area.center.coordinates[1]
//                     );
//                     return distance <= area.radius;
//                 });

//                 setIsInGeoFence(isWithinGeoFence);
//             });
//         };

//         checkGeoFence();
//     }, [employeeGeoArea]);

//     // Function to calculate the distance between two points (Haversine formula)
//     const calculateDistance = (lat1, lon1, lat2, lon2) => {
//         const toRad = (value) => (value * Math.PI) / 180;
//         const R = 6371e3; // Radius of the Earth in meters
//         const dLat = toRad(lat2 - lat1);
//         const dLon = toRad(lon2 - lon1);
//         const a =
//             Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//             Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
//             Math.sin(dLon / 2) * Math.sin(dLon / 2);
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//         const distance = R * c; // Distance in meters
//         return distance;
//     };

//     const handleOperate = () => {
//         setOpen(false);
//         getUserImage.mutate();
//         setStartTime();
//         setGeoFencingArea(true);
//     };

//     return (
//         <>
//             {!start ? (
//                 <Fab
//                     disabled={!isInGeoFence}
//                     onClick={() => setOpen(true)}
//                     color="primary"
//                     variant="extended"
//                     className="!absolute bottom-12 right-12 !text-white"
//                 >
//                     <PlayArrow sx={{ mr: 1 }} className={`animate-pulse text-white`} />
//                     Start
//                 </Fab>
//             ) : (
//                 <StopGeoFencing {...{ setStart, geoFencing, isInGeoFence }} />
//             )}

//             <Dialog open={open} onClose={() => setOpen(false)}>
//                 <DialogContent>
//                     <div className="w-full text-center text-red-500">
//                         <h1 className="font-semibold text-3xl">Confirm Action</h1>
//                     </div>
//                     <h1 className="text-lg mt-2">
//                         Are you sure you want to start geo access?
//                     </h1>
//                     <div className="flex gap-4 mt-4">
//                         <Button onClick={handleOperate} size="small" variant="contained">
//                             Yes
//                         </Button>
//                         <Button
//                             onClick={() => setOpen(false)}
//                             variant="contained"
//                             color="error"
//                             size="small"
//                         >
//                             No
//                         </Button>
//                     </div>
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// }import { PlayArrow } from "@mui/icons-material";

import {
    Button,
    Dialog,
    DialogContent,
    Fab,
} from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import useLocationMutation from "./useLocationMutation";
import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";
import useGeoFencingCircle from "./useGeoFencingCircle";
import StopGeoFencing from "./StopGeoFencing";
import UserProfile from "../../../hooks/UserData/useUser";
import { PlayArrow } from "@mui/icons-material"; // Ensure this line is present
import StudentVerification from "./Fullskapestudent";


export default function StartGeoFencing() {
    // hooks
    const { start, setStart, setStartTime, setGeoFencingArea } = useSelfieStore();
    const { getUserImage } = useLocationMutation();
    const { employeeGeoArea } = useGeoFencingCircle();

    // state
    const [open, setOpen] = useState(false);
    const [isInGeoFence, setIsInGeoFence] = useState(false);
    const [zoneId, setZoneId] = useState(null);
    const { getCurrentUser } = UserProfile();
    const user = getCurrentUser();
    const organizationId = user && user.organizationId;

    const [selectedStudent, setSelectedStudent] = useState(null);
    const geoFencing = "geoFencing";


    // Function to calculate the distance between two points (Haversine formula)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371e3; // Radius of the Earth in meters
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Distance in meters
    };

    // Function to fetch Zone ID
    const fetchZoneId = useCallback(async () => {
        try {
            const token = localStorage.getItem("Authorization") || ""; // Replace with your token fetching logic
            const response = await fetch(
                `${process.env.REACT_APP_API}/route/fullskape/organization/${organizationId}`, // Replace organizationId
                { headers: { Authorization: token } }
            );

            if (response.ok) {
                const responseData = await response.json();
                const zone = responseData?.data[0]; // Adjust based on the actual API structure
                if (zone) {
                    setZoneId(zone._id);
                    console.log("Zone ID fetched successfully:", zone._id);
                } else {
                    console.error("No zones found in the API response.");
                }
            } else {
                console.error("Failed to fetch zone ID. HTTP Status:", response.status);
            }
        } catch (error) {
            console.error("Error fetching zone ID:", error);
        }
    }, [organizationId]);


    // Function to check GeoFence
    useEffect(() => {

        if (!employeeGeoArea || !employeeGeoArea?.area || !navigator?.geolocation) return;

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                // Check if the current location is within any geofence area
                const isWithinGeoFence = employeeGeoArea.area.some((area) => {
                    const distance = calculateDistance(
                        latitude,
                        longitude,
                        area.center.coordinates[0],
                        area.center.coordinates[1]
                    );
                    return distance <= area.radius;
                });

                // Update state with the result
                setIsInGeoFence(isWithinGeoFence);
                console.log("isWithinGeoFence", isWithinGeoFence);
            },
            (error) => {
                console.error("Error fetching live location:", error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000,
            }
        );

        // Cleanup watcher when component unmounts
        return () => {
            if (watchId !== undefined) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [employeeGeoArea]);


    useEffect(() => {
        fetchZoneId();
    }, [fetchZoneId]);

    // Function to handle GeoFencing Start
    const handleOperate = () => {
        setOpen(false);
        getUserImage.mutate();
        setStartTime();
        setGeoFencingArea(true);
    };

    return (
        <>

            {!start ? (
                <Fab
                    disabled={!isInGeoFence}
                    onClick={() => setOpen(true)}
                    color="success"
                    variant="extended"
                    className="!absolute bottom-12 right-12 !text-white"
                >
                    <PlayArrow sx={{ mr: 1 }} className={`animate-pulse text-white`} />
                    Start
                </Fab>
            ) : (
                <StopGeoFencing {...{ setStart, geoFencing, isInGeoFence }} />
            )}

            {/* Dialog for starting GeoFencing */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
                <DialogContent
                    style={{
                        padding: '20px',
                    }}
                >
                    <div className="w-full text-center text-red-500">
                        <h1 className="font-semibold text-3xl mb-2">Confirm Action</h1>
                    </div>
                    <h1 className="text-lg mt-2 text-center">
                        Are you sure you want to start geo access?
                    </h1>
                    <div className="flex justify-center gap-4 mt-6">
                        <Button
                            onClick={handleOperate}
                            size="small"
                            variant="contained"
                            color="primary"
                            style={{
                                padding: '8px',
                            }}
                        >
                            Yes
                        </Button>
                        <Button
                            onClick={() => setOpen(false)}
                            variant="contained"
                            color="error"
                            size="small"
                            style={{
                                padding: '8px',
                            }}
                        >
                            No
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            


            {/* Render the StudentVerification component when a student is selected */}
            {selectedStudent && (
                <StudentVerification
                    student={selectedStudent}
                    activity={selectedStudent.activity}
                    zoneId={zoneId}
                    onClose={() => setSelectedStudent(null)} // Reset selectedStudent on close
                />
            )}
        </>
    );
}
