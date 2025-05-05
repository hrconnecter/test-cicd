/* eslint-disable no-unused-vars */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { UseContext } from "../../../State/UseState/UseContext";
import GeoFencingAcceptModal from "../../../components/Modal/RemotePunchingModal/GeoFencingAcceptModal";
import useIncomeTax from "../../../hooks/IncomeTax/useIncomeTax";
import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";
import useForm16NotificationHook from "../../../hooks/QueryHook/notification/Form16Notification/useForm16NotificationHook";
import usePayslipNotificationHook from "../../../hooks/QueryHook/notification/PayslipNotification/usePayslipNotificaitonHook";
import useAdvanceSalaryData from "../../../hooks/QueryHook/notification/advance-salary-notification/useAdvanceSalary";
import useDepartmentNotification from "../../../hooks/QueryHook/notification/department-notification/hook";
import useLeaveNotificationHook from "../../../hooks/QueryHook/notification/leave-notification/hook";
import useLoanNotification from "../../../hooks/QueryHook/notification/loan-notification/useLoanNotificaiton";
import usePunchNotification from "../../../hooks/QueryHook/notification/punch-notification/hook";
import useShiftNotification from "../../../hooks/QueryHook/notification/shift-notificatoin/hook";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import useHook from "../../../hooks/UserProfile/useHook";
import AdvanceSalaryNotification from "../../AdvanceSalaryNotification/AdvanceSalaryNotification";
import AdvanceSalaryNotificationToEmp from "../../AdvanceSalaryNotification/AdvanceSalaryNotificationToEmp";
import OrderNotifications from "../../CateringAndFood/Notification/OrderNotifications";
import EmpOrdersNotifications from "../../CateringAndFood/Notification/emporders";
import DepartmentNotification from "../../DeptNotification/DepartmentNotification";
import DepartmentNotificationToEmp from "../../DeptNotification/DepartmentNotificationToEmp";
import DocumentApproval from "../../DocumentManagement/Docmanagenotification/DocumentApproval";
import useEmployeeDocumentNotification from "../../../hooks/QueryHook/notification/document-notification/useEmployeeDocumentNotification";
import EmployeeDocumentNotifications from "../../DocumentManagement/EmployeeDocumentNotifications/EmployeeDocumentNotifications";
import Form16NotificationToEmp from "../../Form16NotificationToEmp/Form16NotificationToEmp";
import FullskapeempNotification from "../../FullskapeNotification/FullskapeempNotification";
import FullskapesaNotification from "../../FullskapeNotification/fullskapesanotification";
import useOrgGeo from "../../Geo-Fence/useOrgGeo";
import IncomeTaxNotification from "../../Income/IncomeTaxNotification";
import DeclarationPage from "../../Income/components/accountantDeclarations/DeclarationPage";
import LoanMgtNotification from "../../LoanMgtNotified/LoanMgtNotification";
import LoanNotificationToEmp from "../../LoanMgtNotified/LoanNotificationToEmp";
import PayslipNotification from "../../PayslipNotification/PayslipNotification";
import RecruitmentApproval from "../../Recruitment/components/RecruitmentApproval";
import SelfInterviewShedule from "../../Recruitment/components/SelfInterviewShedule";
import ShortlisttedNotiMR from "../../Recruitment/components/ShortlisttedNotiMR";
import SelfLeaveNotification from "../../SelfLeaveNotification/page";
import useLeaveNotification from "../../SelfLeaveNotification/useLeaveNotification";
import UseEmployeeShiftNotification from "../../SelfShiftNotification/UseEmployeeShiftNotification";
import SelfShiftNotification from "../../SelfShiftNotification/page";
import EmployeeTrainingNoteification from "../../Training/EmployeeTrainingNoteification";
import TrainingNotification from "../../Training/TrainingNotification";
import EmpGeoFencingNotification from "../../emp-notifications/EmpGeoFencingNotification";
import EmpNotificationData from "../../emp-notifications/EmpNotification";
import LeaveAcceptModal from "../../leave-notification/LeaveAcceptModal";
import PunchNotification from "../../punch-notification/page";
import ShiftNotification from "../../shift-notification/page";
import  ExpenseNotifications from "../../../components/ExpenseManagement/ExpenseNotifications";
import EmployeeExpenseNotifications from "../../../components/ExpenseManagement/ExpenseNotifications/EmployeeExpenseNotifications";
// import AssetReturnModal from "../../../components/Modal/AssetReturnModal/AssetReturnModal";
//tue
// Add imports for the new components
import AssetReturnModal from "../../../components/Modal/AssetReturnModal/AssetReturnModal";
import AssetReturnApprovalModal from "../../../components/Modal/AssetReturnModal/AssetReturnApprovalModal";
// import AssetReturnNotification from './AssetReturnNotification';


import useExpenseNotification from '../../../hooks/QueryHook/notification/expense-notification/useExpenseNotification';

