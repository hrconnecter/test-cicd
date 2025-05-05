/* eslint-disable no-unused-vars */

// import { Info, Search, West } from "@mui/icons-material";
// import { Avatar, CircularProgress, Box, Tabs, Tab, List, ListItem, ListItemText } from "@mui/material";
// import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
// import moment from "moment";
// import React, { useState } from "react";
// import HeadingOneLineInfo from "../HeadingOneLineInfo/HeadingOneLineInfo";
// import useExpenseNotification from "../../hooks/QueryHook/notification/expense-notification/useExpenseNotification";

// const ExpenseNotifications = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeTab, setActiveTab] = useState("pending");
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const { getExpenseNotifications, getEmployeeList } = useExpenseNotification();
  
//   const notifications = getExpenseNotifications.data?.notifications || [];
//   const employeeList = getEmployeeList.data?.employees || [];

//   const filteredNotifications = selectedEmployee 
//     ? notifications.filter(notif => notif.employeeId._id === selectedEmployee._id)
//     : notifications;

//   const filteredEmployees = employeeList.filter(emp => 
//     emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     emp.last_name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <Box>
//       <div className="flex">
//         {/* Left sidebar */}
//         <div className="w-1/4 min-h-screen border-r bg-white p-4">
//           <div className="mb-4">
//             <div className="flex items-center border rounded p-2">
//               <Search className="text-gray-400 mr-2" />
//               <input
//                 type="text"
//                 placeholder="Search Employee"
//                 className="w-full outline-none"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
//           <List>
//             <ListItem 
//               button 
//               selected={!selectedEmployee}
//               onClick={() => setSelectedEmployee(null)}
//             >
//               <ListItemText primary="All Employees" />
//             </ListItem>
//             {filteredEmployees.map(employee => (
//               <ListItem 
//                 button 
//                 key={employee._id}
//                 selected={selectedEmployee?._id === employee._id}
//                 onClick={() => setSelectedEmployee(employee)}
//               >
//                 <ListItemText 
//                   primary={`${employee.first_name} ${employee.last_name}`}
//                   secondary={employee.employeeId}
//                 />
//               </ListItem>
//             ))}
//           </List>
//         </div>

//         {/* Main content */}
//         <div className="w-3/4">
//           <article className="w-full min-h-[90vh] border-l-[.5px] bg-gray-50">
//             <div className="px-4 pt-2">
//               <HeadingOneLineInfo
//                 heading="Expense Notifications"
//                 info="Review and track expense report updates"
//               />
//             </div>

//              <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} className="px-4">
//               <Tab label="Pending" value="pending" />
//               {/* <Tab label="Archive" value="archive" /> */}
//             </Tabs>

//             <div className="md:px-4 px-0">
//               {getExpenseNotifications.isLoading ? (
//                 <div className="flex justify-center my-4">
//                   <CircularProgress />
//                 </div>
//               ) : filteredNotifications.length === 0 ? (
//                 <div className="flex px-4 w-full items-center my-4">
//                   <h1 className="text-lg w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
//                     <Info /> No expense notifications found
//                   </h1>
//                 </div>
//               ) : (
//                 filteredNotifications
//                   .filter(notification => 
//                     activeTab === "pending" ? !notification.read : notification.read
//                   )
//                   .map((notification) => (
//                     <div key={notification._id} className="w-full bg-white shadow-md mb-3 p-4 rounded-md">
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <h2 className="text-lg font-semibold">{notification.message}</h2>
//                           <div className="text-sm text-gray-600">
//                             Employee: {notification.employeeId?.first_name} {notification.employeeId?.last_name}
//                           </div>
//                           <div className="text-sm text-gray-600">
//                             Type: {notification.notificationType}
//                           </div>
//                           <div className="text-sm text-gray-600">
//                             Amount: ₹{notification.expenseId?.amount || notification.expenseId?.totalAmount}
//                           </div>
//                         </div>
//                         <div className="text-sm text-gray-700 underline">
//                           {moment(notification.createdAt).fromNow()}
//                         </div>
//                       </div>
//                     </div>
//                   ))
//               )}
//             </div>
//           </article>
//         </div>
//       </div>
//     </Box>
//   );
// };

// export default ExpenseNotifications;


//updated
// import { Info, Search, West } from "@mui/icons-material";
// import { Avatar, CircularProgress, Box, Tabs, Tab, List, ListItem, ListItemText } from "@mui/material";
// import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
// import moment from "moment";
// import React, { useState } from "react";
// import HeadingOneLineInfo from "../HeadingOneLineInfo/HeadingOneLineInfo";
// import useExpenseNotification from "../../hooks/QueryHook/notification/expense-notification/useExpenseNotification";
// const ExpenseNotifications = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const { getExpenseNotifications, getEmployeeList } = useExpenseNotification();
  
