import React, { useContext, useState } from 'react';
import { Avatar, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Search } from '@mui/icons-material';
import HeadingOneLineInfo from '../../../components/HeadingOneLineInfo/HeadingOneLineInfo';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import useGetUser from '../../../hooks/Token/useUser';
import BasicButton from '../../../components/BasicButton';
import { TestContext } from '../../../State/Function/Main';
import InterviewScheduleInterviewer from './InterviewScheduleInterviewer';

const ShortlisttedNotiMR = (shortlistedApplication) => {
    const { organisationId } = useParams();
    const { authToken } = useGetUser();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { handleAlert } = useContext(TestContext);

    const [searchQuery, setSearchQuery] = useState("");
    const [notificationType, setNotificationType] = useState("shortlisted");

    // Mutation for status update
    const mutation = useMutation(
        async ({ status, applicationId }) => {
            const response = await axios.patch(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-application/${applicationId}/statusbymr`,
                { statusByManager: status },
                { headers: { Authorization: authToken } }
            );
            return response.data;
        },
        {
            onSuccess: () => {
                handleAlert(true, "success", "Applicant successfully updated!");
                queryClient.invalidateQueries(['shortlistedApplications']);
            },
            onError: (e) => {
                handleAlert(true, "error", e.message);
            }
        }
    );

    const handleAction = (status, applicationId) => {
        mutation.mutate({ status, applicationId });
    };

    const filteredApplications = shortlistedApplication?.shortlistedApplication?.filter((app) =>
        `${app?.first_name} ${app?.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="min-h-[90vh] flex">
            {/* Sidebar */}
            <article className="md:w-[25%] w-[200px] overflow-auto h-[90vh] p-2">
                <div className="space-y-2">
                    {/* Search Bar */}
                    <div className="flex rounded-md items-center px-2 border-gray-200 border-[.5px] bg-white py-1">
                        <Search className="text-gray-700 text-lg" />
                        <input
                            type="text"
                            placeholder="Search Applicant"
                            className="border-none bg-white w-full outline-none px-2"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </article>

            {/* Main Content */}
            <main className="w-[75%] min-h-[90vh] border-l-[.5px] p-4">
                <div className="flex justify-between items-center">
                    <HeadingOneLineInfo
                        heading="Shortlisted Applications"
                        info="Here managers can see applications shortlisted by HR."
                    />
                    <FormControl size="small" variant="outlined" className="w-[200px]">
                        <InputLabel id="notification-type-label">Notification Type</InputLabel>
                        <Select
                            labelId="notification-type-label"
                            value={notificationType}
                            onChange={(e) => {
                                setNotificationType(e.target.value);
                                setSearchQuery("");
                            }}
                            label="Notification Type"
                        >
                            <MenuItem value="shortlisted">Shortlisted by HR</MenuItem>
                            <MenuItem value="interviewScheduled">Interview Scheduled</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <div className="space-y-6">
                    {notificationType === "shortlisted" ? (
                        filteredApplications?.map((vacancy, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white border rounded-md shadow-md p-4">
                                <div className="flex items-center gap-4">
                                    <Avatar
                                        sx={{ width: 40, height: 40 }}
                                        src={vacancy?.applicantId?.user_logo_url || ""}
                                        alt={`${vacancy?.first_name || "Applicant"} Avatar`}
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {vacancy?.first_name} {vacancy?.last_name}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            {vacancy?.jobId?.jobTitle || "N/A"} - {vacancy?.email || "N/A"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <BasicButton
                                        title="Shortlist"
                                        onClick={() => handleAction("Shortlisted", vacancy?._id)}
                                        color="success"
                                        disabled={vacancy?.statusByManager === "Shortlisted"}
                                    />
                                    <BasicButton title="Reject" color="danger" />
                                    <BasicButton
                                        title="View"
                                        onClick={() => navigate(`/organisation/${organisationId}/view-job-detail-application/${vacancy?.jobId?._id}/${vacancy?._id}`)}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <InterviewScheduleInterviewer />
                    )}
                </div>
            </main>
        </section>
    );
};

export default ShortlisttedNotiMR;
