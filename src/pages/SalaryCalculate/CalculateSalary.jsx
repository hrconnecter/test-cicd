/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import dayjs from "dayjs";
import html2pdf from "html2pdf.js";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import HeadingOneLineInfo from "../../../src/components/HeadingOneLineInfo/HeadingOneLineInfo";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import useAdvanceSalaryQuery from "../../hooks/AdvanceSalaryHook/useAdvanceSalaryQuery";
import useCalculateSalaryQuery from "../../hooks/CalculateSalaryHook/useCalculateSalaryQuery";
import useGetPfEsicSetup from "../../hooks/Salary/useGetPfEsicSetup";
import { fetchFoundationSetup } from "../SetupPage/Foundationsetup";
import SalarySlip from "./ salary-slip";

import moment from "moment";
function CalculateSalary() {
  // state
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];
  const { userId, organisationId } = useParams();
  const currentDate = dayjs();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [numDaysInMonth, setNumDaysInMonth] = useState(0);
  const [employeeSummary, setEmployeeSummary] = useState([]);
  const [paidLeaveDays, setPaidLeaveDays] = useState(0);
  const [unPaidLeaveDays, setUnPaidLeaveDays] = useState(0);
  const [remotePunchingCount, setRemotePunchingCount] = useState(0);
  const [publicHolidays, setPublicHoliDays] = useState([]);
  const [activeButton, setActiveButton] = useState("submit");
  const [attendanceData, setAttendanceData] = useState(0);
  const [workingHours, setWorkingHours] = useState(0);

  const { data: foundationData } = useQuery(
    ["foundationSetup", organisationId],
    () => fetchFoundationSetup(organisationId),
    { enabled: !!organisationId }
  );

  const [expensePayments, setExpensePayments] = useState([]);

  const { availableEmployee, empLoanAplicationInfo, remotePunchAllowance } =
    useCalculateSalaryQuery({ userId, organisationId, remotePunchingCount });
  const ITEMS_PER_PAGE = 7;
  const formattedDate = selectedDate.format("MMM-YY");

  // handle the date
  const handleDateChange = (event) => {
    setSelectedDate(dayjs(event.target.value));
  };

  // Correctly calculate the number of days in the selected month
  const calculateDaysInMonth = (date) => {
    return date.daysInMonth();
  };

  useEffect(() => {
    setNumDaysInMonth(calculateDaysInMonth(selectedDate));
  }, [selectedDate]);

  // Fetch leave of employee in specific month
  const month = selectedDate.$M + 1;
  const year = selectedDate.$y;
  useEffect(() => {
    const fetchDataAndFilter = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/employee/leaves/${year}/${month}/${userId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setEmployeeSummary(response.data);
      } catch (error) {
        console.error(error);
        // handleAlert(
        //   true,
        //   "error",
        //   "Failed to fetch Employee Attendance Summary"
        // );
      }
    };
    fetchDataAndFilter();
    // eslint-disable-next-line
  }, [month, year]);
  useEffect(() => {
    setPaidLeaveDays(employeeSummary?.paidLeaveDays || 0);
    setUnPaidLeaveDays(employeeSummary?.unpaidLeaveDays || 0);
  }, [employeeSummary, month, year]);

  useEffect(() => {
    setNumDaysInMonth(selectedDate.daysInMonth());
  }, [selectedDate]);
  console.log("employee summary", employeeSummary);

  // to get holiday in the organization
  const fetchHoliday = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/holiday/get/${organisationId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setPublicHoliDays(response.data.holidays);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch Holiday");
    }
  };
  useEffect(() => {
    fetchHoliday();
    // eslint-disable-next-line
  }, []);

  // count the public holidays count
  const countPublicHolidaysInCurrentMonth = () => {
    const selectedMonth = selectedDate.format("M");
    const selectedYear = selectedDate.format("YYYY");

    const holidaysInCurrentMonth = publicHolidays.filter((holiday) => {
      const holidayDate = dayjs(holiday.date);
      return (
        holidayDate.month() + 1 === parseInt(selectedMonth) &&
        holidayDate.year() === parseInt(selectedYear)
      );
    });

    return holidaysInCurrentMonth.length;
  };
  let publicHolidaysCount = countPublicHolidaysInCurrentMonth();

  // to get shifts of employee based on month
  const selectedMonths = selectedDate.format("M");
  const selectedYears = selectedDate.format("YYYY");
  const { data: getShifts } = useQuery(
    ["shiftAllowance", userId, selectedMonths, selectedYears],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get/shifts/${userId}`,
        {
          headers: {
            Authorization: token,
          },
          params: {
            month: parseInt(selectedMonths),
            year: parseInt(selectedYears),
          },
        }
      );
      return response.data.shiftRequests;
    }
  );
  console.log("getShifts", getShifts);

  // to get shift count of employee
  const countShifts = (shifts) => {
    const shiftCount = {};
    shifts.forEach((shift) => {
      const title = shift?.title;
      if (shiftCount[title]) {
        shiftCount[title]++;
      } else {
        shiftCount[title] = 1;
      }
    });
    return shiftCount;
  };
  const shiftCounts = useMemo(
    () => (getShifts ? countShifts(getShifts) : {}),
    [getShifts]
  );
  console.log("shiftCounts", shiftCounts);

  // get the amount of shift in the organization
  const { data: shiftAllowanceAmount } = useQuery(
    ["shift-allowance-amount"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/shifts/${organisationId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data.shifts;
    }
  );
  const shiftAllowances = useMemo(() => {
    if (shiftAllowanceAmount) {
      return shiftAllowanceAmount?.reduce((acc, shift) => {
        acc[shift.shiftName.toLowerCase()] = shift.allowance;
        return acc;
      }, {});
    }
    return {};
  }, [shiftAllowanceAmount]);

  const [shiftTotalAllowance, setShiftTotalAllowance] = useState(0);
  useEffect(() => {
    let total = 0;
    for (const [shiftTitle, count] of Object.entries(shiftCounts)) {
      const shiftAllowance = shiftAllowances[shiftTitle.toLowerCase()];
      if (shiftAllowance) {
        total += count * shiftAllowance;
      }
    }
    setShiftTotalAllowance(total);
  }, [shiftCounts, shiftAllowances]);

  // to fetch the remote punching count of employee in a specific month
  const fetchRemotePunchingCount = async (userId, startDate, endDate) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/remote-punch-count/${userId}?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setRemotePunchingCount(response.data.remotePunchingCount || 0);
    } catch (error) {
      console.error(error);
    }
  };
  const startDate = selectedDate.startOf("month").format("YYYY-MM-DD");
  const endDate = selectedDate.endOf("month").format("YYYY-MM-DD");

  useEffect(() => {
    fetchRemotePunchingCount(userId, startDate, endDate);
    fetchAttendanceData(startDate, endDate);
    // eslint-disable-next-line
  }, [selectedDate, userId, startDate, endDate]);

  const { getTotalSalaryEmployee } = useAdvanceSalaryQuery(organisationId);

  const extradayShifts = Array.isArray(getShifts)
    ? getShifts.filter((shift) => shift.title === "Extra Day")
    : [];

  const extradayCount = Array.isArray(extradayShifts)
    ? extradayShifts.length
    : 0;

  // calculate the no fo days employee present
  // Extract the dynamic joining date from the employee data
  const joiningDate = new Date(availableEmployee?.joining_date);
  const calculateDaysEmployeePresent = (joiningDate) => {
    const selectedMonth = new Date(selectedDate).getMonth();
    const selectedYear = new Date(selectedDate).getFullYear();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
    const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

    // Check if the joining date is within the selected month
    const isJoinedThisMonth =
      joiningDate >= firstDayOfMonth && joiningDate <= lastDayOfMonth;

    let daysPresent;
    if (isJoinedThisMonth) {
      daysPresent = lastDayOfMonth.getDate() - joiningDate.getDate() + 1;
    } else {
      // old one
      // daysPresent =  numDaysInMonth - unPaidLeaveDays;

      // if (employeeSummary?.isBioMetric) {
      daysPresent = employeeSummary?.presentDays;
      // } else {
      //   daysPresent = employeeSummary?.presentDays - unPaidLeaveDays;
      // }
    }

    return daysPresent;
  };

  let noOfDaysEmployeePresent = calculateDaysEmployeePresent(joiningDate);

  // Calculate the total payable days including extra days
  const totalAvailableDays =
    typeof noOfDaysEmployeePresent === "number" &&
    !isNaN(noOfDaysEmployeePresent) &&
    typeof extradayCount === "number" &&
    !isNaN(extradayCount)
      ? noOfDaysEmployeePresent + extradayCount
      : 0; // Default to 0 if any of the values are not valid numbers

  // ------------------Foundation attendance Hours---------------

  const fetchAttendanceData = async (startDate, endDate) => {
    console.log("Fetching attendance for:", startDate, endDate);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/foundation-attendance`,
        {
          params: {
            employeeId: userId,
            month: selectedDate.format("M"),
            year: selectedDate.format("YYYY"),
          },
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.success) {
        console.log("Fetched attendance data:", response.data);
        setAttendanceData(response.data); // Store the entire response
      } else {
        console.error("No attendance records found.");
        setAttendanceData({ totalWorkingHours: 0, records: [] }); // Ensure default structure
      }
    } catch (err) {
      console.error("Error fetching attendance data:", err);

      // Handle 404 error (No attendance records)
      if (err.response && err.response.status === 404) {
        console.warn("Setting attendanceData to default due to 404 error.");
        setAttendanceData({ totalWorkingHours: 0, records: [] });
      }
    }
  };

  // Effect to update working hours when attendance data changes
  useEffect(() => {
    console.log("Updated attendanceData:", attendanceData);
    setWorkingHours(attendanceData?.totalWorkingHours || 0);
  }, [attendanceData]); // Dependency added

  // ---------------------------------

  // Get Query for fetching overtime allowance in the organization
  const { data: overtime } = useQuery(
    ["overtime", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get/${organisationId}/overtime`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data.data;
    }
  );
  let otamount = overtime && overtime?.allowanceAmount;
  let otparameter = overtime && overtime?.allowanceParameter;
  console.log("otamount", otamount);
  console.log("otparameter", otparameter);

  // to get the overtime hour of employee in specific month from machine punching
  const sd = selectedDate.startOf("month").format("YYYY-MM-DD");
  const ed = selectedDate.endOf("month").format("YYYY-MM-DD");

  const { data: empOverTimeData } = useQuery(
    ["empOverTimeHour", sd, ed],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/getOvertimeHour/${organisationId}/${userId}`,
        {
          params: {
            startDate: sd,
            endDate: ed,
          },
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data;
    }
  );
  // Destructure the employee overtime data
  const overtimeRecordCount = empOverTimeData?.overtimeRecordCount || 0;
  const totalOvertimeHours = empOverTimeData?.totalOvertimeHours || 0;

  console.log("overtimeRecordCount", overtimeRecordCount);
  console.log("totalOvertimeHours", totalOvertimeHours);

  // calculate overtime amount of employee in specific month
  // Initialize overtimeAllowance
  let totalOvertimeAllowance = 0;
  // Calculate the overtime allowance based on the parameter
  if (otparameter === "perDay") {
    // Calculate allowance per day (use the overtimeRecordCount as the number of overtime days)
    totalOvertimeAllowance = otamount * overtimeRecordCount;
  } else if (otparameter === "perHour") {
    // Calculate allowance per hour (use the totalOvertimeHours)
    totalOvertimeAllowance = otamount * totalOvertimeHours;
  }
  // Log the calculated overtime allowance
  console.log("Overtime Allowance:", totalOvertimeAllowance);

  // to get employee salary component data of employee ✅
  const { data: salaryComponent, isFetching } = useQuery(
    ["salary-component", userId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get-salary-component/${userId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data.data;
    }
  );

  //FY Add this with your existing queries
  const { data: financialYearData } = useQuery(
    ["financialYear", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/financial-year`,
        {
          headers: { Authorization: token },
        }
      );
      console.log("FY Data:", response.data);
      return response.data;
    }
  );

  //sat
  const { data: submittedSalaries, refetch: refetchSubmittedSalaries } =
    useQuery(["submitted-salaries", userId, selectedDate], async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employeeSalary/get-submitted-salaries/${userId}/${organisationId}`,
        {
          headers: { Authorization: token },
          // params: {
          //   year: selectedDate.format("YYYY"),
          // }
        }
      );
      console.log("AP Submitted salaries response:", response.data);
      console.log("AP Fetched salaries:", response.data.data);
      console.log("AP Total submitted salaries:", response.data.data.length);
      return response.data.data;
      // return response.data;
    });
  const [annualTotals, setAnnualTotals] = useState({
    income: 0,
    deductions: 0,
    net: 0,
  });

  const getFinancialYearRange = () => {
    const yearFormat = financialYearData?.data?.yearFormat || "apr-mar";
    const selectedYear = selectedDate.year();
    const selectedMonth = selectedDate.month() + 1;

    console.log(
      " FY Getting financial year range with format:",
      yearFormat,
      "for date:",
      selectedDate.format("YYYY-MM-DD")
    );
    switch (yearFormat) {
      case "jan-dec":
        return `January ${selectedYear} - December ${selectedYear}`;
      case "apr-mar":
        return selectedMonth < 4
          ? `April ${selectedYear - 1} - March ${selectedYear}`
          : `April ${selectedYear} - March ${selectedYear + 1}`;
      case "jul-jun":
        return selectedMonth < 7
          ? `July ${selectedYear - 1} - June ${selectedYear}`
          : `July ${selectedYear} - June ${selectedYear + 1}`;
      case "oct-sep":
        return selectedMonth < 10
          ? `October ${selectedYear - 1} - September ${selectedYear}`
          : `October ${selectedYear} - September ${selectedYear + 1}`;
      default:
        return `April ${selectedYear} - March ${selectedYear + 1}`;
    }
  };

  // Update the financial year calculation logic to be more robust
  const calculateFinancialYearPeriod = () => {
    const yearFormat = financialYearData?.data?.yearFormat || "apr-mar";
    const selectedYear = selectedDate.year();
    const selectedMonth = selectedDate.month() + 1;
    console.log(
      "FY Calculating financial year period with format:",
      yearFormat,
      "for date:",
      selectedDate.format("YYYY-MM-DD")
    );
    let startMonth, startYear, endMonth, endYear;

    switch (yearFormat) {
      case "jan-dec":
        startMonth = 1;
        startYear = selectedYear;
        endMonth = 12;
        endYear = selectedYear;
        break;
      case "apr-mar":
        if (selectedMonth < 4) {
          startMonth = 4;
          startYear = selectedYear - 1;
          endMonth = 3;
          endYear = selectedYear;
        } else {
          startMonth = 4;
          startYear = selectedYear;
          endMonth = 3;
          endYear = selectedYear + 1;
        }
        break;
      case "jul-jun":
        if (selectedMonth < 7) {
          startMonth = 7;
          startYear = selectedYear - 1;
          endMonth = 6;
          endYear = selectedYear;
        } else {
          startMonth = 7;
          startYear = selectedYear;
          endMonth = 6;
          endYear = selectedYear + 1;
        }
        break;
      case "oct-sep":
        if (selectedMonth < 10) {
          startMonth = 10;
          startYear = selectedYear - 1;
          endMonth = 9;
          endYear = selectedYear;
        } else {
          startMonth = 10;
          startYear = selectedYear;
          endMonth = 9;
          endYear = selectedYear + 1;
        }
        break;
      default:
        if (selectedMonth < 4) {
          startMonth = 4;
          startYear = selectedYear - 1;
          endMonth = 3;
          endYear = selectedYear;
        } else {
          startMonth = 4;
          startYear = selectedYear;
          endMonth = 3;
          endYear = selectedYear + 1;
        }
    }

    const result = {
      startDate: dayjs(
        `${startYear}-${startMonth.toString().padStart(2, "0")}-01`
      ),
      endDate: dayjs(
        `${endYear}-${endMonth.toString().padStart(2, "0")}-${dayjs(
          `${endYear}-${endMonth}-01`
        ).daysInMonth()}`
      ),
    };

    console.log("FY Financial year period:", {
      startDate: result.startDate.format("YYYY-MM-DD"),
      endDate: result.endDate.format("YYYY-MM-DD"),
    });

    return result;
  };

  // Function to filter submitted salaries for the current financial year
  const filterSalariesForCurrentFinancialYear = (salaries) => {
    if (!salaries || !Array.isArray(salaries)) {
      console.log("No salaries to filter or salaries is not an array");
      return [];
    }

    const { startDate, endDate } = calculateFinancialYearPeriod();

    console.log(
      "FY Filtering salaries between:",
      startDate.format("YYYY-MM-DD"),
      "and",
      endDate.format("YYYY-MM-DD")
    );
    console.log("FY Total salaries before filtering:", salaries.length);

    const filteredSalaries = salaries.filter((salary) => {
      const salaryDate = dayjs(
        `${salary.year}-${salary.month.toString().padStart(2, "0")}-01`
      );
      const isInRange =
        (salaryDate.isAfter(startDate) || salaryDate.isSame(startDate)) &&
        (salaryDate.isBefore(endDate) || salaryDate.isSame(endDate));

      console.log(
        "FY Salary date:",
        salaryDate.format("YYYY-MM-DD"),
        "In range:",
        isInRange
      );

      return isInRange;
    });

    console.log("FY Total salaries after filtering:", filteredSalaries.length);
    return filteredSalaries;
  };

  // Update the useEffect for annual totals calculation
  useEffect(() => {
    if (submittedSalaries && Array.isArray(submittedSalaries)) {
      console.log(
        "Calculating annual totals from submitted salaries:",
        submittedSalaries
      );

      const currentFYSalaries =
        filterSalariesForCurrentFinancialYear(submittedSalaries);

      console.log(
        "FY Filtered salaries for current financial year:",
        currentFYSalaries
      );

      const totals = currentFYSalaries.reduce(
        (acc, salary) => ({
          income: acc.income + salary.totalGrossSalary,
          deductions: acc.deductions + salary.totalDeduction,
          net: acc.net + salary.totalNetSalary,
        }),
        { income: 0, deductions: 0, net: 0 }
      );

      console.log("Calculated annual totals:", totals);
      setAnnualTotals(totals);
    }
  }, [submittedSalaries, selectedDate, financialYearData]);

  useEffect(() => {
    const fetchExpensePayments = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/expense/payroll/${userId}`,
          {
            headers: { Authorization: token },
            params: {
              month: selectedDate.format("M"),
              year: selectedDate.format("YYYY"),
            },
          }
        );

        // Process nested expenses structure
        const processedExpenses = response.data.expenses.reduce(
          (acc, expenseReport) => {
            const approvedExpenses = expenseReport.expenses.filter(
              (expense) => expense.finalStatus === "APPROVED"
            );
            return [...acc, ...approvedExpenses];
          },
          []
        );

        setExpensePayments(processedExpenses);
      } catch (error) {
        console.error("Error fetching expense payments:", error);
      }
    };

    fetchExpensePayments();
  }, [userId, selectedDate, token]);

  // calculate the salary component for income
  const [incomeValues, setIncomeValues] = useState([]);

  const isdailywage =
    foundationData?.hourlyWages &&
    ["Hourly wage"].includes(incomeValues?.[0]?.name);
  console.log("isdailywage", isdailywage);

  const {
    data: tdsData,
    isLoading,
    isFetching: tdsFetching,
  } = useQuery(["tds-data", selectedDate], async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/tds/getTDSDetails/${userId}/2024-2025`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return data;
  });

  useEffect(() => {
    const daysInMonth = calculateDaysInMonth(selectedDate);
    let updatedIncomeValues = [];

    // Calculate the salary component
    salaryComponent?.income?.forEach((item) => {
      const updatedValue = isdailywage
        ? item?.value
        : (item?.value / daysInMonth) * totalAvailableDays;
      if (item.name === "Basic") {
        console.log(
          "~ income:",
          item.value,
          daysInMonth,
          totalAvailableDays,
          updatedValue
        );
      }

      const existingIndex = updatedIncomeValues.findIndex(
        (ele) => ele.name === item.name
      );

      if (existingIndex !== -1) {
        updatedIncomeValues[existingIndex] = {
          name: item?.name,
          value: Math.round(updatedValue),
        };
      } else {
        updatedIncomeValues.push({
          name: item?.name,
          value: Math.round(updatedValue),
        });
      }
    });

    console.log(
      "test item",

      salaryComponent?.fixedAllowance?.map((item) => ({
        name: item?.name,
        value: item?.value,
      }))
    );

    // Add expense payments
    expensePayments.forEach((expense) => {
      updatedIncomeValues.push({
        name: `Expense Payment - ${expense.expenseName}`,
        value: expense.amount,
        isExpense: true,
      });
    });

    // Check if shiftTotalAllowance is greater than 0 and if the name "Shift Allowance" does not already exist
    if (shiftTotalAllowance > 0) {
      const existingIndex = updatedIncomeValues.findIndex(
        (ele) => ele.name === "Shift Allowance"
      );

      if (existingIndex === -1) {
        // If "Shift Allowance" does not exist, add it to the array
        updatedIncomeValues.push({
          name: "Shift Allowance",
          value: shiftTotalAllowance,
        });
      } else {
        // If "Shift Allowance" already exists, update its value
        updatedIncomeValues[existingIndex].value = shiftTotalAllowance;
      }
    }

    // Add Remote Punch Allowance if applicable
    if (remotePunchAllowance > 0) {
      const existingIndex = updatedIncomeValues.findIndex(
        (ele) => ele.name === "Remote Punch Allowance"
      );

      if (existingIndex === -1) {
        // If "Remote Punch Allowance" does not exist, add it to the array
        updatedIncomeValues.push({
          name: "Remote Punch Allowance",
          value: remotePunchAllowance,
        });
      } else {
        // If "Remote Punch Allowance" already exists, update its value
        updatedIncomeValues[existingIndex].value = remotePunchAllowance;
      }
    }

    // Add overtime Allowance if applicable
    if (totalOvertimeAllowance > 0) {
      const existingIndex = updatedIncomeValues.findIndex(
        (ele) => ele.name === "Overtime Allowance"
      );

      if (existingIndex === -1) {
        // If "Overtime Allowance" does not exist, add it to the array
        updatedIncomeValues.push({
          name: "Overtime Allowance",
          value: totalOvertimeAllowance,
        });
      } else {
        // If "Overtime Allowance" already exists, update its value
        updatedIncomeValues[existingIndex].value = remotePunchAllowance;
      }
    }
    // Update the incomeValues state with the new array
    setIncomeValues([
      ...updatedIncomeValues,
      ...salaryComponent?.fixedAllowance,
    ]);

    // eslint-disable-next-line
  }, [
    selectedDate,
    salaryComponent,
    totalAvailableDays,
    shiftTotalAllowance,
    remotePunchAllowance,
    totalOvertimeAllowance,
    isLoading,
    expensePayments,
  ]);

  // get the PFsetup from organizaiton
  const { PfSetup } = useGetPfEsicSetup({
    organisationId,
  });

  // Initialize the state for set deduction value
  let pwd = availableEmployee?.pwd;
  console.log("availableEmployee", availableEmployee);

  console.log("after pwd ", incomeValues);

  // calculate the financial year
  const calculateFinancialYear = (date) => {
    const month = date?.month();
    const currentYear = date?.year();
    if (month < 3) {
      // January, February, March
      return `${currentYear - 1}-${currentYear}`;
    } else {
      return `${currentYear}-${currentYear + 1}`;
    }
  };
  const financialYear = calculateFinancialYear(dayjs(selectedDate));

  // to get the annual income tax
  const { data: annualIncomeTax } = useQuery(
    ["getIncomeTax", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/tds/getMyDeclaration/${financialYear}/${getTotalSalaryEmployee}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data.getTotalTaxableIncome;
    }
  );

  // calculate monthly income tax based on annual income tax
  const monthlyIncomeTax =
    typeof annualIncomeTax === "number" && annualIncomeTax > 0
      ? annualIncomeTax / 12
      : "0";
  console.log("monthlyIncomeTax :", monthlyIncomeTax);

  // get the loan deduction amount from loan application data of employee
  let loanDeduction = 0;
  if (Array.isArray(empLoanAplicationInfo)) {
    const currentDate = new Date();
    // Filter loan applications that are currently active
    const loanDeductionApplications = empLoanAplicationInfo?.filter(
      (application) => {
        const loanDisbursementDate = new Date(
          application?.loanDisbursementDate
        );
        const loanCompletionDate = new Date(application?.loanCompletedDate);
        return (
          loanDisbursementDate <= currentDate &&
          currentDate <= loanCompletionDate
        );
      }
    );
    // Calculate the total loan deduction for active loans
    loanDeduction = loanDeductionApplications.reduce((total, application) => {
      // Check if the current application is within the loan disbursement and completion dates
      const loanDisbursementDate = new Date(application.loanDisbursementDate);
      const loanCompletionDate = new Date(application.loanCompletedDate);
      if (
        loanDisbursementDate <= currentDate &&
        currentDate <= loanCompletionDate
      ) {
        return total + parseFloat(application.totalDeduction || 0);
      }
      return total;
    }, 0);
  }
  loanDeduction = isNaN(loanDeduction) ? 0 : Math.round(loanDeduction);

  // calculate the deduction value
  const [deductionValues, setDeductionValues] = useState([]);
  console.log("deductionValues", deductionValues);

  const [employerContribution, setEmployerContribution] = useState(0);
  useEffect(() => {
    let basic = 0;
    let da = 0;

    // Loop through income array to find Basic and DA components
    incomeValues?.forEach((item) => {
      if (item?.name === "Basic") {
        basic = item.value;
      }
      if (item?.name === "DA") {
        da = item.value;
      }
    });

    const combinedBasicDA = basic + da;
    const basicDA = combinedBasicDA < 15000 ? combinedBasicDA : 15000;
    const employeePF = (basicDA * PfSetup?.EPF) / 100;

    const totalGrossSalary = incomeValues?.reduce((a, c) => a + c.value, 0);
    console.log(`🚀 ~ checkOne`, pwd, totalGrossSalary);
    const empCtr = pwd
      ? totalGrossSalary < 25000
        ? 0
        : (totalGrossSalary * PfSetup?.ECP) / 100
      : totalGrossSalary <= 21000
      ? (totalGrossSalary * PfSetup?.ECP) / 100
      : 0;

    const emlCtr = pwd
      ? totalGrossSalary < 25000
        ? 0
        : (totalGrossSalary * PfSetup?.ECS) / 100
      : totalGrossSalary <= 21000
      ? (totalGrossSalary * PfSetup?.ECS) / 100
      : 0;

    // Safely reduce deductions, ensuring deduction array exists
    const updatedDeductions = salaryComponent?.deductions
      ? salaryComponent?.deductions?.reduce((acc, deduction) => {
          if (deduction.name === "PF") {
            acc.push({ ...deduction, value: employeePF });
          } else if (deduction.name === "ESIC") {
            if (empCtr > 0) {
              acc.push({ ...deduction, value: Math.round(empCtr) });
            }
          } else {
            acc.push(deduction);
          }
          return acc;
        }, [])
      : [];

    // Remove ESIC if empCtr is 0
    if (empCtr === 0) {
      const esicIndex = updatedDeductions.findIndex(
        (deduction) => deduction.name === "ESIC"
      );
      if (esicIndex !== -1) {
        updatedDeductions.splice(esicIndex, 1);
      }
    }

    if (tdsData?.regularTaxAmount > 0) {
      const taxAmount = tdsData?.regularTaxAmount + tdsData?.cess;
      const monthAmount = Math.round(taxAmount / 12);
      updatedDeductions.push({
        name: "TDS",
        value: monthAmount,
      });
    }

    // Process loan deductions if applicable
    const selectedDateObj = new Date(selectedDate);
    empLoanAplicationInfo?.forEach((loanInfo) => {
      const loanDisbursement = new Date(loanInfo?.loanDisbursementDate);
      const loanCompleted = new Date(loanInfo?.loanCompletedDate);

      if (
        loanDeduction > 0 &&
        selectedDateObj >= loanDisbursement &&
        selectedDateObj <= loanCompleted
      ) {
        const existingIndex = updatedDeductions?.findIndex(
          (ele) => ele.name === "Loan Deduction"
        );

        if (existingIndex !== -1) {
          // Update existing deduction
          updatedDeductions[existingIndex] = {
            name: "Loan Deduction",
            value: loanDeduction,
          };
        } else {
          // Push new loan deduction entry
          updatedDeductions.push({
            name: "Loan Deduction",
            value: loanDeduction,
          });
        }
      }
    });

    setDeductionValues(updatedDeductions);
    setEmployerContribution(emlCtr > 0 ? emlCtr : 0);

    // eslint-disable-next-line
  }, [
    salaryComponent,
    PfSetup,
    selectedDate,
    incomeValues,
    loanDeduction,
    empLoanAplicationInfo,
    tdsData,
  ]);

  // calculate the total income (totalGrossSalary) , total deduction , totalNetAalary
  const [salary, setSalary] = useState({
    totalIncome: 0,
    totalDeduction: 0,
    totalNetSalary: 0,
  });
  useEffect(() => {
    const income = incomeValues?.reduce((a, c) => a + c.value, 0);
    console.log("incomeedede", incomeValues);

    const expenseAmount =
      expensePayments?.reduce(
        (total, expense) =>
          total + (expense.isReport ? expense.totalAmount : expense.amount),
        0
      ) || 0;

    // In your existing salary calculation code, modify only the necessary parts:
    const totalIncome = isdailywage
      ? incomeValues?.reduce((a, c) => a + c.value, 0) * workingHours
      : incomeValues?.reduce((a, c) => a + c.value, 0) || 0;

    console.log("total income", totalIncome);
    const totalDeduction =
      deductionValues?.reduce((a, c) => a + c.value, 0) || 0;
    const totalNetSalary = Math.round(totalIncome - totalDeduction);

    setSalary({
      totalIncome: Math.round(totalIncome + expenseAmount), // Add expense to gross
      totalDeduction: Math.round(totalDeduction),
      totalNetSalary: Math.round(totalIncome - totalDeduction), // Keep original net calculation
    });

    // eslint-disable-next-line
  }, [deductionValues, incomeValues, tdsFetching, expensePayments]);

  // submit the data
  const saveSalaryDetail = async () => {
    try {
      const currentYear = dayjs().format("YYYY");
      const currentMonth = dayjs().format("MM");
      const selectedYear = selectedDate.format("YYYY");
      const selectedMonth = selectedDate.format("MM");
      const employeeJoiningYear = dayjs(availableEmployee?.joining_date).format(
        "YYYY"
      );
      const employeeJoiningMonth = dayjs(
        availableEmployee?.joining_date
      ).format("MM");
      const nextMonth =
        Number(currentMonth) === 12
          ? Number(currentMonth) + 1
          : Number(currentMonth);

      if (
        Number(selectedYear) > Number(currentYear) ||
        (Number(selectedYear) === Number(currentYear) &&
          Number(selectedMonth) > nextMonth)
      ) {
        handleAlert(
          true,
          "error",
          `Cannot calculate salary for future months or years`
        );
        return;
      }
      if (
        parseInt(selectedYear) < parseInt(employeeJoiningYear) ||
        (parseInt(selectedYear) === parseInt(employeeJoiningYear) &&
          parseInt(selectedMonth) < parseInt(employeeJoiningMonth))
      ) {
        handleAlert(
          true,
          "error",
          "Cannot calculate salary for months before employee's joining date"
        );
        return;
      }
      const data = {
        employeeId: userId,
        income: incomeValues,
        deductions: deductionValues,
        totalGrossSalary: salary?.totalIncome,
        totalDeduction: salary?.totalDeduction,
        totalNetSalary: salary?.totalNetSalary,
        emlCtr: employerContribution,
        numDaysInMonth,
        formattedDate,
        publicHolidaysCount,
        paidLeaveDays,
        unPaidLeaveDays,
        totalAvailableDays,
        month: selectedDate.format("M"),
        year: selectedDate.format("YYYY"),
        organizationId: organisationId,
      };
      console.log("data", data);
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/employeeSalary/add-salary/${userId}/${organisationId}`,
        data,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.data.success) {
        handleAlert(
          true,
          "success",
          "Monthly Salary Detail added Successfully"
        );
        await refetchSubmittedSalaries();
      }
      // window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        handleAlert(
          true,
          "error",
          "Salary for this month and year already exists"
        );
      } else {
        console.error("Error adding salary details:", error);
        handleAlert(true, "error", "Failed to add salary details");
      }
    }
  };
  console.log("salary", salary);

  // download the pdf
  // const exportPDF = async () => {
  //   const input = document.getElementById("App");
  //   console.log(`🚀 ~ input:`, input);

  //   const opt = {
  //     filename: "payslip.pdf",
  //     margin: [2, 0, 2, 0], // Set margins
  //     image: { type: "jpeg", quality: 0.98 }, // Set image type and quality
  //     html2canvas: { scale: 2, windowWidth: 1920 }, // Increase scale & force lg screen width
  //     jsPDF: { unit: "mm", format: "a4" }, // Set PDF format & landscape mode
  //   };

  //   try {
  //     // Fetch image using axios with authorization headers
  //     const imageUrl = `${process.env.REACT_APP_API}/route/getImageFile?imageUrl=${availableEmployee?.organizationId?.logo_url}`;
  //     const response = await axios.get(imageUrl, {
  //       headers: { Authorization: token },
  //       responseType: "blob", // Ensure the response is a Blob
  //     });
  //     const blob = response.data;
  //     const imageBlobUrl = URL.createObjectURL(blob);

  //     // Replace the image src with the Blob URL
  //     const imgElement = input.querySelector("img");
  //     if (imgElement) {
  //       imgElement.src = imageBlobUrl;
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch image:", error);
  //   }

  //   // Force lg screen rendering
  //   input.classList.add("lg-screen");

  //   html2pdf().from(input).set(opt).save();

  //   // Remove lg screen class after exporting
  //   setTimeout(() => {
  //     input.classList.remove("lg-screen");
  //   }, 1000);
  // };

  const exportPDF = async () => {
    const input = document.getElementById("App");
    console.log(`🚀 ~ input:`, input);

    // Measure the content height in pixels
    const contentHeight = input.scrollHeight; // Total height of the content

    // Define A4 and A3 sizes in pixels (approximate)
    const A4_HEIGHT_PX = 1123; // Roughly corresponds to A4 height at 96 DPI
    const A3_HEIGHT_PX = 1587; // Roughly corresponds to A3 height at 96 DPI

    // Determine page format
    const pageFormat = contentHeight > A4_HEIGHT_PX ? "a3" : "a4";

    const opt = {
      filename: "payslip.pdf",
      margin: [2, 0, 2, 0], // Set margins
      image: { type: "jpeg", quality: 0.98 }, // Set image type and quality
      html2canvas: { scale: 2, windowWidth: 1920 }, // Increase scale & force lg screen width
      jsPDF: { unit: "mm", format: pageFormat }, // Dynamically set format
    };

    try {
      // Fetch image using axios with authorization headers
      const imageUrl = `${process.env.REACT_APP_API}/route/getImageFile?imageUrl=${availableEmployee?.organizationId?.logo_url}`;
      const response = await axios.get(imageUrl, {
        headers: { Authorization: token },
        responseType: "blob", // Ensure the response is a Blob
      });
      const blob = response.data;
      const imageBlobUrl = URL.createObjectURL(blob);

      // Replace the image src with the Blob URL
      const imgElement = input.querySelector("img");
      if (imgElement) {
        imgElement.src = imageBlobUrl;
      }
    } catch (error) {
      console.error("Failed to fetch image:", error);
    }

    // Force lg screen rendering
    input.classList.add("lg-screen");

    html2pdf().from(input).set(opt).save();

    // Remove lg screen class after exporting
    setTimeout(() => {
      input.classList.remove("lg-screen");
    }, 1000);
  };

  // submit the data of payslip
  const handleSubmitClick = () => {
    setActiveButton("submit");
    saveSalaryDetail();
  };

  // download the payslip
  const handleDownloadClick = () => {
    setActiveButton("download");
    exportPDF();
  };

  //Annual Salary

  // // Calculate current month and financial year
  // const currentMonth = dayjs().month() + 1; // Current month (1-12)
  // const financialYearStartMonth = 4; // April is the start of the financial year

  // // Calculate how many months from April to the current month
  // const monthsFromAprilToCurrent =
  //   currentMonth >= financialYearStartMonth
  //     ? currentMonth - financialYearStartMonth + 1
  //     : 0; // If it's before April, we don't calculate yet

  // console.log("Months from April to Current Month:", monthsFromAprilToCurrent);

  // const minDate = dayjs(joiningDate).format("YYYY-MM");
  // const maxDate = dayjs().subtract(1, "month").format("YYYY-MM");
  // const defaultDate = dayjs().subtract(1, "month");

  //Annual 2.0
  const calculateFinancialYearMonths = () => {
    const selectedYear = selectedDate.year();
    const selectedMonth = selectedDate.month() + 1;
    const financialYearStartMonth = 4;

    // Consider joining date
    // const joiningMonth = dayjs(joiningDate).month() + 1;
    // const joiningYear = dayjs(joiningDate).year();

    let financialYearStart;
    if (selectedMonth < financialYearStartMonth) {
      financialYearStart = dayjs(`${selectedYear - 1}-04-01`);
    } else {
      financialYearStart = dayjs(`${selectedYear}-04-01`);
    }

    // Adjust start date if joining date is after financial year start
    if (dayjs(joiningDate).isAfter(financialYearStart)) {
      financialYearStart = dayjs(joiningDate);
    }

    const monthsDiff = selectedDate.diff(financialYearStart, "month") + 1;
    return Math.max(0, monthsDiff);
  };

  // Keep existing date constraints
  const minDate = dayjs(joiningDate).format("YYYY-MM");
  const maxDate = dayjs().subtract(1, "month").format("YYYY-MM");
  const defaultDate = dayjs().subtract(1, "month");

  // Use this for annual calculations
  const monthsForAnnual = calculateFinancialYearMonths();
  console.log("monthsForAnnual", monthsForAnnual);

  // Check if the employee is offboarded
  const isOffboarded = availableEmployee?.isOffboarded;

  console.log("isOffboarded", isOffboarded, availableEmployee?.lastDate);

  const companyData = {
    name: availableEmployee?.organizationId?.orgName || "",
    address: availableEmployee?.organizationId?.location?.address || "",
    phone: availableEmployee?.organizationId?.contact_number || "",
    email: availableEmployee?.organizationId?.email || "",
    // gstin: "27AAVCA3805B1ZS",
    // certification: "ISO9001-2015 & ISO27001-2013 certified company",
    logo: availableEmployee?.organizationId?.logo_url,
  };

  const employeeData = {
    name: `${availableEmployee?.first_name} ${availableEmployee?.last_name}`,
    designation:
      (availableEmployee?.designation &&
        availableEmployee?.designation.length > 0 &&
        availableEmployee?.designation[0]?.designationName) ||
      "",
    department:
      (availableEmployee?.deptname &&
        availableEmployee?.deptname.length > 0 &&
        availableEmployee?.deptname[0]?.departmentName) ||
      "",
    pan: availableEmployee?.pan_card_number,
    employeeId: availableEmployee?.empId,
    bankAccountNumber: availableEmployee?.bank_account_no || "",
    esicNo: availableEmployee?.esicNo || "",
    uanNo: availableEmployee?.uanNo || "",
    employmentType: availableEmployee?.employmentType?.title || "",
    joiningDate: availableEmployee?.joining_date
      ? new Date(availableEmployee?.joining_date).toLocaleDateString("en-GB")
      : "",
    unpaidLeaves: unPaidLeaveDays,
    workingDaysAttended: Math.round(totalAvailableDays),
    paidLeaves: unPaidLeaveDays,
    publicHolidays: employeeSummary?.publicDays,
    daysInMonth: numDaysInMonth,
    totalWorkingHours: workingHours,
    extradayCount: extradayCount,
  };

  const monthlyIncomeData =
    incomeValues
      ?.filter((income) => !income.isExpense) // Ensuring only income values
      ?.map((income) => ({
        particular: income.name, // Mapping "name" to "particular"
        amount: Math.round(income.value), // Mapping "value" to "amount"
      })) || [];

  const monthlyDeductionData =
    deductionValues?.map((deduction) => ({
      particular: deduction.name, // Mapping "name" to "particular"
      amount: Math.round(deduction.value) || 0, // Mapping "value" to "amount" and ensuring no undefined values
    })) || [];

  const annualIncomeData =
    incomeValues?.map((income) => ({
      particular: income.name,
      amount:
        submittedSalaries?.length > 0
          ? Math.round(income.value * submittedSalaries.length)
          : 0,
    })) || [];

  // const annualDeductionData = [{ particular: "", amount: "0" }];
  const annualDeductionData =
    deductionValues?.map((deduction) => ({
      particular:
        deduction.name !== "Loan Deduction" ? deduction.name : "\u00A0", // Exclude "Loan Deduction"
      amount:
        deduction.name !== "Loan Deduction" && submittedSalaries?.length > 0
          ? Math.round(deduction.value * submittedSalaries.length)
          : "\u00A0",
    })) || [];

  const monthlyTotals = {
    grossSalary: salary?.totalIncome || 0,
    totalDeduction: salary?.totalDeduction || 0,
    netSalary: salary?.totalNetSalary || 0,
  };

  const annualTotal = {
    grossSalary: salary?.totalIncome
      ? Math.round(salary?.totalIncome * submittedSalaries?.length) // Multiply by months passed
      : 0,
    totalDeduction: salary?.totalDeduction
      ? deductionValues.reduce((a, i) => {
          return i.name !== "Loan Deduction"
            ? (a += Number(i.value) * submittedSalaries?.length)
            : (a += 0);
        }, 0)
      : 0,
    netSalary: submittedSalaries ? Math.round(annualTotals.net) : "",
  };

  const currentMonth = "Mar-25";

  // Check if the employee is offboarded and their last working date is greater than the selected date
  const isOffboardedAndLastDateGreater =
    isOffboarded &&
    availableEmployee?.lastDate &&
    dayjs(availableEmployee?.lastDate).isBefore(selectedDate, "month");

  return (
    <BoxComponent>
      <HeadingOneLineInfo
        heading={"Salary Calulation"}
        info={"Here you can see salary calculation"}
      />

      <div className="container mx-auto py-2">
        <input
          type="month"
          value={selectedDate.format("YYYY-MM")}
          onChange={handleDateChange}
          style={{ width: "500px" }}
          className="border border-gray-300 rounded-md p-2 mt-2"
          // min={minDate}
          // max={maxDate}
          defaultValue={defaultDate.format("YYYY-MM")}
        />
        <h4 className="text-lg font-bold text-gray-700 pb-2">
          Please select the month for calculate salary.
        </h4>
        {isFetching || isLoading || tdsFetching ? (
          <CircularProgress />
        ) : (
          <>
            <div id="App" className="px-3">
              <SalarySlip
                companyData={companyData}
                employeeData={employeeData}
                monthlyIncomeData={monthlyIncomeData}
                monthlyDeductionData={monthlyDeductionData}
                annualIncomeData={annualIncomeData}
                annualDeductionData={annualDeductionData}
                monthlyTotals={monthlyTotals}
                annualTotals={annualTotal}
                currentMonth={currentMonth}
                financialYear={financialYear}
                isdailywage={isdailywage}
              />
            </div>

            {/* Conditionally render buttons or message */}
            {isOffboardedAndLastDateGreater ? (
              <div className="text-red-500 text-center m-2 font-bold">
                Employee has been offboarded. You cannot generate their salary.
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                  }}
                >
                  <Button
                    variant={
                      activeButton === "submit" ? "contained" : "outlined"
                    }
                    onClick={handleSubmitClick}
                    color="primary"
                  >
                    Submit
                  </Button>
                  <Button
                    variant={
                      activeButton === "download" ? "contained" : "outlined"
                    }
                    onClick={handleDownloadClick}
                    color="primary"
                  >
                    Download PDF
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </BoxComponent>
  );
}

export default CalculateSalary;

// Annual Salary should be only added if salary is (submit  button)submitted  till previous month. If salary is not submitted then it should not be added under annual salary (then show empty )
//Annual salary should be as per finical year added in setup which should be added for Organization. if ex: Finical year is Jan to Dec then Annual salary should be addition of all salaries submitted from Jan till Dec. Jan month salary should showing annual salary as 0 as Jan month will be first month in finical year and  salary is not submitted.
