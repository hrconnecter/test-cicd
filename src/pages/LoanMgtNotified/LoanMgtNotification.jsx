import React, { useState, useMemo } from "react";
import { Search, Info } from "@mui/icons-material";
import { Avatar, Box, Tabs, Tab, CircularProgress } from "@mui/material";
import LoanMgtApproval from "./LoanMgtApproval";
import useLoanNotification from "../../hooks/QueryHook/notification/loan-notification/useLoanNotificaiton";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";

const LoanMgtNotification = () => {
  // State definitions
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("loanRequests");
  
  // Get loan notification data
  const { 
    getEmployeeRequestLoanApplication, 
    getArchivedLoanRequests,
    loanRequestLoading,
    archivedLoansLoading
  } = useLoanNotification();

  // Combine all employees from both pending and archived loans
  const allEmployees = useMemo(() => {
    const employeeMap = new Map();
    
    // Process all employees from pending loans
    if (Array.isArray(getEmployeeRequestLoanApplication)) {
      getEmployeeRequestLoanApplication.forEach(loan => {
        if (loan.userId && loan.userId._id) {
          employeeMap.set(loan.userId._id, loan.userId);
        }
      });
    }
    
    // Process all employees from archived loans
    if (Array.isArray(getArchivedLoanRequests)) {
      getArchivedLoanRequests.forEach(loan => {
        if (loan.userId && loan.userId._id) {
          employeeMap.set(loan.userId._id, loan.userId);
        }
      });
    }
    
    return Array.from(employeeMap.values());
  }, [getEmployeeRequestLoanApplication, getArchivedLoanRequests]);
  
  // Filter employees based on search query
  const filteredEmployees = useMemo(() => {
    return allEmployees.filter(
      (employee) =>
        employee?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee?.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allEmployees, searchQuery]);

  const handleEmployeeClick = (employee) => {
    // Find loans for this employee based on the active tab
    if (activeTab === "loanRequests") {
      // Find pending loans for this employee
      const pendingLoans = Array.isArray(getEmployeeRequestLoanApplication) 
        ? getEmployeeRequestLoanApplication.filter(
            loan => loan.userId?._id === employee._id
          )
        : [];
      
      if (pendingLoans.length > 0) {
        setSelectedEmployee(pendingLoans[0]);
      } else {
        setSelectedEmployee(null);
      }
    } else {
      // Find archived loans for this employee
      const archivedLoans = Array.isArray(getArchivedLoanRequests)
        ? getArchivedLoanRequests.filter(
            loan => loan.userId?._id === employee._id
          )
        : [];
      
      if (archivedLoans.length > 0) {
        setSelectedEmployee(archivedLoans[0]);
      } else {
        setSelectedEmployee(null);
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSelectedEmployee(null);
  };

  const isLoading = loanRequestLoading || archivedLoansLoading;

  return (
    <Box>
      <section className="min-h-[90vh] flex">
        <article className="md:w-[25%] w-[200px] overflow-auto h-[90vh]">
          <div className="p-2 my-2 !py-2">
            <div className="space-y-2">
              <div
                className={`
                  flex rounded-md items-center px-2 outline-none border-gray-200 border-[.5px] bg-white py-1 md:py-[6px]`}
              >
                <Search className="text-gray-700 md:text-lg !text-[1em]" />
                <input
                  type={"text"}
                  placeholder={"Search Employee"}
                  className={`border-none bg-white w-full outline-none px-2`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-4">
              <CircularProgress size={24} />
            </div>
          ) : filteredEmployees && filteredEmployees.length > 0 ? (
            <div>
              {filteredEmployees.map((employee) => (
                <div
                  className={`px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50 ${
                    selectedEmployee?.userId?._id === employee._id ? "bg-gray-50 text-black" : ""
                  }`}
                  key={employee._id}
                  onClick={() => handleEmployeeClick(employee)}
                >
                  <Avatar src={employee?.avatar} />
                  <div>
                    <h1 className="text-[1.2rem]">
                      {employee?.first_name}{" "}
                      {employee?.last_name}
                    </h1>
                    <h1 className={`text-sm text-gray-500`}>
                      {employee?.email}
                    </h1>
                  </div>
                </div> 
              ))} 
            </div> 
          ) : (
            <div className="px-6 my-1 mx-3 py-2">
              <p className="text-gray-500">No employees found</p>
            </div>
          )}
        </article>
        
        <div className="w-[75%] min-h-[90vh] border-l-[.5px] bg-gray-50">
          <div className="px-4 pt-2">
            <HeadingOneLineInfo  
              heading={"Loan Requests"} 
              info={"Here you would be able to approve or reject the loan requests"}
            />
          </div>
          
          <Tabs value={activeTab} onChange={handleTabChange} className="px-4">
            <Tab label="Loan Requests" value="loanRequests" />
            <Tab label="Archive" value="archive" />
          </Tabs>

          {isLoading ? (
            <div className="flex justify-center p-4">
              <CircularProgress />
            </div>
          ) : selectedEmployee ? (
            <div className="px-2">
              <LoanMgtApproval 
                employee={selectedEmployee} 
                isArchived={activeTab === "archive"}
              />
            </div>
          ) : (
            <div className="flex px-4 w-full items-center my-4">
              <h1 className="text-lg w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
                <Info /> {activeTab === "loanRequests" 
                  ? "Select an employee to see their loan requests" 
                  : "Select an employee to see their archived loans"}
              </h1>
            </div>
          )}
        </div>
      </section>
    </Box>
  );
};

export default LoanMgtNotification;


//working
// import React, { useState, useMemo, useEffect } from "react";
// import { Search, Info } from "@mui/icons-material";
// import { Avatar, Box, Tabs, Tab, CircularProgress } from "@mui/material";
// import LoanMgtApproval from "./LoanMgtApproval";
// import useLoanNotification from "../../hooks/QueryHook/notification/loan-notification/useLoanNotificaiton";
// import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";

// const LoanMgtNotification = () => {
//   // State definitions
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
//   const [activeTab, setActiveTab] = useState("loanRequests");
  
//   // Get loan notification data
//   const { 
//     getEmployeeRequestLoanApplication, 
//     getArchivedLoanRequests,
//     loanRequestLoading,
//     archivedLoansLoading
//   } = useLoanNotification();

//   // Combine all employees from both pending and archived loans
//   const allEmployees = useMemo(() => {
//     const employeeMap = new Map();
    
//     // Process all employees from pending loans
//     if (Array.isArray(getEmployeeRequestLoanApplication)) {
//       getEmployeeRequestLoanApplication.forEach(loan => {
//         if (loan.userId && loan.userId._id) {
//           employeeMap.set(loan.userId._id, loan.userId);
//         }
//       });
//     }
    
//     // Process all employees from archived loans
//     if (Array.isArray(getArchivedLoanRequests)) {
//       getArchivedLoanRequests.forEach(loan => {
//         if (loan.userId && loan.userId._id) {
//           employeeMap.set(loan.userId._id, loan.userId);
//         }
//       });
//     }
    
//     return Array.from(employeeMap.values());
//   }, [getEmployeeRequestLoanApplication, getArchivedLoanRequests]);
  
//   // Filter employees based on search query
//   const filteredEmployees = useMemo(() => {
//     return allEmployees.filter(
//       (employee) =>
//         employee?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         employee?.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [allEmployees, searchQuery]);

//   // Get loans for the selected employee based on active tab
//   const selectedEmployeeLoans = useMemo(() => {
//     if (!selectedEmployeeId) return [];
    
//     if (activeTab === "loanRequests") {
//       return Array.isArray(getEmployeeRequestLoanApplication) 
//         ? getEmployeeRequestLoanApplication.filter(
//             loan => loan.userId?._id === selectedEmployeeId
//           )
//         : [];
//     } else {
//       return Array.isArray(getArchivedLoanRequests)
//         ? getArchivedLoanRequests.filter(
//             loan => loan.userId?._id === selectedEmployeeId
//           )
//         : [];
//     }
//   }, [selectedEmployeeId, activeTab, getEmployeeRequestLoanApplication, getArchivedLoanRequests]);

//   // When tab changes, update the selected loan if the employee has loans in that tab
//   useEffect(() => {
//     if (selectedEmployeeId) {
//       const loansInCurrentTab = selectedEmployeeLoans;
//       if (loansInCurrentTab.length > 0) {
//         setSelectedEmployee(loansInCurrentTab[0]);
//       } else {
//         setSelectedEmployee(null);
//       }
//     }
//   }, [activeTab, selectedEmployeeId, selectedEmployeeLoans]);

//   const handleEmployeeClick = (employeeId) => {
//     setSelectedEmployeeId(employeeId);
    
//     // Find loans for this employee in the current tab
//     let employeeLoans;
//     if (activeTab === "loanRequests") {
//       employeeLoans = Array.isArray(getEmployeeRequestLoanApplication) 
//         ? getEmployeeRequestLoanApplication.filter(loan => loan.userId?._id === employeeId)
//         : [];
//     } else {
//       employeeLoans = Array.isArray(getArchivedLoanRequests)
//         ? getArchivedLoanRequests.filter(loan => loan.userId?._id === employeeId)
//         : [];
//     }
    
//     // Set the first loan as selected if available
//     if (employeeLoans.length > 0) {
//       setSelectedEmployee(employeeLoans[0]);
//     } else {
//       setSelectedEmployee(null);
//     }
//   };

//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue);
//     // Don't reset selectedEmployeeId here to keep the employee selected
    
//     // The useEffect will update the selected loan based on the new tab
//   };
  
//   const handleLoanSelect = (loan) => {
//     setSelectedEmployee(loan);
//   };

//   const isLoading = loanRequestLoading || archivedLoansLoading;

//   return (
//     <Box>
//       <section className="min-h-[90vh] flex">
//         <article className="md:w-[25%] w-[200px] overflow-auto h-[90vh]">
//           <div className="p-2 my-2 !py-2">
//             <div className="space-y-2">
//               <div
//                 className={`
//                   flex rounded-md items-center px-2 outline-none border-gray-200 border-[.5px] bg-white py-1 md:py-[6px]`}
//               >
//                 <Search className="text-gray-700 md:text-lg !text-[1em]" />
//                 <input
//                   type={"text"}
//                   placeholder={"Search Employee"}
//                   className={`border-none bg-white w-full outline-none px-2`}
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>
          
//           {isLoading ? (
//             <div className="flex justify-center p-4">
//               <CircularProgress size={24} />
//             </div>
//           ) : filteredEmployees && filteredEmployees.length > 0 ? (
//             <div>
//               {filteredEmployees.map((employee) => (
//                 <div
//                   className={`px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50 ${
//                     selectedEmployeeId === employee._id ? "bg-gray-50 text-black" : ""
//                   }`}
//                   key={employee._id}
//                   onClick={() => handleEmployeeClick(employee._id)}
//                 >
//                   <Avatar src={employee?.avatar} />
//                   <div>
//                     <h1 className="text-[1.2rem]">
//                       {employee?.first_name}{" "}
//                       {employee?.last_name}
//                     </h1>
//                     <h1 className={`text-sm text-gray-500`}>
//                       {employee?.email}
//                     </h1>
//                   </div>
//                 </div> 
//               ))} 
//             </div> 
//           ) : (
//             <div className="px-6 my-1 mx-3 py-2">
//               <p className="text-gray-500">No employees found</p>
//             </div>
//           )}
//         </article>
        
//         <div className="w-[75%] min-h-[90vh] border-l-[.5px] bg-gray-50">
//           <div className="px-4 pt-2">
//             <HeadingOneLineInfo  
//               heading={"Loan Requests"} 
//               info={"Here you would be able to approve or reject the loan requests"}
//             />
//           </div>
          
//           <Tabs value={activeTab} onChange={handleTabChange} className="px-4">
//             <Tab label="Loan Requests" value="loanRequests" />
//             <Tab label="Archive" value="archive" />
//           </Tabs>

//           {isLoading ? (
//             <div className="flex justify-center p-4">
//               <CircularProgress />
//             </div>
//           ) : selectedEmployeeId ? (
//             <div>
//               {selectedEmployeeLoans.length > 0 ? (
//                 <div>
//                   {/* If employee has multiple loans, show a loan selector */}
//                   {selectedEmployeeLoans.length > 1 && (
//                     <div className="px-4 py-2 bg-gray-100">
//                       <p className="text-sm font-medium mb-2">Select a loan:</p>
//                       <div className="flex flex-wrap gap-2">
//                         {selectedEmployeeLoans.map((loan, index) => (
//                           <button
//                             key={loan._id}
//                             onClick={() => handleLoanSelect(loan)}
//                             className={`px-3 py-1 text-sm rounded-full ${
//                               selectedEmployee?._id === loan._id
//                                 ? "bg-blue-500 text-white"
//                                 : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                             }`}
//                           >
//                             Loan {index + 1} - {loan.loanType?.loanName || "Unknown"}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   )}
                  
//                   {/* Display the selected loan */}
//                   <div className="px-2">
//                     <LoanMgtApproval 
//                       employee={selectedEmployee} 
//                       isArchived={activeTab === "archive"}
//                     />
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex px-4 w-full items-center my-4">
//                   <h1 className="text-lg w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
//                     <Info /> No {activeTab === "loanRequests" ? "pending" : "archived"} loans found for this employee
//                   </h1>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="flex px-4 w-full items-center my-4">
//               <h1 className="text-lg w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
//                 <Info /> Select an employee to see their loan requests
//               </h1>
//             </div>
//           )}
//         </div>
//       </section>
//     </Box>
//   );
// };

// export default LoanMgtNotification;



// import React, { useState, useMemo } from "react";
// import { Search, Info } from "@mui/icons-material";
// import { Avatar, Box, Tabs, Tab } from "@mui/material";
// import LoanMgtApproval from "./LoanMgtApproval";
// import useLoanNotification from "../../hooks/QueryHook/notification/loan-notification/useLoanNotificaiton";
// import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";

// const LoanMgtNotification = () => {
//   // State definitions
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
//   const [activeTab, setActiveTab] = useState("loanRequests");
  
//   // Get loan notification data
//   const { 
//     getEmployeeRequestLoanApplication, 
//     getArchivedLoanRequests 
//   } = useLoanNotification();

//   // Group loans by employee ID to avoid duplicates in the list
//   const uniqueEmployees = useMemo(() => {
//     const employeeMap = new Map();
    
//     // Process pending loans
//     if (Array.isArray(getEmployeeRequestLoanApplication)) {
//       getEmployeeRequestLoanApplication.forEach(loan => {
//         if (loan.userId && loan.userId._id) {
//           if (!employeeMap.has(loan.userId._id)) {
//             employeeMap.set(loan.userId._id, {
//               ...loan.userId,
//               loanCount: 1
//             });
//           } else {
//             const emp = employeeMap.get(loan.userId._id);
//             employeeMap.set(loan.userId._id, {
//               ...emp,
//               loanCount: emp.loanCount + 1
//             });
//           }
//         }
//       });
//     }
    
//     // Process archived loans
//     if (Array.isArray(getArchivedLoanRequests)) {
//       getArchivedLoanRequests.forEach(loan => {
//         if (loan.userId && loan.userId._id) {
//           if (!employeeMap.has(loan.userId._id)) {
//             employeeMap.set(loan.userId._id, {
//               ...loan.userId,
//               loanCount: 1
//             });
//           } else {
//             const emp = employeeMap.get(loan.userId._id);
//             employeeMap.set(loan.userId._id, {
//               ...emp,
//               loanCount: emp.loanCount + 1
//             });
//           }
//         }
//       });
//     }
    
//     return Array.from(employeeMap.values());
//   }, [getEmployeeRequestLoanApplication, getArchivedLoanRequests]);
  
//   // Filter employees based on search query
//   const filteredEmployees = useMemo(() => {
//     return uniqueEmployees.filter(
//       (employee) =>
//         employee?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         employee?.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [uniqueEmployees, searchQuery]);
  
//   // Get loans for the selected employee based on active tab
//   const selectedEmployeeLoans = useMemo(() => {
//     if (!selectedEmployeeId) return [];
    
//     if (activeTab === "loanRequests") {
//       return Array.isArray(getEmployeeRequestLoanApplication) 
//         ? getEmployeeRequestLoanApplication.filter(
//             loan => loan.userId?._id === selectedEmployeeId
//           )
//         : [];
//     } else {
//       return Array.isArray(getArchivedLoanRequests)
//         ? getArchivedLoanRequests.filter(
//             loan => loan.userId?._id === selectedEmployeeId
//           )
//         : [];
//     }
//   }, [selectedEmployeeId, activeTab, getEmployeeRequestLoanApplication, getArchivedLoanRequests]);

//   const handleEmployeeClick = (employeeId) => {
//     setSelectedEmployeeId(employeeId);
    
//     // Find the first loan for this employee in the current tab
//     let firstLoan;
//     if (activeTab === "loanRequests") {
//       firstLoan = Array.isArray(getEmployeeRequestLoanApplication) 
//         ? getEmployeeRequestLoanApplication.find(loan => loan.userId?._id === employeeId)
//         : null;
//     } else {
//       firstLoan = Array.isArray(getArchivedLoanRequests)
//         ? getArchivedLoanRequests.find(loan => loan.userId?._id === employeeId)
//         : null;
//     }
    
//     setSelectedEmployee(firstLoan);
//   };

//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue);
//     setSelectedEmployee(null);
//     setSelectedEmployeeId(null);
//   };
  
//   const handleLoanSelect = (loan) => {
//     setSelectedEmployee(loan);
//   };

//   return (
//     <Box>
//       <section className="min-h-[90vh] flex">
//         <article className="md:w-[25%] w-[200px] overflow-auto h-[90vh]">
//           <div className="p-2 my-2 !py-2">
//             <div className="space-y-2">
//               <div
//                 className={`
//                   flex rounded-md items-center px-2 outline-none border-gray-200 border-[.5px] bg-white py-1 md:py-[6px]`}
//               >
//                 <Search className="text-gray-700 md:text-lg !text-[1em]" />
//                 <input
//                   type={"text"}
//                   placeholder={"Search Employee"}
//                   className={`border-none bg-white w-full outline-none px-2`}
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>
//           {filteredEmployees && filteredEmployees.length > 0 ? (
//             <div>
//               {filteredEmployees.map((employee) => (
//                 <div
//                   className={`px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50 ${
//                     selectedEmployeeId === employee._id ? "bg-gray-50 text-black" : ""
//                   }`}
//                   key={employee._id}
//                   onClick={() => handleEmployeeClick(employee._id)}
//                 >
//                   <Avatar src={employee?.avatar} />
//                   <div>
//                     <h1 className="text-[1.2rem]">
//                       {employee?.first_name}{" "}
//                       {employee?.last_name}
//                     </h1>
//                     <h1 className={`text-sm text-gray-500`}>
//                       {employee?.email}
//                     </h1>
//                     {employee.loanCount > 1 && (
//                       <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
//                         {employee.loanCount} loans
//                       </span>
//                     )}
//                   </div>
//                 </div> 
//               ))} 
//             </div> 
//           ) : (
//             <div className="px-6 my-1 mx-3 py-2">
//               <p className="text-gray-500">No employees found</p>
//             </div>
//           )}
//         </article>
//         <div className="w-[75%] min-h-[90vh] border-l-[.5px] bg-gray-50">
//           <div className="px-4 pt-2">
//             <HeadingOneLineInfo  
//               heading={"Loan Requests"} 
//               info={"Here you would be able to approve or reject the loan requests"}
//             />
//           </div>
          
//           <Tabs value={activeTab} onChange={handleTabChange} className="px-4">
//             <Tab label="Loan Requests" value="loanRequests" />
//             <Tab label="Archive" value="archive" />
//           </Tabs>

//           {selectedEmployeeId ? (
//             <div>
//               {selectedEmployeeLoans.length > 0 ? (
//                 <div>
//                   {/* If employee has multiple loans, show a loan selector */}
//                   {selectedEmployeeLoans.length > 1 && (
//                     <div className="px-4 py-2 bg-gray-100">
//                       <p className="text-sm font-medium mb-2">Select a loan:</p>
//                       <div className="flex flex-wrap gap-2">
//                         {selectedEmployeeLoans.map((loan, index) => (
//                           <button
//                             key={loan._id}
//                             onClick={() => handleLoanSelect(loan)}
//                             className={`px-3 py-1 text-sm rounded-full ${
//                               selectedEmployee?._id === loan._id
//                                 ? "bg-blue-500 text-white"
//                                 : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                             }`}
//                           >
//                             Loan {index + 1} - {loan.loanType?.loanName || "Unknown"}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   )}
                  
//                   {/* Display the selected loan */}
//                   <div className="px-2">
//                     <LoanMgtApproval 
//                       employee={selectedEmployee} 
//                       isArchived={activeTab === "archive"}
//                     />
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex px-4 w-full items-center my-4">
//                   <h1 className="text-lg w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
//                     <Info /> No {activeTab === "loanRequests" ? "pending" : "archived"} loans found for this employee
//                   </h1>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="flex px-4 w-full items-center my-4">
//               <h1 className="text-lg w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
//                 <Info /> Select an employee to see their loan requests
//               </h1>
//             </div>
//           )}
//         </div>
//       </section>
//     </Box>
//   );
// };

// export default LoanMgtNotification;



// import React, { useState } from "react";
// import { Search, Info } from "@mui/icons-material";
// import { Avatar, Box, Tabs, Tab } from "@mui/material";
// import LoanMgtApproval from "./LoanMgtApproval";
// import useLoanNotification from "../../hooks/QueryHook/notification/loan-notification/useLoanNotificaiton";
// import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";

// const LoanMgtNotification = () => {
//   // State definitions
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [activeTab, setActiveTab] = useState("loanRequests");
  
//   // Get loan notification data
//   const { 
//     getEmployeeRequestLoanApplication, 
//     getArchivedLoanRequests 
//   } = useLoanNotification();

//   const handleEmployeeClick = (employee) => {
//     setSelectedEmployee(employee);
//   };

//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue);
//     setSelectedEmployee(null); // Reset selected employee when changing tabs
//   };
 
//   // Filter employees based on search query and active tab
//   let filteredEmployees = [];
  
//   if (activeTab === "loanRequests" && Array.isArray(getEmployeeRequestLoanApplication)) {
//     filteredEmployees = getEmployeeRequestLoanApplication.filter(
//       (employee) =>
//         employee?.userId?.first_name
//           .toLowerCase()
//           .includes(searchQuery.toLowerCase()) ||
//         employee?.userId?.last_name
//           .toLowerCase()
//           .includes(searchQuery.toLowerCase())
//     );
//   } else if (activeTab === "archive" && Array.isArray(getArchivedLoanRequests)) {
//     filteredEmployees = getArchivedLoanRequests.filter(
//       (employee) =>
//         employee?.userId?.first_name
//           .toLowerCase()
//           .includes(searchQuery.toLowerCase()) ||
//         employee?.userId?.last_name
//           .toLowerCase()
//           .includes(searchQuery.toLowerCase())
//     );
//   }

//   return (
//     <Box>
//       <section className="min-h-[90vh] flex">
//         <article className="md:w-[25%] w-[200px] overflow-auto h-[90vh]">
//           <div className="p-2 my-2 !py-2">
//             <div className="space-y-2">
//               <div
//                 className={`
//                   flex rounded-md items-center px-2 outline-none border-gray-200 border-[.5px] bg-white py-1 md:py-[6px]`}
//               >
//                 <Search className="text-gray-700 md:text-lg !text-[1em]" />
//                 <input
//                   type={"text"}
//                   placeholder={"Search Employee"}
//                   className={`border-none bg-white w-full outline-none px-2`}
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>
//           {filteredEmployees && filteredEmployees.length > 0 ? (
//             <div>
//               {filteredEmployees?.map((employee) => (
//                 <div
//                   className={`px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50 ${
//                     selectedEmployee?._id === employee?._id ? "bg-gray-50 text-black" : ""
//                   }`}
//                   key={employee?.userId?._id}
//                   onClick={() => handleEmployeeClick(employee)}
//                 >
//                   <Avatar src={employee?.avatarSrc} />
//                   <div>
//                     <h1 className="text-[1.2rem]">
//                       {employee?.userId?.first_name}{" "}
//                       {employee?.userId?.last_name}
//                     </h1>
//                     <h1 className={`text-sm text-gray-500`}>
//                       {employee?.userId?.email}
//                     </h1>
//                   </div>
//                 </div> 
//               ))} 
//             </div> 
//           ) : (
//             <div className="px-6 my-1 mx-3 py-2">
//               <p className="text-gray-500">No loan requests found</p>
//             </div>
//           )}
//         </article>
//         <div className="w-[75%] min-h-[90vh] border-l-[.5px] bg-gray-50">
//           <div className="px-4 pt-2">
//             <HeadingOneLineInfo  
//               heading={"Loan Requests"} 
//               info={"Here you would be able to approve or reject the loan requests"}
//             />
//           </div>
          
//           <Tabs value={activeTab} onChange={handleTabChange} className="px-4">
//             <Tab label="Loan Requests" value="loanRequests" />
//             <Tab label="Archive" value="archive" />
//           </Tabs>

//           {selectedEmployee ? ( 
//             <div className="px-2">
//               <LoanMgtApproval 
//                 employee={selectedEmployee} 
//                 isArchived={activeTab === "archive"}
//               />
//             </div>
//           ) : (
//             <div className="flex px-4 w-full items-center my-4">
//               <h1 className="text-lg w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
//                 <Info /> Select employee to see their requests
//               </h1>
//             </div>
//           )}
//         </div>
//       </section>
//     </Box>
//   );
// };

// export default LoanMgtNotification;

// import React, { useState } from "react";
// import { Search, Info } from "@mui/icons-material";
// import { Avatar, Box } from "@mui/material";
// import LoanMgtApproval from "./LoanMgtApproval";
// import useLoanNotification from "../../hooks/QueryHook/notification/loan-notification/useLoanNotificaiton";
// // import useOrganizationLoans from "..//loan-management/useOrganizationLoans";
// import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// const LoanMgtNotification = () => {
//   // to define the state, hook , import other function if needed
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const { getEmployeeRequestLoanApplication } = useLoanNotification();

//   const handleEmployeeClick = (employee) => {
//     setSelectedEmployee(employee);
//   };
 
//   let filteredEmployees = [];

//   if (Array.isArray(getEmployeeRequestLoanApplication)) {
//     filteredEmployees = getEmployeeRequestLoanApplication.filter(
//       (employee) =>
//         employee?.userId?.first_name
//           .toLowerCase()
//           .includes(searchQuery.toLowerCase()) ||
//         employee?.userId?.last_name
//           .toLowerCase()
//           .includes(searchQuery.toLowerCase())
//     );
//   }

//   return (
//     <Box>

//       <section className="min-h-[90vh] flex">
//         <article className="md:w-[25%] w-[200px] overflow-auto h-[90vh]">
//           <div className="p-2 my-2 !py-2  ">
//             <div className="space-y-2">
//               <div
//                 className={`
//                   flex  rounded-md items-center px-2 outline-none border-gray-200 border-[.5px]  bg-white py-1 md:py-[6px]`}
//               >
//                 <Search className="text-gray-700 md:text-lg !text-[1em]" />
//                 <input
//                   type={"text"}
//                   placeholder={"Search Employee"}
//                   className={`border-none bg-white w-full outline-none px-2  `}
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>
//           {filteredEmployees && filteredEmployees.length > 0 && (
//             <div>
//               {filteredEmployees?.map((employee) => (
//                 <div
//                   className={`px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50`}
//                   key={employee?.userId?._id}
//                   onClick={() => handleEmployeeClick(employee)}
//                 >
//                   <Avatar src={employee?.avatarSrc} />
//                    <div>
//                     <h1 className="text-[1.2rem]">
//                       {employee?.userId?.first_name}{" "}
//                       {employee?.userId?.last_name}
//                     </h1>

//                     <h1 className={`text-sm text-gray-500`}>
//                       {employee?.userId?.email}
//                     </h1>
//                   </div>
//                 </div> 
//               ))} 
//             </div> 
//           )}
//         </article>
//         <div className="w-[75%] min-h-[90vh] border-l-[.5px]  bg-gray-50">
//           <div className="px-4 pt-2">
//             <HeadingOneLineInfo 
//               heading={"Loan Requests"}
//               info={
//                 "Here you would be able to approve or reject the loan requests "}
//             /></div>
//           {selectedEmployee ? (
//             <div className="px-2">
//               <LoanMgtApproval employee={selectedEmployee} />
//             </div>
//           ) : (
//             <div className="flex px-4 w-full items-center my-4">
//               <h1 className="text-lg w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
//                 <Info /> Select employee to see their requests
//               </h1>
//             </div>
//           )}
//         </div>
//       </section>
//     </Box>
//   );
// };

// export default LoanMgtNotification;
