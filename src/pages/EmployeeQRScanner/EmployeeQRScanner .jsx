import { useState, useContext } from "react";
import { QrReader } from "react-qr-reader";
import UserProfile from "../../hooks/UserData/useUser";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";
import { Typography } from "@mui/material";
import { TestContext } from "../../State/Function/Main";

const EmployeeQRScanner = () => {
    const { getCurrentUser } = UserProfile();
    const user = getCurrentUser();
    const employeeOrgId = user?.organizationId;
    const { handleAlert } = useContext(TestContext);
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];

    const [scannedOrgId, setScannedOrgId] = useState("");
    console.log(scannedOrgId);
    const [error, setError] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [hasCheckedIn, setHasCheckedIn] = useState(false);

    // Fetch attendance status
    useQuery(
        ["attendanceStatus", user?._id],
        async () => {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API}/route/attendance/status/${user?._id}`,
                { headers: { Authorization: authToken } }
            );
            setHasCheckedIn(!!data?.isCheckedIn);
            return data;
        },
        { enabled: !!user?._id }
    );

    // Punch-In Mutation
    const punchInMutation = useMutation({
        mutationFn: ({ start, end }) =>
            axios.post(
                `${process.env.REACT_APP_API}/route/attendance/punch-in`,
                {
                    employeeId: user?._id,
                    start,
                    end,
                },
                { headers: { Authorization: authToken } }
            ),
        onSuccess: () => {
            setHasCheckedIn(true);
            handleAlert(true, "success", "Punch in successful!");
        },
        onError: (error) => {
            console.error(error);
            handleAlert(true, "error", error.response?.data?.message);
            setError(error.response?.data?.message || "Error during punch-in!");
        },
    });

    // Punch-Out Mutation
    const punchOutMutation = useMutation({
        mutationFn: () =>
            axios.put(
                `${process.env.REACT_APP_API}/route/attendance/punch-out`,
                { employeeId: user?._id },
                { headers: { Authorization: authToken } }
            ),
        onSuccess: () => {
            setHasCheckedIn(false);
            handleAlert(true, "success", "Punch out successful!");
        },
        onError: (error) => {
            console.error(error);
            handleAlert(true, "error", error.response?.data?.message);
            setError(error.response?.data?.message || "Error during punch-out!");
        },
    });

    // Handle scan result
    const handleScan = (result) => {
        if (result && result?.text) {
            setScannedOrgId(result.text);
            if (result.text === employeeOrgId) {
                setIsVerified(true);
                setError("");
            } else {
                setError("Scanned organization ID does not match your organization!");
                setIsVerified(false);
            }
        } else {
            console.log("No QR code detected or empty data");
        }
    };

    // Handle scanning error
    const handleError = (err) => {
        console.error("QR scan error:", err);
        setError("An error occurred while scanning. Please try again.");
    };

    const handlePunchIn = () => {
        const currentDate = new Date().toISOString();
        punchInMutation.mutate({
            start: currentDate,
            end: currentDate,
        });
    };

    return (
        <div style={{ textAlign: "center", margin: "20px" }}>
            <Typography variant="h5">Scan QR Code For Attendance</Typography>
            <div
                style={{
                    display: "inline-block",
                    width: "300px",
                    height: "300px",
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                <QrReader
                    delay={200}
                    onError={handleError}
                    onResult={handleScan}
                    constraints={{ facingMode: "environment" }}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Display Check-In and Check-Out Buttons after successful verification */}
            {isVerified && (
                <div style={{ marginTop: "20px" }}>
                    <p style={{ color: "green", fontSize: "18px", fontWeight: "bold" }}>
                        Organization Verified Successfully!
                    </p>
                    <div className="flex gap-2 justify-center items-center">
                        {!hasCheckedIn && (
                            <button
                                onClick={handlePunchIn}
                                style={{
                                    padding: "10px 10px",
                                    backgroundColor: "green",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                Punch-In
                            </button>
                        )}

                        {hasCheckedIn && (
                            <button
                                onClick={() => punchOutMutation.mutate()}
                                style={{
                                    padding: "10px 10px",
                                    backgroundColor: "blue",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                Punch-Out
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeQRScanner;
