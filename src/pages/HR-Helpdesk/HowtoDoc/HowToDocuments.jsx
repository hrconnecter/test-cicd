import React, { useState } from "react";
import registerImage1 from "../../../assets/How-To/register/register1.png";
import registerImage2 from "../../../assets/How-To/register/register2.png";
import loginImage1 from "../../../assets/How-To/login/login1.png";
import loginImage2 from "../../../assets/How-To/login/login2.png";
import creatorg1 from "../../../assets/How-To/createorg/createorg1.png"
import createorg2 from "../../../assets/How-To/createorg/createorg2.png"
import createorg3 from "../../../assets/How-To/createorg/createorg3.png"
import createorg4 from "../../../assets/How-To/createorg/createorg4.png"
import setup1 from "../../../assets/How-To/setup/setup1.png"
import setup2 from "../../../assets/How-To/setup/setup2.png"

import recruitment1 from "../../../assets/How-To/recruitment/recruitment1.png";
import recruitment2 from "../../../assets/How-To/recruitment/recruitment2.png";
import recruitment4 from "../../../assets/How-To/recruitment/recruitment4.png";
import attendance1 from "../../../assets/How-To/attendance/attendance1.png";
import attendance2 from "../../../assets/How-To/attendance/attendance2.png";
import dept from "../../../assets/How-To/department/dept.png";
import dept2 from "../../../assets/How-To/department/dept2.png";
import attendance3 from "../../../assets/How-To/attendance/attendance3.png";
import attendance4 from "../../../assets/How-To/attendance/attendance4.png";
import shift1 from "../../../assets/How-To/shift/shift1.png";
import shift2 from "../../../assets/How-To/shift/shift2.png";
import payslip1 from "../../../assets/How-To/payroll/payslip1.png";
import payslip2 from "../../../assets/How-To/payroll/payslip2.png";
import payslip3 from "../../../assets/How-To/payroll/payslip3.png";
import payslip4 from "../../../assets/How-To/payroll/payslip4.png";
import payslip5 from "../../../assets/How-To/payroll/payslip5.png";
import reporting from "../../../assets/How-To/reporting/reporting.png";
import reporting1 from "../../../assets/How-To/reporting/reporting1.png";
import loan1 from "../../../assets/How-To/loan/loan1.png";
import loan2 from "../../../assets/How-To/loan/loan2.png";
import advance1 from "../../../assets/How-To/advance/advance1.png";
import advance2 from "../../../assets/How-To/advance/advance2.png";
/*

import salary1 from "../../../assets/How-To/payroll/salary1.png";
import salary2 from "../../../assets/How-To/payroll/salary2.png";
*/