//   const notifications = getExpenseNotifications.data?.notifications || [];
//   const employeeList = getEmployeeList.data?.employees || [];

//   const handleEmployeeClick = (employee) => {
//     setSelectedEmployee(employee);
//   };

//   let filteredEmployees = [];
//   if (Array.isArray(employeeList)) {
//     filteredEmployees = employeeList.filter(
//       (employee) =>
//         employee?.first_name
//           .toLowerCase()
//           .includes(searchQuery.toLowerCase()) ||
//         employee?.last_name
//           .toLowerCase()
//           .includes(searchQuery.toLowerCase())
//     );
//   }

//   const filteredNotifications = selectedEmployee
//     ? notifications.filter(
//         (notification) => notification.employeeId._id === selectedEmployee._id
//       )
//     : notifications;

//   return (
//     <Box>
//       <section className="min-h-[90vh] flex">
//         <article className="md:w-[25%] w-[200px] overflow-auto h-[90vh]">
//           <div className="p-2 my-2 !py-2">
//             <div className="space-y-2">
//               <div className="flex rounded-md items-center px-2 outline-none border-gray-200 border-[.5px] bg-white py-1 md:py-[6px]">
//                 <Search className="text-gray-700 md:text-lg !text-[1em]" />
//                 <input
//                   type="text"
//                   placeholder="Search Employee"
//                   className="border-none bg-white w-full outline-none px-2"
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
//                   className={`px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50 cursor-pointer ${
//                     selectedEmployee?._id === employee._id ? "bg-blue-50" : ""
//                   }`}
//                   key={employee?._id}
//                   onClick={() => handleEmployeeClick(employee)}
//                 >
//                   <Avatar src={employee?.avatarSrc} />
//                   <div>
//                     <h1 className="text-[1.2rem]">
//                       {employee?.first_name} {employee?.last_name}
//                     </h1>
//                     <h1 className="text-sm text-gray-500">
//                       {employee?.email}
//                     </h1>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </article>

//         <article className="w-[75%] min-h-[90vh] border-l-[.5px] bg-gray-50">
//           <div className="px-4 pt-2">
//             <HeadingOneLineInfo
//               heading="Expense Notifications"
//               info="Review and manage expense notifications"
//             />
//           </div>

//           {selectedEmployee ? (
//             <div className="md:px-4 px-0">
//               {filteredNotifications.map((notification) => (
//                 <div key={notification._id} className="w-full bg-white shadow-md mb-3 p-4 rounded-md">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <h2 className="text-lg font-semibold">{notification.message}</h2>
//                       <div className="text-sm text-gray-600">
//                         Type: {notification.notificationType}
//                       </div>
//                       <div className="text-sm text-gray-600">
//                         Amount: ₹{notification.expenseId?.amount || notification.expenseId?.totalAmount}
//                       </div>
//                     </div>
//                     <div className="text-sm text-gray-700">
//                       {moment(notification.createdAt).fromNow()}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="flex px-4 w-full items-center my-4">
//               <h1 className="text-lg w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
//                 <Info /> Select employee to see their notifications
//               </h1>
//             </div>
//           )}
//         </article>
//       </section>
//     </Box>
//   );
// };
// export default ExpenseNotifications;


// import { Info, Search } from "@mui/icons-material";
// import { Avatar, CircularProgress, Box } from "@mui/material";
// import moment from "moment";
// import React, { useState } from "react";
// import useExpenseNotification from "../../hooks/QueryHook/notification/expense-notification/useExpenseNotification";

// const ExpenseNotifications = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const { getExpenseNotifications, getEmployeeList } = useExpenseNotification();

//   const notifications = getExpenseNotifications.data?.notifications || [];
//   const employeeList = getEmployeeList.data || [];

//   const filteredEmployees = employeeList.filter((employee) =>
//     employee?.employeeName?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const filteredNotifications = selectedEmployee
//     ? notifications.filter(
//         (notification) => notification.employeeId === selectedEmployee.employeeId
//       )
//     : notifications;

//   const getNotificationColor = (type) => {
//     switch (type) {
//       case "STATUS_CHANGE":
//         return "text-blue-600";
//       case "PAYMENT":
//         return "text-green-600";
//       default:
//         return "text-gray-600";
//     }
//   };

