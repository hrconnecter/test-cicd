import React, { useEffect } from "react";
import { Chip } from "@mui/material";
import MapComponent from "./components/MapComponent";
import useLocationMutation from "./components/useLocationMutation";
import useSelfieStore from "../../hooks/QueryHook/Location/zustand-store";
import { useJsApiLoader } from "@react-google-maps/api";
import moment from "moment";
import StartGeoFencing from "./components/StartGeoFencing";
import PhotoCaptureCamera from "./components/PhotoCaptureCamera";
import BoxComponent from "../../components/BoxComponent/BoxComponent";

const EmployeeSideGeoFencing = () => {
    const { getUserLocation } = useLocationMutation();

    const { data, mutate } = getUserLocation;

    useEffect(() => {
        mutate();
    }, [mutate]);

    const { locationArray, startTime, endTime } = useSelfieStore();

    const { isLoaded } = useJsApiLoader({
        id: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,

        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    });

    return (
        <BoxComponent>
            <div className="flex  items-center justify-center h-screen">
                {!data ? (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "absolute",
                            top: 0, bottom: 0, left: 0, right: 0,
                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                            textAlign: "center",
                            padding: "10px",
                            fontSize: "16px",
                            wordWrap: "break-word",
                            whiteSpace: "normal",
                            zIndex: 10,

                        }}
                    >
                        <span
                            style={{
                                backgroundColor: "#ff9800",
                                padding: "5px 10px",
                                color: "white",
                                borderRadius: "10px"

                            }}
                        >
                            Please do not connect to any wi-fi till your location is fetching
                        </span>
                    </div>
                ) : (
                    <>
                        <MapComponent {...{ isLoaded, data, locationArray }} />
                        <div className="top-7  sm:right-10 absolute px-10 pt-20 flex flex-col items-end justify-center">

                            {startTime && (
                                <>
                                    <Chip
                                        label={`Start Time ${moment(startTime).format("hh:mm:ss")}`}
                                        className="!bg-white"
                                        variant="filled"
                                        sx={{ mb: "10px" }}
                                    />
                                    <Chip
                                        label={`Current Time ${endTime
                                            ? moment(endTime).format("hh:mm:ss")
                                            : moment().format("hh:mm:ss")
                                            }`}
                                        className="!bg-white"
                                        variant="filled"
                                        sx={{ mb: "10px" }}
                                    />
                                </>
                            )}

                        </div>
                        <StartGeoFencing />
                        <PhotoCaptureCamera />
                    </>
                )}

            </div>
        </BoxComponent>
    );
};

export default EmployeeSideGeoFencing;
