// /* eslint-disable no-unused-vars */
// import { useQuery } from 'react-query';
// import axios from 'axios';
// import useAuthToken from '../../../Token/useAuth';
// import { useParams } from 'react-router-dom';
// import UserProfile from '../../../UserData/useUser';

// const useExpenseNotification = () => {
//   const authToken = useAuthToken();
//   const { getCurrentUser, useGetCurrentRole } = UserProfile();
//   const user = getCurrentUser();
//   const role = useGetCurrentRole();
//   const { organisationId } = useParams();


//   const getEmployeeList = useQuery(
//     ['expenseEmployeeList', organisationId],
//     async () => {
//       const response = await axios.get(
//         // `${process.env.REACT_APP_API}/route/expense/employees-with-notifications`,
//         // `${process.env.REACT_APP_API}/route/expense/employees-with-notifications/${organisationId}`,
//         `${process.env.REACT_APP_API}/route/organization/get-notification-all?key=Expense Management&organisationId=${organisationId}`,
//         {
//           headers: { Authorization: authToken } 
//         }
//       );
//       // return response.data;
//       return response.data.data.expenses[0].arrayOfEmployee;
//     },
//     {
//       enabled: role !== 'Employee'
//     }
//   );



//   const getExpenseNotifications = useQuery(
//     ['expenseNotifications', organisationId],
//     async () => {
//       const response = await axios.get(
//         // `${process.env.REACT_APP_API}/route/expense-notifications`,
//         `${process.env.REACT_APP_API}/route/expense-notifications`,
//         {  
//           headers: { Authorization: authToken }
//         }
//       );
//       return response.data;
//     },
//     {
//       enabled: role !== 'Employee'
//     }
//   );


 
  

//   const getEmployeeExpenseNotifications = useQuery(
//     ['employeeExpenseNotifications', organisationId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/expense/employee-notifications`,
//         // `${process.env.REACT_APP_API}/route/expense/employee-notifications/${organisationId}`,
//         {
//           headers: { Authorization: authToken }
//         }
//       );
//       return response.data;
//     },
//     {
//       enabled: role === 'Employee',
//       refetchInterval: 30000 // Refetch every 30 seconds for real-time updates
//     }
//   );

//   return {
//     getExpenseNotifications,
//     getEmployeeExpenseNotifications,
//     getEmployeeList
//   };
// };

// export default useExpenseNotification;

/* eslint-disable no-unused-vars */
// 😑
// import { useQuery } from 'react-query';
// import axios from 'axios';
// import useAuthToken from '../../../Token/useAuth';
// import { useParams } from 'react-router-dom';
// import UserProfile from '../../../UserData/useUser';

// const useExpenseNotification = () => {
//   const authToken = useAuthToken();
//   const { getCurrentUser, useGetCurrentRole } = UserProfile();
//   const user = getCurrentUser();
//   const role = useGetCurrentRole();
//   const { organisationId } = useParams();

//   const isSuperAdmin = role === "Super-Admin";

//   // For admin/manager - get list of employees with notifications
//   const getEmployeeList = useQuery(
//     ['expenseEmployeeList', organisationId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/organization/get-notification-all?key=Expense Management&organisationId=${organisationId}`,
//         {
//           headers: { Authorization: authToken } 
//         }
//       );
//       return response.data.data.expenses[0].arrayOfEmployee;
//     },
//     {
//       enabled: role !== 'Employee'
//     }
//   );

//   // For admin/manager - get all expense notifications
//   const getExpenseNotifications = useQuery(
//     ['expenseNotifications', organisationId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/expense-notifications`,
//         {  
//           headers: { Authorization: authToken }
//         }
//       );
//       return response.data;
//     },
//     {
//       enabled: role !== 'Employee'
//     }
//   );

//   // For employees - get their own notifications
//   const getEmployeeExpenseNotifications = useQuery(
//     ['employeeExpenseNotifications', user?._id],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/expense/employee-notifications`,
//         {
//           headers: { Authorization: authToken }
//         }
//       );
//       return response.data;
//     },
//     {
//       enabled: role === 'Employee',
//       refetchInterval: 30000 // Refetch every 30 seconds for real-time updates
//     }
//   );
  
//   // Get notification count for specific employees (for admin/manager view)
//   const getNotificationCountForEmployees = (employeeIds = []) => {
//     if (!getExpenseNotifications.data?.notifications) return 0;
    
//     // If no specific employees are selected, return total unread count
//     if (!employeeIds.length) {
//       return getExpenseNotifications.data.notifications.reduce(
//         (total, notification) => total + (notification.read ? 0 : 1), 
//         0
//       );
//     }
    
//     // Count only notifications for selected employees
//     return getExpenseNotifications.data.notifications.reduce(
//       (total, notification) => {
//         // Check if this notification belongs to one of the selected employees
//         if (employeeIds.includes(notification.employeeId?._id) && !notification.read) {
//           return total + 1;
//         }
//         return total;
//       }, 
//       0
//     );
//   };