//   return (
//     <Box>
//       <section className="min-h-[90vh] flex">
//         {/* Left Panel - Employee List */}
//         <article className="md:w-[25%] w-[200px] overflow-auto h-[90vh] border-r">
//           <div className="p-4 sticky top-0 bg-white z-10">
//             <div className="flex items-center border rounded p-2">
//               <Search className="text-gray-400 mr-2" />
//               <input
//                 type="text"
//                 placeholder="Search Employee"
//                 className="w-full outline-none"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="px-2">
//             {getEmployeeList.isLoading ? (
//               <div className="flex justify-center p-4">
//                 <CircularProgress size={24} />
//               </div>
//             ) : filteredEmployees.length > 0 ? (
//               filteredEmployees.map((employee) => (
//                 <div
//                   key={employee.employeeId}
//                   onClick={() => setSelectedEmployee(employee)}
//                   className={`p-3 rounded-lg mb-2 cursor-pointer transition-all ${
//                     selectedEmployee?.employeeId === employee.employeeId
//                       ? "bg-blue-50 border border-blue-200"
//                       : "hover:bg-gray-50"
//                   }`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <Avatar className="!bg-blue-500">
//                       {employee.employeeName?.charAt(0)}
//                     </Avatar>
//                     <div>
//                       <h3 className="font-medium">{employee.employeeName}</h3>
//                       <p className="text-sm text-gray-500">
//                         {employee.employeeEmail}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-gray-500 p-4">No employees found</p>
//             )}
//           </div>
//         </article>

//         {/* Right Panel - Notifications */}
//         <article className="flex-1 bg-gray-50 p-4">
//           <div className="mb-4">
//             <h1 className="text-xl font-semibold">Expense Notifications</h1>
//             <p className="text-gray-600">
//               {selectedEmployee
//                 ? `Showing notifications for ${selectedEmployee.employeeName}`
//                 : "Select an employee to view their notifications"}
//             </p>
//           </div>

//           {getExpenseNotifications.isLoading ? (
//             <div className="flex justify-center p-4">
//               <CircularProgress />
//             </div>
//           ) : filteredNotifications.length > 0 ? (
//             <div className="space-y-4">
//               {filteredNotifications.map((notification) => (
//                 <div
//                   key={notification._id}
//                   className="bg-white rounded-lg shadow p-4"
//                 >
//                   <div className="flex justify-between">
//                     <div>
//                       <h3
//                         className={`font-medium ${getNotificationColor(
//                           notification.notificationType
//                         )}`}
//                       >
//                         {notification.message}
//                       </h3>
//                       <div className="mt-2 space-y-1 text-sm text-gray-600">
//                         <p>Type: {notification.notificationType}</p>
//                         <p>
//                           Amount: ₹
//                           {notification.expenseId?.amount ||
//                             notification.expenseId?.totalAmount}
//                         </p>
//                         {notification.paymentMethod && (
//                           <p>Payment Method: {notification.paymentMethod}</p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="text-sm text-gray-500">
//                       {moment(notification.createdAt).fromNow()}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <Info className="text-blue-500 mr-2" />
//               No notifications found
//             </div>
//           )}
//         </article>
//       </section>
//     </Box>
//   );
// };

// export default ExpenseNotifications;

// 😑

// import { Info, Search } from "@mui/icons-material";
// import { Avatar, CircularProgress, Box } from "@mui/material";
// import moment from "moment";
// import React, { useState } from "react";
// import useExpenseNotification from "../../hooks/QueryHook/notification/expense-notification/useExpenseNotification";

// const ExpenseNotifications = ({filterOrgData}) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const { getExpenseNotifications, getEmployeeList } = useExpenseNotification();



  
//   const notifications = getExpenseNotifications.data?.notifications || [];
//   const employeeList = getEmployeeList.data || [];

//   const filteredEmployees = employeeList.filter((employee) =>
//     employee?.employeeName?.toLowerCase().includes(searchQuery.toLowerCase())
//   );


//   // Filter notifications based on selected employee
//   // const filteredNotifications = selectedEmployee
//   //   ? notifications.filter(
//   //       (notification) => notification.employeeId === selectedEmployee.employeeId
//   //     )
//   //   : [];
  
//   const filteredNotifications = notifications?.filter((notification) => {
//       // console.log(" EN Notification Employee ID:", notification.employeeId);
//       // console.log("EN Selected Employee ID:", selectedEmployee.employeeId);
//       return notification?.employeeId?._id === selectedEmployee?.employeeId;
//     });


// console.log('EN Selected Employee:', selectedEmployee);
// console.log('EN All Notifications:', notifications);
// console.log('EN Filtered Notifications:', filteredNotifications);


//   const getNotificationColor = (type) => {
//     switch (type) {
//       case "STATUS_CHANGE":
//         return "text-blue-600";
//       case "PAYMENT":
//         return "text-green-600";
//       default:
//         return "text-gray-600";
//     }
//   };

