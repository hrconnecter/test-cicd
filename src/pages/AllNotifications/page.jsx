// import React, { useEffect, useState } from "react";
// import BoxComponent from "../../components/BoxComponent/BoxComponent";
// import Card from "./components/card";
// import useNotification from "./components/useNotification";
// import Select from "react-select";
// import useGetUser from "../../hooks/Token/useUser";
// import useOrgList from "../../hooks/QueryHook/Orglist/hook";
// import UserProfile from "../../hooks/UserData/useUser";

// const ParentNotification = () => {
//   const { dummyData } = useNotification();
//   const visibleData = dummyData.filter((item) => item.visible === true);

//   //filter
//   const { decodedToken } = useGetUser();
//   const { data: orgData } = useOrgList();

//   const { getCurrentUser } = UserProfile();
//   const user = getCurrentUser();

//   const [filterOrgId, setFilterOrgId] = useState(user?.organizationId);
//   const [selectedOrg, setSelectedOrg] = useState(null);

//   useEffect(() => {
//     if (orgData?.organizations) {
//       const selectedOrg = orgData.organizations.find(
//         (org) => org._id === filterOrgId
//       );
//       setSelectedOrg(
//         selectedOrg
//           ? { value: selectedOrg._id, label: selectedOrg.orgName }
//           : null
//       );
//     }
//   }, [filterOrgId, orgData]);

//   const handleOrganizationChange = (selectedOption) => {
//     setFilterOrgId(selectedOption?.value || null);
//     setSelectedOrg(selectedOption || null);
//   };

//   return (
//     <BoxComponent sx={{ p: "0 !important" }}>
//       <div className="mb-2 flex justify-end">
//         {decodedToken?.user?.profile.includes("Super-Admin") && (
//           <Select
//             options={orgData?.organizations?.map((org) => ({
//               value: org?._id,
//               label: org?.orgName,
//             }))}
//             onChange={handleOrganizationChange}
//             placeholder={"Select Organisation"}
//             value={selectedOrg}
//             className="!w-[300px]"
//           />
//         )}
//       </div>
//       <Card card={visibleData} filterOrgId={filterOrgId} />
//     </BoxComponent>
//   );
// };

// // export default ParentNotification;
// import React, { useEffect, useState } from "react";
// import BoxComponent from "../../components/BoxComponent/BoxComponent";
// import Card from "./components/card";
// import useNotification from "./components/useNotification";
// import Select from "react-select";
// import useGetUser from "../../hooks/Token/useUser";
// import useOrgList from "../../hooks/QueryHook/Orglist/hook";
// import UserProfile from "../../hooks/UserData/useUser";

// const ParentNotification = () => {
//   const { dummyData } = useNotification();
//   const visibleData = dummyData.filter((item) => item.visible === true);

//   const { decodedToken } = useGetUser();
//   const { data: orgData, isLoading } = useOrgList();
//   const { getCurrentUser } = UserProfile();
//   const user = getCurrentUser();

//   // ✅ Default to null (Super Admin sees all data)
//   const [filterOrgId, setFilterOrgId] = useState(null);
//   const [selectedOrg, setSelectedOrg] = useState(null);

//   useEffect(() => {
//     if (
//       user?.organizationId &&
//       !decodedToken?.user?.profile.includes("Super-Admin")
//     ) {
//       setFilterOrgId(user.organizationId);
//     }
//   }, [user, decodedToken]);

//   const handleOrganizationChange = (selectedOption) => {
//     setFilterOrgId(selectedOption?.value || null);
//     setSelectedOrg(selectedOption || null);
//   };

//   return (
//     <BoxComponent sx={{ p: "0 !important" }}>
//       <div className="mb-2 flex justify-end">
//         {decodedToken?.user?.profile.includes("Super-Admin") && !isLoading && (
//           <Select
//             options={[
//               { value: null, label: "All Organizations" }, // ✅ Default for Super Admin
//               ...(orgData?.organizations?.map((org) => ({
//                 value: org?._id,
//                 label: org?.orgName,
//               })) || []),
//             ]}
//             onChange={handleOrganizationChange}
//             placeholder={"Select Organisation"}
//             value={selectedOrg}
//             className="!w-[300px]"
//           />
//         )}
//       </div>
//       <Card card={visibleData} filterOrgId={filterOrgId} />
//     </BoxComponent>
//   );
// };

// export default ParentNotification;


import React, { useEffect, useState } from "react";
import Select from "react-select";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import useOrgList from "../../hooks/QueryHook/Orglist/hook";
import useGetUser from "../../hooks/Token/useUser";
import UserProfile from "../../hooks/UserData/useUser";
import useHook from "../../hooks/UserProfile/useHook";
import Card from "./components/card";
import {  useQueryClient } from "react-query";
import useNotification from "./components/useNotification";


const ParentNotification = () => {
  const { dummyData, dummyData1 } = useNotification(); // Get both data sets
  const { decodedToken } = useGetUser();
  const { data: orgData, isLoading } = useOrgList();
  const { getCurrentUser } = UserProfile();
  const { UserInformation } = useHook(); // Get user info to check if vendor

  const user = getCurrentUser();
  const isVendor = UserInformation?.isVendor; // Check if the user is a vendor

  // ✅ Default to null (Super Admin sees all data)
  const [filterOrgId, setFilterOrgId] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState(null);

  // Use dummyData1 if the user is a vendor, otherwise use dummyData
  const notifications = isVendor ? dummyData1 : dummyData;

  // Only filter visible notifications
  const visibleData = notifications.filter((item) => item.visible === true);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (
      user?.organizationId &&
      !decodedToken?.user?.profile.includes("Super-Admin")
    ) {
      setFilterOrgId(user.organizationId);
    }
  }, [user, decodedToken]);

  const handleOrganizationChange =  async(selectedOption) => {
    setFilterOrgId(selectedOption?.value || null);
    await queryClient.invalidateQueries(["employeeExpenseNotifications" , "expenseEmployeeList" , "expenseNotifications"]);
    setSelectedOrg(selectedOption || null);
  };

  return (
    <BoxComponent sx={{ p: "0 !important" }}>
      <div className="mb-2 flex justify-end">
        {decodedToken?.user?.profile.includes("Super-Admin") && !isLoading && (
          <Select
            options={[
              { value: null, label: "All Organizations" }, // ✅ Default for Super Admin
              ...(orgData?.organizations?.map((org) => ({
                value: org?._id,
                label: org?.orgName,
              })) || []),
            ]}
            onChange={handleOrganizationChange}
            placeholder={"Select Organisation"}
            value={selectedOrg}
            className="!w-[300px]"
          />
        )}
      </div>
      <Card card={visibleData} filterOrgId={filterOrgId} />
    </BoxComponent>
  );
};

export default ParentNotification;
