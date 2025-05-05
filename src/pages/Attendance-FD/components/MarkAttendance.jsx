import React, { useEffect, useRef } from "react";
import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";
import useLocationMutation from "./useLocationMutation";
import useGeoFencingCircle from "./useGeoFencingCircle";

export default function MarkAttendance() {
    // hooks
    const { setStartTime, setGeoFencingArea } = useSelfieStore();
    const { getUserImage } = useLocationMutation();
    const { employeeGeoArea } = useGeoFencingCircle();

    // Prevent useEffect from running repeatedly
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            getUserImage.mutate(); // Trigger user image capture
            setStartTime(); // Set start time
            setGeoFencingArea(true); // Set geofencing area
        }
    }, [getUserImage, setStartTime, setGeoFencingArea]);

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

    return (
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
            {/* <PhotoCaptureForm /> */}
            {/* <Fab
                color="success"
                variant="extended"
                className="!text-white"
            >
                <PlayArrow sx={{ mr: 1 }} className={`animate-pulse text-white`} />
                Mark Attendance
            </Fab> */}
        </div>
    );
}
