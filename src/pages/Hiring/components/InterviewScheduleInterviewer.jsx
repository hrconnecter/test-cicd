import axios from "axios";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import { UseContext } from "../../../State/UseState/UseContext";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";

const InterviewScheduleInterviewer = () => {
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const { organisationId } = useParams();

    const { data, isLoading, isError } = useQuery(
        ["interviewerScheduleInterview"],
        async () => {
            if (!authToken) throw new Error("Authorization token missing");
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/interviewer-see-schedule-interview`,
                { headers: { Authorization: authToken } }
            );
            return response.data.data;
        },
        {
            enabled: !!authToken,
        }
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center mt-10">
                <h2 className="text-red-600 font-semibold text-lg">
                    Unable to fetch interview schedules.
                </h2>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            {data && data.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
                    {data.map((vacancy, idx) => (
                        <div
                            key={idx}
                            className="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-5"
                        >
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-700" style={{ fontSize: "18px" }}>
                                        Interview scheduled for <span className="font-semibold">{vacancy?.applicantId?.first_name} {vacancy?.applicantId?.last_name}{" "}</span>
                                        on <span className="font-semibold">{vacancy?.interviewDetails?.date
                                            ? format(new Date(vacancy?.interviewDetails?.date), "PP") : "N/A"}</span>
                                        {" "}at <span className="font-semibold">{vacancy?.interviewDetails?.time || "N/A"}</span>.
                                    </p>
                                    <div className="mt-4">  <Link
                                        to={`/organisation/${organisationId}/view-job-detail-application/${vacancy?.jobId?._id}/${vacancy?._id}`}
                                        className="font-semibold text-blue-500 hover:underline text-md mt-6"
                                    >
                                        View Applicant Details →
                                    </Link></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center mt-10">
                    <h2 className="text-gray-600 font-semibold text-lg">
                        No interviews scheduled yet.
                    </h2>
                </div>
            )}
        </div>
    );
};

export default InterviewScheduleInterviewer;