//   // Get notification count for the logged-in employee
//   const getEmployeeNotificationCount = () => {
//     if (!getEmployeeExpenseNotifications.data?.notifications) return 0;
    
//     return getEmployeeExpenseNotifications.data.notifications.reduce(
//       (total, notification) => total + (notification.read ? 0 : 1),
//       0
//     );
//   };

//   return {
//     getExpenseNotifications,
//     getEmployeeExpenseNotifications,
//     getEmployeeList,
//     getNotificationCountForEmployees,
//     getEmployeeNotificationCount
//   };
// };

// export default useExpenseNotification;


//😑😑
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
import { useQuery } from 'react-query';
import axios from 'axios';
import useAuthToken from '../../../Token/useAuth';
import { useParams } from 'react-router-dom';
import UserProfile from '../../../UserData/useUser';

const useExpenseNotification = () => {
  const authToken = useAuthToken();
  const { getCurrentUser, useGetCurrentRole } = UserProfile();
  const user = getCurrentUser();
  const role = useGetCurrentRole();
  const { organisationId } = useParams();

  // For admin/manager - get list of employees with notifications
  const getEmployeeList = useQuery(
    ['expenseEmployeeList', organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/get-notification-all?key=Expense Management&organisationId=${organisationId}`,
        {
          headers: { Authorization: authToken } 
        }
      );
      console.log("Employee List API Response:", response.data);
      return response.data.data.expenses[0].arrayOfEmployee;
    },
    {
      enabled: role !== 'Employee' && !!organisationId
    }
  );

  // For admin/manager - get all expense notifications
  const getExpenseNotifications = useQuery(
    ['expenseNotifications', organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/expense-notifications`,
        {  
          headers: { Authorization: authToken }
        }
      );
      console.log("All Notifications API Response:", response.data);
      return response.data;
    },
    {
      enabled: role !== 'Employee'
    }
  );

  // For employees - get their own notifications
  const getEmployeeExpenseNotifications = useQuery(
    ['employeeExpenseNotifications', user?._id],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/expense/employee-notifications`,
        {
          headers: { Authorization: authToken }
        }
      );
      return response.data;
    },
    {
      enabled: role === 'Employee' && !!user?._id,
      refetchInterval: 30000 // Refetch every 30 seconds for real-time updates
    }
  );

  // Helper function to filter notifications for a specific employee
  // const getNotificationsForEmployee = (employeeId) => {
  //   if (!getExpenseNotifications.data?.notifications || !employeeId) {
  //     return [];
  //   }
    
  //   return getExpenseNotifications.data.notifications.filter(notification => {
  //     // Extract employee ID from notification
  //     let notificationEmployeeId;
      
  //     if (notification.employeeId) {
  //       // Handle both object and string formats
  //       notificationEmployeeId = typeof notification.employeeId === 'object' 
  //         ? notification.employeeId._id 
  //         : notification.employeeId;
  //     } else if (notification.employee) {
  //       // Some APIs might use 'employee' instead of 'employeeId'
  //       notificationEmployeeId = typeof notification.employee === 'object'
  //         ? notification.employee._id
  //         : notification.employee;
  //     }
      
  //     return notificationEmployeeId === employeeId;
  //   });
  // };
  // Helper function to filter notifications for a specific employee
const getNotificationsForEmployee = (employeeId) => {
  console.log("Getting notifications for employee ID:", employeeId);
  console.log("All notifications data:", getExpenseNotifications.data);
  
  if (!getExpenseNotifications.data?.notifications || !employeeId) {
    console.log("No notifications data available or no employee ID provided");
    return [];
  }
  
  const filteredNotifications = getExpenseNotifications.data.notifications.filter(notification => {
    // Extract employee ID from notification
    let notificationEmployeeId;
    
    if (notification.employeeId) {
      // Handle both object and string formats
      notificationEmployeeId = typeof notification.employeeId === 'object' 
        ? notification.employeeId._id 
        : notification.employeeId;
      
      console.log("Notification employee ID (from employeeId):", notificationEmployeeId);
    } else if (notification.employee) {
      // Some APIs might use 'employee' instead of 'employeeId'
      notificationEmployeeId = typeof notification.employee === 'object'
        ? notification.employee._id
        : notification.employee;
      
      console.log("Notification employee ID (from employee):", notificationEmployeeId);
    }
    
    // Log the comparison
    console.log(`Comparing: ${notificationEmployeeId} === ${employeeId} => ${notificationEmployeeId === employeeId}`);
    
    return notificationEmployeeId === employeeId;
  });
  
  console.log("Filtered notifications result:", filteredNotifications);
  return filteredNotifications;
};


  return {
    getExpenseNotifications,
    getEmployeeExpenseNotifications,
    getEmployeeList,
    getNotificationsForEmployee
  };
};

export default useExpenseNotification;
