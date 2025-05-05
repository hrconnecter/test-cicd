import React from 'react'
import useGetUser from '../../../hooks/Token/useUser';
import { Link, useParams } from 'react-router-dom';
import UserProfile from '../../../hooks/UserData/useUser';
import { useQuery } from 'react-query';
import axios from 'axios';
import { format } from "date-fns";

const SelfInterviewShedule = () => {
    const { authToken } = useGetUser();
    const { organisationId } = useParams();
    const { getCurrentUser } = UserProfile();
    const user = getCurrentUser();
    const selfApplicantID = user?._id;

    const { data: applicantData } = useQuery(
        ["allicantData", organisationId, selfApplicantID],
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/applicant/${selfApplicantID}/applied-jobs`,
                {
                    headers: { Authorization: authToken },
                }
            );
            return response.data?.data;
        },
        { enabled: !!authToken }
    );

    console.log("applicantData", applicantData);

    return (
        <div className=" mx-auto p-6">
            {applicantData && applicantData?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
                    {applicantData?.map((vacancy, idx) => (
                        <div
                            key={idx}
                            className="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-5"
                        >
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-700" style={{ fontSize: "18px" }}>
                                        Interview scheduled for <span className="font-semibold">{vacancy?.applicantId?.first_name} {vacancy?.applicantId?.last_name}</span>
                                        {" "} by <span className="font-semibold">{vacancy?.interviewDetails?.scheduledBy || "N/A"}</span>
                                        {" "} with interviewer <span className="font-semibold">{vacancy?.interviewDetails?.interviewer || "N/A"}</span>
                                        {" "} on <span className="font-semibold">{vacancy?.interviewDetails?.date ? format(new Date(vacancy?.interviewDetails?.date), "PP") : "N/A"}</span>
                                        {" "}at <span className="font-semibold">{vacancy?.interviewDetails?.time || "N/A"}</span>.
                                    </p>
                                </div>
                                <div className="mt-4">  <Link
                                    to={`/organisation/${organisationId}/view-job-details/${vacancy?.jobId?._id}`}
                                    className="font-semibold text-blue-500 hover:underline text-md mt-6"
                                >
                                    Applied Job Details →
                                </Link></div>
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
    )
}

export default SelfInterviewShedule