const HowToDocuments = () => {
  const [activeCard, setActiveCard] = useState(null)

  const toggleCard = (cardId) => {
    setActiveCard(activeCard === cardId ? null : cardId)
  }

  const sections = [
    {
      id: "register",
      title: "How to Register with AEGIS HRMS Software",
      content: (
        <div>
          <ol className="list-decimal pl-5">
            <li className="mb-2">
              <span className="font-bold mr-1">Step 1:</span>
              Click on the link to open the registration page:{" "}
              <a
                href="https://app.aegishrms.com/sign-up"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Register Here
              </a>
              .
            </li>
          </ol>
          <div className="my-3">
            <img src={registerImage1 || "/placeholder.svg"} alt="Registration Step 1" className="w-max rounded-lg" />
          </div>
          <ol start={2} className="list-decimal pl-5">
            <li className="mb-2">
              <span className="font-bold mr-1">Step 2:</span>
              Enter all the mandatory fields, such as first name, last name, etc.
            </li>
            <li className="mb-2">
              <span className="font-bold mr-1">Step 3:</span>
              Verify your contact number using the OTP process.
            </li>
            <li className="mb-2">
              <span className="font-bold mr-1">Step 4:</span>
              Verify your email address using the link sent to your email.
            </li>
            <li className="mb-2">
              <span className="font-bold mr-1">Step 5:</span>
              Enter a strong password and confirm it (e.g., Xityu@1211).
            </li>
            <li className="mb-2">
              <span className="font-bold mr-1">Step 6:</span>
              Read the terms and conditions, and check the box to agree.
            </li>
            <li className="mb-2">
              <span className="font-bold mr-1">Step 7:</span>
              Click the "Register Account" button to complete registration.
            </li>
          </ol>
          <div className="my-3">
            <img src={registerImage2 || "/placeholder.svg"} alt="Registration Step 7" className="w-max rounded-lg" />
          </div>
        </div>
      ),
    },
    {
      id: "login",
      title: "How to Log in to AEGIS HRMS Software",
      content: (
        <div>
          <ol className="list-decimal pl-5">
            <li className="mb-2">
              <span className="font-bold mr-1">Step 1:</span>
              Click on the link:{" "}
              <a
                href="https://app.aegishrms.com/login"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Log In Here
              </a>
              .
            </li>
            <li className="mb-2">
              <span className="font-bold mr-1">Step 2:</span>
              Use valid credentials to log in.
            </li>
          </ol>
          <div className="my-3">
            <img src={loginImage1 || "/placeholder.svg"} alt="Login Step 2" className="w-max rounded-lg" />
          </div>
          <ol start={3} className="list-decimal pl-5">
            <li className="mb-2">
              <span className="font-bold mr-1">Step 3:</span>
              After login, you'll be navigated to the welcome page.
            </li>
          </ol>
          <div className="my-3">
            <img src={loginImage2 || "/placeholder.svg"} alt="Login Step 3" className="w-max rounded-lg" />
          </div>
        </div>
      ),
    },
    {
      id: "organization",
      title: "How to Create an Organization",
      content: (
        <div>
          <ol className="list-decimal pl-5">
            <li className="mb-2">
              <span className="font-bold mr-1">Step 1:</span>
              Click on the "Create Organization" button to open the organization form.
            </li>
            <li className="mb-2">
              <span className="font-bold mr-1">Step 2:</span>
              Enter all mandatory fields, such as organization name, email ID, foundation date, website address, etc.
              <div className="my-3">
                <img
                  src={creatorg1 || "/placeholder.svg"}
                  alt="Organization Creation Step 2"
                  className="w-full rounded-lg"
                />
              </div>
            </li>
            <li className="mb-2">
              <span className="font-bold mr-1">Step 3:</span>
              Choose a package from Essential, Basic, Intermediate, or Enterprise plans.
              <div className="my-3">
                <img
                  src={createorg2 || "/placeholder.svg"}
                  alt="Organization Creation Step 3"
                  className="w-full rounded-lg"
                />
              </div>
            </li>
            <li className="mb-2">
              <span className="font-bold mr-1">Step 4:</span>
              Enter organization member count and choose a payment option or a 7-day free trial.
              <div className="my-3">
                <img
                  src={createorg3 || "/placeholder.svg"}
                  alt="Organization Creation Step 4"
                  className="w-full rounded-lg"
                />
              </div>
            </li>
            <li className="mb-2">
              <span className="font-bold mr-1">Step 5:</span>
              After successful payment, the organization will be created, and you'll be navigated to the setup page.
              <div className="my-3">
                <img
                  src={createorg4 || "/placeholder.svg"}
                  alt="Organization Creation Step 5"
                  className="w-full rounded-lg"
                />
              </div>
            </li>
          </ol>
        </div>
      ),
    },
    {
      id: "setup",
      title: "How to Do Setup (Super Admin Side)",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <span className="font-bold">⚫ </span> Only super admin can do setup.
          </li>
          <li>
            <span className="font-bold">⚫ </span> Manage Roles: Choose roles that the organization contains and save
            it.
            <div className="my-3">
              <img src={setup1 || "/placeholder.svg"} alt="Setup ⚫ 2" className="w-full rounded-lg" />
            </div>
          </li>
          <li>
            <span className="font-bold">⚫ </span> Leaves: Here, users can add organization-specific leaves along with
            leave counts. These leaves get visible to employees, e.g., Casual leaves, Sick leaves.
          </li>
          <li>
            <span className="font-bold">⚫ </span> Shifts: Here, users can add organization-mentioned shifts for
            employees by entering Shift name, time, and days, e.g., Morning shift, General shift.
          </li>
          <li>
            <span className="font-bold">⚫ </span> Location: Add the organization's location by entering region,
            country, state, city, short name, with pin code.
          </li>
          <li>
            <span className="font-bold">⚫ </span> Public Holidays: Add public holidays mentioned by the organization,
            which get visible in the employee's calendar.
          </li>
          <li>
            <span className="font-bold">⚫ </span> Additional Employee Data: If users require any other information of
            employees during onboarding, by clicking on a checkbox, an input field will get added in the employee
            onboarding page.
          </li>
          <li>
            <span className="font-bold">⚫ </span> Employment: Here, users can add types of employment, such as
            full-time, part-time.
          </li>
          <li>
            <span className="font-bold">⚫ </span> Salary Template: Here, users can create different salary templates
            for employees. By adding salary components, users can customize salary templates according to their
            organization.
          </li>
          <li>
            <span className="font-bold">⚫ </span> Designation: Here, users can create different designations that can
            be used to assign to employees during onboarding, e.g., HR, Manager, Developer, Tester.
          </li>
          <li>
            <span className="font-bold">⚫ </span> Communication: Users can add mail IDs to send broadcast mails to
            employees. In the website, there is an add email button. By using that, users can add emails and choose the
            communication type. These will be used for further communication.
          </li>
          <li>
            <span className="font-bold">⚫ </span> Employee Survey: There is another checkbox enabling users to create
            employee survey forms.
          </li>
          <li>
            <span className="font-bold">⚫ </span> Weekly Off: Here, users can add weekend days that are available in
            the organization.
          </li>
          <li>
            <span className="font-bold">⚫ </span> Salary Computation Day: Here, users can add the salary computation
            day, and salary will be calculated on that day.
          </li>
          <li>
            <span className="font-bold">⚫ </span> Loan Management: Here, users can create types of loans they want to
            provide to employees.
          </li>
          <li>
            <span className="font-bold">⚫ </span> Remote Punching: As there is a feature present in the software for
            remote employees, for that setup, there are several checkboxes given:
            <div className="my-3">
              <img src={setup1 || "/placeholder.svg"} alt="Setup ⚫ 16" className="w-full rounded-lg" />
            </div>
            <ul className="list-[lower-alpha] pl-5 space-y-1 mt-2">
              <li>
                Dual Workflow: By enabling this checkbox, users can allow managers to approve employees' remote punching
                requests.
              </li>
              <li>
                Geo Fencing: By enabling this checkbox, users can allow employees to punch in only from the allowed
                location.
              </li>
              <li>
                Extra Allowance: By enabling this checkbox, users can allow employees to add extra amounts to salaries,
                which can be specified in the setup.
              </li>
              <li>
                Shift Allowance: By enabling this checkbox, accountants can approve employees' shift requests after the
                manager's approval. Additionally, users can set shift allowance amounts to be added to the employees'
                salary slip.
              </li>
              <li>
                Extra Day: If any employee works on holidays or extra days, they can apply for extra days in the
                attendance and calendar. This setup allows employees to apply for extra days.
              </li>
              <li>
                Overtime Allowance: By enabling the checkbox, users can allow an allowance to be added to the salary
                slip if any employee works overtime. Users can set amounts on an hourly basis.
              </li>
            </ul>
          </li>
          <li>
            <span className="font-bold">⚫ </span> Training: Here, users need to do some basic setup for the training
            feature.
          </li>
          <li>
            <span className="font-bold">⚫ </span> Performance Management: Here, users need to do settings for
            performance management.
          </li>
          <li>
            <span className="font-bold">⚫ </span> PF and ESIC Calculation: Users need to do the setup of PF and ESIC
            rates according to government norms.
            <div className="my-3">
              <img src={setup2 || "/placeholder.svg"} alt="PF and ESIC Calculation" className="w-full rounded-lg" />
            </div>
          </li>
          <li>
            <span className="font-bold">⚫ </span> Letter Types Setup: This setup is regarding the types of letters that
            users want to add for employees.
          </li>
        </ul>
      ),
    },
    {
      id: "department",
      title: "Department Setup",
      content: (
        <div>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <span className="font-bold mr-1">Step 1:</span>
              Navigate through Department and click on "Add Department".
            
              <div className="my-3  ">
              <img src={dept || "/placeholder.svg"} alt="Employee Attendance" className="w-[500px]  rounded-lg" />
            </div>
            </li>


            <li>
              <span className="font-bold mr-1">Step 2:</span>
              Navigate through Department and click on "Add Department".
            
              <div className="my-3  ">
              <img src={dept2 || "/placeholder.svg"} alt="Employee Attendance" className="w-[500px] rounded-lg" />
            </div>
            </li>
            <li>
              <span className="font-bold mr-1">Step 3:</span>
              Navigate through Department and click on "Add Department". Once the department is added, employee onboarding can be done.
            </li>
           
          </ol>
        </div>
      ),
    },
    {
      id: "attendance",
      title: "Attendance and Leave Management",
      content: (
        <div className="space-y-3">
          <div>
            <p className="font-semibold">Super Admin/HR/Manager Profile:</p>
            <p>
              In the left navigation there is option called Attendance and leave management. By using that you can view
              employee's attendance and leaves which they have applied, also there is a facility to apply leaves or
              attendance on behalf of employees.
            </p>
            <p>Super Admin Profile &gt; Attendance &gt; Manage Leaves &gt; View Employee Attendance.</p>
            {/* Commented out due to undefined variables */}

            <div className="my-3  ">
              <img src={attendance2 || "/placeholder.svg"} alt="Employee Attendance" className="w-max rounded-lg" />
            </div>
            <div className="my-3" >
            <p>Manage Leaves &gt; View Employee Attendance &gt; Actions &gt; Apply leave</p>
            <div className="my-3 ">
              <img src={attendance1 || "/placeholder.svg"} alt="Attendance Management" className="w-max rounded-lg" />
            </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="font-semibold">Employee Profile:</p>
            <p>
              In the employee profile there is option called Attendance, where employee can apply their leave or
              attendance and availability.
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Login to employee profile using valid credentials.</li>
              <li>Click on the left navigation and select the attendance and leave management.</li>
              <li>Calendar will visible, select the date you want to apply choose the types of leaves and submit.</li>
            </ol>
            {/* Commented out due to undefined variables */}
            
            <div className="my-3 ">
              <img src={attendance3 || "/placeholder.svg"} alt="Attendance Management" className="w-max rounded-lg" />
            </div>
            <div className="my-3 ">
              <img src={attendance4 || "/placeholder.svg"} alt="Attendance Management" className="w-max rounded-lg" />
            </div>
          
          </div>

          <div className="mt-6">
            <p className="font-semibold">Shift Management:</p>
            <p>Using this feature employee can apply extra shift they want to work on holidays or any week offs.</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Login to employee profile using valid credentials.</li>
              <li>Click on the left navigation and select the shift management.</li>
              <li>
                Click on the apply shift button, Select the dates you want to apply for to do shifts and choose the
                shift type (Morning, Evening etc) and submit further which will go for approval to respective manager.
              </li>
            </ol>
            {/* Commented out due to undefined variables */}
            <div className="my-3">
              <img src={shift1 || "/placeholder.svg"} alt="Shift Management" className="w-[600px] rounded-lg" />
            </div>
            <div className="my-3">
              <img src={shift2 || "/placeholder.svg"} alt="Shift Management" className="w-[600px] rounded-lg" />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "payroll",
      title: "Payroll Management",
      content: (
        <div className="space-y-6">
          <div>
            <p className="font-semibold text-lg">Employee Profile</p>
            <p className="font-medium mt-2">Pay slip:</p>
            <p>
              This feature regarding to view and download the pay slip, once HR is uploaded pay slip in employee
              profile.
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Log in to employee profile.</li>
              <li>Click on the payroll then go to pay slip section where you see calendar icon.</li>
              <li>
                Click on the calendars icon, choose the month you want to download the pay slip, after that pay slip
                gets visible click on the download button.
              </li>
            </ol>
            {/* Commented out due to undefined variables */}
            <div className="my-3">
              <img src={payslip1 || "/placeholder.svg"} alt="Employee Payslip" className="w-max rounded-lg" />
            </div>
           
          </div>

          <div>
            <p className="font-semibold text-lg">Super Admin/HR Profile</p>
            <p className="font-medium mt-2">Salary Management:</p>
            <p>Super admin or HR can calculate salary of employees by using this feature.</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Log in to the Super admin profile/HR profile using valid credentials.</li>
              <li>Go to payroll section, click on the salary management.</li>
              <li>Choose the employee then click on the actions.</li>
              <li>Click on the Manage salary then add the amount click on the submit.</li>
              <li>Click on calculate salary to submit the pay slip to employees.</li>
            </ol>

            <div className="my-3">
              <img src={payslip2 || "/placeholder.svg"} alt="Employee Payslip" className="w-[600px] rounded-lg" />
            </div>
            <div className="my-3">
              <img src={payslip3 || "/placeholder.svg"} alt="Employee Payslip" className="w-max rounded-lg" />
            </div>
            <div className="my-3">
              <img src={payslip4 || "/placeholder.svg"} alt="Employee Payslip" className="w-[600px] rounded-lg" />
            </div>
            <div className="my-3">
              <img src={payslip5 || "/placeholder.svg"} alt="Employee Payslip" className="w-max rounded-lg" />
            </div>
            {/* Commented out due to undefined variables */}
            {/* <div className="my-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <img src={salary1 || "/placeholder.svg"} alt="Salary Management 1" className="w-full rounded-lg" />
              <img src={salary2 || "/placeholder.svg"} alt="Salary Management 2" className="w-full rounded-lg" />
            </div> */}
          </div>
        </div>
      ),
    },
    {
      id: "reporting",
      title: "Reporting MIS",
      content: (
        <div className="space-y-3">
          <p>
            This feature is to download the attendance report, salary information, TDS info and employee data in the
            excel format. This feature is for HR also.
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Login to Super admin or HR profile using valid credentials.</li>
            <li>Click on the left navigation.</li>
            <li>Select the reporting MIS and click on the report you want to download.</li>
            <li>
              Choose manager if you want download manager under employees, which is not mandatory field click on the
              generate report button excel file download.
            </li>
          </ol>
          {/* Commented out due to undefined variables */}
          <div className="my-3">
            <img src={reporting || "/placeholder.svg"} alt="Reporting MIS" className="w-max rounded-lg" />
          </div>
          <div className="my-3">
            <img src={reporting1 || "/placeholder.svg"} alt="Reporting MIS" className="w-max rounded-lg" />
          </div>
        </div>
      ),
    },
    {
      id: "loan",
      title: "Loan & Advanced Salary Management",
      content: (
        <div className="space-y-6">
          <p>
            Employee can apply for loans that are set by organization with specific range and with interest, employee is
            having authority to choose the no of EMI, date of imbursement.
          </p>

          <div>
            <p className="font-semibold">Loan Setup (Super admin side):</p>
            <p>Super admin have authority to set the loans for their employees.</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Login with super admin profile click on set up.</li>
              <li>Select the loan management click on the Add loan type.</li>
              <li>Fill all mandatory fields Loan type, rate of interest and submit.</li>
            </ol>
            {/* Commented out due to undefined variables */}
            <div className="my-3">
              <img src={loan1 || "/placeholder.svg"} alt="Loan Setup" className="w-max rounded-lg" />
            </div>
          </div>

          <div>
            <p className="font-semibold">Loan Management (Employee side):</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Login to employee profile.</li>
              <li>Click on the left navigation and select the loan management.</li>
              <li>
                Choose the loan type, amount, no of EMI's, read the declaration submit it. Which will go for HR
                approval.
              </li>
            </ol>
            {/* Commented out due to undefined variables */}
            <div className="my-3">
              <img src={loan2 || "/placeholder.svg"} alt="Employee Loan Management" className="w-max rounded-lg" />
            </div>
          </div>

          <div>
            <p className="font-semibold">Advance Salary:</p>
            <p>
              Employees who want advance salary they can apply for that using this feature. This works similar like loan
              management.
            </p>
            <div className="my-3">
              <img src={advance1 || "/placeholder.svg"} alt="Advance Salary" className="w-max rounded-lg" />
            </div>

            <ol className="list-decimal pl-5 space-y-2">
              <li>Login to employee profile.</li>
              <li>Click on the left navigation, select the advance salary.</li>
              <li>Click on the month you want advance salary.</li>
              <li>Upload the document, if any.</li>
              <li>Submit it, further which will go for HR approval.</li>
            </ol>
            {/* Commented out due to undefined variables */}
            <div className="my-3">
              <img src={advance2 || "/placeholder.svg"} alt="Advance Salary" className="w-max rounded-lg" />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "recruitment",
      title: "How to Setup Recruitment Module",
      content: (
        <div className="space-y-3">
          <p>
            This module is present only for enterprise package, while creating organization if user chooses enterprise
            package or else any other package with additional module as recruitment.
          </p>
          <p className="font-semibold">Super Admin Side:</p>
          <p>HR and Manager can have access of this creating job positions establishing the job roles.</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Log in to AEGIS software and enter the valid credentials.</li>
            <li>Click on the enterprise organization.</li>
            <li>Click on the left navigation and choose the internal job program.</li>
            <li>And choose the Job vacancy list.</li>
          </ol>
          {/* Commented out due to undefined variables */}
          <div className="my-3">
            <img src={recruitment1 || "/placeholder.svg"} alt="Recruitment Step 4" className="w-max rounded-lg" />
          </div>
          <ol start={5} className="list-decimal pl-5 space-y-2">
            <li>Click on the Create job position.</li>
            <li>Enter all the details regarding the job position step by step, create the job position.</li>
          </ol>
          {/* Commented out due to undefined variables */}
          <div className="my-3">
            <img src={recruitment2 || "/placeholder.svg"} alt="Recruitment Step 6" className="w-max rounded-lg" />
          </div>
          <ol start={7} className="list-decimal pl-5 space-y-2">
            <li>List of created job positions will be visible in the open job role.</li>
            <li>
              Click on the 'my schedule interview', enter all the details and schedule the interviews for the employees.
            </li>
          </ol>
          {/* Commented out due to undefined variables */}
          {/* <div className="my-3">
          //   <img src={recruitment3 || "/placeholder.svg"} alt="Recruitment Step 8" className="w-max rounded-lg" />
          // </div> */}
          <ol start={9} className="list-decimal pl-5 space-y-2">
            <li>Scheduled interviews will be visible in the employee calendar.</li>
          </ol>
          {/* Commented out due to undefined variables */}
          <div className="my-3">
            <img src={recruitment4 || "/placeholder.svg"} alt="Recruitment Step 9" className="w-[600px] rounded-lg" />
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <h1 className="text-center text-2xl font-bold mb-6">How-to Documents</h1>
      <div className="flex flex-col gap-4">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`border border-gray-200 rounded-lg p-4 bg-white shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md ${
              activeCard === section.id ? "transform-none" : "hover:scale-[1.01]"
            }`}
            onClick={() => toggleCard(section.id)}
          >
            <div className="flex justify-between items-center">
              <h3 className="m-0 text-gray-800 font-semibold">{section.title}</h3>
              <span className="text-lg text-gray-700">{activeCard === section.id ? "▲" : "▼"}</span>
            </div>
            {activeCard === section.id && (
              <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn">{section.content}</div>
            )}
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  )
}

export default HowToDocuments
