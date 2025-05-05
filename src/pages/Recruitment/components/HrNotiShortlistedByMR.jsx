import { Avatar } from '@mui/material'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import BasicButton from '../../../components/BasicButton';

const HrNotiShortlistedByMR = (shortlistedApplicationByMR) => {
    const navigate = useNavigate();
    const { organisationId } = useParams();

    const handleAction = (jobId, applicantId) => {
        navigate(`/organisation/${organisationId}/interview-Shedule/${jobId}/${applicantId}`);
    };

    const handleViewDetails = (vacancy) => {
        if (vacancy?.jobId?._id && vacancy?._id) {
            navigate(
                `/organisation/${organisationId}/view-job-detail-application/${vacancy.jobId._id}/${vacancy?._id}`
            );
        } else {
            console.error("Missing jobId or applicantId for navigation.");
        }
    };
    return (
        <div>
            <div className="space-y-6 px-4">
                {shortlistedApplicationByMR?.shortlistedApplicationByMR?.map((vacancy, idx) => (
                    <div key={idx} className="flex justify-between items-center  bg-white border border-gray-300 rounded-md shadow-md p-6 py-2 space-y-4">
                        <div className='flex justify-center items-center gap-4'>
                            <Avatar
                                sx={{ height: 40, width: 40 }}
                                src={vacancy?.applicantId?.user_logo_url}
                            />
                            <div className="text-sm text-gray-600">
                                <p className="text-lg font-semibold text-gray-800">{vacancy?.first_name}{" "}{vacancy?.last_name}</p>
                                <p>
                                    <span className="font-medium text-gray-700"></span> {vacancy?.jobId?.jobTitle || 'N/A'}
                                </p>
                                <p>
                                    <span className="font-medium text-gray-700"></span> {vacancy?.email || 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className='flex gap-2'>
                            <BasicButton color="success" title={"Schedule Interview"} onClick={() => handleAction(vacancy?.jobId?._id, vacancy?._id)} />
                            <BasicButton onClick={() => handleViewDetails(vacancy)} title={"View"} />


                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default HrNotiShortlistedByMR
