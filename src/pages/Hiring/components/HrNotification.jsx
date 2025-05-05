import axios from "axios";
import React, { useContext } from "react";
import { useQuery, useQueryClient } from "react-query";
import { UseContext } from "../../../State/UseState/UseContext";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const HrNotification = (selectedCreator) => {
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const { organisationId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery(
        ["JobVacancyCreator", organisationId, selectedCreator?.selectedCreator],
        async () => {
            if (!authToken) throw new Error("Authorization token missing");
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-job-vacancy-by-CreatorId/${selectedCreator?.selectedCreator}`,
                { headers: { Authorization: authToken } }
            );
            return response.data.data;
        },
        {
            enabled: !!authToken || selectedCreator?.selectedCreator,
            onSuccess: () => {
                queryClient.invalidateQueries(["jobVacancyNoti"]);
            },
        },
    );

    if (isLoading) return <div className="flex items-center justify-center my-2">
        <CircularProgress />
    </div>;

    if (isError) return <div>Failed to load data. Please try again later.</div>;

    const handleCreateJob = (vacancyId) => {
        console.log("vacancyId", vacancyId);
        if (vacancyId) {
            // Navigates to the edit job position route if a vacancyId is provided
            navigate(
                `/organisation/${organisationId}/create-job-position/${vacancyId}`
            );
        } else {
            // Navigates to the create job position route if no vacancyId is provided
            navigate(`/organisation/${organisationId}/create-job-position`);
        }
    };

    return (
        <div>
            {data?.length > 0 ? (
                <div className="space-y-6">
                    {data.map((vacancy, idx) => (
                        <div key={idx} className="flex justify-between items-center  bg-white border border-gray-300 rounded-md shadow-md p-6 py-2 space-y-4">
                            <div>
                                <div className="text-sm text-gray-600">
                                    <p className="text-lg font-semibold text-gray-800">{vacancy?.jobTitle}</p>
                                    <p>
                                        <span className="font-medium text-gray-700">Department:</span> {vacancy?.department?.departmentName || 'N/A'}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-700">Role:</span> {vacancy?.jobRole || 'N/A'}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-700">Experience:</span> {vacancy?.experienceRequired || 'N/A'}
                                    </p>

                                </div>

                                {/* Additional Description */}
                                {vacancy?.description && (
                                    <p className="text-gray-600 text-sm mt-2">
                                        <span className="font-medium text-gray-700">Description:</span> {vacancy?.description}
                                    </p>
                                )}

                                {/* Create Job Position Button */}

                            </div>

                            <div>
                                <button className=" bg-green-500 text-white p-1 rounded-md hover:bg-green-600 transition" onClick={() => handleCreateJob(vacancy._id)}>
                                    Create Job Position
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            ) : (
                <div className="w-full h-full ">
                    <div className="bg-white shadow-md rounded-md p-6 w-full max-w-4xl  border border-gray-200">
                        <div className="mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 text-gray-400 "
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m-9 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            No Creator Selected
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Please select a creator from the list to view their job vacancies.
                        </p>
                    </div>
                </div>
            )}
        </div>);
};

export default HrNotification;
