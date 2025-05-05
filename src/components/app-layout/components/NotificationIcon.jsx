// import { Notifications } from "@mui/icons-material";
// import { Badge } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import useGetUser from "../../../hooks/Token/useUser";
// import UserProfile from "../../../hooks/UserData/useUser";
// import useNotification from "../../../pages/AllNotifications/components/useNotification";

// const NotificationIcon = () => {
//   const { decodedToken: decoded } = useGetUser();
//   const location = useLocation();
//   const { getCurrentUser, useGetCurrentRole } = UserProfile();
//   const role = useGetCurrentRole();
//   const user = getCurrentUser();
//   const [orgId, setOrgId] = useState(null);
//   useEffect(() => {
//     if ((role === "Super-Admin", "Delegate-Super-Admin")) {
//       getOrganizationIdFromPathname(location.pathname);
//     } else {
//       setOrgId(user?.organizationId);
//     }
//     // eslint-disable-next-line
//   }, [location.pathname, orgId]);
//   const getOrganizationIdFromPathname = (pathname) => {
//     const parts = pathname.split("/");
//     const orgIndex = parts.indexOf("organisation");
//     let orgId;

//     if (orgIndex !== -1 && parts.length > orgIndex + 1) {
//       if (parts[orgIndex + 1] === null || undefined) {
//         orgId = decoded?.user?.organizationId;
//       } else {
//         orgId = parts[orgIndex + 1];
//       }
//     } else {
//       orgId = decoded?.user?.organizationId;
//     }
//     setOrgId(orgId);
//   };
//   const { dummyData } = useNotification();
//   console.log("dummyData", dummyData);

//   const totalCount = dummyData.reduce((acc, item) => acc + item.count, 0);
//   console.log("totalCount..", totalCount);

//   return (
//     <Link to={`/organisation/${orgId}/notification`}>
//       <Badge
//         variant={"standard"}
//         color={"error"}
//         badgeContent={totalCount ?? 0}
//       >
//         <Notifications sx={{ color: 'grey' }} />
//       </Badge>
//     </Link>
//   );
// };

// export default NotificationIcon;

import { Notifications } from "@mui/icons-material";
import { Badge } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useGetUser from "../../../hooks/Token/useUser";
import UserProfile from "../../../hooks/UserData/useUser";
import useNotification from "../../../pages/AllNotifications/components/useNotification";
import useHook from "../../../hooks/UserProfile/useHook";

const NotificationIcon = () => {
  const { decodedToken: decoded } = useGetUser();
  const location = useLocation();
  const { getCurrentUser, useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  const user = getCurrentUser();
  const [orgId, setOrgId] = useState(null);
  
  const { UserInformation } = useHook(); // Get user information
  const isVendor = UserInformation?.isVendor; // Check if the user is a vendor

  useEffect(() => {
    if (role === "Super-Admin" || role === "Delegate-Super-Admin") {
      getOrganizationIdFromPathname(location.pathname);
    } else {
      setOrgId(user?.organizationId);
    }
    // eslint-disable-next-line
  }, [location.pathname, user?.organizationId]); 

  const getOrganizationIdFromPathname = (pathname) => {
    const parts = pathname.split("/");
    const orgIndex = parts.indexOf("organisation");
    let orgId;

    if (orgIndex !== -1 && parts.length > orgIndex + 1) {
      orgId = parts[orgIndex + 1] || decoded?.user?.organizationId;
    } else {
      orgId = decoded?.user?.organizationId;
    }
    setOrgId(orgId);
  };

  const { dummyData, dummyData1 } = useNotification(); // Get both data sets

  // Use dummyData1 if user is a vendor, otherwise use dummyData
  const notifications = isVendor ? dummyData1 : dummyData;

  const totalCount = notifications.reduce((acc, item) => acc + item.count, 0);

  return (
    <Link to={`/organisation/${orgId}/notification`}>
      <Badge variant="standard" color="error" badgeContent={totalCount ?? 0}>
        <Notifications sx={{ color: "grey" }} />
      </Badge>
    </Link>
  );
};

export default NotificationIcon;