//   return (
//     <Box>
//       <section className="min-h-[90vh] flex">
//         {/* Left Panel - Employee List */}
//         <article className="md:w-[25%] w-[200px] overflow-auto h-[90vh] border-r">
//           <div className="p-4 sticky top-0 bg-white z-10">
//             <div className="flex items-center border rounded p-2">
//               <Search className="text-gray-400 mr-2" />
//               <input
//                 type="text"
//                 placeholder="Search Employee"
//                 className="w-full outline-none"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="px-2">
//             {getEmployeeList.isLoading ? (
//               <div className="flex justify-center p-4">
//                 <CircularProgress size={24} />
//               </div>
//             ) : filteredEmployees.length > 0 ? (
//               filteredEmployees.map((employee) => (
//                 <div
//                   key={employee.employeeId}
//                   onClick={() => setSelectedEmployee(employee)}
//                   className={`p-3 rounded-lg mb-2 cursor-pointer transition-all ${
//                     selectedEmployee?.employeeId === employee.employeeId
//                       ? "bg-blue-50 border border-blue-200"
//                       : "hover:bg-gray-50"
//                   }`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <Avatar className="!bg-blue-500">
//                       {employee.employeeName?.charAt(0)}
//                     </Avatar>
//                     <div>
//                       <h3 className="font-medium">{employee.employeeName}</h3>
//                       <p className="text-sm text-gray-500">
//                         {employee.employeeEmail}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-gray-500 p-4">No employees found</p>
//             )}
//           </div>
//         </article>

//         {/* Right Panel - Notifications */}
//         <article className="flex-1 bg-gray-50 p-4">
//           <div className="mb-4">
//             <h1 className="text-xl font-semibold">Expense Notifications</h1>
//             <p className="text-gray-600">
//               {selectedEmployee
//                 ? `Showing notifications for ${selectedEmployee.employeeName}`
//                 : "Select an employee to view their notifications"}
//             </p>
//           </div>

//           {/* Handle Loading State */}
//           {getExpenseNotifications.isLoading ? (
//             <div className="flex justify-center p-4">
//               <CircularProgress />
//             </div>
//           ) : !selectedEmployee ? (
//             /* Display Message if No Employee is Selected */
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
//               <Info className="text-blue-500 mr-2" />
//               <span>Select an employee to see their requests</span>
//             </div>
//           ) : filteredNotifications.length > 0 ? (
//             /* Show Notifications if Available */
//             <div className="space-y-4">
//               {filteredNotifications.map((notification) => (
//                 <div
//                   key={notification._id}
//                   className="bg-white rounded-lg shadow p-4"
//                 >
//                   <div className="flex justify-between">
//                     <div>
//                       <h3
//                         className={`font-medium ${getNotificationColor(
//                           notification.notificationType
//                         )}`}
//                       >
//                         {notification.message}
//                       </h3>
//                       <div className="mt-2 space-y-1 text-sm text-gray-600">
//                         <p>Type: {notification.notificationType}</p>
//                         <p>
//                           Amount: ₹
//                           {notification.expenseId?.amount ||
//                             notification.expenseId?.totalAmount}
//                         </p>
//                         {notification.paymentMethod && (
//                           <p>Payment Method: {notification.paymentMethod}</p>
//                         )}
//                       </div>
//                     </div>
//                     <div className="text-sm text-gray-500">
//                       {moment(notification.createdAt).fromNow()}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             /* Display Message if No Notifications Found */
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
//               <Info className="text-blue-500 mr-2" />
//               <span>No notifications found</span>
//             </div>
//           )}
//         </article>
//       </section>
//     </Box>
//   );
// };

// export default ExpenseNotifications;

//😑😑
import { Info, Search } from "@mui/icons-material";
import { Avatar, CircularProgress, Box } from "@mui/material";
import moment from "moment";
import React, { useState, useEffect } from "react";
import useExpenseNotification from "../../hooks/QueryHook/notification/expense-notification/useExpenseNotification";
import axios from "axios";
import useAuthToken from "../../hooks/Token/useAuth";

