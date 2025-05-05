<div id="App" className="px-3">
<div className="flex items-center justify-between mb-6">
  <img
    src={availableEmployee?.organizationId?.logo_url}
    alt="Company Logo"
    style={{
      width: "150px",
      height: "150px",
      borderRadius: "50%",
    }}
  />
  <div className="px-2 ">
    <p className="text-lg font-semibold flex items-center">
      <span className=" mr-1">Organisation Name :</span>
      <span style={{ whiteSpace: "pre-wrap" }}>
        {availableEmployee?.organizationId?.orgName || ""}
      </span>
    </p>
    <p className="text-lg flex items-center">
      <span className=" mr-1">Location :</span>
      <span>
        {" "}
        {availableEmployee?.organizationId?.location?.address ||
          ""}
      </span>
    </p>
    <p className="text-lg flex items-center">
      <span className="mr-1">Contact No :</span>
      <span>
        {availableEmployee?.organizationId?.contact_number || ""}
      </span>
    </p>
    <p className="text-lg flex items-center">
      <span className="mr-1">Email :</span>
      <span>
        {availableEmployee?.organizationId?.email || ""}
      </span>
    </p>
  </div>
</div>

<hr className="mb-6" />

<div>
  <table className="w-full border border-collapse ">
    {/* 1st table */}
    <table className="w-full border border-collapse">
      <thead style={{ textAlign: "left" }}>
        <tr className="bg-blue-200">
          <th className="px-2  py-2 border">Salary Slip</th>
          <th className="border"></th>
          <th className="px-2  py-2 border">Month</th>
          <th className="px-2  py-2 border">{formattedDate}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="px-2  py-2 border">Employee Name:</td>
          <td className="px-2  py-2 border">
            {`${availableEmployee?.first_name} ${availableEmployee?.last_name}`}
          </td>
          <td className="px-2  py-2 border">Date Of Joining:</td>
          <td className="px-2  py-2 border">
            {availableEmployee?.joining_date
              ? new Date(
                  availableEmployee?.joining_date
                ).toLocaleDateString("en-GB")
              : ""}
          </td>
        </tr>

        <tr>
          <td className="px-2  py-2 border">Designation:</td>
          <td className="px-2  py-2 border">
            {" "}
            {(availableEmployee?.designation &&
              availableEmployee?.designation.length > 0 &&
              availableEmployee?.designation[0]
                ?.designationName) ||
              ""}
          </td>
          <td className="px-2  py-2 border">Unpaid Leaves:</td>
          <td className="px-2  py-2 border">{unPaidLeaveDays}</td>
        </tr>

        <tr>
          <td className="px-2  py-2 border">Department Name:</td>
          <td className="px-2  py-2 border">
            {" "}
            {(availableEmployee?.deptname &&
              availableEmployee?.deptname.length > 0 &&
              availableEmployee?.deptname[0]?.departmentName) ||
              ""}
          </td>
          <td className="px-2  py-2 border">
            No Of Working Days Attended:
          </td>
          <td className="px-2  py-2 border">
            {Math.round(totalAvailableDays)}
          </td>
        </tr>

        <tr>
          <td className="px-2  py-2 border">PAN No:</td>
          <td className="px-2  py-2 border">
            {availableEmployee?.pan_card_number}
          </td>
          <td className="px-2  py-2 border">Paid Leaves:</td>
          <td className="px-2  py-2 border">{paidLeaveDays}</td>
        </tr>

        <tr>
          <td className="px-2  py-2 border">Employee Id:</td>
          <td className="px-2  py-2 border">
            {availableEmployee?.empId}
          </td>
          <td className="px-2  py-2 border">Public Holidays:</td>
          <td className="px-2  py-2 border">
            {employeeSummary?.publicDays}
          </td>
        </tr>

        <tr>
          <td className="px-2  py-2 border">Bank Account No:</td>
          <td className="px-2  py-2 border">
            {availableEmployee?.bank_account_no || ""}
          </td>

          <td className="px-2  py-2 border">
            No Of Days in Month:
          </td>
          <td className="px-2  py-2 border">{numDaysInMonth}</td>
        </tr>
          {
            isdailywage && (
              <tr>
          <td className="px-2  py-2 border">Employment Type:</td>
          <td className="px-2  py-2 border">
            {availableEmployee?.employmentType?.title || ""}
          </td>

          <td className="px-2  py-2 border">
            Total Working Hours:
          </td>
          <td className="px-2  py-2 border">{workingHours}</td>
        </tr>
            )
          }
       

        <tr>
          {/* <td className="px-2  py-2 border"></td>
        <td className="px-2  py-2 border"></td> */}
          {extradayCount > 0 && (
            <>
              <td className="px-2  py-2 border">
                No Of Extra Days in Month:
              </td>
              <td className="px-2  py-2 border">
                {extradayCount}
              </td>
            </>
          )}
        </tr>
      </tbody>
    </table>
    {/* </div> */}

    {/* </div> 
{/* esko  niche lgadala */}

    <div className="container mx-auto py-2 ">
      <div className="flex flex-wrap gap-1 justify-between">
        {/* Left Column: Monthly Salary Table */}
        <div className="flex-1 min-w-[300px]">
          <div>
            <table className="w-full border border-collapse">
              <thead>
                <tr className="bg-blue-200 px-2 py-2 border text-center">
                  <th colSpan="4" className="px-2 py-2">
                    {" "}
                    Monthly Salary
                  </th>
                </tr>
                <tr className="" style={{ textAlign: "left" }}>
                  <th
                    colSpan="2"
                    className="px-2 py-2 border text-center"
                  >
                    Income
                  </th>
                  {/* <th className="border"></th> */}
                  <th
                    colSpan="2"
                    className="px-2 py-2 border text-center"
                  >
                    Deduction
                  </th>
                  {/* <th className="px-2 py-2 border"></th> */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-2 border">
                    Particulars
                  </td>
                  <td className=" px-2 py-2 border">Amount</td>
                  <td className="px-2 py-2 border ">
                    Particulars
                  </td>
                  <td className=" px-2  py-2 border">Amount</td>
                </tr>
                {Array.from({
                  length: Math.max(
                    incomeValues?.length || 0,
                    deductionValues?.length || 0
                  ),
                }).map((_, index) => {
                  // const currentPage = Math.floor(index / ITEMS_PER_PAGE);
                  const incomeItem = incomeValues[index];
                  if (!incomeItem?.isExpense) {
                    return (
                      <tr
                        key={index}
                        style={{
                          pageBreakAfter:
                            (index + 1) % ITEMS_PER_PAGE === 0
                              ? "always"
                              : "auto",
                        }}
                      >
                        {/* Income column */}
                        <td className="px-2 py-2 border">
                          {incomeValues?.[index]?.name || ""}
                        </td>

                        <td className="px-2 py-2 border">
                          {incomeValues?.[index]?.value || ""}
                        </td>

                        {/* Deduction column */}
                        <td className="px-2 py-2 border">
                          {deductionValues?.[index]?.name || ""}
                        </td>
                        <td className="px-2 py-2 border">
                          {deductionValues?.[index]?.value
                            ? Math.round(
                                deductionValues[index].value
                              )
                            : ""}
                        </td>
                      </tr>
                    );
                  }
                })}

                {expensePayments?.length > 0 && (
                  <tr>
                    <td className="px-2 py-2 border">Expense</td>
                    <td className="px-2 py-2 border">Expense</td>
                    <td className="px-2 py-2 border">
                      ₹
                      {expensePayments.reduce(
                        (total, expense) =>
                          total + expense.amount,
                        0
                      )}
                    </td>
                    <td className="px-2 py-2 border"></td>
                    <td className="px-2 py-2 border"></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>


          {/* Total Gross Salary and Deduction */}
          <div>
            <table className="w-full border border-collapse">
              <thead>
                <tr className="">
                  <th className="py-2 mx-2  border">
                    Total Gross Salary:{" "}
                  </th>
                  {/* <span className="mx-2  ">
                      {salary?.totalIncome || ""}
                    </span>{" "}
                  </th> */}
                  <th className="py-2 border">
                    {salary?.totalIncome || "" }
                  </th>
                  <th className="py-2 mx-2 border">
                    Total Deduction:
                    {/* <span className="mx-2  ">
                      {" "}
                      {salary?.totalDeduction || ""}
                    </span> */}
                  </th>
                  <th className="py-2 border">
                    {salary?.totalDeduction || ""}
                  </th>
                </tr>
              </thead>
              {/* <tbody></tbody> */}
            </table>
          </div>

          {/* Total Net Salary */}
          <div>
            <table className="w-full mt-10 border">
              <thead>
                <tr className="bg-blue-200">
                  <th className="px-2 py-2">Total Net Salary</th>
                  <th></th>
                  <th className="px-2 py-2">
                    {  salary?.totalNetSalary || ""}
                  </th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Annual Salary Table */}
        <div className="flex-1 min-w-[300px]">
          {/* <h3 className="text-xl font-semibold mb-4  text-center">
        Annual Salary
      </h3> */}
          <table className="w-full border border-collapse">
            <thead>
              {/* <tr className="bg-blue-200 px-2 py-2 border text-center">
                <th colSpan="4" className="px-2 py-2">
                  {" "}
                
                  Annual Salary (FY:{" "}
                  {selectedDate.month() < 3
                    ? `${
                        selectedDate.year() - 1
                      }-${selectedDate.year()}`
                    : `${selectedDate.year()}-${
                        selectedDate.year() + 1
                      }`}
                  )
                </th>
              </tr> */}

            <tr className="bg-blue-200 px-2 py-2 border text-center">
              <th colSpan="4" className="px-2 py-2">
                Annual Salary (FY: {getFinancialYearRange()})
              </th>
            </tr>
              <tr className="" style={{ textAlign: "left" }}>
                <th
                  colSpan="2"
                  className="px-2 py-2 border text-center"
                >
                  Income
                </th>
                {/* <th className="border"></th> */}
                <th
                  colSpan="2"
                  className="px-2 py-2 border  text-center"
                >
                  Deduction
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-2 border">Particulars</td>
                <td className=" px-2 py-2 border">Amount</td>
                <td className="px-2 py-2 border ">Particulars</td>
                <td className=" px-2  py-2 border">Amount</td>
              </tr>
              {/* pre code niche comment */}
              {/* sat🙁 */}
              {/* 
{Array.from({
length: Math.max(
incomeValues?.length || 0,
deductionValues?.length || 0
),
}).map((_, index) => {
const incomeItem = incomeValues[index];
const deductionItem = deductionValues[index];
if (!incomeItem?.isExpense) {
return (
<tr key={index}>
<td className="px-2 py-2 border">
{incomeValues?.[index]?.name || ""}
</td>
<td className="px-2 py-2 border">
{incomeValues?.[index]?.value && submittedSalaries 
? Math.round(annualTotals.income)
: ""}
</td>
<td className="px-2 py-2 border">
{deductionItem?.name !== "Loan Deduction" 
? deductionItem?.name 
: "\u00A0"}
</td>
<td className="px-2 py-2 border">
{deductionItem?.name !== "Loan Deduction" && submittedSalaries
? Math.round(annualTotals.deductions)
: "\u00A0"}
</td>
</tr>
);
}
})} */}
              {Array.from({
                length: Math.max(
                  incomeValues?.length || 0,
                  deductionValues?.length || 0
                ),
              }).map((_, index) => {
                const incomeItem = incomeValues[index];
                const deductionItem = deductionValues[index];
                if (!incomeItem?.isExpense) {
                  return (
                    <tr key={index}>
                      <td className="px-2 py-2 border">
                        {incomeValues?.[index]?.name || ""}
                      </td>
                      {/* <td className="px-2 py-2 border">
                        {submittedSalaries?.length > 0 &&
                        incomeValues?.[index]?.value
                          ? Math.round(annualTotals.income)
                          : "0"}
                      </td> */}
                      <td className="px-2 py-2 border">
                    {submittedSalaries?.length > 0 && incomeValues?.[index]?.value
                      ? Math.round(incomeValues[index].value * submittedSalaries.length)
                      : "0"}
                    
                  </td>

                      <td className="px-2 py-2 border">
                        {deductionItem?.name !== "Loan Deduction"
                          ? deductionItem?.name
                          : "\u00A0"}
                      </td>

                      <td className="px-2 py-2 border">
                        {deductionItem?.name !==
                          "Loan Deduction" &&
                        submittedSalaries?.length > 0
                          ? Math.round(
                              deductionItem?.value *
                                submittedSalaries?.length
                            ) || "0"
                          : "\u00A0"}
                      </td>
                    </tr>
                  );
                }
              })}
              {expensePayments?.length > 0 && (
                <tr>
                  <td className="px-2 py-2 border"> NA</td>
                  <td className="px-2 py-2 border"></td>
                  <td className="px-2 py-2 border"></td>
                  <td className="px-2 py-2 border"></td>
                </tr>
              )}
            </tbody>
          </table>
          {/* euu2 */}
          {/* Total Annual Salary and Deduction */}
          <div>
            <table className="w-full border border-collapse">
              <thead>
                <tr className="">
                  <th className="py-2 mx-2  border">
                    {/* Total Gross Annual Salary: */}
                    Total Gross Salary :
                    {/* {salary?.totalIncome
                      ? Math.round(
                          salary?.totalIncome *
                            monthsFromAprilToCurrent
                        ) // Multiply by months passed
                      : ""} */}
                  </th>

                  <th className="py-2 border">
                    {salary?.totalIncome
                      ? Math.round(
                          salary?.totalIncome *
                            submittedSalaries?.length
                        ) // Multiply by months passed
                      : ""}
                  </th>
                  

                  <span></span>
                  <th className="py-2 mx-2  border">
                    {/* Total Annual Deduction: */}
                    Total Deduction:
                  </th>
                  <th className="py-2 border">
                    {salary?.totalDeduction
                      ? deductionValues.reduce((a, i) => {
                          return i.name !== "Loan Deduction"
                            ? (a +=
                                Number(i.value) *
                                submittedSalaries?.length)
                            : (a += 0);
                        }, 0)
                      : ""}
                  </th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>

          {/* Total Annual Net Salary */}
          <div>
            <table className="w-full mt-10 border">
              <thead>
                <tr className="bg-blue-200">
                  <th className="px-2 py-2">
                    Total Annual Net Salary
                  </th>
                  <th></th>
                  {/* sat  */}
                  {/* <th className="px-2 py-2">
                    {salary?.totalNetSalary
                      ? Math.round(
                          salary?.totalNetSalary * monthsForAnnual
                        ) 
                      : ""}
                  </th> */}
                  
                   <th className="px-2 py-2">
                      {submittedSalaries ? Math.round(annualTotals.net) : ""}
                  
                    </th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </table>
</div>
</div>