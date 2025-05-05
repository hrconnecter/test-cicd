// import React, { useState } from "react";
// import HrNotification from "./HrNotification";
// import { Avatar } from "@mui/material";
// import UserProfile from "../../../hooks/UserData/useUser";
// import { Search } from "@mui/icons-material";
// import { Link } from "react-router-dom";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

// const RecruitmentApproval = ({ jobVacancyNoti }) => {
//     const [selectedCreator, setSelectedCreator] = useState(null);
//     const { getCurrentUser } = UserProfile();
//     const user = getCurrentUser();
//     const hrId = user?._id;

//     const data = jobVacancyNoti || [];

//     // Filter out vacancies created by the current user
//     const filteredData = data?.filter((item) => item?.createdBy?._id !== hrId);

//     // Group vacancies by creator
//     const groupedCreators = filteredData?.reduce((acc, item) => {
//         const creatorId = item?.createdBy?._id;
//         if (creatorId && !acc[creatorId]) {
//             acc[creatorId] = item?.createdBy;
//         }
//         return acc;
//     }, {});

//     const creators = Object.values(groupedCreators);

//     return (
//         <div>
//             here i want to select field for select job vacancy notififation, shortlisted notification by manager
//             <div>
//                 <section className="min-h-[90vh] flex">
//                     <article className="md:w-[25%] w-[200px] overflow-auto h-[90vh]">
//                         <div className="p-2 my-2 !py-2  ">
//                             <div className="space-y-2">
//                                 <div
//                                     className={`
//                   flex  rounded-md items-center px-2 outline-none border-gray-200 border-[.5px]  bg-white py-1 md:py-[6px]`}
//                                 >
//                                     <Search className="text-gray-700 md:text-lg !text-[1em]" />
//                                     <input
//                                         type={"test"}
//                                         placeholder={"Search Employee"}
//                                         className={`border-none bg-white w-full outline-none px-2  `}
//                                     />
//                                 </div>
//                             </div>
//                         </div>

//                         {creators.map((creator, idx) => (
//                             creator && (
//                                 <Link
//                                     onClick={() => setSelectedCreator(creator._id)}
//                                     className={`px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50 ${selectedCreator === creator._id ? "bg-blue-500 text-white hover:!bg-blue-500" : ""
//                                         }`}
//                                     key={idx}
//                                 >
//                                     <Avatar />
//                                     <div>
//                                         <h1 className={`md:text-[1.2rem] text-sm ${selectedCreator === creator._id ? "text-white" : ""}`}>
//                                             {creator?.first_name} {creator?.last_name}
//                                         </h1>
//                                         <h1
//                                             className={`md:text-sm text-xs text-gray-500 ${selectedCreator === creator._id ? "text-white" : ""
//                                                 }`}
//                                         >
//                                             {creator?.email}
//                                         </h1>
//                                     </div>
//                                 </Link>
//                             )
//                         ))}


//                     </article>

//                     {/* Main Content */}
//                     <main className="w-[75%] min-h-[90vh] border-l-[.5px]">
//                         <div className="px-4 pt-2">
//                             <HeadingOneLineInfo
//                                 heading={"Job Vacancies"}
//                                 info={
//                                     " Vacancies created by the selected HR manager."
//                                 }
//                             />
//                         </div>
//                         <div className="space-y-6">
//                             {selectedCreator ? (
//                                 <div className="px-4">
//                                     <HrNotification selectedCreator={selectedCreator} />
//                                 </div>
//                             ) : (
//                                 <div className="px-4">
//                                     <p className="text-gray-500">Please select a creator to view their job vacancies.</p>
//                                 </div>)}
//                         </div>
//                     </main>
//                 </section>
//             </div>
//         </div>
//     );
// };