const useNotification = () => {
  //testing code for dev branch on git hub
  const { cookies } = useContext(UseContext);
  const { organisationId } = useParams();
  const token = cookies["aegis"];
  const authToken = useAuthToken();
  const { getCurrentUser, useGetCurrentRole } = UserProfile();
  const user = getCurrentUser();
  const role = useGetCurrentRole();

  const { data: orgData } = useSubscriptionGet({ organisationId });
  const { data } = useLeaveNotificationHook(); //super admin and manager side notification
  const { data: shiftNotification, accData } = useShiftNotification(); //super admin and manager side notification
  const { data: employeeShiftNotification } = UseEmployeeShiftNotification(); //employee side notification
  const { data: selfLeaveNotification } = useLeaveNotification();
  const { documentNotificationCount } = useEmployeeDocumentNotification();
  const { data: data3 } = usePunchNotification();
  // const { assetReturnNotificationCount } = useAssetReturnNotification();


  //states
  const [emp, setEmp] = useState();
  console.log(emp);
  const [shiftCount, setShiftCount] = useState(0);
  const [shiftAccCount, setShiftAccCount] = useState(0);
  const [employeeShiftCount, setEmployeeShiftCount] = useState(0);
  const [leaveCount, setLeaveCount] = useState(0);
  const [employeeLeaveCount, setEmployeeLeaveCount] = useState(0);
  const [loanCount, setLoanCount] = useState(0);
  const [empLoanCount, setEmpLoanCount] = useState(0);
  const [advanceSalaryCount, setAdvanceSalaryCount] = useState(0);
  const [empAdvanceSalaryCount, setEmpAdvanceSalaryCount] = useState(0);
  const [TDSCount, setTDSCount] = useState(0);
  const [TDSCountEmp, setTDSCountEmp] = useState(0);
  const [expenseNotificationCount, setExpenseNotificationCount] = useState(0);
  const { getExpenseNotifications, getEmployeeExpenseNotifications } = useExpenseNotification();
  // eslint-disable-next-line no-unused-vars
  const [employeeExpenseNotificationCount, setEmployeeExpenseNotificationCount] = useState(0);

  

  const { UserInformation } = useHook();
  // const navigate = useNavigate();
  const employeeId = user?._id;

  const isvendor = UserInformation?.isVendor;
  // const orgId = UserInformation?.organizationId?._id
  // console.log("UserInformation", UserInformation);

  // useEffect(() => {
  //   if (isvendor) {
  //     navigate(`/organisation/${orgId}/Orders`);
  //   }
  // }, [isvendor, navigate, orgId]);

//expense
// First effect handles admin/manager notifications
useEffect(() => {
  if (getExpenseNotifications?.data?.notifications) {
    const count = getExpenseNotifications.data.notifications.reduce((total, notification) => 
      total + (notification.read ? 0 : 1), 0);
    setExpenseNotificationCount(count);
  }
}, [getExpenseNotifications?.data]);
// Second effect handles employee notifications
// useEffect(() => {
//   if (getEmployeeExpenseNotifications?.data?.notifications) {
//     const count = getEmployeeExpenseNotifications.data.notifications.reduce((total, notification) => 
//       total + (notification.read ? 0 : 1), 0);
//     setEmployeeExpenseNotificationCount(count);
//   }
// }, [getEmployeeExpenseNotifications?.data]);
// Inside useNotification.jsx, update the expense notification count calculation
useEffect(() => {
  if (role === 'Employee') {
    // For employees, use their own notification count
    const count = getEmployeeExpenseNotifications?.data?.notifications?.reduce(
      (total, notification) => total + (notification.read ? 0 : 1), 
      0
    ) || 0;
    setEmployeeExpenseNotificationCount(count);
  } else {
    // For admins/managers, use all notifications count
    if (getExpenseNotifications?.data?.notifications) {
      const count = getExpenseNotifications.data.notifications.reduce(
        (total, notification) => total + (notification.read ? 0 : 1), 
        0
      );
      setExpenseNotificationCount(count);
    }
  }
}, [getExpenseNotifications?.data, getEmployeeExpenseNotifications?.data, role]);

  //---------super admin and manager side leave notification count
  useEffect(() => {
    if (data && data?.leaveRequests && data?.leaveRequests?.length > 0) {
      let total = 0;
      data?.leaveRequests.forEach((item) => {
        total += item.notificationCount;
      });
      setLeaveCount(total);
    } else {
      setLeaveCount(0);
    }
  }, [data]);

  //employee side leave notification count
  useEffect(() => {
    if (
      selfLeaveNotification &&
      selfLeaveNotification?.leaveRequests &&
      selfLeaveNotification?.leaveRequests?.length > 0
    ) {
      let total = 0;
      selfLeaveNotification?.leaveRequests?.forEach((item) => {
        total += item.approveRejectNotificationCount;
      });
      setEmployeeLeaveCount(total);
    } else { 
      setEmployeeLeaveCount(0);
    }
  }, [selfLeaveNotification]);

  const Leavecount =
    role === "Super-Admin" || role === "Manager"
      ? leaveCount
      : employeeLeaveCount;

  //---------super admin and manager side shift notification count
  useEffect(() => {
    if (shiftNotification && shiftNotification?.length > 0) {
      let total = 0;
      shiftNotification.forEach((item) => {
        total += item.notificationCount;
      });
      setShiftCount(total);
    } else {
      setShiftCount(0);
    }
  }, [shiftNotification]);

  //Account side shift notification count
  useEffect(() => {
    if (accData && accData?.length > 0) {
      let total = 0;
      accData.forEach((item) => {
        total += item.accNotificationCount;
      });
      setShiftAccCount(total);
    }
  }, [accData]);

  //employee side shift notification count
  useEffect(() => {
    if (
      employeeShiftNotification &&
      employeeShiftNotification?.requests &&
      employeeShiftNotification?.requests?.length > 0
    ) {
      let total = 0;
      employeeShiftNotification?.requests.forEach((item) => {
        total += item?.approveRejectNotificationCount || 0;
      });
      setEmployeeShiftCount(total);
    } else {
      setEmployeeShiftCount(0);
    }
  }, [employeeShiftNotification]);

  const count =
    role === "Super-Admin" || role === "Manager"
      ? shiftCount
      : role === "Accountant"
      ? shiftAccCount
      : employeeShiftCount;

  //Fullskape Notification count

  const { data: notificationsData } = useQuery({
    queryKey: ["notifications", organisationId],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/${organisationId}/notifications`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return res.data;
      } catch (error) {
        console.error("Error fetching notifications:", error);
        return { data: [] }; // Return an empty array to handle gracefully
      }
    },
    enabled: organisationId !== undefined,
  });

  // Calculate unread notification count
  const unreadNotificationCount = notificationsData?.data?.reduce(
    (count, notification) => (!notification.read ? count + 1 : count),
    0
  );

  let fullskapenotiCount;
  if (role === "Employee") {
    // Check if geoFencingArea is true and then assign the approveRejectNotificationCount
    const punchData = notificationsData?.data?.[0];
    console.log("punchData", punchData);

    if (punchData?.geoFencingArea === true) {
      fullskapenotiCount = unreadNotificationCount;
    } else {
      fullskapenotiCount = 0;
    }
  } else {
    fullskapenotiCount = unreadNotificationCount;
  }

  //------Food catering count
  const { data: foodcateringdata } = useQuery({
    queryKey: ["ordernotifications", employeeId],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/notifications/${employeeId}`
        );
        console.log("API Response:", res.data); // Log full API response
        return res.data;
      } catch (error) {
        console.error("Error fetching notifications:", error);
        return { data: [] }; // Return an empty array to handle gracefully
      }
    },
    enabled: !!employeeId,
  });

  // Debug: Log fetched notifications data
  console.log("foodcateringdata:", foodcateringdata);

  // Calculate unread notification count
  const foodcateringCount = foodcateringdata?.data?.reduce(
    (count, notification) => {
      if (isvendor) {
        return !notification.notification.vendorRead ? count + 1 : count;
      } else {
        return !notification.notification.isRead ? count + 1 : count;
      }
    },
    0
  );

  // Debug: Log the unread notification count
  console.log("Unread notifications count:", foodcateringCount);

  //---------Employee Side remote and geofencing Notification count

  const { data: EmpNotification } = useQuery({
    queryKey: ["EmpDataPunchNotification", employeeId],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/punch/get-notification/${employeeId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: employeeId !== undefined,
  });
  console.log("EmpNotification", EmpNotification);
  // Calculate total notificationCount for geoFencingArea false
  const punchNotifications = data3?.punchNotification || [];
  const totalFalseStartNotificationsCount = punchNotifications
    .filter((item) => item.geoFencingArea === false)
    .reduce(
      (total, item) =>
        total +
        (item.punchData?.reduce(
          (sum, punch) => sum + punch.notificationCount,
          0
        ) || 0),
      0
    );

  const totalFalseStopNotificationsCount = punchNotifications
    .filter((item) => item.geoFencingArea === false)
    .reduce(
      (total, item) =>
        total +
        (item.punchData?.reduce(
          (sum, punch) => sum + punch.stopNotificationCount,
          0
        ) || 0),
      0
    );
  const totalFalseNotificationsCount =
    totalFalseStartNotificationsCount + totalFalseStopNotificationsCount;

  const totalTrueStartNotificationsCount = punchNotifications
    .filter((item) => item.geoFencingArea === true)
    .reduce(
      (total, item) =>
        total +
        (item.punchData?.reduce(
          (sum, punch) => sum + punch.notificationCount,
          0
        ) || 0),
      0
    );

  const totalTrueStopNotificationsCount = punchNotifications
    .filter((item) => item.geoFencingArea === true)
    .reduce(
      (total, item) =>
        total +
        (item.punchData?.reduce(
          (sum, punch) => sum + punch.stopNotificationCount,
          0
        ) || 0),
      0
    );

  const totalTrueNotificationsCount =
    totalTrueStopNotificationsCount + totalTrueStartNotificationsCount;

  // remote punch notification count
  let remotePunchingCount;
  if (role === "Employee") {
    const punchData = EmpNotification?.punchData?.[0];
    console.log("punchData", punchData);

    if (punchData?.geoFencingArea === false) {
      remotePunchingCount = punchData.approveRejectNotificationCount;
    } else {
      remotePunchingCount = 0;
    }
  } else {
    remotePunchingCount = totalFalseNotificationsCount;
  }

  let geoFencingCount;
  if (role === "Employee") {
    // Check if geoFencingArea is true and then assign the approveRejectNotificationCount
    const punchData = EmpNotification?.punchData?.[0];
    if (punchData?.geoFencingArea === true) {
      geoFencingCount = punchData.approveRejectNotificationCount;
    } else {
      geoFencingCount = 0;
    }
  } else {
    geoFencingCount = totalTrueNotificationsCount;
  }

  //selected employee list for geofencing
  const { data: geofencingData } = useOrgGeo(user?.organizationId);

  //match currect user and selcted employee in list
  const isUserMatchInEmployeeList = geofencingData?.area?.some((area) =>
    area.employee.includes(employeeId)
  );

  //---------Notification for loan
  const { getEmployeeRequestLoanApplication, getLoanEmployee } =
    useLoanNotification();

  //get notification count of loan
  // useEffect(() => {
  //   if (
  //     getEmployeeRequestLoanApplication &&
  //     getEmployeeRequestLoanApplication?.length > 0
  //   ) {
  //     let total = 0;
  //     getEmployeeRequestLoanApplication?.forEach((item) => {
  //       total += item.notificationCount;
  //     });
  //     setLoanCount(total);
  //   } else {
  //     setLoanCount(0);
  //   }

  //   if (getLoanEmployee && getLoanEmployee?.length > 0) {
  //     let total = 0;
  //     getLoanEmployee?.forEach((item) => {
  //       total += item.acceptRejectNotificationCount;
  //     });
  //     setEmpLoanCount(total);
  //   } else {
  //     setEmpLoanCount(0);
  //   }
  // }, [getEmployeeRequestLoanApplication, getLoanEmployee]);

  // Inside the useNotification.jsx file, update the loan count calculation:

// Update the loan notification count calculation
useEffect(() => {
  if (
    getEmployeeRequestLoanApplication &&
    getEmployeeRequestLoanApplication?.length > 0
  ) {
    let total = 0;
    getEmployeeRequestLoanApplication?.forEach((item) => {
      total += item.notificationCount;
    });
    setLoanCount(total);
  } else {
    setLoanCount(0);
  }

  if (getLoanEmployee && getLoanEmployee?.length > 0) {
    let total = 0;
    getLoanEmployee?.forEach((item) => {
      total += item.acceptRejectNotificationCount;
    });
    setEmpLoanCount(total);
  } else {
    setEmpLoanCount(0);
  }
}, [getEmployeeRequestLoanApplication, getLoanEmployee]);

  const countLoan =
    role === "Super-Admin" || role === "HR" || role === "Delegate-Super-Admin"
      ? loanCount
      : empLoanCount;

  //---------notification Count for advance salary
  const { getAdvanceSalary, advanceSalaryNotificationEmp } =
    useAdvanceSalaryData();

  //get notification count of advance salary
  useEffect(() => {
    if (getAdvanceSalary && getAdvanceSalary?.length > 0) {
      let total = 0;
      getAdvanceSalary?.forEach((item) => {
        total += item.notificationCount;
      });
      setAdvanceSalaryCount(total);
    } else {
      setAdvanceSalaryCount(0);
    }

    if (
      advanceSalaryNotificationEmp &&
      advanceSalaryNotificationEmp?.length > 0
    ) {
      let total = 0;
      advanceSalaryNotificationEmp?.forEach((item) => {
        total += item.acceptRejectNotificationCount;
      });
      setEmpAdvanceSalaryCount(total);
    } else {
      setEmpAdvanceSalaryCount(0);
    }
  }, [getAdvanceSalary, advanceSalaryNotificationEmp]);

  const countAdvance =
    role === "Super-Admin" || role === "HR" || role === "Delegate-Super-Admin"
      ? advanceSalaryCount
      : empAdvanceSalaryCount;

  //--------payslip notification count
  const { PayslipNotification: Payslip } = usePayslipNotificationHook();

  const totalNotificationCount =
    Payslip?.reduce((total, notification) => {
      return total + notification.NotificationCount;
    }, 0) || 0;

  //---------Notification for TDS super admin or accountant
  const { financialYear } = useIncomeTax();
  const getInvestmentSection = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/route/tds/getTDSWorkflow/${financialYear}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching investment data:", error);
      throw error;
    }
  };

  const { data: investmentsData, isFetching } = useQuery({
    queryKey: ["getAllInvestment"],
    queryFn: getInvestmentSection,
  });

  useEffect(() => {
    if (!isFetching && investmentsData) {
      const investments = investmentsData.investment || [];

      if (Array.isArray(investments)) {
        const totalNotificationTDS = investments.reduce((total, investment) => {
          return total + (investment?.notificationCount || 0);
        }, 0);
        setTDSCount(totalNotificationTDS);
      } else {
        console.error("Investments data is not an array");
      }
    }
  }, [investmentsData, isFetching]);

  //Employee side notification TDS
  const { data: empTDSData } = useQuery({
    queryKey: ["TDSNotify"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/tds/getTDSNotify/${user._id}/${financialYear}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        return res?.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  useEffect(() => {
    if (empTDSData && empTDSData.data && Array.isArray(empTDSData.data)) {
      const totalNotificationCountEmp = empTDSData.data.reduce(
        (total, item) => {
          return total + (item.notificationCountEmp || 0);
        },
        0
      );

      setTDSCountEmp(totalNotificationCountEmp);
    } else {
      console.error("Invalid empTDSData structure");
    }
  }, [empTDSData]);

  const countTDS =
    role === "Super-Admin" || role === "Accountant" ? TDSCount : TDSCountEmp;

  //////////////////////////////////////

  // const { data: data4 } = useDocNotification();

  const { Form16Notification } = useForm16NotificationHook();

  const { getDepartmnetData, getDeptNotificationToEmp } =
    useDepartmentNotification();

  // for form 16 notification count
  let form16NotificationCount;
  if (role === "Employee") {
    form16NotificationCount = Form16Notification?.length ?? 0;
  } else {
    form16NotificationCount = 0;
  }

  // department notification count
  let departmentNotificationCount;

  if (role === "Employee") {
    departmentNotificationCount = getDeptNotificationToEmp?.length ?? 0;
  } else if (
    role === "HR" ||
    role === "Super-Admin" ||
    role === "Delegate-Super-Admin"
  ) {
    departmentNotificationCount = getDepartmnetData?.length ?? 0;
  } else {
    departmentNotificationCount = 0;
  }

  useEffect(() => {
    (async () => {
      if (user?._id) {
        const resp = await axios.get(
          `${process.env.REACT_APP_API}/route/employee/get/profile/${user?._id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setEmp(resp?.data?.employee?.organizationId);
      }
    })();
    // eslint-disable-next-line
  }, []);

  //Internal Job Program
  const { data: jobVacancyNoti } = useQuery({
    queryKey: ["jobVacancyNoti"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/organization/${organisationId}/manager/job-vacancy-noti-hr/${user?._id}/vacancies`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        return res?.data?.data;
      } catch (error) {
        console.log(error);
      }
    },
  });
  const totalJobVacancyNotiCount = jobVacancyNoti
    ? jobVacancyNoti?.reduce(
        (total, item) => total + (item?.jobVacancyNotiCount || 0),
        0
      )
    : 0;
  console.log("jobVacancyNoti", jobVacancyNoti);

  //Manager side shortlist application
  const { data: shortlistedApplication } = useQuery(
    ["shortlistedApplicationsByCreterId", user?._id],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/job/shortlisted-applications/MR/${user?._id}`,
        {
          headers: {
            Authorization: authToken, // Send the auth token for authorization
          },
        }
      );
      return response?.data?.data;
    },
    {
      enabled: !!authToken && !!user?._id, // Ensure the query is only enabled when the auth token and vacancyId are available
    }
  );
  console.log("aashortlistedApplication", shortlistedApplication);

  // Fetch employees whose documents are pending approval by the logged-in manager
  const { data: employeeData } = useQuery(
    ["employeesForManagerCount", organisationId],
    async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/route/org/getdocss/mangernotificationcount`,
        {
          headers: { Authorization: authToken },
        }
      );

      return res?.data; // API response
    },
    {
      enabled: !!authToken && !!organisationId, // Fetch only if authToken & organisationId exist
      //bro working v2 ,with notification count

      refetchInterval: 30000, // Refetch every 30 seconds to check for new notifications
      refetchOnWindowFocus: true, // Refetch when window regains focus
    }
  );

  // const totalPendingApprovalCount = employeeData?.data
  //   ? employeeData?.data.reduce((totalEmployeeCount, employee) => {
  //       console.log("Employee:", employee); // Log each employee
  //       console.log("Documents for this employee:", employee?.documents);

  //       const pendingDocsCount =
  //         employee?.documents?.filter((doc) => {
  //           console.log(
  //             "Document:",
  //             doc,
  //             "NotificationCount:",
  //             doc?.notificationCount
  //           );
  //           return doc?.notificationCount === 1;
  //         })?.length || 0;

  //       console.log("Pending docs count for this employee:", pendingDocsCount);

  //       return totalEmployeeCount + pendingDocsCount; // Add to total count
  //     }, 0)
  //   : 0;
  //tuesday eve
  // Then modify the totalPendingApprovalCount calculation to include all pending documents
const totalPendingApprovalCount = employeeData?.data
? employeeData?.data.reduce((totalEmployeeCount, employee) => {
    console.log("Employee:", employee); // Log each employee
    console.log("Documents for this employee:", employee?.documents);

    const pendingDocsCount =
      employee?.documents?.filter((doc) => {
        console.log(
          "Document:",
          doc,
          "Status:",
          doc?.docstatus,
          "NotificationCount:",
          doc?.notificationCount
        );
        // Count documents with "Pending" status, regardless of notification count
        return doc?.docstatus === "Pending";
      })?.length || 0;

    console.log("Pending docs count for this employee:", pendingDocsCount);

    return totalEmployeeCount + pendingDocsCount; // Add to total count
  }, 0)
: 0;

  console.log("Total Pending Approval Count:", totalPendingApprovalCount);
  console.log("employeeData:", totalPendingApprovalCount);


  // Add a new query for asset return notifications
  const getAssetReturnNotifications = useQuery(
    ["assetReturnNotifications", organisationId], 
    async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/notification/asset-return/employee/notifications`,
          {
            headers: { Authorization: authToken }
          }
        );
        return response.data;
      } catch (error) {
        // If 404 (no notifications), return empty array
        if (error.response?.status === 404) {
          return { notifications: [] };
        }
        throw error;
      }
    },
    {
      enabled: !!authToken && !!organisationId && role === 'Employee',
      refetchInterval: 60000,
      refetchOnWindowFocus: true
    }
  );
  
  // Add query for asset return approval notifications count
  // const getAssetApprovalNotifications = useQuery(
  //   ["assetApprovalNotifications", organisationId],
  //   async () => {
  //     try {
  //       const response = await axios.get(
  //         `${process.env.REACT_APP_API}/route/notification/asset-return/count`,
  //         {
  //           headers: { Authorization: authToken }
  //         }
  //       );
  //       return response.data;
  //     } catch (error) {
  //       // If 404 (no notifications), return 0 count
  //       if (error.response?.status === 404) {
  //         return { count: 0 };
  //       }
  //       throw error;
  //     }
  //   },
  //   {
  //     enabled: !!authToken && !!organisationId && role !== 'Employee',
  //     refetchInterval: 60000,
  //     refetchOnWindowFocus: true
  //   }
  // );
  // Add query for asset return approval notifications count
const getAssetApprovalNotifications = useQuery(
  ["assetApprovalNotifications", organisationId],
  async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/notification/asset-return/count`,
        {
          headers: { Authorization: authToken }
        }
      );
      return response.data;
    } catch (error) {
      // If 404 (no notifications), return 0 count
      if (error.response?.status === 404) {
        return { count: 0 };
      }
      throw error;
    }
  },
  {
    enabled: !!authToken && !!organisationId && role !== 'Employee',
    refetchInterval: 60000,
    refetchOnWindowFocus: true
  }
);