const ExpenseNotifications = ({filterOrgData}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeNotifications, setEmployeeNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getExpenseNotifications, getEmployeeList } = useExpenseNotification();
  const authToken = useAuthToken();

  const notifications = getExpenseNotifications.data?.notifications || [];
  const employeeList = getEmployeeList.data || [];

  console.log("Employee List:", employeeList);
  console.log("All Notifications:", notifications);

  const filteredEmployees = employeeList.filter((employee) =>
    employee?.employeeName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch employee-specific notifications directly from API when an employee is selected
  useEffect(() => {
    const fetchEmployeeNotifications = async () => {
      if (!selectedEmployee) return;
      
      setLoading(true);
      try {
        console.log(`Fetching notifications for employee ID: ${selectedEmployee.employeeId}`);
        
        // Try to fetch directly from the API
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/expense-notifications`,
          {
            headers: { Authorization: authToken }
          }
        );
        
        console.log("API Response:", response.data);
        
        if (response.data && response.data.notifications) {
          // Filter notifications for this employee
          const employeeNotifs = response.data.notifications.filter(notification => {
            // Extract employee ID from notification
            let notificationEmployeeId;
            
            if (notification.employeeId) {
              // Handle both object and string formats
              notificationEmployeeId = typeof notification.employeeId === 'object' 
                ? notification.employeeId._id 
                : notification.employeeId;
            } else if (notification.employee) {
              // Some APIs might use 'employee' instead of 'employeeId'
              notificationEmployeeId = typeof notification.employee === 'object'
                ? notification.employee._id
                : notification.employee;
            }
            
            console.log(`Comparing: ${notificationEmployeeId} with ${selectedEmployee.employeeId}`);
            return notificationEmployeeId === selectedEmployee.employeeId;
          });
          
          console.log("Filtered employee notifications:", employeeNotifs);
          setEmployeeNotifications(employeeNotifs);
        }
      } catch (error) {
        console.error("Error fetching employee notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployeeNotifications();
  }, [selectedEmployee, authToken]);

  const getNotificationColor = (type) => {
    switch (type) {
      case "STATUS_CHANGE":
        return "text-blue-600";
      case "PAYMENT":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Box>
      <section className="min-h-[90vh] flex">
        {/* Left Panel - Employee List */}
        <article className="md:w-[25%] w-[200px] overflow-auto h-[90vh] border-r">
          <div className="p-4 sticky top-0 bg-white z-10">
            <div className="flex items-center border rounded p-2">
              <Search className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search Employee"
                className="w-full outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="px-2">
            {getEmployeeList.isLoading ? (
              <div className="flex justify-center p-4">
                <CircularProgress size={24} />
              </div>
            ) : filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <div
                  key={employee.employeeId}
                  onClick={() => setSelectedEmployee(employee)}
                  className={`p-3 rounded-lg mb-2 cursor-pointer transition-all ${
                    selectedEmployee?.employeeId === employee.employeeId
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="!bg-blue-500">
                      {employee.employeeName?.charAt(0)}
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{employee.employeeName}</h3>
                      <p className="text-sm text-gray-500">
                        {employee.employeeEmail}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 p-4">No employees found</p>
            )}
          </div>
        </article>

        {/* Right Panel - Notifications */}
        <article className="flex-1 bg-gray-50 p-4">
          <div className="mb-4">
            <h1 className="text-xl font-semibold">Expense Notifications</h1>
            <p className="text-gray-600">
              {selectedEmployee
                ? `Showing notifications for ${selectedEmployee.employeeName}`
                : "Select an employee to view their notifications"}
            </p>
            
            {/* Debug info */}
            {/* {selectedEmployee && (
              <div className="text-xs text-gray-500 mt-1">
                Employee ID: {selectedEmployee.employeeId}
              </div>
            )} */}
          </div>

          {/* Handle Loading State */}
          {getExpenseNotifications.isLoading || loading ? (
            <div className="flex justify-center p-4">
              <CircularProgress />
            </div>
          ) : !selectedEmployee ? (
            /* Display Message if No Employee is Selected */
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
              <Info className="text-blue-500 mr-2" />
              <span>Select an employee to see their requests</span>
            </div>
          ) : employeeNotifications.length > 0 ? (
            /* Show Notifications if Available */
            <div className="space-y-4">
              {employeeNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className="bg-white rounded-lg shadow p-4"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3
                        className={`font-medium ${getNotificationColor(
                          notification.notificationType
                        )}`}
                      >
                        {notification.message}
                      </h3>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p>Type: {notification.notificationType}</p>
                        <p>
                          Amount: ₹
                          {notification.expenseId?.amount ||
                            notification.expenseId?.totalAmount || "N/A"}
                        </p>
                        {notification.paymentMethod && (
                          <p>Payment Method: {notification.paymentMethod}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {moment(notification.createdAt).fromNow()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Display Message if No Notifications Found */
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
              <Info className="text-blue-500 mr-2" />
              <span>No notifications found for this employee</span>
            </div>
          )}
        </article>
      </section>
    </Box>
  );
};

export default ExpenseNotifications;