// export default RecruitmentApproval;
import React, { useState } from "react";
import HrNotification from "./HrNotification";
import { Avatar, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import UserProfile from "../../../hooks/UserData/useUser";
import { Search } from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../../../hooks/Token/useAuth";
import HrNotiShortlistedByMR from "./HrNotiShortlistedByMR";

const RecruitmentApproval = ({ jobVacancyNoti }) => {
    const [selectedCreator, setSelectedCreator] = useState(null);
    const [notificationType, setNotificationType] = useState("jobVacancies"); // State for notification type
    const { getCurrentUser } = UserProfile();
    const user = getCurrentUser();
    const hrId = user?._id;
    const { organisationId } = useParams();
    const authToken = useAuthToken();
    const data = jobVacancyNoti || [];

    // Filter out vacancies created by the current user
    const filteredData = data?.filter((item) => item?.createdBy?._id !== hrId);

    // Group vacancies by creator
    const groupedCreators = filteredData?.reduce((acc, item) => {
        const creatorId = item?.createdBy?._id;
        if (creatorId && !acc[creatorId]) {
            acc[creatorId] = item?.createdBy;
        }
        return acc;
    }, {});

    const creators = Object.values(groupedCreators);

    //shorlisted noti by mr
    const { data: shortlistedApplicationByMR } = useQuery(
        ['shortlistedApplicationsByMR', user?._id],
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-applications-shorlisted-by-mr/${user?._id}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response?.data?.data;
        },
        {
            enabled: !!authToken && !!user?._id,
        }
    );
    console.log("shortlistedApplicationByMR", shortlistedApplicationByMR);


    return (
        <div>
            <section className="min-h-[90vh] flex">
                {/* Sidebar */}
                <article className="md:w-[25%] w-[200px] overflow-auto h-[90vh]">
                    <div className="p-2 my-2">
                        {/* Search Bar */}
                        <div className="space-y-2">
                            <div className="flex rounded-md items-center px-2 border-gray-200 border-[.5px] bg-white py-1 md:py-[6px]">
                                <Search className="text-gray-700 md:text-lg" />
                                <input
                                    type="text"
                                    placeholder="Search Employee"
                                    className="border-none bg-white w-full outline-none px-2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Creator List */}
                    {creators.map((creator, idx) => (
                        creator && (
                            <Link
                                onClick={() => setSelectedCreator(creator._id)}
                                className={`px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50 ${selectedCreator === creator._id ? "bg-blue-500 text-white hover:!bg-blue-500" : ""}`}
                                key={idx}
                            >
                                <Avatar />
                                <div>
                                    <h1 className={`md:text-[1.2rem] text-sm ${selectedCreator === creator._id ? "text-white" : ""}`}>
                                        {creator?.first_name} {creator?.last_name}
                                    </h1>
                                    <h1 className={`md:text-sm text-xs text-gray-500 ${selectedCreator === creator._id ? "text-white" : ""}`}>
                                        {creator?.email}
                                    </h1>
                                </div>
                            </Link>
                        )
                    ))}
                </article>

                {/* Main Content */}
                <main className="w-[75%] min-h-[90vh] border-l-[.5px]">
                    <div className="px-4 pt-2 flex items-center justify-between">
                        <HeadingOneLineInfo
                            heading={"Recruitment Notifications"}
                            info={"Switch between job vacancies and shortlisted notifications."}
                        />

                        {/* Notification Type Selector */}
                        <FormControl size="small" variant="outlined" className="w-[200px]">
                            <InputLabel id="notification-type-label">Notification Type</InputLabel>
                            <Select
                                labelId="notification-type-label"
                                value={notificationType}
                                onChange={(e) => setNotificationType(e.target.value)}
                                label="Notification Type"
                            >
                                <MenuItem value="jobVacancies">Job Vacancy Notifications</MenuItem>
                                <MenuItem value="shortlisted">Shortlisted by Manager</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <div className="space-y-6">
                        {/* Content Based on Selected Notification Type */}
                        {selectedCreator ? (
                            <div className="px-4">
                                {notificationType === "jobVacancies" ? (
                                    <HrNotification selectedCreator={selectedCreator} />
                                ) : (
                                    <HrNotiShortlistedByMR shortlistedApplicationByMR={shortlistedApplicationByMR} />
                                )}
                            </div>
                        ) : (
                            <div className="px-4">
                                <p className="text-gray-500">Please select a creator to view notifications.</p>
                            </div>
                        )}
                    </div>
                </main>
            </section>
        </div>
    );
};

export default RecruitmentApproval;
