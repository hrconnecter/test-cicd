import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState, useMemo, useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import { useParams } from "react-router-dom";
import axios from "axios";
import useAuthToken from "../../../hooks/Token/useAuth";
import { TestContext } from "../../../State/Function/Main";
import { useMutation } from "react-query";
import { SiMicrosoftexcel } from "react-icons/si";
import * as XLSX from "xlsx";
import * as ExcelJS from "exceljs";
import Select from "react-select";
import useOrgSubscription from "../../../hooks/Subscription/subscription";
import moment from "moment";

// Define the schema using Zod for validation
const CustomizationReport = () => {
  const orgId = useParams().organisationId;
  const { handleAlert } = useContext(TestContext);
  const { subscriptionDetails } = useOrgSubscription(orgId);

  const MISchema = z.object({
    department: z.object({
      label: z.string().nonempty({ message: "Department is required" }),
      value: z.string().nonempty({ message: "Value is required" }),
    }),
    subOption: z
      .object({
        label: z.string(),
        value: z.string(),
      })
      .optional(), // Make subOption optional
    checkboxes: z.array(z.string()).optional(),
    startMonth: z
      .object({
        label: z.string(),
        value: z.string(),
      })
      .optional(),
    startYear: z
      .object({
        label: z.string(),
        value: z.string(),
      })
      .optional(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    getValues,
    setValue,
    resetField,
  } = useForm({
    resolver: zodResolver(MISchema),
    defaultValues: {
      department: undefined,
      subOption: undefined,
      checkboxes: [],
      startMonth: undefined,
      startYear: undefined,
    },
  });

  const departments = [
    { label: "Attendence", value: "attendence" },
    { label: "Payroll", value: "payroll" },
    { label: "Performance", value: "performance" },
    { label: "GeoFencing", value: "geoFence" },
    { label: "Record", value: "record" },
   { label: "Remote punch Report", value: "remotepunch" },
   { label: "Advance Salary", value: "advancesalary" },
   {label: "Loan Management", value: "loanmanagement" },
  { label: "Food and Catering", value: "foodandcatering" },
  ];

  const subOptions = useMemo(
    () => ({
      record: [
        { label: "Document uploaded by employee", value: "document" },
        { label: "Policies", value: "policies" },
        { label: "Letters", value: "letters" },
      ],

      payroll : [
        { label: "Salary Report", value: "salary" },
        { label: "ESIC Challan", value: "esic" },
        { label: "PF Challan", value: "pf" },
        { label: "TDS Report", value: "tds" },

      ],
      geoFencing: [
        { label: "Set Zones", value: "setZones" },
        { label: "View Logs", value: "viewLogs" },
      ],

      foodandcatering: [
        { label: "Vendor Profile Report ", value: "vendorreports" },
        { label: "Employee Order Report ", value: "employeeorderreports" },
        { label: "Order Report", value: "orderreports" },
        { label: "Menu Report", value: "menureports" },
      ],

      advancesalary: [
        { label: "Advance Salary Report", value: "advancesalaryreport"}
      ],

      loanmanagement:[
       
        { label: "Loan Type Report", value: "loantypereport" },
        { label: "Employee Loan Report", value: "loanemployeereport" },
      
      ],

      remotepunch: [
        { label: "Remote Pumch Report", value: "setRemotePunches" }
      ],
        
      performance: [
        { label: "Organisation", value: "organisation" },
        { label: "List", value: "list" },
      ],
    }),
    []
  );

  const checkboxes = useMemo(
    () => ({
      document: [
        "First Name",
        "Last Name",
        "Email",
        // "Document Name",
        "Department Name",
        "Phone",
        "Location",
        "Company Email",
        "Gender",
      ],
      policies: [
        "View Policies",
        "Applicable Date",
        "Updated Date",
        "Active Status",
      ],
      esic: [
        "Salary Report",
        "Salary Report",
      ],
      vendorreports: [
        "First Name",
        "Last Name",
        "Email",
        "Gender",
        "Department Name",
        "Phone",
        "Location",
        "Company Name",
        "Bank Account Number",
        "Selected Frequency of Menu Update",
        // "Document Uploaded By Vendor",
        // "View Document",
        "Pan Card Number",
       
      ],
      orderreports: ["Company Name","Vendor Name","Total Orders Placed","Total Revenue Generated:","Top 3 Ordered Menu Items"],
      menureports:["Vendor Name","List Of Menu Items","Preparation Time","Price","Veg/Non-Veg","Cuisine Type","Available","Category"],
      employeeorderreports: ["Employee Name","Company Name","Vendor Name","Order Menu","Price","Quantity","Discount","Grand Total","Status","Placed At","Updated At","Rating","Review"],
      setRemotePunches:   ["Employee Name","Punch In Time","Punch Out Time","Distance Travelled","Status"],
     
      loantypereport: ["Loan Name","Minimum Loan Value","Maximum Loan Value","Rate Of Intrest"],
      loanemployeereport: ["Employee Name","Email","Loan Type","Rate Of Intrest","Loan Amount Applied","Disbursement Date","Completion Date","No of EMI","Loan Amount Paid Monthly","Total Deduction Montly","Loan Status"],


      advancesalaryreport: ["Employee Name","Email","Total Salary","Advance Salary","No Of Month","Start Date","End Date","Status"],
     



      setZones: ["Zone 1", "Zone 2", "Zone 3"],
      viewLogs: ["1"],
      letters: [
        "Title",
        "View Letter",
        "Letter Status",
        "Employee Name",
        "Hr Name",
        "Manager Name",
        "Applicable Date",
        "Status",
      ],
      organisation: ["A", "B", "C", "D"],
      list: ["al", "om"],
    }),
    []
  );

  const checkboxMapping = useMemo(
    () => ({
      document: {
        "First Name": "first_name",
        "Last Name": "last_name",
        Email: "email",
        // "Document Name": "selectedValue",
        "Department Name": "departmentName",
        Phone: "phone_number",
        Location: "worklocation",
        "Company Email": "companyemail",
        Gender: "gender",
      },

      policies: {
        "View Policies": "url",
        "Applicable Date": "applicableDate",
        "Updated Date": "updatedAt",
        "Active Status": "isActive",
      },

      letters: {
        Title: "title",
        "View Letter": "url",
        "Letter Status": "docstatus",
        "Employee Name": "empidd",
        "Hr Name": "hrid",
        "Manager Name": "managerId",
        "Applicable Date": "applicableDate",
        Status: "isActive",
      },

      vendorreports: {
        "First Name": "first_name",
        "Last Name": "last_name",
        "Email": "email",
        // "Department Name": "departmentName",
        "Phone": "phone_number",
        "Gender": "gender",
        "Location": "address",
        "Company Name": "companyname",
        "Bank Account Number": "bank_account_no",
        "Selected Frequency of Menu Update": "selectedFrequency",
        // "Document Uploaded By Vendor": "selectedValue",
        // "View Document" : "url",
        "Pan Card Number": "pan_card_number",

      },

      orderreports: {
        "Company Name": "company_name",
        "Vendor Name": "vendor_name",
        "Total Orders Placed": "total_orders_placed",
        "Total Revenue Generated:": "total_revenue_generated",
        "Top 3 Ordered Menu Items": "top_3_ordered_menu_items",
      },

      menureports: {
        "Vendor Name": "vendor_name",
        "List Of Menu Items": "name",
        "Preparation Time": "preparationTime",
        "Price": "price",
        "Veg/Non-Veg": "isVeg",
        "Cuisine Type": "cuisineType",
        "Available": "available",
        "Category": "category"
      },

      employeeorderreports:{
        "Employee Name": "employee_name",
        "Company Name": "company_name",
        "Vendor Name": "vendor_name",
        "Order Menu": "name",
        "Price": "price",
        "Quantity":"quantity",
        "Discount": "discount",
        "Grand Total": "grandTotal",
        "Status": "status",
        "Placed At": "placedAt",
        "Updated At": "updatedAt",
        "Rating": "rating",
        "Review": "review",
      },

      setRemotePunches: {
        "Employee Name": "employee_name",
        "Punch In Time": "punch_in_time",
        "Punch Out Time": "punch_out_time",
        "Distance Travelled": "distance_travelled",
       "Status": "status",
},

advancesalaryreport: {
  "Employee Name": "employee_name",
   "Email": "email",
   "Total Salary": "totalSalary",
   "Advance Salary": "advancedSalaryAmounts",
   "No Of Month": "noOfMonth",
   "Start Date": "advanceSalaryStartingDate",
   "End Date": "advanceSalaryEndingDate",
   "Status": "status",
},

loantypereport:{
  "Loan Name": "loanName",
  "Minimum Loan Value": "loanValue",
  "Maximum Loan Value": "maxLoanValue",
  "Rate Of Intrest": "rateOfInterest",

},

loanemployeereport:{
  "Employee Name": "employeeName",
  "Email": "email",
  "Loan Type": "loanType",
  "Rate Of Intrest": "rateOfInterest",
  "Loan Amount Applied": "loanAmount",
  "Disbursement Date": "loanDisbursementDate",
  "Completion Date": "loanCompletedDate",
  "No of EMI": "noOfEmi",
  "Loan Amount Paid Monthly": "totalDeduction",
  "Total Deduction Montly": "totalDeductionMonthly",
  "Loan Status": "loanStatus",
  },


      setZones: {
        "Zone 1": "ZONE_1",
        "Zone 2": "ZONE_2",
        "Zone 3": "ZONE_3",
      },
      viewLogs: {
        1: "LOG_1",
      },

      organisation: {
        A: "ORG_A",
        B: "ORG_B",
        C: "ORG_C",
        D: "ORG_D",
      },
      list: {
        al: "LIST_AL",
        om: "LIST_OM",
      },
    }),
    []
  );

  const [subOptionsList, setSubOptionsList] = useState([]);
  const [availableCheckboxes, setAvailableCheckboxes] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [loading, setLoading] = useState(false); // State for loader visibility

  const departmentValue = watch("department")?.value;
  const subOptionValue = watch("subOption")?.value;

  useEffect(() => {
    if (departmentValue) {
      setSubOptionsList(subOptions[departmentValue] || []);
      resetField("subOption");
      setAvailableCheckboxes([]);
    }
  }, [departmentValue, subOptions, resetField]);

  useEffect(() => {
    if (subOptionValue && checkboxes[subOptionValue]) {
      setAvailableCheckboxes(checkboxes[subOptionValue]);
    }
  }, [subOptionValue, checkboxes]);

  const authToken = useAuthToken();

  useEffect(() => {
    const fetchMisData = async () => {
      try {
        setLoading(true); // Show loader when fetching data
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/MisReport/get/${orgId}`,
          {
            headers: {
              Authorization: `${authToken}`,
            },
          }
        );
        const misData = response.data.data;

        const currentMisRecord = misData.find(
          (record) =>
            record.department === departmentValue &&
            record.subOption === subOptionValue
        );

        if (currentMisRecord) {
          const selectedCheckboxes = Object.keys(
            currentMisRecord.checkboxes
          ).filter((key) => currentMisRecord.checkboxes[key] === true);

          const selectedCheckboxDisplayNames = selectedCheckboxes.map(
            (checkboxKey) => {
              const checkboxName = Object.keys(
                checkboxMapping[subOptionValue] || {}
              ).find(
                (key) => checkboxMapping[subOptionValue][key] === checkboxKey
              );
              return checkboxName;
            }
          );

          setAvailableCheckboxes(selectedCheckboxDisplayNames);
        }
      } catch (error) {
        console.error("Error fetching MIS data", error);
      } finally {
        setLoading(false); // Hide loader after fetching is complete
      }
    };

    fetchMisData();
  }, [orgId, departmentValue, subOptionValue, authToken, checkboxMapping]);

  const handleSelectAllChange = () => {
    const newSelectAllChecked = !selectAllChecked;
    setSelectAllChecked(newSelectAllChecked);

    if (newSelectAllChecked) {
      // Select all checkboxes
      setValue("checkboxes", availableCheckboxes);
    } else {
      // Unselect all checkboxes
      setValue("checkboxes", []);
    }
  };

  const months = [
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];
  
  const years = Array.from({ length: 20 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { label: year.toString(), value: year.toString() };
  });

  const generateAttendanceReport = (data, selectedMonth, selectedYear) => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Attendance Report")
  
    // Set consistent column widths - ADJUSTED WIDTH for day columns to ensure status has enough space
    worksheet.columns = [
      { width: 20 }, // A - Labels
      { width: 25 }, // B - Values
      { width: 7.5 }, // C - Day 1 (ADJUSTED WIDTH)
      { width: 7.5 }, // D - Day 2 (ADJUSTED WIDTH)
      { width: 7.5 }, // E - Day 3 (ADJUSTED WIDTH)
      { width: 7.5 }, // F - Day 4 (ADJUSTED WIDTH)
      { width: 7.5 }, // G - Day 5 (ADJUSTED WIDTH)
      { width: 7.5 }, // H - Day 6 (ADJUSTED WIDTH)
      { width: 7.5 }, // I - Day 7 (ADJUSTED WIDTH)
      { width: 7.5 }, // J - Day 8 (ADJUSTED WIDTH)
      { width: 7.5 }, // K - Day 9 (ADJUSTED WIDTH)
      { width: 7.5 }, // L - Day 10 (ADJUSTED WIDTH)
      { width: 7.5 }, // M - Day 11 (ADJUSTED WIDTH)
      { width: 7.5 }, // N - Day 12 (ADJUSTED WIDTH)
      { width: 7.5 }, // O - Day 13 (ADJUSTED WIDTH)
      { width: 7.5 }, // P - Day 14 (ADJUSTED WIDTH)
      { width: 7.5 }, // Q - Day 15 (ADJUSTED WIDTH)
      { width: 7.5 }, // R - Day 16 (ADJUSTED WIDTH)
      { width: 7.5 }, // S - Day 17 (ADJUSTED WIDTH)
      { width: 7.5 }, // T - Day 18 (ADJUSTED WIDTH)
      { width: 7.5 }, // U - Day 19 (ADJUSTED WIDTH)
      { width: 7.5 }, // V - Day 20 (ADJUSTED WIDTH)
      { width: 7.5 }, // W - Day 21 (ADJUSTED WIDTH)
      { width: 7.5 }, // X - Day 22 (ADJUSTED WIDTH)
      { width: 7.5 }, // Y - Day 23 (ADJUSTED WIDTH)
      { width: 7.5 }, // Z - Day 24 (ADJUSTED WIDTH)
      { width: 7.5 }, // AA - Day 25 (ADJUSTED WIDTH)
      { width: 7.5 }, // AB - Day 26 (ADJUSTED WIDTH)
      { width: 7.5 }, // AC - Day 27 (ADJUSTED WIDTH)
      { width: 7.5 }, // AD - Day 28 (ADJUSTED WIDTH)
      { width: 7.5 }, // AE - Day 29 (ADJUSTED WIDTH)
      { width: 7.5 }, // AF - Day 30 (ADJUSTED WIDTH)
      { width: 7.5 }, // AG - Day 31 (ADJUSTED WIDTH)
    ]
  
    let currentRow = 1
  
    // Add organization name with enhanced styling (only top header) - LEFT ALIGNED
    const orgName = subscriptionDetails?.organisation?.orgName || "Organization Name";
   
    worksheet.mergeCells(`A${currentRow}:AG${currentRow}`);
    const orgCell = worksheet.getCell(`A${currentRow}`);
    orgCell.value = `${orgName}`;
    orgCell.alignment = { horizontal: "left", vertical: "middle" };
    orgCell.font = { bold: true, size: 16, color: { argb: "002060" } };
    orgCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "E6F0FF" },
    };
  
    // Add border to header
    for (let i = 1; i <= 33; i++) {
      // Increased to 33 columns (A, B + 31 days)
      const colLetter = getColumnLetter(i)
      worksheet.getCell(`${colLetter}${currentRow}`).border = {
        top: { style: "medium" },
        left: { style: "thin" },
        bottom: { style: "medium" },
        right: { style: "thin" },
      }
    }
  
    currentRow += 2 // Space after organization name
  
    data.forEach((employee, index) => {
     
      // Employee details with better styling and alignment
      const detailsFields = [
        { label: "Employee's Name", value: employee.employeeName },
        { label: "Employee's Code", value: employee.employeeCode },
        { label: "Designation", value: employee.designation },
      ]
  
      // Create a styled box for employee details
      worksheet.mergeCells(`A${currentRow}:B${currentRow}`)
      const empHeaderCell = worksheet.getCell(`A${currentRow}`)
      empHeaderCell.value = "EMPLOYEE DETAILS"
      empHeaderCell.alignment = { horizontal: "center" }
      empHeaderCell.font = { bold: true, size: 12 }
      empHeaderCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D9E1F2" }, // Light blue background
      }
  
      // Add border to employee header
      ;["A", "B"].forEach((col) => {
        worksheet.getCell(`${col}${currentRow}`).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        }
      })
  
      currentRow++
  
      detailsFields.forEach((field) => {
        const labelCell = worksheet.getCell(`A${currentRow}`)
        const valueCell = worksheet.getCell(`B${currentRow}`)
  
        labelCell.value = field.label
        valueCell.value = field.value
  
        // Style the cells
        labelCell.font = { bold: true }
        labelCell.alignment = { horizontal: "left", vertical: "middle" }
        valueCell.alignment = { horizontal: "left", vertical: "middle" }
  
        labelCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F2F2F2" }, // Light gray background
        }
  
        // Add borders
        ;[labelCell, valueCell].forEach((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          }
        })
  
        currentRow++
      })
  
      currentRow += 1 // Space after employee details
  
      // Monthly attendance section with improved alignment - LEFT ALIGNED HEADER
      // Create a header that spans exactly 31 days
      worksheet.mergeCells(`A${currentRow}:AG${currentRow}`)
      const attHeaderCell = worksheet.getCell(`A${currentRow}`)
      attHeaderCell.value = "MONTHLY ATTENDANCE"
      attHeaderCell.alignment = { horizontal: "left" } // Changed to left alignment
      attHeaderCell.font = { bold: true, size: 12 }
      attHeaderCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "E2EFDA" }, // Light green background
      }
  
      // Add border to attendance header
      for (let i = 1; i <= 33; i++) {
        // Increased to 33 columns (A, B + 31 days)
        const colLetter = getColumnLetter(i)
        worksheet.getCell(`${colLetter}${currentRow}`).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        }
      }
  
      currentRow++
  
      // Days row with better styling and alignment - SMALLER FONT SIZE
      worksheet.getRow(currentRow)
      const statusRow = worksheet.getRow(currentRow + 1)
      const checkInRow = worksheet.getRow(currentRow + 2)
      const checkOutRow = worksheet.getRow(currentRow + 3)
      const workingHoursRow = worksheet.getRow(currentRow + 4)
  
      // Set row height for attendance rows to ensure enough space
      statusRow.height = 20 // Increased height for status row
      checkInRow.height = 20 // Height for check-in row
      checkOutRow.height = 20 // Height for check-out row
      workingHoursRow.height = 20 // Height for working hours row
  
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate(); // Get total days in the selected month
      for (let i = 1; i <= daysInMonth; i++) { // Loop only up to the total days in the month
        const colLetter = getColumnLetter(i + 2) 
        const dayCell = worksheet.getCell(`${colLetter}${currentRow}`)
        const statusCell = worksheet.getCell(`${colLetter}${currentRow + 1}`)
        const checkInCell = worksheet.getCell(`${colLetter}${currentRow + 2}`)
        const checkOutCell = worksheet.getCell(`${colLetter}${currentRow + 3}`)
        const workingHoursCell = worksheet.getCell(`${colLetter}${currentRow + 4}`)
  
        dayCell.value = i
  
        // Get attendance data for this day
        const dayData = employee.monthlyAttendance[i - 1] || {}
        
        // Set status value
        let statusValue = dayData.status || "N/A"
        if (statusValue === "P" || statusValue === "p") {
          statusValue = "Present"
        } else if (statusValue === "A" || statusValue === "a") {
          statusValue = "Absent"
        } else if (statusValue === "L" || statusValue === "l") {
          statusValue = "Leave"
        } else if (statusValue === "H" || statusValue === "h") {
          statusValue = "Holiday"
        }
        statusCell.value = statusValue
        
        // Set check-in and check-out values
        checkInCell.value = dayData.checkInTime || "N/A"
        checkOutCell.value = dayData.checkOutTime || "N/A"
        workingHoursCell.value = dayData.totalHours || "N/A"
  
        // Style day cells - SMALLER FONT
        dayCell.font = { bold: true, size: 9 } // Reduced font size
        dayCell.alignment = { horizontal: "center" }
        dayCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "D9D9D9" }, // Gray background
        }
  
        // Style status cells - ENSURE PROPER ALIGNMENT
        statusCell.alignment = { horizontal: "center", vertical: "middle" }
        statusCell.font = { size: 8 } // Smaller font for status to fit
  
        // Style check-in and check-out cells
        checkInCell.alignment = { horizontal: "center", vertical: "middle" }
        checkInCell.font = { size: 8 }
        checkOutCell.alignment = { horizontal: "center", vertical: "middle" }
        checkOutCell.font = { size: 8 }

        // Style working hours cells
        workingHoursCell.alignment = { horizontal: "center", vertical: "middle" }
        workingHoursCell.font = { size: 8 }
        workingHoursCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F8F8F8" }, // Very light gray
        }
  
        // Add color coding based on attendance value
        if (statusValue === "Present") {
          statusCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "C6EFCE" }, // Light green for present
          }
        } else if (statusValue === "Absent") {
          statusCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFC7CE" }, // Light red for absent
          }
        } else if (statusValue === "Leave") {
          statusCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFEB9C" }, // Light yellow for leave
          }
        } else if (statusValue === "Holiday") {
          statusCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "BDD7EE" }, // Light blue for holiday
          }
        }
  
        // Add light background for check-in/check-out cells
        checkInCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F8F8F8" }, // Very light gray
        }
        checkOutCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F8F8F8" }, // Very light gray
        }
  
        // Add borders
        ;[dayCell, statusCell, checkInCell, checkOutCell, workingHoursCell].forEach((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          }
        })
      }
  
      // Add labels for the days and attendance rows in columns A and B
      worksheet.mergeCells(`A${currentRow}:B${currentRow}`)
      worksheet.getCell(`A${currentRow}`).value = "Day"
      worksheet.getCell(`A${currentRow}`).font = { bold: true }
      worksheet.getCell(`A${currentRow}`).alignment = { horizontal: "center" }
      worksheet.getCell(`A${currentRow}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D9D9D9" }, // Gray background
      }
      worksheet.getCell(`A${currentRow}`).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      }
  
      worksheet.mergeCells(`A${currentRow + 1}:B${currentRow + 1}`)
      worksheet.getCell(`A${currentRow + 1}`).value = "Status"
      worksheet.getCell(`A${currentRow + 1}`).font = { bold: true }
      worksheet.getCell(`A${currentRow + 1}`).alignment = { horizontal: "center" }
      worksheet.getCell(`A${currentRow + 1}`).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      }
      
      // Add labels for check-in and check-out rows
      worksheet.mergeCells(`A${currentRow + 2}:B${currentRow + 2}`)
      worksheet.getCell(`A${currentRow + 2}`).value = "Check In"
      worksheet.getCell(`A${currentRow + 2}`).font = { bold: true }
      worksheet.getCell(`A${currentRow + 2}`).alignment = { horizontal: "center" }
      worksheet.getCell(`A${currentRow + 2}`).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      }
      
      worksheet.mergeCells(`A${currentRow + 3}:B${currentRow + 3}`)
      worksheet.getCell(`A${currentRow + 3}`).value = "Check Out"
      worksheet.getCell(`A${currentRow + 3}`).font = { bold: true }
      worksheet.getCell(`A${currentRow + 3}`).alignment = { horizontal: "center" }
      worksheet.getCell(`A${currentRow + 3}`).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      }

      worksheet.mergeCells(`A${currentRow + 4}:B${currentRow + 4}`)
      worksheet.getCell(`A${currentRow + 4}`).value = "Working Hours"
      worksheet.getCell(`A${currentRow + 4}`).font = { bold: true }
      worksheet.getCell(`A${currentRow + 4}`).alignment = { horizontal: "center" }
      worksheet.getCell(`A${currentRow + 4}`).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      }
      
      currentRow += 6 // Space after attendance table (adjusted to account for working hours row)
  
      // Attendance summary with improved styling and alignment
      worksheet.mergeCells(`A${currentRow}:B${currentRow}`)
      const summaryHeaderCell = worksheet.getCell(`A${currentRow}`)
      summaryHeaderCell.value = "ATTENDANCE SUMMARY"
      summaryHeaderCell.alignment = { horizontal: "center" }
      summaryHeaderCell.font = { bold: true, size: 12 }
      summaryHeaderCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF2CC" }, // Light yellow background
      }
  
      // Add border to summary header
      ;["A", "B"].forEach((col) => {
        worksheet.getCell(`${col}${currentRow}`).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        }
      })
  
      currentRow++
  
      // Summary table header
      const headerRow = currentRow
      const headerCells = [
        { col: "A", value: "Particulars" },
        { col: "B", value: "No. of Days" },
      ]
  
      headerCells.forEach((cell) => {
        const headerCell = worksheet.getCell(`${cell.col}${headerRow}`)
        headerCell.value = cell.value
        headerCell.font = { bold: true }
        headerCell.alignment = { horizontal: "center" }
        headerCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "D9D9D9" }, // Gray background
        }
        headerCell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        }
      })
  
      currentRow++
  
      // Summary data with better styling
      const summary = employee.attendanceSummary
      const totalWorkingDays = summary.TotalWorkingDays || 0; // Total working days from backend
      const totalPresent = summary.Total || 0; // Total present days
      const totalLeave = totalWorkingDays - totalPresent; // Calculate leave days
      
      const summaryKeys = [
        { label: "Sunday", value: summary.Sunday || 0 },
        { label: "Holidays", value: summary.Holidays || 0 },
        { label: "Leave", value: totalLeave }, // Replace "Absent" with "Leave"
        { label: "Total Working Days", value: totalWorkingDays },
        { label: "Total Present", value: totalPresent }, // Move Total Present to the bottom
      ]
  
      summaryKeys.forEach((key, idx) => {
        const labelCell = worksheet.getCell(`A${currentRow}`)
        const valueCell = worksheet.getCell(`B${currentRow}`)
  
        labelCell.value = key.label
        valueCell.value = key.value
  
        // Style cells
        labelCell.alignment = { horizontal: "left" }
        valueCell.alignment = { horizontal: "center" }
  
        // Highlight total row
        if (key.label === "Total Present" || key.label === "Leave") {
          labelCell.font = { bold: true }
          valueCell.font = { bold: true }
          labelCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "D9D9D9" }, // Gray background
          }
          valueCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "D9D9D9" }, // Gray background
          }
        } else {
          // Alternate row colors for better readability
          const bgColor = idx % 2 === 0 ? "F2F2F2" : "FFFFFF"
          labelCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: bgColor },
          }
          valueCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: bgColor },
          }
        }
        // Add borders
        ;[labelCell, valueCell].forEach((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          }
        })
  
        currentRow++
      })
  
  
      if (index < data.length - 1) {
        currentRow += 1
  
        // Add a subtle separator line
        worksheet.mergeCells(`A${currentRow}:AG${currentRow}`)
        const separatorCell = worksheet.getCell(`A${currentRow}`)
        separatorCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F2F2F2" }, // Light gray background
        }
  
        // Add a thin border to create a subtle line
        for (let i = 1; i <= 33; i++) {
          const colLetter = getColumnLetter(i)
          worksheet.getCell(`${colLetter}${currentRow}`).border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
          }
        }
  
        currentRow += 1
      }
    })
  
    // Add footer
    worksheet.mergeCells(`A${currentRow}:AG${currentRow}`)
    const footerCell = worksheet.getCell(`A${currentRow}`)
    footerCell.value = "*** END OF REPORT ***"
    footerCell.alignment = { horizontal: "center" }
    footerCell.font = { bold: true, size: 12 }
    footerCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "E6F0FF" }, // Light blue background
    }
  
    // Add border to footer
    for (let i = 1; i <= 33; i++) {
      const colLetter = getColumnLetter(i)
      worksheet.getCell(`${colLetter}${currentRow}`).border = {
        top: { style: "medium" },
        left: { style: "thin" },
        bottom: { style: "medium" },
        right: { style: "thin" },
      }
    }
  
    // Export workbook
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = "AttendanceReport.xlsx"
      link.click()
    })
  }
  
  // Helper function to convert column index to letter (A, B, C, ..., Z, AA, AB, etc.)
  function getColumnLetter(columnIndex) {
    let columnLetter = ""
  
    while (columnIndex > 0) {
      const remainder = (columnIndex - 1) % 26
      columnLetter = String.fromCharCode(65 + remainder) + columnLetter
      columnIndex = Math.floor((columnIndex - 1) / 26)
    }
  
    return columnLetter
  }
  


  const generatePayrollReport = (data, selectedMonth, selectedYear) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Salary Report");
  
    worksheet.columns = [
      { width: 3 }, // A - Left margin
      { width: 22 }, // B - Component/Label
      { width: 15 }, // C - Value/Amount
      { width: 22 }, // D - Component/Label
      { width: 15 }, // E - Value/Amount
      { width: 3 }, // F - Right margin
    ];
  
    let currentRow = 1;
  
    // Convert month number to month name for display
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthName = monthNames[Number.parseInt(selectedMonth) - 1];
  
    // Helper function to process employee detail rows
    const processEmployeeDetailRow = (rowNum, field1, field2) => {
      worksheet.getCell(`B${rowNum}`).value = field1.label;
      worksheet.getCell(`C${rowNum}`).value = field1.value;
  
      if (field2) {
        worksheet.getCell(`D${rowNum}`).value = field2.label;
        worksheet.getCell(`E${rowNum}`).value = field2.value;
      }
  
      // Style the cells
      ["B", "D"].forEach((col) => {
        if (worksheet.getCell(`${col}${rowNum}`).value) {
          worksheet.getCell(`${col}${rowNum}`).font = { bold: true };
          worksheet.getCell(`${col}${rowNum}`).alignment = { horizontal: "left" };
          worksheet.getCell(`${col}${rowNum}`).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "F2F2F2" }, // Light gray background
          };
        }
      });
      ["C", "E"].forEach((col) => {
        if (worksheet.getCell(`${col}${rowNum}`).value) {
          worksheet.getCell(`${col}${rowNum}`).alignment = { horizontal: "left" };
        }
      });
  
      // Add borders
      for (let j = 2; j <= 5; j++) {
        const colLetter = getColumnLetter(j);
        worksheet.getCell(`${colLetter}${rowNum}`).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
    };
  
    // Add organization name with enhanced styling
    worksheet.mergeCells(`B${currentRow}:E${currentRow}`);
    const orgName = subscriptionDetails?.organisation?.orgName || "Organization Name";
    const orgCell = worksheet.getCell(`B${currentRow}`);
    orgCell.value = orgName;
    orgCell.alignment = { horizontal: "left", vertical: "middle" };
    orgCell.font = { bold: true, size: 16, color: { argb: "002060" } };
  
    // Add border to header
    for (let i = 2; i <= 5; i++) {
      const colLetter = getColumnLetter(i);
      worksheet.getCell(`${colLetter}${currentRow}`).border = {
        top: { style: "medium" },
        left: { style: "thin" },
        bottom: { style: "medium" },
        right: { style: "thin" },
      };
    }
  
    // Add more space at the top
    currentRow += 3; // Increased space after organization name
  
    // Add report title with month and year
    worksheet.mergeCells(`B${currentRow}:E${currentRow}`);
    const titleCell = worksheet.getCell(`B${currentRow}`);
    titleCell.value = `SALARY REPORT - ${monthName} ${selectedYear}`;
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    titleCell.font = { bold: true, size: 14 };
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "D9E1F2" }, // Light blue background
    };
  
    // Add border to title
    for (let i = 2; i <= 5; i++) {
      const colLetter = getColumnLetter(i);
      worksheet.getCell(`${colLetter}${currentRow}`).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }
  
    currentRow += 2; // Space after title
  
    // Process each employee
    data.forEach((employee, index) => {
      // Employee details header
      worksheet.mergeCells(`B${currentRow}:E${currentRow}`);
      const empHeaderCell = worksheet.getCell(`B${currentRow}`);
      empHeaderCell.value = `EMPLOYEE: ${employee.employeeName.toUpperCase()}`;
      empHeaderCell.alignment = { horizontal: "left" };
      empHeaderCell.font = { bold: true, size: 12 };
      empHeaderCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D9E1F2" }, // Light blue background
      };
  
      // Add border to employee header
      for (let i = 2; i <= 5; i++) {
        const colLetter = getColumnLetter(i);
        worksheet.getCell(`${colLetter}${currentRow}`).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
  
      currentRow++;
  
      // Employee details fields in a more compact format (2 columns)
      const detailsFields = [
        { label: "Email", value: employee.email },
        { label: "Gender", value: employee.gender },
        { label: "UAN", value: employee.uan || "Not Provided" },
      ];
  
      // Display employee details in two columns
      for (let i = 0; i < detailsFields.length; i += 2) {
        const field1 = detailsFields[i];
        const field2 = i + 1 < detailsFields.length ? detailsFields[i + 1] : null;
  
        processEmployeeDetailRow(currentRow, field1, field2);
        currentRow++;
      }
  
      // Check if salary details are available
      if (employee.salaryDetails === "Not Provided") {
        worksheet.mergeCells(`B${currentRow}:E${currentRow}`);
        const noDataCell = worksheet.getCell(`B${currentRow}`);
        noDataCell.value = "Salary details not provided for this employee.";
        noDataCell.alignment = { horizontal: "center" };
        noDataCell.font = { italic: true, color: { argb: "FF0000" } };
  
        // Add borders
        for (let i = 2; i <= 5; i++) {
          const colLetter = getColumnLetter(i);
          worksheet.getCell(`${colLetter}${currentRow}`).border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        }
  
        currentRow += 1; // Reduced space after no data message
      } else {
        // Filter salary records for the selected month and year
        const filteredSalaryDetails = employee.salaryDetails.filter((salary) => {
          return salary.month === Number.parseInt(selectedMonth) && salary.year === Number.parseInt(selectedYear);
        });
  
        if (filteredSalaryDetails.length === 0) {
          // No salary data for the selected month and year
          worksheet.mergeCells(`B${currentRow}:E${currentRow}`);
          const noDataCell = worksheet.getCell(`B${currentRow}`);
          noDataCell.value = `No salary data for ${monthName} ${selectedYear}.`;
          noDataCell.alignment = { horizontal: "center" };
          noDataCell.font = { italic: true, color: { argb: "FF0000" } };
  
          // Add borders
          for (let i = 2; i <= 5; i++) {
            const colLetter = getColumnLetter(i);
            worksheet.getCell(`${colLetter}${currentRow}`).border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          }
  
          currentRow += 1;
        } else {
          // Process each filtered salary record
          filteredSalaryDetails.forEach((salary, salaryIndex) => {
            // Salary header
            worksheet.mergeCells(`B${currentRow}:E${currentRow}`);
            const salaryHeaderCell = worksheet.getCell(`B${currentRow}`);
            salaryHeaderCell.value = `SALARY DETAILS - ${salary.formattedDate}`;
            salaryHeaderCell.alignment = { horizontal: "left" };
            salaryHeaderCell.font = { bold: true, size: 11 };
            salaryHeaderCell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "E2EFDA" }, // Light green background
            };
  
            // Add border to salary header
            for (let i = 2; i <= 5; i++) {
              const colLetter = getColumnLetter(i);
              worksheet.getCell(`${colLetter}${currentRow}`).border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
              };
            }
  
            currentRow++;
  
            // Income and Deduction headers side by side
            worksheet.getCell(`B${currentRow}`).value = "INCOME";
            worksheet.getCell(`C${currentRow}`).value = "AMOUNT";
            worksheet.getCell(`D${currentRow}`).value = "DEDUCTIONS";
            worksheet.getCell(`E${currentRow}`).value = "AMOUNT";
  
            // Style headers
            ["B", "C", "D", "E"].forEach((col) => {
              worksheet.getCell(`${col}${currentRow}`).font = { bold: true };
              worksheet.getCell(`${col}${currentRow}`).alignment = { horizontal: "center" };
              worksheet.getCell(`${col}${currentRow}`).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "D9D9D9" }, // Gray background
              };
              worksheet.getCell(`${col}${currentRow}`).border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
              };
            });
  
            currentRow++;
  
            // Determine the maximum number of rows needed for income or deductions
            const maxRows = Math.max(salary.income.length, salary.deductions.length);
  
            // Display income and deductions side by side
            for (let i = 0; i < maxRows; i++) {
              // Income component (if available)
              if (i < salary.income.length) {
                worksheet.getCell(`B${currentRow}`).value = salary.income[i].name;
                worksheet.getCell(`C${currentRow}`).value = salary.income[i].value;
                worksheet.getCell(`C${currentRow}`).numFmt = "#,##0.00";
              } else {
                worksheet.getCell(`B${currentRow}`).value = "";
                worksheet.getCell(`C${currentRow}`).value = "";
              }
  
              // Deduction component (if available)
              if (i < salary.deductions.length) {
                worksheet.getCell(`D${currentRow}`).value = salary.deductions[i].name;
                worksheet.getCell(`E${currentRow}`).value = salary.deductions[i].value;
                worksheet.getCell(`E${currentRow}`).numFmt = "#,##0.00";
              } else {
                worksheet.getCell(`D${currentRow}`).value = "";
                worksheet.getCell(`E${currentRow}`).value = "";
              }
  
              // Style cells
              worksheet.getCell(`B${currentRow}`).alignment = { horizontal: "left" };
              worksheet.getCell(`C${currentRow}`).alignment = { horizontal: "right" };
              worksheet.getCell(`D${currentRow}`).alignment = { horizontal: "left" };
              worksheet.getCell(`E${currentRow}`).alignment = { horizontal: "right" };
  
              // Add borders
              for (let j = 2; j <= 5; j++) {
                const colLetter = getColumnLetter(j);
                worksheet.getCell(`${colLetter}${currentRow}`).border = {
                  top: { style: "thin" },
                  left: { style: "thin" },
                  bottom: { style: "thin" },
                  right: { style: "thin" },
                };
              }
  
              currentRow++;
            }
  
            // Total row
            worksheet.getCell(`B${currentRow}`).value = "Total Gross Salary";
            worksheet.getCell(`C${currentRow}`).value = salary.totalGrossSalary;
            worksheet.getCell(`C${currentRow}`).numFmt = "#,##0.00";
            worksheet.getCell(`D${currentRow}`).value = "Total Deductions";
            worksheet.getCell(`E${currentRow}`).value = salary.totalDeduction;
            worksheet.getCell(`E${currentRow}`).numFmt = "#,##0.00";
  
            // Style total row
            ["B", "C", "D", "E"].forEach((col) => {
              worksheet.getCell(`${col}${currentRow}`).font = { bold: true };
              worksheet.getCell(`${col}${currentRow}`).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "D9D9D9" }, // Gray background
              };
              worksheet.getCell(`${col}${currentRow}`).border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
              };
            });
  
            worksheet.getCell(`B${currentRow}`).alignment = { horizontal: "left" };
            worksheet.getCell(`C${currentRow}`).alignment = { horizontal: "right" };
            worksheet.getCell(`D${currentRow}`).alignment = { horizontal: "left" };
            worksheet.getCell(`E${currentRow}`).alignment = { horizontal: "right" };
  
            currentRow++;
  
            // Net Salary row
            worksheet.mergeCells(`B${currentRow}:D${currentRow}`);
            worksheet.getCell(`B${currentRow}`).value = "NET SALARY";
            worksheet.getCell(`B${currentRow}`).alignment = { horizontal: "right" };
            worksheet.getCell(`B${currentRow}`).font = { bold: true };
            worksheet.getCell(`E${currentRow}`).value = salary.totalNetSalary;
            worksheet.getCell(`E${currentRow}`).numFmt = "#,##0.00";
            worksheet.getCell(`E${currentRow}`).alignment = { horizontal: "right" };
            worksheet.getCell(`E${currentRow}`).font = { bold: true };
  
            // Style net salary row
            ["B", "C", "D", "E"].forEach((col) => {
              worksheet.getCell(`${col}${currentRow}`).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "C6EFCE" }, // Light green background
              };
              worksheet.getCell(`${col}${currentRow}`).border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
              };
            });
  
            currentRow++;
          });
        }
      }
  
      // Add a separator between employees
      if (index < data.length - 1) {
        worksheet.mergeCells(`B${currentRow}:E${currentRow}`);
        const separatorCell = worksheet.getCell(`B${currentRow}`);
        separatorCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F2F2F2" }, // Light gray background
        };
  
        // Add a thin border to create a subtle line
        for (let i = 2; i <= 5; i++) {
          const colLetter = getColumnLetter(i);
          worksheet.getCell(`${colLetter}${currentRow}`).border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
          };
        }
  
        currentRow += 2; // Increased space between employees
      }
    });
  
    // Add footer
    worksheet.mergeCells(`B${currentRow}:E${currentRow}`);
    const footerCell = worksheet.getCell(`B${currentRow}`);
    footerCell.value = "*** END OF REPORT ***";
    footerCell.alignment = { horizontal: "center" };
    footerCell.font = { bold: true, size: 12 };
    footerCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "E6F0FF" }, // Light blue background
    };
  
    // Add border to footer
    for (let i = 2; i <= 5; i++) {
      const colLetter = getColumnLetter(i);
      worksheet.getCell(`${colLetter}${currentRow}`).border = {
        top: { style: "medium" },
        left: { style: "thin" },
        bottom: { style: "medium" },
        right: { style: "thin" },
      };
    }
  
    // Export workbook
    return workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `SalaryReport_${monthName}${selectedYear}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    });
  };
  

  const GeoFenceReport = (response) => {
    try {
      if (!response?.data?.data || response.data.data.length === 0) {
        console.error("Invalid data: Data is undefined, null, or empty.");
        return;
      }
  
      const data = response.data.data;
  
      // Define headers for the GeoFence report
      const headers = ["Employee Name", "Status", "Start Time", "End Time", "Total Distance"];
  
      // Format time using moment
      const formatTime = (isoDate) => {
        if (!isoDate) return "N/A";
        return moment(isoDate).format("DD-MM-YYYY HH:mm:ss");
      };
  
      // Map rows dynamically based on headers
      const rows = data.map((item) => [
        item.employee_name ?? "N/A",
        item.status ?? "N/A",
        formatTime(item.startTime),
        formatTime(item.endTime),
        item.totalDistance ?? "N/A",
      ]);
  
      // Create the worksheet with headers and rows
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  
      // Write the workbook and download it as a file
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "GeoFence Report");
      XLSX.writeFile(wb, "GeoFenceReport.xlsx");
  
      console.log("GeoFence Excel report generated successfully");
    } catch (error) {
      console.error("Error generating GeoFence Excel report:", error);
    }
  };
  

  const generatePerformanceReport = (data) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Performance Report");
    
    // Set consistent column widths
    worksheet.columns = [
      { width: 15 }, // Column A
      { width: 25 }, // Column B
      { width: 15 }, // Column C
      { width: 15 }, // Column D
      { width: 15 }, // Column E
    ];
    
    // Company header
    const companyRow = worksheet.addRow(["Noble Hospitals"]);
    companyRow.height = 24;
    companyRow.getCell(1).font = { bold: true, size: 14, color: { argb: '000080' } };
    worksheet.mergeCells('A1:E1');
    companyRow.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    
    // Add empty row
    worksheet.addRow([]);
    
    // Report title
    const titleRow = worksheet.addRow(["PERFORMANCE REPORT - January 2025"]);
    titleRow.height = 24;
    worksheet.mergeCells('A3:E3');
    titleRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'D9E1F2' } // Light blue background
    };
    titleRow.getCell(1).font = { bold: true, size: 12 };
    titleRow.getCell(1).alignment = { horizontal: 'center' };
    titleRow.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    
    // Add empty row
    worksheet.addRow([]);
    
    // Process each employee
    let rowIndex = 5;
    
    data.forEach((employee) => {
      const { employee_name, goals } = employee;
      const hasGoals = goals && goals.length > 0;
      
      // Employee header - use full width for consistency
      const employeeHeaderRow = worksheet.addRow([`EMPLOYEE: ${employee_name}`, "", "", "", ""]);
      employeeHeaderRow.height = 20;
      worksheet.mergeCells(`A${rowIndex}:E${rowIndex}`);
      employeeHeaderRow.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D9E1F2' }
      };
      employeeHeaderRow.getCell(1).font = { bold: true };
      employeeHeaderRow.getCell(1).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      rowIndex++;
      
      // Employee details - use full width table for consistency
      const empId = employee.empId || employee.employee_id || "EMP" + (Math.floor(Math.random() * 10000)).toString().padStart(4, '0');
      const email = employee.email || `${employee_name.toLowerCase().replace(/\s+/g, '.')}@noblehospitals.com`;
      const department = employee.department || "Not Specified";
      const position = employee.position || "Not Specified";
      
      // First row with ID and Email - use full width
      const detailsRow = worksheet.addRow([
        "ID:", empId, 
        "Email:", email,
        ""
      ]);
      
      // Style the cells
      detailsRow.getCell(1).font = { bold: true };
      detailsRow.getCell(3).font = { bold: true };
      
      // Add borders to all cells
      detailsRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
      
      rowIndex++;
      
      // Second row with Department and Position - use full width
      const deptPosRow = worksheet.addRow([
        "Dept:", department, 
        "Position:", position,
        ""
      ]);
      
      // Style the cells
      deptPosRow.getCell(1).font = { bold: true };
      deptPosRow.getCell(3).font = { bold: true };
      
      // Add borders to all cells
      deptPosRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
      
      rowIndex++;
      
      // Only add goals section if employee has goals
      if (hasGoals) {
        // Goals table header - use full width
        const goalsHeaderRow = worksheet.addRow(["GOALS DETAILS", "", "", "", ""]);
        goalsHeaderRow.height = 20;
        worksheet.mergeCells(`A${rowIndex}:E${rowIndex}`);
        goalsHeaderRow.getCell(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'C6EFCE' } // Light green background
        };
        goalsHeaderRow.getCell(1).font = { bold: true };
        goalsHeaderRow.getCell(1).alignment = { horizontal: 'center' };
        goalsHeaderRow.getCell(1).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };


        rowIndex++;
        
        // Goals table column headers - use full width
        const goalsColumnRow = worksheet.addRow([
          "GOAL NAME", 
          "GOAL DESCRIPTION", 
          "START DATE", 
          "END DATE", 
          "STATUS"
        ]);
        goalsColumnRow.eachCell((cell) => {
          cell.font = { bold: true };
          cell.alignment = { horizontal: 'center' };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'E6E6E6' } // Light gray background
          };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
        rowIndex++;
        
        // Add goals data - use full width
        goals.forEach(goal => {
          // Adjust row height based on content length
          const descriptionLength = goal.goalDescription.replace(/<[^>]*>/g, "").length;
          const rowHeight = Math.max(15, Math.min(90, Math.ceil(descriptionLength / 20) * 15));
          
          const goalRow = worksheet.addRow([
            goal.goalName,
            goal.goalDescription.replace(/<[^>]*>/g, ""), // Remove HTML tags
            goal.startDate,
            goal.endDate,
            goal.status
          ]);
          
          goalRow.height = rowHeight;
          
          goalRow.eachCell((cell) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
            
            // Word wrap for description
            if (cell.col === 2) {
              cell.alignment = { wrapText: true };
            }
          });
          
          // Add color to status cell based on status
          const statusCell = goalRow.getCell(5);
          if (goal.status === 'Goal Approved') {
            statusCell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'C6EFCE' } // Light green
            };
          } else if (goal.status === 'Goal Submitted') {
            statusCell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFEB9C' } // Light yellow
            };
          }
          
          rowIndex++;
        });
        
        // Employee Summary at the end with green background - only for employees with goals
        const totalGoals = goals.length;
        const submittedGoals = goals.filter(g => g.status === 'Goal Submitted').length;
        const approvedGoals = goals.filter(g => g.status === 'Goal Approved').length;
        
        // Add a small space before summary
        // worksheet.addRow([]);
        // rowIndex++;
        
        const summaryHeaderRow = worksheet.addRow(["EMPLOYEE SUMMARY", "", "", "", ""]);
        summaryHeaderRow.height = 20;
        worksheet.mergeCells(`A${rowIndex}:E${rowIndex}`);
        summaryHeaderRow.getCell(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'C6EFCE' } // Light green background
        };
        summaryHeaderRow.getCell(1).font = { bold: true };
        summaryHeaderRow.getCell(1).alignment = { horizontal: 'center' };
        summaryHeaderRow.getCell(1).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        rowIndex++;
        
        const summaryRow = worksheet.addRow([
          "Total Goals", 
          totalGoals, 
          "Submitted", 
          submittedGoals, 
          approvedGoals > 0 ? `Approved: ${approvedGoals}` : ""
        ]);
        summaryRow.getCell(1).font = { bold: true };
        summaryRow.getCell(3).font = { bold: true };
        summaryRow.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
        rowIndex++;
      } else {
        // If no goals, add a "No goals" message that spans the full width
        const noGoalsRow = worksheet.addRow(["No goals available for this employee", "", "", "", ""]);
        worksheet.mergeCells(`A${rowIndex}:E${rowIndex}`); // Merge all columns for consistency
        noGoalsRow.getCell(1).alignment = { horizontal: 'center' };
        noGoalsRow.getCell(1).font = { italic: true };
        noGoalsRow.getCell(1).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        rowIndex++;
        
        // No summary for employees without goals
      }
      
      // Add separator line for better separation between employees
      const separatorRow = worksheet.addRow(["_".repeat(100), "", "", "", ""]);
      worksheet.mergeCells(`A${rowIndex}:E${rowIndex}`);
      separatorRow.getCell(1).alignment = { horizontal: 'center' };
      separatorRow.getCell(1).font = { color: { argb: 'CCCCCC' } };
      rowIndex++;
      
      // Add empty row before next employee
      worksheet.addRow([]);
      rowIndex++;
    });
    
    // Export workbook
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "PerformanceReport.xlsx";
      link.click();
    });
  };
  

  const onSubmit = (data) => {
    if (data.department.value === "attendence" || data.department.value === "payroll") {
      if (!data.startMonth || !data.startYear) {
        handleAlert(true, "error", "Please select both month and year.");
        return;
      }
  
      const finalDataToSend = {
        department: data.department.value,
        subOption: data.subOption?.value,
        startMonth: data.startMonth.value,
        startYear: data.startYear.value,
        organisationId: orgId,
      };
  
      setLoading(true); // Show loader before fetching data
      axios
        .get(
          `${process.env.REACT_APP_API}/route/MisReport/get/selectedrecord/${orgId}`,
          {
            headers: { Authorization: `${authToken}` },
            params: finalDataToSend,
          }
        )
        .then((response) => {
          if (data.department.value === "attendence") {
            generateAttendanceReport(response.data.data, watch("startMonth").value, watch("startYear").value);
          } else if (data.department.value === "payroll") {
            generatePayrollReport(response.data.data , watch("startMonth").value  ,  watch("startYear").value);
          }
        })
        .catch((error) => {
          console.error(`Error fetching ${data.department.value} data:`, error);
          handleAlert(true, "error", `Failed to generate ${data.department.value} report`);
        })
        .finally(() => {
          setLoading(false); // Hide loader after fetching is complete
        });
      return;
    }

    if (data.department.value === "performance") {
      setLoading(true); // Show loader before fetching data
      console.log("Selected department:", orgId);
      axios
        .get(
          `${process.env.REACT_APP_API}/route/MisReport/get/selectedrecord/${orgId}`,
          {
            headers: { Authorization: `${authToken}` },
            params: {  organisationId: orgId,   department: data.department.value },
            query: {
             
          }
        }
        )
        .then((response) => {
          generatePerformanceReport(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching performance data:", error);
          handleAlert(true, "error", "Failed to generate performance report");
        })
        .finally(() => {
          setLoading(false); // Hide loader after fetching is complete
        });
      return;
    }
  
    const checkboxesWithTrueFalse = availableCheckboxes.reduce(
      (acc, option) => {
        const backendKey = checkboxMapping[subOptionValue]?.[option];
        if (backendKey && data.checkboxes.includes(option)) {
          acc[backendKey] = true;
        }
        return acc;
      },
      {}
    );
  
    const finalDataToSend = {
      department: data.department.value,
      subOption: data.subOption?.value,
      checkboxes: checkboxesWithTrueFalse,
      organisationId: orgId,
    };
  
    mutation.mutate(finalDataToSend);
  };
  

  const mutation = useMutation(
    (finalData) => {
      setLoading(true); // Show loader during mutation
      return axios.get(
        `${process.env.REACT_APP_API}/route/MisReport/get/selectedrecord/${orgId}`,
        {
          headers: {
            Authorization: `${authToken}`,
          },
          params: finalData,
        }
      );
    },
    {
      onSuccess: (data) => {
        if (
          getValues("department")?.value === "record" &&
          getValues("subOption")?.value === "document"
        ) {
          Documentuploadedemp(data);
        }
        if (
          getValues("department")?.value === "record" &&
          getValues("subOption")?.value === "policies"
        ) {
          Policiesreport(data);
        }
        if (
          getValues("department")?.value === "record" &&
          getValues("subOption")?.value === "letters"
        ) {
          Lettersreport(data);
        }
        if (
          getValues("department")?.value === "foodandcatering" &&
          getValues("subOption")?.value === "vendorreports"
        ) {
          Vendersreport(data);
        }

        if (
          getValues("department")?.value === "foodandcatering" &&
          getValues("subOption")?.value === "orderreports"
        ) {
          Orderreports(data);
        }

        if (
          getValues("department")?.value === "foodandcatering" &&
          getValues("subOption")?.value === "menureports"
        ) {
          Menureports(data);
        }

        if (
          getValues("department")?.value === "foodandcatering" &&
          getValues("subOption")?.value === "employeeorderreports"
        ) {
          employeeorderreports(data);
        }

        
        if (
          getValues("department")?.value === "remotepunch" &&
          getValues("subOption")?.value === "setRemotePunches"
        ) {
          RemotePunchports(data);
        }

        if (
          getValues("department")?.value === "advancesalary" &&
          getValues("subOption")?.value === "advancesalaryreport"
        ) {
          AdvanceSalary(data);
        }


        
        if (
          getValues("department")?.value === "loanmanagement" &&
          getValues("subOption")?.value === "loantypereport"
        ) {
          Loantypereport(data);
        }

        if (
          getValues("department")?.value === "loanmanagement" &&
          getValues("subOption")?.value === "loanemployeereport"
        ) {
          LoanemployeeReport(data);
        }

        if (
          getValues("department")?.value === "geoFence"
        ) {
          GeoFenceReport(data);
        }

        handleAlert(true, "success", " Report Generated Successfully");
      },
      onError: (error) => {
        console.error("Error:", error);
        handleAlert(true, "error", "Failed to generate report");
      },
      onSettled: () => {
        setLoading(false); // Hide loader when mutation is complete
      },
    }
  );

  const Documentuploadedemp = (response) => {
    if (!response?.data?.data || response.data.data.length === 0) {
      console.error("Invalid data: Data is undefined, null, or empty.");
      return;
    }

    const data = response.data.data;
    console.log("Generate data", data);

    const headers = Object.keys(data[0]).filter((key) => key !== "_id");

    const rows = data.map((item) =>
      headers.map((header) => {
        const value = item[header];
        if (Array.isArray(value)) {
          return value.join(", ");
        }
        return value;
      })
    );

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "DocumentReport.xlsx");
    console.log("Excel report generated successfully");
  };

  const Policiesreport = (response) => {
    if (!response?.data?.data || response.data.data.length === 0) {
      console.error("Invalid data: Data is undefined, null, or empty.");
      return;
    }

    const data = response.data.data;

    // Headers excluding the raw "url" and adding a "PDF Link" column
    const headers = Object.keys(data[0])
      .filter((key) => key !== "_id" && key !== "url") // Exclude raw "url"
      .concat("PDF Link"); // Add a custom column for hyperlinks

    // Map rows with hyperlinks and formatted fields
    const rows = data.map((item) => {
      return headers.map((header) => {
        if (header === "PDF Link") {
          // Hyperlink object for Excel
          return { t: "s", v: "View PDF", l: { Target: item.url } }; // `l.Target` is the actual link
        } else if (header === "isActive") {
          // Format boolean to Active/Inactive
          return item[header] ? "Active" : "Inactive";
        } else if (header === "applicableDate" || header === "updatedAt") {
          // Format date to DD-MM-YYYY
          return item[header]
            ? new Date(item[header]).toLocaleDateString("en-GB")
            : "";
        } else {
          // Return other fields as they are
          return item[header] ?? "";
        }
      });
    });

    // Create the worksheet with headers and rows
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // Write the workbook and download as a file
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Policies Report");
    XLSX.writeFile(wb, "PoliciesReport.xlsx");

    console.log("Excel report with hyperlinks generated successfully");
  };

  const Lettersreport = (response) => {
    if (!response?.data?.data || response.data.data.length === 0) {
      console.error("Invalid data: Data is undefined, null, or empty.");
      return;
    }

    const data = response.data.data;

    // Custom headers mapping
    const customHeaders = {
      title: "Title",
      letterType: "Type of a Letter",
      applicableDate: "Applicable Date",
      docstatus: "Letter Status",
      isActive: "Is Active",
      "Employee Name": "Employee Name",
      "HR Name": "HR Name",
      "Manager Name": "Manager Name",
      url: "PDF Link", // Custom column for hyperlinks
    };

    // Dynamically filter headers based on available fields in the data
    const availableHeaders = Object.keys(customHeaders).filter((key) =>
      data.some((item) => item[key] !== undefined && item[key] !== null)
    );

    // Create the headers row using the customHeaders map
    const headers = availableHeaders.map((key) => customHeaders[key]);

    // Map rows with hyperlinks and formatted fields
    const rows = data.map((item) => {
      return availableHeaders.map((key) => {
        if (key === "url") {
          // Hyperlink object for Excel
          return item[key]
            ? { t: "s", v: "View PDF", l: { Target: item[key] } }
            : "";
        } else if (key === "isActive") {
          // Format boolean to Active/Inactive
          return item[key] ? "Active" : "Inactive";
        } else if (key === "applicableDate") {
          // Keep the date as it is (already formatted)
          return item[key] ? item[key] : "";
        } else {
          // Return other fields as they are
          return item[key] ?? "";
        }
      });
    });

    // Create the worksheet with headers and rows
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // Write the workbook and download as a file
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Letters Report");
    XLSX.writeFile(wb, "LettersReport.xlsx");

    console.log("Excel report generated with conditional headers successfully");
  };

  const Vendersreport = (response) => {
    if (!response?.data?.data || response.data.data.length === 0) {
      console.error("Invalid data: Data is undefined, null, or empty.");
      return;
    }
  
    const data = response.data.data;
  
    // Headers excluding "url" and "PDF Link" column
    const headers = Object.keys(data[0]).filter((key) => key !== "_id" && key !== "url");
  
    // Map rows without hyperlinks or any PDF-related fields
    const rows = data.map((item) => {
      return headers.map((header) => {
        if (header === "isActive") {
          // Format boolean to Active/Inactive
          return item[header] ? "Active" : "Inactive";
        } else if (header === "applicableDate" || header === "updatedAt") {
          // Format date to DD-MM-YYYY
          return item[header]
            ? new Date(item[header]).toLocaleDateString("en-GB")
            : "";
        } else if (header === "Menu Update Frequency") {
          // Return the "Menu Update Frequency" as it is
          return item[header] ?? "";
        } else {
          // Return other fields as they are
          return item[header] ?? "";
        }
      });
    });
  
    // Create the worksheet with headers and rows
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  
    // Write the workbook and download as a file
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vendors Report");
    XLSX.writeFile(wb, "VendorsReport.xlsx");
  
    console.log("Excel report generated successfully");
  };
    
  


  const Orderreports = (response) => {
    try {
      if (!response?.data?.data || response.data.data.length === 0) {
        console.error("Invalid data: Data is undefined, null, or empty.");
        return;
      }
  
      const data = response.data.data;
  
      // Generate dynamic headers based on the first object keys in data
      const headers = Object.keys(data[0]).map((key) => {
        // Customize header names dynamically
        switch (key) {
          case "company_name":
            return "Company Name";
          case "vendor_name":
            return "Vendor Name";
          case "total_orders_placed":
            return "Total Orders Placed";
          case "total_revenue_generated":
            return "Total Revenue Generated";
          case "top_3_ordered_menu_items":
            return "Top 3 Ordered Menu Items";
          default:
            return key; // Keep key as is if no customization is needed
        }
      });
  
      // Map rows dynamically based on headers
      const rows = data.map((item) => {
        return headers.map((header) => {
          const originalKey = Object.keys(data[0]).find((key) => {
            // Match dynamic header name to original object key
            switch (key) {
              case "company_name":
                return header === "Company Name";
              case "vendor_name":
                return header === "Vendor Name";
              case "total_orders_placed":
                return header === "Total Orders Placed";
              case "total_revenue_generated":
                return header === "Total Revenue Generated";
              case "top_3_ordered_menu_items":
                return header === "Top 3 Ordered Menu Items";
              default:
                return header === key;
            }
          });
  
          // Handle specific cases
          if (originalKey === "top_3_ordered_menu_items") {
            return item[originalKey]
              ? item[originalKey].map((menuItem) => `${menuItem.name}`).join(", ")
              : "N/A";
          } else {
            return item[originalKey] ?? "N/A"; 
          }
        });
      });
  
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Order Reports");
      XLSX.writeFile(wb, "OrderReports.xlsx");
  
      console.log("Excel report generated successfully");
    } catch (error) {
      console.error("Error generating Excel report:", error);
    }
  };


  
  const Menureports = (response) => {
  try {
    if (!response?.data?.data || response.data.data.length === 0) {
      console.error("Invalid data: Data is undefined, null, or empty.");
      return;
    }

    const data = response.data.data;

    const headers = new Set();
    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (key === "menu_items" && item.menu_items?.length > 0) {
          headers.add("Menu Item Name");
          headers.add("Preparation Time");
          headers.add("Price");
          headers.add("Is Veg");
          headers.add("Cuisine Type");
          headers.add("Available");
          headers.add("Category");
        } else if (item[key] !== undefined && item[key] !== null) {
          switch (key) {
            case "company_name":
              headers.add("Company Name");
              break;
            case "vendor_name":
              headers.add("Vendor Name");
              break;
            default:
              headers.add(key); 
              break;
          }
        }
      });
    });

    const headersArray = Array.from(headers);

    // Map rows dynamically based on headers
    const rows = data.flatMap((item) => {
      const baseData = headersArray.map((header) => {
        switch (header) {
          case "Company Name":
            return item.company_name ?? "N/A";
          case "Vendor Name":
            return item.vendor_name ?? "N/A";
          default:
            if (header.startsWith("Menu")) {
              // Menu-specific handling
              return "N/A";
            }
            return item[header] ?? "N/A"; // Generic handling for other fields
        }
      });

      // Process menu_items
      if (item.menu_items && item.menu_items.length > 0) {
        return item.menu_items.map((menuItem) => {
          return headersArray.map((header) => {
            switch (header) {
              case "Menu Item Name":
                return menuItem.name ?? "N/A";
              case "Preparation Time":
                return menuItem.preparationTime ?? "N/A";
              case "Price":
                return menuItem.price ?? "N/A";
              case "Is Veg":
                return menuItem.isVeg ?? "N/A";
              case "Cuisine Type":
                return menuItem.cuisineType ?? "N/A";
              case "Available":
                return menuItem.available ?? "N/A";
              case "Category":
                return menuItem.category ?? "N/A";
              default:
                return baseData[headersArray.indexOf(header)];
            }
          });
        });
      }

      // If no menu_items, return just the base data
      return [baseData];
    });

    // Create the worksheet with headers and rows
    const ws = XLSX.utils.aoa_to_sheet([headersArray, ...rows]);

    // Write the workbook and download as a file
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Menu Reports");
    XLSX.writeFile(wb, "MenuReports.xlsx");

    console.log("Excel report generated successfully");
  } catch (error) {
    console.error("Error generating Excel report:", error);
  }
}; 

const employeeorderreports = (response) => {
  try {
    if (!response?.data?.data || response.data.data.length === 0) {
      console.error("Invalid data: Data is undefined, null, or empty.");
      return;
    }

    const data = response.data.data;

    // Generate dynamic headers based on the selected fields
    const headers = Object.keys(data[0]).map((key) => {
      switch (key) {
        case "employee_name":
          return "Employee Name";
        case "menu":
          return "Menu Item";
        case "price":
          return "Price";
        case "quantity":
          return "Quantity";
        case "discount":
          return "Discount";
        case "grandTotal":
          return "Grand Total";
        case "status":
          return "Status";
        case "placedAt":
          return "Order Placed At";
        case "updatedAt":
          return "Order Updated At";
        case "rating":
          return "Rating";
        case "review":
          return "Review";
        default:
          return key;
      }
    });

    // Function to format ISO date strings
    const formatDate = (isoDate) => {
      if (!isoDate) return "N/A";
      const date = new Date(isoDate);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    };

    // Map rows dynamically based on headers
    const rows = data.map((item) => {
      return headers.map((header) => {
        const originalKey = Object.keys(data[0]).find((key) => {
          switch (key) {
            case "employee_name":
              return header === "Employee Name";
            case "menu":
              return header === "Menu Item";
            case "price":
              return header === "Price";
            case "quantity":
              return header === "Quantity";
            case "discount":
              return header === "Discount";
            case "grandTotal":
              return header === "Grand Total";
            case "status":
              return header === "Status";
            case "placedAt":
              return header === "Order Placed At";
            case "updatedAt":
              return header === "Order Updated At";
            case "rating":
              return header === "Rating";
            case "review":
              return header === "Review";
            default:
              return header === key;
          }
        });

        // Format date fields
        if (originalKey === "placedAt" || originalKey === "updatedAt") {
          return formatDate(item[originalKey]);
        }

        return item[originalKey] ?? "N/A";
      });
    });

    // Create the worksheet with headers and rows
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // Write the workbook and download it as a file
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employee Order Reports");
    XLSX.writeFile(wb, "EmployeeOrderReports.xlsx");

    console.log("Excel report generated successfully");
  } catch (error) {
    console.error("Error generating Excel report:", error);
  }
};


const RemotePunchports = (response) => {
  try {
    // Validate the response and ensure data exists
    if (!response?.data?.data || response.data.data.length === 0) {
      console.error("Invalid data: Data is undefined, null, or empty.");
      return;
    }

    const data = response.data.data;

    if (data.length === 0) {
      console.error("The data array is empty. No data to generate the report.");
      return;
    }

    // Define dynamic headers
    const headers = Object.keys(data[0]).map((key) => {
      switch (key) {
        case "employee_name":
          return "Employee Name";
        case "punch_in_time":
          return "Punch In Time";
        case "punch_out_time":
          return "Punch Out Time";
        case "distance_travelled":
          return "Distance Travelled";
        case "status":
          return "Status";
        default:
          return key; // Use original key as header if no mapping exists
      }
    });

    // Function to format ISO date strings
    const formatDate = (isoDate) => {
      if (!isoDate || isoDate === "N/A") return "N/A";
      const date = new Date(isoDate);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    };

    // Map rows dynamically based on headers
    const rows = data.map((item) => {
      return headers.map((header) => {
        const originalKey = Object.keys(data[0]).find((key) => {
          switch (key) {
            case "employee_name":
              return header === "Employee Name";
            case "punch_in_time":
              return header === "Punch In Time";
            case "punch_out_time":
              return header === "Punch Out Time";
            case "distance_travelled":
              return header === "Distance Travelled";
            case "status":
              return header === "Status";
            default:
              return header === key;
          }
        });

        // Format date fields
        if (originalKey === "punch_in_time" || originalKey === "punch_out_time") {
          return formatDate(item[originalKey]);
        }

        return item[originalKey] ?? "N/A";
      });
    });

    // Create the worksheet with headers and rows
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // Write the workbook and download it as a file
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Remote Punch Reports");
    XLSX.writeFile(wb, "RemotePunchReports.xlsx");

    console.log("Excel report generated successfully");
  } catch (error) {
    console.error("Error generating Excel report:", error);
  }
};


const AdvanceSalary = (response) => {
  try {
    // Validate the response and ensure data exists
    // Validate the response and ensure data exists
    if (!response?.data?.data || response.data.data.length === 0) {
      console.error("Invalid data: Data is undefined, null, or empty.");
      return;
    }

    const data = response.data.data;

    if (data.length === 0) {
      console.error("The data array is empty. No data to generate the report.");
      return;
    }

    // Define dynamic headers for the advance salary data
    const headers = Object.keys(data[0]).map((key) => {
      switch (key) {
        case "employee_name":
          return "Employee Name";
        case "email":
          return "Email";
        case "totalSalary":
          return "Total Salary";
        case "advancedSalaryAmounts":
          return "Advanced Salary Amount";
        case "noOfMonth":
          return "No of Months";
        case "advanceSalaryStartingDate":
          return "Advance Salary Starting Date";
        case "advanceSalaryEndingDate":
          return "Advance Salary Ending Date";
        case "status":
          return "Status";
        default:
          return key; // Use original key as header if no mapping exists
      }
    });

    // Function to format ISO date strings
    const formatDate = (isoDate) => {
      if (!isoDate || isoDate === "N/A") return "N/A";
      const date = new Date(isoDate);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    // Map rows dynamically based on headers
    const rows = data.map((item) => {
      return headers.map((header) => {
        const originalKey = Object.keys(data[0]).find((key) => {
          switch (key) {
            case "employee_name":
              return header === "Employee Name";
            case "email":
              return header === "Email";
            case "totalSalary":
              return header === "Total Salary";
            case "advancedSalaryAmounts":
              return header === "Advanced Salary Amount";
            case "noOfMonth":
              return header === "No of Months";
            case "advanceSalaryStartingDate":
              return header === "Advance Salary Starting Date";
            case "advanceSalaryEndingDate":
              return header === "Advance Salary Ending Date";
            case "status":
              return header === "Status";
            default:
              return header === key;
          }
        });

        // Format date fields
        if (originalKey === "advanceSalaryStartingDate" || originalKey === "advanceSalaryEndingDate") {
          return formatDate(item[originalKey]);
        }

        return item[originalKey] ?? "N/A";
      });
    });

    // Create the worksheet with headers and rows
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // Write the workbook and download it as a file
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Advance Salary Report");
    XLSX.writeFile(wb, "AdvanceSalaryReport.xlsx");

    console.log("Excel report generated successfully");
  } catch (error) {
    console.error("Error generating Excel report:", error);
  }
};


const Loantypereport = (response) => {
  try {
    // Validate the response and ensure data exists
    if (!response?.data?.data || response.data.data.length === 0) {
      console.error("Invalid data: Data is undefined, null, or empty.");
      return;
    }

    const data = response.data.data;

    if (data.length === 0) {
      console.error("The data array is empty. No data to generate the report.");
      return;
    }

    // Define dynamic headers for the loan data
    const headers = Object.keys(data[0]).map((key) => {
      switch (key) {
        case "loanName":
          return "Loan Name";
        case "loanValue":
          return "Minimum Loan Value"; // Change 'loanValue' to 'Minimum Loan Value'
        case "maxLoanValue":
          return "Max Loan Value";
        case "rateOfInterest":
          return "Rate of Interest";
        default:
          return key; // Use original key as header if no mapping exists
      }
    });

    // Map rows dynamically based on headers
    const rows = data.map((item) => {
      return headers.map((header) => {
        const originalKey = Object.keys(data[0]).find((key) => {
          switch (key) {
            case "loanName":
              return header === "Loan Name";
            case "loanValue":
              return header === "Minimum Loan Value"; // Map the field correctly
            case "maxLoanValue":
              return header === "Max Loan Value";
            case "rateOfInterest":
              return header === "Rate of Interest";
            default:
              return header === key;
          }
        });

        return item[originalKey] ?? "N/A";
      });
    });

    // Create the worksheet with headers and rows
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // Apply styles to the header row

    // Column widths for better readability
    if (!ws["!cols"]) ws["!cols"] = [];
    headers.forEach((_, index) => {
      ws["!cols"].push({ wpx: 180 }); // Adjust column width
    });

    // Apply styles to the header row
    for (let col = 0; col < headers.length; col++) {
      const cellAddress = { r: 0, c: col };
      ws[XLSX.utils.encode_cell(cellAddress)] = {
        ...ws[XLSX.utils.encode_cell(cellAddress)],
        s: {
          font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12, name: "Arial" }, // Bold, white text
          alignment: { horizontal: "center", vertical: "center" },
          fill: { fgColor: { rgb: "4F81BD" } }, // Light Blue background
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        },
      };
    }

    // Apply borders to the entire sheet (rows and columns)
    const borderStyle = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

    // Apply borders to rows
    for (let row = 0; row < rows.length + 1; row++) {
      for (let col = 0; col < headers.length; col++) {
        const cellAddress = { r: row, c: col };
        if (ws[XLSX.utils.encode_cell(cellAddress)]) {
          ws[XLSX.utils.encode_cell(cellAddress)].s = { ...ws[XLSX.utils.encode_cell(cellAddress)].s, border: borderStyle };
        }
      }
    }

    // Create the workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Loan Type Report");

    // Write the file with a name
    XLSX.writeFile(wb, "LoanTypeReport.xlsx");

    console.log("Excel report generated successfully");
  } catch (error) {
    console.error("Error generating Excel report:", error);
  }
};




const LoanemployeeReport = (response) => {
  try {
    // Validate the response and ensure data exists
    if (!response?.data.data || response.data.data.length === 0) {
      console.error("Invalid data: Data is undefined, null, or empty.");
      return;
    }

    const data = response.data.data;

    // If data is empty, exit early
    if (data.length === 0) {
      console.error("The data array is empty. No data to generate the report.");
      return;
    }

    // Define dynamic headers for the loan employee data
    const headers = [
      "Employee Name",
      "Employee Email",
      "Loan Type",
      "Loan Amount",
      "Rate of Interest",
      "Loan Disbursement Date",
      "Loan Completed Date",
      "No of EMI",
      "Total Deduction",
      "Total Deduction Monthly",
      "Status"
    ];

    // Map rows dynamically based on the headers
    const rows = data.map((item) => [
      item.employee_name ?? "N/A",
      item.employee_email ?? "N/A",
      item.loan_type ?? "N/A",
      item.loan_amount ?? "N/A",
      item.rate_of_interest ?? "N/A",
      item.loan_disbursement_date ?? "N/A",
      item.loan_completed_date ?? "N/A",
      item.no_of_emi ?? "N/A",
      item.total_deduction ?? "N/A",
      item.total_deduction_monthly ?? "N/A",
      item.status ?? "N/A"
    ]);

    // Create the worksheet with headers and rows
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // Apply styles to the header row
    if (!ws["!cols"]) ws["!cols"] = [];
    headers.forEach(() => {
      ws["!cols"].push({ wpx: 180 }); // Adjust column width
    });

    // Apply styles to the header row
    for (let col = 0; col < headers.length; col++) {
      const cellAddress = { r: 0, c: col };
      ws[XLSX.utils.encode_cell(cellAddress)] = {
        ...ws[XLSX.utils.encode_cell(cellAddress)],
        s: {
          font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12, name: "Arial" },
          alignment: { horizontal: "center", vertical: "center" },
          fill: { fgColor: { rgb: "4F81BD" } }, // Light Blue background
          border: {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          },
        },
      };
    }

    // Apply borders to the entire sheet (rows and columns)
    const borderStyle = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };

    // Apply borders to rows
    for (let row = 0; row < rows.length + 1; row++) {
      for (let col = 0; col < headers.length; col++) {
        const cellAddress = { r: row, c: col };
        if (ws[XLSX.utils.encode_cell(cellAddress)]) {
          ws[XLSX.utils.encode_cell(cellAddress)].s = { ...ws[XLSX.utils.encode_cell(cellAddress)].s, border: borderStyle };
        }
      }
    }

    // Create the workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Loan Employee Report");

    // Write the file with a name
    XLSX.writeFile(wb, "LoanEmployeeReport.xlsx");

    console.log("Excel report generated successfully");
  } catch (error) {
    console.error("Error generating Excel report:", error);
  }
};


  return (
    <BoxComponent sx={{ p: 0 }}>
      <div className="h-[90vh] overflow-y-auto scroll px-3">
        <HeadingOneLineInfo
          heading="Mis Record"
          info="Choose the fields you want to include in your report"
        />
        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          className="flex w-full flex-col gap-1"
        >
          <div className="grid grid-cols-2 gap-4">
            <AuthInputFiled
              name="department"
              control={control}
              type="select"
              placeholder="Select Department"
              label="Select Your Module *"
              options={departments}
              errors={errors}
            />
            {departmentValue &&
              departmentValue !== "attendence" &&
              departmentValue !== "payroll" &&
              departmentValue !== "geoFence" &&  
              departmentValue !== "performance"  
              
              &&( // Hide for GeoFencing
                <AuthInputFiled
                  name="subOption"
                  control={control}
                  type="select"
                  placeholder="Select Report Type"
                  label="Select Report Type *"
                  options={subOptionsList}
                  errors={errors}
                />
              )}
          </div>
          {departmentValue === "attendence" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Month *
                </label>
                <Select
                  options={months}
                  onChange={(selected) => setValue("startMonth", selected)}
                  placeholder="Select Month"
                />
                {errors.startMonth && (
                  <p className="text-red-500 text-sm">{errors.startMonth.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Year *
                </label>
                <Select
                  options={years}
                  onChange={(selected) => setValue("startYear", selected)}
                  placeholder="Select Year"
                />
                {errors.startYear && (
                  <p className="text-red-500 text-sm">{errors.startYear.message}</p>
                )}
              </div>
            </div>
          )}
          {departmentValue === "payroll" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Month *
                </label>
                <Select
                  options={months}
                  onChange={(selected) => setValue("startMonth", selected)}
                  placeholder="Select Month"
                />
                {errors.startMonth && (
                  <p className="text-red-500 text-sm">{errors.startMonth.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Year *
                </label>
                <Select
                  options={years}
                  onChange={(selected) => setValue("startYear", selected)}
                  placeholder="Select Year"
                />
                {errors.startYear && (
                  <p className="text-red-500 text-sm">{errors.startYear.message}</p>
                )}
              </div>
            </div>
          )}
          {subOptionValue && availableCheckboxes.length > 0 && (
            <div className="flex flex-col gap-4 mb-4">
              <div className="font-semibold text-gray-500 text-md ">
                Select fields to include in your report
              </div>
              <div className="flex gap-4 pl-2">
                <div className="w-1/4">
                  <div className="flex items-center mb-2">
                    <input
                      className="transform scale-125"
                      type="checkbox"
                      checked={selectAllChecked}
                      onChange={handleSelectAllChange}
                      id="selectAll"
                    />
                    <label
                      htmlFor="selectAll"
                      className="flex items-center text-xl  ml-2"
                    >
                      Select All
                    </label>
                  </div>
                  {availableCheckboxes.slice(0, 5).map((option, index) => (
                    <div key={index} className="flex items-center text-xl mb-2">
                      <input
                        className="transform scale-125"
                        type="checkbox"
                        value={option}
                        {...control.register("checkboxes")}
                        id={option}
                      />
                      <label htmlFor={option} className="ml-2">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="w-1/4">
                  {availableCheckboxes.slice(5, 10).map((option, index) => (
                    <div key={index} className="flex items-center text-xl mb-2">
                      <input
                        className="transform scale-125"
                        type="checkbox"
                        value={option}
                        {...control.register("checkboxes")}
                        id={option}
                      />
                      <label htmlFor={option} className="ml-2">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Circular Loader */}
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
              <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
            </div>
          )}

          <button
            type="submit"
            title="Submit"
            className="flex group justify-center w-max gap-2 items-center rounded-sm h-[30px] px-4 py-4 text-md font-semibold text-white bg-green-500 hover:bg-green-500 focus-visible:outline-green-500 mt-4"
          >
            <SiMicrosoftexcel /> Generate Report
          </button>
        </form>
      </div>
    </BoxComponent>
  );
};

export default CustomizationReport;
