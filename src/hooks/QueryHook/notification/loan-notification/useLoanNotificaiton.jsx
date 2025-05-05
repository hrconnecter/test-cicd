import { useQuery } from "react-query";
import axios from "axios";
import useAuthToken from "../../../Token/useAuth";
import { useParams } from "react-router-dom";

const useLoanNotification = () => {
  const authToken = useAuthToken();
  const { organisationId } = useParams();

  // Keep the original endpoint for pending loans (for HR/Admin)
  const { 
    data: getEmployeeRequestLoanApplication, 
    isLoading: loanRequestLoading 
  } = useQuery(
    ['empLoanApplyRequest'],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/pendingLoans`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    },
    {
      enabled: !!authToken,
    }
  );

  // Add new query for archived loans (approved/rejected)
  const { 
    data: getArchivedLoanRequests, 
    isLoading: archivedLoansLoading 
  } = useQuery(
    ['empLoanArchivedRequests'],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/loans/status/archived`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    },
    {
      enabled: !!authToken && !!organisationId,
    }
  );

  // Keep the original employee loan notifications query
  const { data: getLoanEmployee } = useQuery(
    ['empLoanNotification'],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get-approved-reject-loan-to-employee`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    },
    {
      enabled: !!authToken,
    }
  );

  return {
    getEmployeeRequestLoanApplication,
    getArchivedLoanRequests,
    getLoanEmployee,
    loanRequestLoading,
    archivedLoansLoading
  };
};

export default useLoanNotification;


//working
// import { useQuery } from "react-query";
// import axios from "axios";
// import useAuthToken from "../../../Token/useAuth";
// import { useParams } from "react-router-dom";

// const useLoanNotification = () => {
//   const authToken = useAuthToken();
//   const { organisationId } = useParams();

//   // Get pending loan requests (for HR/Admin)
//   const { 
//     data: getEmployeeRequestLoanApplication, 
//     // isLoading: loanRequestLoading 
//   } = useQuery(
//     ['empLoanApplyRequest'],
//     async () => {
//       console.log("Fetching pending loans for organization:", organisationId);
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/loans/status/pending`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       console.log("Pending loans response:", response.data);
//       return response.data.data;
//     },
//     {
//       enabled: !!authToken && !!organisationId,
//     }
//   );

//   // Get archived loan requests (approved/rejected)
//   const { 
//     data: getArchivedLoanRequests, 
//     // isLoading: archivedLoansLoading 
//   } = useQuery(
//     ['empLoanArchivedRequests'],
//     async () => {
//       console.log("Fetching archived loans for organization:", organisationId);
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/loans/status/archived`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       console.log("Archived loans response:", response.data);
//       return response.data.data;
//     },
//     {
//       enabled: !!authToken && !!organisationId,
//     }
//   );

//   // Get employee loan notifications (for employees)
//   const { data: getLoanEmployee } = useQuery(
//     ['empLoanNotification'],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/get-approved-reject-loan-to-employee`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data.data;
//     },
//     {
//       enabled: !!authToken,
//     }
//   );

//   return {
//     getEmployeeRequestLoanApplication,
//     getArchivedLoanRequests,
//     getLoanEmployee,
//     // loanRequestLoading,
//     // archivedLoansLoading
//   };
// };

// export default useLoanNotification;



// import axios from "axios";
// import { useContext } from "react";
// import { useQuery } from "react-query";
// import { UseContext } from "../../../../State/UseState/UseContext";
// import useNotificationCount from "../../../../components/app-layout/notification-zustand";
// import UserProfile from "../../../../hooks/UserData/useUser";

// const useLoanNotification = () => {
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"]; 
//   const { setNotificationCount } = useNotificationCount();

//     const { getCurrentUser } = UserProfile();
//     const user = getCurrentUser();
//     // const userId = user._id;
//     const organisationId = user?.organizationId;

//   // get the employee whose raised a request for loan applicaiton
//   const {
//     data: getEmployeeRequestLoanApplication,
//     isFetching,
//     isLoading,
//   } = useQuery(
//     ["empLoanApplyRequest"], 
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/pendingLoans`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data.data;
//     },
//     {
//       refetchOnWindowFocus: false,
//       refetchOnMount: false,
//       onSuccess: (data) => {
//         setNotificationCount(data?.length ?? 0);
//       },
//     }
//   );

//   //for get loan data
//   const { data: getLoanEmployee } = useQuery(
//     ["getLoanEmployee"],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/get-loan-to-employee`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data.data;
//     }
//   );

//     // Get archived loan requests (approved/rejected)

//     const { data: getArchivedLoanRequests, isLoading: archivedLoansLoading } = useQuery(
//       ['empLoanArchivedRequests'],
//       async () => {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/organization/${organisationId}/loans/status/archived`,
//           {
//             headers: {
//               Authorization: authToken,
//             },
//           }
//         );
//         console.log("Archieve Notifications",response.data.data);
//         return response.data.data;
//       }
//     );


//   return { 
//     getEmployeeRequestLoanApplication,
//     isLoading,
//     isFetching,
//     getLoanEmployee,
//     getArchivedLoanRequests,
//     archivedLoansLoading
//   };
// };

// export default useLoanNotification;
