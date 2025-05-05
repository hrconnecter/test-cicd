import { Button, CircularProgress } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";
import FaceDetectionLoader from "./FaceDetectionLoader";
import useSelfieFaceDetect from "./useSelfieFaceDetect";
import useHook from "../../../hooks/UserProfile/useHook";
import axios from "axios";
import useGetUser from "../../../hooks/Token/useUser";
import UserProfile from "../../../hooks/UserData/useUser";

const PhotoCaptureForm = ({ setOpen }) => {
    const { media, setStart, geoFencingArea, setPunchObjectId } = useSelfieStore();
    const photoRef = useRef();
    const videoRef = useRef();
    const { UserInformation } = useHook();
    const profileImage = UserInformation?.user_logo_url;

    const [imageCaptured, setImageCaptured] = useState(false);
    const [profileImageBlob, setProfileImageBlob] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [videoReady, setVideoReady] = useState(false);
    const [startLoading, setStartLoading] = useState(false);
    const [isFaceMatched, setIsFaceMatched] = useState(false);

    const { authToken } = useGetUser();
    const { useGetCurrentRole } = UserProfile();
    const role = useGetCurrentRole();
    console.log(isUploading, role);
    const [hasFetched, setHasFetched] = useState(false);

    const downloadImage = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
            const blob = await response.blob();
            if (!(blob instanceof Blob)) throw new Error("Downloaded file is not a Blob");
            setProfileImageBlob(blob);
        } catch (error) {
            console.error("Error downloading image:", error);
        }
    };
    

    useEffect(() => {
        if (profileImage && !hasFetched) {
            if (profileImage.startsWith("http")) {
                downloadImage(profileImage);
                setHasFetched(true);
            } else {
                console.warn("Invalid profileImage URL:", profileImage);
            }
        }
    }, [profileImage, hasFetched]);

    const { loading, setLoading, isFaceDetectionLoading, employeeOrgId } = useSelfieFaceDetect();

    useEffect(() => {
        let video = videoRef.current;
        if (video && media) {
            video.srcObject = media;
        }
    }, [media]);

    const takePicture = async () => {
        setLoading(true);
        setImageCaptured(true);

        const width = 640;
        const height = 480;
        const photo = photoRef.current;
        const video = videoRef.current;

        photo.width = width;
        photo.height = height;
        const ctx = photo.getContext("2d");
        ctx.drawImage(video, 0, 0, photo.width, photo.height);

        const dataUrl = photo.toDataURL("image/png");
        const imgBlob = await (await fetch(dataUrl)).blob();


        if (employeeOrgId?.employee?.faceRecognition) {
            // Proceed with face comparison
            await compareFaces(imgBlob, profileImageBlob);
        } else {
            setIsFaceMatched(true);
        }


        // if (employeeOrgId?.employee?.faceRecognition) {
        //     await compareFaces(imgBlob, profileImageBlob);
        // } else {
        //     setIsFaceMatched(true);
        // }

        setLoading(false);
    };

    const compareFaces = async (capturedImage, profileImage) => {
        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("uploadedImage", capturedImage, "captured-image.png");
            formData.append("profileImage", profileImage, "profile-image.png");

            const response = await axios.post(
                `${process.env.REACT_APP_API}/route/face-model/compare`,
                formData,
                {
                    headers: {
                        Authorization: authToken,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("Face comparison result:", response.data);

            if (response.data.match) {
                console.log("Face match successful!");
                setIsFaceMatched(true);
            } else {
                console.warn("Face match failed!");
                setIsFaceMatched(false);
            }
        } catch (error) {
            console.error("Error comparing faces:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const startGeofencing = async () => {
        setStartLoading(true);
        try {
            setStart(true);
            await createPunchEntry();
            setOpen(false);
            const tracks = media.getTracks();
            tracks.forEach((track) => {
                track.stop(); // Stop each track in the media stream
            });
        } catch (error) {
            console.error("Error starting geofencing:", error);
        } finally {
            setStartLoading(false);
        }
    };

    const createPunchEntry = async () => {
        try {
            const punchResponse = await axios.post(
                `${process.env.REACT_APP_API}/route/punch`,
                { geoFencingArea },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: authToken,
                    },
                }
            );
            setPunchObjectId(punchResponse?.data?.punchObjectId);
            console.log("Punch object created:", punchResponse.data?.punchObjectId);
        } catch (error) {
            console.error("Error creating punch object:", error);
        }
    };

    const clearImage = () => {
        const photo = photoRef.current;
        const ctx = photo.getContext("2d");
        ctx.clearRect(0, 0, photo.width, photo.height);
        setImageCaptured(false);
        setIsFaceMatched(false);
    };

    return (
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4 w-full" noValidate>
            <div className="relative">
                <video
                    ref={videoRef}
                    autoPlay
                    onLoadedData={() => setVideoReady(true)}
                    className={`container rounded-lg ${imageCaptured && "!hidden"}`}
                    id="client-video"
                ></video>
                {employeeOrgId?.employee?.faceRecognition ? <FaceDetectionLoader isLoading={isFaceDetectionLoading || loading} /> : null}
                <canvas
                    ref={photoRef}
                    className={`container rounded-lg ${!imageCaptured && "!hidden"}`}
                    id="client-photo"
                />
            </div>

            {videoReady && (
                <div className="flex w-full justify-between">
                    <Button onClick={clearImage} variant="contained" color="error" disabled={!imageCaptured}>
                        Clear
                    </Button>
                    <Button onClick={takePicture} variant="contained" disabled={imageCaptured}>
                        Capture
                    </Button>
                    <Button
                        onClick={startGeofencing}
                        variant="contained"
                        color="success"
                        disabled={
                            !imageCaptured || !isFaceMatched // Default logic for other roles
                        }
                    // disabled={!imageCaptured || !isFaceMatched}
                    >
                        {startLoading ? <CircularProgress size={20} style={{ color: "white" }} /> : "Start"}
                    </Button>
                </div>
            )}
        </form>
    );
};

export default PhotoCaptureForm;