// // Calculate the count of unread asset return notifications
// const assetReturnCount = assetReturnNotifications
//   ? assetReturnNotifications.reduce(
//       (count, notification) => count + (notification.read ? 0 : 1),
//       0
//     )
//   : 0;

  const dummyData = [
    {
      name: "Leave",
      tooltipName: "Attendance & Leave Requests",
      count: typeof Leavecount === "number" ? Leavecount : 0,
      color: "#FF7373",
      visible:
        role === "Super-Admin" ||
        role === "HR" ||
        role === "Delegate-Super-Admin" ||
        role === "Manager" ||
        role === "Accountant" ||
        role === "Employee",
      page: <LeaveAcceptModal />,
      empPage: <SelfLeaveNotification />,
    },
    {
      name: "Shift",
      tooltipName: "Shift Requests",
      count: typeof count === "number" ? count : 0,
      color: "#3668ff",
      visible:
        orgData?.organisation?.packageInfo !== "Essential Plan" &&
        (role === "Super-Admin" ||
          role === "Delegate-Super-Admin" ||
          role === "Manager" ||
          role === "Accountant" ||
          role === "Employee"),
      page: <ShiftNotification />,
      empPage: <SelfShiftNotification />,
    },
    {
      name: "FullSkape",
      tooltipName: "Attendance & Leave Requests",
      count: typeof fullskapenotiCount === "number" ? fullskapenotiCount : 0,
      color: "#FF7373",
      visible:
        (role === "Teacher" || role === "Super-Admin") &&
        orgData?.organisation?.packageInfo === "Fullskape Plan",
      page: <FullskapesaNotification />,
      empPage: <FullskapeempNotification />,
    },

    {
      name: "Food & Catering",
      tooltipName: "Attendance & Leave Requests",
      count: typeof foodcateringCount === "number" ? foodcateringCount : 0,
      color: "#FF7373",
      visible: orgData?.organisation?.packageInfo === "Enterprise Plan",
      page: <OrderNotifications />,
      empPage: <EmpOrdersNotifications />,
    },

    ...(role === "Super-Admin" ||
    role === "Manager" ||
    role === "HR" ||
    role === "Accountant" ||
    role === "Delegate-Super-Admin"
      ? [
          {
            name: "Remote Punch",
            tooltipName: "Remote Punch Requests",
            count:
              typeof remotePunchingCount === "number" ? remotePunchingCount : 0,
            color: "#51FD96",
            visible:
              (orgData?.organisation?.packageInfo === "Intermediate Plan" ||
                orgData?.organisation?.packageInfo === "Enterprise Plan") &&
              (role === "Super-Admin" ||
                role === "Delegate-Super-Admin" ||
                role === "Manager" ||
                role === "Accountant" ||
                role === "Employee" ||
                role === "HR"),
            page: <PunchNotification />,
            empPage: <EmpNotificationData />,
          },
          {
            name: "Geo Fence",
            tooltipName: "Geo Fence Requests",
            count: typeof geoFencingCount === "number" ? geoFencingCount : 0,
            color: "#51FD96",
            visible:
              (orgData?.organisation?.packageInfo === "Intermediate Plan" ||
                orgData?.organisation?.packageInfo === "Enterprise Plan") &&
              (role === "Super-Admin" ||
                role === "Delegate-Super-Admin" ||
                role === "Manager" ||
                role === "Employee"),
            page: <GeoFencingAcceptModal />,
            empPage: <EmpGeoFencingNotification />,
          },
        ]
      : // For Employees, conditionally show either Remote Punching or Geo Fencing based on `isUserMatchInEmployeeList`
        [
          isUserMatchInEmployeeList
            ? {
                name: "Geo Fence",
                tooltipName: "Geo Fence Requests",
                count:
                  typeof geoFencingCount === "number" ? geoFencingCount : 0,
                color: "#51FD96",
                visible:
                  (orgData?.organisation?.packageInfo === "Intermediate Plan" ||
                    orgData?.organisation?.packageInfo === "Enterprise Plan") &&
                  (role === "Super-Admin" ||
                    role === "Delegate-Super-Admin" ||
                    role === "Manager" ||
                    role === "Employee"),
                page: <GeoFencingAcceptModal />,
                empPage: <EmpGeoFencingNotification />,
              }
            : {
                name: "Remote Punch",
                tooltipName: "Remote Punch Requests",
                count:
                  typeof remotePunchingCount === "number"
                    ? remotePunchingCount
                    : 0,
                color: "#51FD96",
                visible:
                  (orgData?.organisation?.packageInfo === "Intermediate Plan" ||
                    orgData?.organisation?.packageInfo === "Enterprise Plan") &&
                  (role === "Super-Admin" ||
                    role === "Delegate-Super-Admin" ||
                    role === "Manager" ||
                    role === "Accountant" ||
                    role === "Employee"),
                page: <PunchNotification />,
                empPage: <EmpNotificationData />,
              },
        ]),

    {
      name: "Internal Job Program",
      tooltipName: "Internal Job Program",
      count: totalJobVacancyNotiCount,
      color: "#3668ff",
      // visible:
      //   orgData?.organisation?.packageInfo === "Enterprise Plan" &&
      //   orgData?.organisation?.packages?.includes("Recruitment")
      //     ? true
      //     : false,
      page:
        role === "HR" ? (
          <RecruitmentApproval jobVacancyNoti={jobVacancyNoti} />
        ) : (
          <ShortlisttedNotiMR shortlistedApplication={shortlistedApplication} />
        ),
      empPage: <SelfInterviewShedule />, 
    },

    {
      name: "Loan",
      tooltipName: "Loan Requests",
      count: typeof countLoan === "number" ? countLoan : 0,
      color: "#51E8FD",
      // visible:
      //   orgData?.organisation?.packageInfo !== "Essential Plan" &&
      //   role !== "Super-Admin",
      visible: orgData?.organisation?.packageInfo !== "Essential Plan",
      page: <LoanMgtNotification />,
      empPage: <LoanNotificationToEmp />,
    },
    {
      name: "Advance Salary",
      tooltipName: "Advance Salary",
      count: typeof countAdvance === "number" ? countAdvance : 0,
      color: "#FF7373",
      visible:
        orgData?.organisation?.packageInfo === "Essential Plan" ? false : true,
      page: <AdvanceSalaryNotification />,
      empPage: <AdvanceSalaryNotificationToEmp />,
    }, 
    {
      name: "Payslip",
      tooltipName: "Payslip Requests",
      count:
        typeof totalNotificationCount === "number" ? totalNotificationCount : 0,
      color: "#51E8FD",
      visible: role === "Employee",
      empPage: <PayslipNotification />,
    },
    {
      name: "Training",
      tooltipName: "Training",
      count: typeof countAdvance === "number" ? countAdvance : 0,
      color: "#FF7373",
      visible:
        (orgData?.organisation?.packageInfo === "Intermediate Plan" ||
          orgData?.organisation?.packageInfo === "Enterprise Plan") &&
        (role === "Super-Admin" ||
          role === "Delegate-Super-Admin" ||
          role === "Department-Head" ||
          role === "Delegate-Department-Head" ||
          role === "HR" ||
          role === "Manager" ||
          role === "Employee"),
      page: <TrainingNotification />,
      empPage: <EmployeeTrainingNoteification />,
    },
    {
      name: "TDS",
      tooltipName: "Employee Declarations",
      count: typeof countTDS === "number" ? countTDS : 0,
      color: "#51E8FD",
      visible:
        orgData?.organisation?.packageInfo === "Essential Plan" ? false : true,
      page: <DeclarationPage />,
      empPage: <IncomeTaxNotification />,
    },
    {
      name: "Add Department",
      tooltipName: "Add Department Requests",
      count:
        typeof departmentNotificationCount === "number"
          ? departmentNotificationCount
          : 0,
      color: "#51E8FD",
      visible:
        role === "Super-Admin" ||
        role === "Delegate-Super-Admin" ||
        role === "Department-Head" ||
        role === "Delegate-Department-Head" ||
        role === "HR" ||
        role === "Department-Admin" ||
        role === "Delegate-Department-Admin",
      page: <DepartmentNotification />,
      empPage: <DepartmentNotificationToEmp />,
    },

    { 
      name: "Document Approval",
      tooltipName: "Document Approval Requests",  
      count: typeof totalPendingApprovalCount === "number" ? totalPendingApprovalCount : 0,
      color: "#FF7373",
      visible:
      (  orgData?.organisation?.packageInfo === "Essential Plan" ||
        orgData?.organisation?.packageInfo === "Basic Plan" || 
        orgData?.organisation?.packageInfo === "Enterprise Plan" 
         ) && 
          (role === "Super-Admin" ||
          role === "HR" ||
          role === "Manager" 
        ),
      page: <DocumentApproval />,
    },

    
    // Add this to the dummyData array in useNotification.jsx
{
  name: "Document Notifications",
  tooltipName: "Documents sent to you",
  count: typeof documentNotificationCount === "number" ? documentNotificationCount : 0,
  color: "#3668ff",
  visible: role === "Employee",
  empPage: <EmployeeDocumentNotifications />,
},

    
    {
      name: "Form-16",
      tooltipName: "Form-16 Requests",
      count:
        typeof form16NotificationCount === "number"
          ? form16NotificationCount
          : 0,
      color: "#FF7373",
      visible:
        orgData?.organisation?.packageInfo !== "Essential Plan" &&
        role === "Employee",
      empPage: <Form16NotificationToEmp />,
    },

    {
      name: "Expense Management",
      tooltipName: "Expenses Requests",
      // count: typeof expenseNotificationCount === "number" ? expenseNotificationCount : 0,
      count: 0, // Temporarily hiding the count: typeof expenseNotificationCount === "number" ? expenseNotificationCount : 0,

      color: "#51E8FD",
      visible:
      ( orgData?.organisation?.packageInfo === "Enterprise Plan")
       &&
      (
        role === "Super-Admin" ||
        role === "Delegate-Super-Admin" ||
        role === "Department-Head" ||
        role === "Delegate-Department-Head" ||
        role === "HR" ||
        role === "Manager" ||
        role === "Accountant" ||
        role === "Department-Admin" ||
        role === "Delegate-Department-Admin"),
      page: <ExpenseNotifications  />, 
      
    },

    {
      name: "Expense Management",
      tooltipName: "Expenses Requests",
      // count: typeof expenseNotificationCount === "number" ? expenseNotificationCount : 0,
      count: typeof employeeExpenseNotificationCount === "number" ? employeeExpenseNotificationCount : 0,
      color: "#51E8FD",
      visible: role === "Employee",
      empPage: <EmployeeExpenseNotifications  />,
    },

    // {
    //   name: "Asset Management",
    //   tooltipName: "Asset Return Requests",
    //   count: typeof assetReturnCount === "number" ? assetReturnCount : 0,
    //   color: "#51E8FD",
    //   visible: role === "Employee" || role === "Super-Admin" || role === "HR" || role === "Manager" || role === "Department-Head",
    //   page: <AssetReturnModal />,
    //   empPage: <AssetReturnModal />,
    // },

    {
      name: "Asset Return",
      tooltipName: "Asset Return Notifications",
      count: getAssetReturnNotifications.data?.count || 0,
      color: "primary",
      visible: role === "Employee",
      page: <AssetReturnModal />,
      empPage: <AssetReturnModal />
    },
    
    // Add asset return approval notification for managers/admins
    {
      name: "Asset Return Approvals",
      tooltipName: "Asset Return Approval Requests",
      count: getAssetApprovalNotifications.data?.count || 0,
      color: "warning",
      visible: role !== "Employee",
      page: <AssetReturnApprovalModal />,
      empPage: null
    }


  ];

  const dummyData1 = [
    {
      name: "Food & Catering",
      tooltipName: "Attendance & Leave Requests",
      count: typeof foodcateringCount === "number" ? foodcateringCount : 0,
      color: "#FF7373",
      visible: orgData?.organisation?.packageInfo === "Enterprise Plan",
      page: <OrderNotifications />,
      empPage: <OrderNotifications />,
    },
  ];
  // return { dummyData };
  return isvendor ? { dummyData1 } : { dummyData };
};

export default useNotification;
