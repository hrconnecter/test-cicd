export default function SalarySlip({
    companyData,
    employeeData,
    monthlyIncomeData,
    monthlyDeductionData,
    annualIncomeData,
    annualDeductionData,
    monthlyTotals,
    annualTotals,
    currentMonth,
    financialYear,
    isdailywage,
  }) {
    return (
      <div className="max-w-5xl mx-auto p-2 sm:p-4 bg-white">
        <div className="border border-gray-600">
          {/* Header with logo and company info */}
          <div className="flex items-center border-b border-gray-600">
            {/* Logo Section with Right Shift */}
            <div className="p-2 w-28 sm:w-36 flex items-center justify-center border-r border-gray-600 ml-4 sm:ml-6">
                <img src={companyData?.logo || "/placeholder.svg"} alt={companyData?.name} className="h-16 sm:h-32" />
            </div>

            {/* Company Details Section */}
            <div className="flex-1 p-4  text-black">
                <h1 className="text-lg sm:text-xl font-bold text-red-600">{companyData.name}</h1>
                <p className="text-xs sm:text-sm mt-1 sm:mt-2">Address: {companyData.address}</p>
                <p className="text-xs sm:text-sm mt-1">
                Phone no.: {companyData.phone} Email: {companyData.email}
                </p>
                <p className="text-xs sm:text-sm mt-1">{companyData.gstin}</p>
                <p className="text-xs sm:text-sm font-semibold mt-1">{companyData.certifications}</p>
            </div>
            </div>

  
          {/* Salary Slip Header */}
          <div className="grid grid-cols-4 border-b border-gray-600">
            <div className="col-span-2 p-1 sm:p-2 text-center font-bold bg-blue-100 border-r border-gray-600 text-sm sm:text-base">
              Salary Slip
            </div>
            <div className="p-1 sm:p-2 text-center font-bold bg-blue-100 border-r border-gray-600 text-sm sm:text-base">
              Month
            </div>
            <div className="p-1 sm:p-2 text-center font-bold bg-blue-100 text-sm sm:text-base">{currentMonth}</div>
          </div>
  
          {/* Employee Details - First Column */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-gray-600">
            <div className="p-1 sm:p-2 border-r border-gray-600 font-medium text-xs sm:text-base">Employee Name:</div>
            <div className="p-1 sm:p-2 border-r sm:border-r border-gray-600 text-xs sm:text-base">
              {employeeData.name}
            </div>
            <div className="p-1 sm:p-2 border-r border-gray-600 font-medium text-xs sm:text-base">Date Of Joining:</div>
            <div className="p-1 sm:p-2 text-xs sm:text-base">{employeeData.joiningDate}</div>
          </div>
  
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-gray-600">
            <div className="p-1 sm:p-2 border-r border-gray-600 font-medium text-xs sm:text-base">Designation:</div>
            <div className="p-1 sm:p-2 border-r sm:border-r border-gray-600 text-xs sm:text-base">
              {employeeData.designation}
            </div>
            <div className="p-1 sm:p-2 border-r border-gray-600 font-medium text-xs sm:text-base">Unpaid Leaves:</div>
            <div className="p-1 sm:p-2 text-xs sm:text-base">{employeeData.unpaidLeaves}</div>
          </div>
  
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-gray-600">
            <div className="p-1 sm:p-2 border-r border-gray-600 font-medium text-xs sm:text-base">Department Name:</div>
            <div className="p-1 sm:p-2 border-r sm:border-r border-gray-600 text-xs sm:text-base">
              {employeeData.department}
            </div>
            <div className="p-1 sm:p-2 border-r border-gray-600 font-medium text-xs sm:text-base">
              Working Days Attended:
            </div>
            <div className="p-1 sm:p-2 text-xs sm:text-base">{employeeData.workingDaysAttended}</div>
          </div>
  
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-gray-600">
            <div className="p-1 sm:p-2 border-r border-gray-600 font-medium text-xs sm:text-base">PAN No:</div>
            <div className="p-1 sm:p-2 border-r sm:border-r border-gray-600 text-xs sm:text-base">{employeeData.pan}</div>
            <div className="p-1 sm:p-2 border-r border-gray-600 font-medium text-xs sm:text-base">Paid Leaves:</div>
            <div className="p-1 sm:p-2 text-xs sm:text-base">{employeeData.paidLeaves}</div>
          </div>
  
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-gray-600">
            <div className="p-1 sm:p-2 border-r border-gray-600 font-medium text-xs sm:text-base">Employee Id:</div>
            <div className="p-1 sm:p-2 border-r sm:border-r border-gray-600 text-xs sm:text-base">
              {employeeData.employeeId}
            </div>
            <div className="p-1 sm:p-2 border-r border-gray-600 font-medium text-xs sm:text-base">Public Holidays:</div>
            <div className="p-1 sm:p-2 text-xs sm:text-base">{employeeData.publicHolidays}</div>
          </div>
  
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-gray-600">
            <div className="p-1 sm:p-2 border-r border-gray-600 font-medium text-xs sm:text-base">Bank Account No:</div>
            <div className="p-1 sm:p-2 border-r sm:border-r border-gray-600 text-xs sm:text-base">
              {employeeData.bankAccountNumber}
            </div>
            <div className="p-1 sm:p-2 border-r border-gray-600 font-medium text-xs sm:text-base">
              No Of Days in Month:
            </div>
            <div className="p-1 sm:p-2 text-xs sm:text-base">{employeeData.daysInMonth}</div>
          </div>
  
          {isdailywage && (
            <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-gray-600">
              <div className="p-1 sm:p-2 border-r border-gray-600 font-medium text-xs sm:text-base">Employment Type:</div>
              <div className="p-1 sm:p-2 border-r sm:border-r border-gray-600 text-xs sm:text-base">
                {employeeData.employmentType}
              </div>
              <div className="p-1 sm:p-2 border-r border-gray-600 font-medium text-xs sm:text-base">
                Total Working Hours:
              </div>
              <div className="p-1 sm:p-2 text-xs sm:text-base">{employeeData.totalWorkingHours}</div>
            </div>
          )}
  
          {/* Monthly and Annual Salary Sections */}
          <div className="w-full border border-gray-600">
            <div className="flex flex-col lg:grid lg:grid-cols-2">
              {/* Monthly Salary Section */}
              <div className="border-b lg:border-b-0 lg:border-r border-gray-600">
                {/* Monthly Salary Header */}
                <div className="p-1 sm:p-2 text-center font-bold bg-blue-100 border-b border-gray-600 text-base sm:text-xl">
                  Monthly Salary
                </div>
  
                {/* Monthly Income/Deduction Headers */}
                <div className="grid grid-cols-2 border-b border-gray-600">
                  <div className="p-1 sm:p-2 text-center font-medium border-r border-gray-600 text-sm sm:text-lg">Income</div>
                  <div className="p-1 sm:p-2 text-center font-medium text-sm sm:text-lg">Deduction</div>
                </div>
  
                {/* Monthly Income/Deduction Subheaders */}
                <div className="grid grid-cols-4 border-b border-gray-600">
                  <div className="p-1 sm:p-2 border-r border-gray-600 font-medium text-xs sm:text-base">Particulars</div>
                  <div className="p-1 sm:p-2 border-r border-gray-600 font-medium text-xs sm:text-base">Amount</div>
                  <div className="p-1 sm:p-2 border-r border-gray-600 font-medium text-xs sm:text-base">Particulars</div>
                  <div className="p-1 sm:p-2 font-medium text-xs sm:text-base">Amount</div>
                </div>
  
                {/* Monthly Income/Deduction Data */}
                {Array.from({ length: Math.max(monthlyIncomeData.length, monthlyDeductionData.length) }).map(
                  (_, index) => {
                    const incomeItem = monthlyIncomeData[index] || {}
                    const deductionItem = monthlyDeductionData[index] || {}
  
                    // Skip loan deduction in the main loop to prevent duplication
                    if (deductionItem.particular === "Loan Deduction") return null
  
                    return (
                      <div key={`monthly-income-${index}`} className="grid grid-cols-4 border-b border-gray-600">
                        <div className="p-1 sm:p-2 border-r border-gray-600 text-xs sm:text-base">
                          {incomeItem.particular || ""}
                        </div>
                        <div className="p-1 sm:p-2 border-r border-gray-600 text-xs sm:text-base">
                          {incomeItem.amount || ""}
                        </div>
                        <div className="p-1 sm:p-2 border-r border-gray-600 text-xs sm:text-base">
                          {deductionItem.particular || ""}
                        </div>
                        <div className="p-1 sm:p-2 text-xs sm:text-base">{deductionItem.amount || ""}</div>
                      </div>
                    )
                  },
                )}
  
                {/* Loan Deduction Row */}
                {monthlyDeductionData.some((item) => item.particular === "Loan Deduction") && (
                  <div className="grid grid-cols-4 border-b border-gray-600">
                    <div className="p-1 sm:p-2 border-r border-gray-600 font-medium text-xs sm:text-base"></div>
                    <div className="p-1 sm:p-2 border-r border-gray-600 font-medium text-xs sm:text-base"></div>
                    <div className="p-1 sm:p-2 border-r border-gray-600 font-medium text-xs sm:text-base">
                      Loan Deduction
                    </div>
                    <div className="p-1 sm:p-2 font-medium text-xs sm:text-base">
                      {monthlyDeductionData.find((item) => item.particular === "Loan Deduction")?.amount || "0"}
                    </div>
                  </div>
                )}
  
                {/* Monthly Totals */}
                <div className="grid grid-cols-4 border-b border-gray-600">
                  <div className="p-1 sm:p-2 border-r border-gray-600 font-medium text-xs sm:text-base">
                    Total Gross Salary:
                  </div>
                  <div className="p-1 sm:p-2 border-r border-gray-600 text-xs sm:text-base">
                    {monthlyTotals.grossSalary}
                  </div>
                  <div className="p-1 sm:p-2 border-r border-gray-600 font-medium text-xs sm:text-base">
                    Total Deduction:
                  </div>
                  <div className="p-1 sm:p-2 text-xs sm:text-base">{monthlyTotals.totalDeduction}</div>
                </div>
              </div>
  
              {/* Annual Salary Section */}
              <div>
                {/* Annual Salary Header */}
                <div className="p-1 sm:p-2 text-center font-bold bg-blue-100 border-b border-gray-600 text-base sm:text-xl">
                  Annual Salary (FY: {financialYear})
                </div>
  
                {/* Annual Income/Deduction Headers */}
                <div className="grid grid-cols-2 border-b border-gray-600">
                  <div className="p-1 sm:p-2 text-center font-medium border-r border-gray-600 text-sm sm:text-lg">Income</div>
                  <div className="p-1 sm:p-2 text-center font-medium text-sm sm:text-lg">Deduction</div>
                </div>
  
                {/* Annual Income/Deduction Subheaders */}
                <div className="grid grid-cols-4 border-b border-gray-600">
                  <div className="p-1 sm:p-2 border-r border-gray-600 font-medium text-xs sm:text-base">Particulars</div>
                  <div className="p-1 sm:p-2 border-r border-gray-600 font-medium text-xs sm:text-base">Amount</div>
                  <div className="p-1 sm:p-2 border-r border-gray-600 font-medium text-xs sm:text-base">Particulars</div>
                  <div className="p-1 sm:p-2 font-medium text-xs sm:text-base">Amount</div>
                </div>
  
                {/* Annual Income/Deduction Data */}
                {annualIncomeData.map((income, index) => (
                  <div key={`annual-income-${index}`} className="grid grid-cols-4 border-b border-gray-600">
                    <div className="p-1 sm:p-2 border-r border-gray-600 text-xs sm:text-base">{income.particular}</div>
                    <div className="p-1 sm:p-2 border-r border-gray-600 text-xs sm:text-base">{income.amount}</div>
                    <div className="p-1 sm:p-2 border-r border-gray-600 text-xs sm:text-base">
                      {index < annualDeductionData.length ? annualDeductionData[index].particular : ""}
                    </div>
                    <div className="p-1 sm:p-2 text-xs sm:text-base">
                      {index < annualDeductionData.length ? annualDeductionData[index].amount : ""}
                    </div>
                  </div>
                ))}
                {/* this section wont be visible */}
                {monthlyDeductionData.some((item) => item.particular === "Loan Deduction") && (
                    <div className="grid grid-cols-4 border-b border-gray-600 bg-white bg-opacity-0">
                        <div className="p-1 sm:p-2 font-medium text-xs sm:text-base text-transparent"></div>
                        <div className="p-1 sm:p-2 font-medium text-xs sm:text-base text-transparent"></div>
                        <div className="p-1 sm:p-2 font-medium text-xs sm:text-base text-transparent">
                            Loan Deduction
                        </div>
                        <div className="p-1 sm:p-2 font-medium text-xs sm:text-base text-transparent">
                            {monthlyDeductionData.find((item) => item.particular === "Loan Deduction")?.amount || "0"}
                        </div>
                    </div>
                )}


  
                {/* Annual Totals */}
                <div className="grid grid-cols-4 border-b border-gray-600">
                  <div className="p-1 sm:p-2 border-r border-gray-600 font-medium text-xs sm:text-base">
                    Total Gross Salary :
                  </div>
                  <div className="p-1 sm:p-2 border-r border-gray-600 text-xs sm:text-base">
                    {annualTotals.grossSalary}
                  </div>
                  <div className="p-1 sm:p-2 border-r border-gray-600 font-medium text-xs sm:text-base">
                    Total Deduction:
                  </div>
                  <div className="p-1 sm:p-2 text-xs sm:text-base">{Math.round(annualTotals.totalDeduction)}</div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Net salary annual and monthly */}
          <div className="flex flex-col sm:grid sm:grid-cols-2 border-b border-gray-600">
            <div className="grid grid-cols-2 border-b border-gray-600">
              <div className="p-1 sm:p-2 text-center font-bold bg-blue-100 text-sm sm:text-lg">Total Net Salary</div>
              <div className="p-1 sm:p-2 text-center font-bold bg-blue-100 text-sm sm:text-lg">
                {monthlyTotals.netSalary}
              </div>
            </div>
  
            <div className="grid grid-cols-2 border-b border-gray-600">
              <div className="p-1 sm:p-2 text-center font-bold bg-blue-100 text-sm sm:text-lg">
                Total Annual Net Salary
              </div>
              <div className="p-1 sm:p-2 text-center font-bold bg-blue-100 text-sm sm:text-lg">
                {annualTotals.netSalary}
              </div>
            </div>
          </div>
  
          {/* Footer */}
          <div className="p-2 sm:p-4 text-center text-xs sm:text-base">
            <p>This is computer generated copy hence signature and stamp not required</p>
            <p>For {companyData.name}</p>
          </div>
        </div>
      </div>
    )
  }
  
  