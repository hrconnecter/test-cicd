import useEmpQuery from "./useEmpQuery";

const useEmpOption = (organisationId) => {
  console.log("useEMpOption", organisationId);
  const {
    DepartmentListCall,
    DesignationCall,
    SalaryTempCall,
    EmpTypesCall,
    ManagerListCall,
    ShiftCall,
    CostNumberCall,
    EmpRoleListCall,
    LocationListCall,
    EmpCodeCall,
    OnBoardManagerListCall,
    GetHrListCall,
    GetExpenseApproversCall,
  } = useEmpQuery(organisationId);

  const DepartmentList = DepartmentListCall();
  const ManagerList = ManagerListCall();
  const onBoardManagerList = OnBoardManagerListCall();
  const empCode = EmpCodeCall();
  const empRolesList = EmpRoleListCall();
  const shiftList = ShiftCall();
  const costNumber = CostNumberCall();
  const locationList = LocationListCall();
  const SalaryTemp = SalaryTempCall();
  const DesignationList = DesignationCall();
  const empTypes = EmpTypesCall();
  const getHr = GetHrListCall();
  console.log("getHr", getHr);

  const expenseApproverList = GetExpenseApproversCall();

  const Departmentoptions = DepartmentList?.departments?.map((item) => {
    return {
      value: item?._id,
      label: item?.departmentName,
    };
  });
  console.log("department list", DepartmentList);
  console.log("department opeion", Departmentoptions);

  const Manageroptions = ManagerList?.manager?.map((item) => {
    return {
      value: item?._id,
      label: `${item?.managerId?.first_name} ${item?.managerId?.last_name}`,
    };
  });

  const HrOptions = getHr?.employees?.map((item) => {
    return {
      value: item?._id,
      label: `${item?.first_name} ${item?.last_name}`,
    };
  });

  const onBoardManageroptions = onBoardManagerList?.manager?.map((item) => {
    return {
      value: item?._id,
      label: `${item?.first_name} ${item?.last_name}`,
    };
  });

  console.log(onBoardManagerList?.manager, "onboard");
  console.log(`🚀 ~ onBoardManageroptions:`, onBoardManageroptions);

  const EmpCodeoptions = empCode?.EmpCodeoptions?.map((item) => {
    return {
      value: item?._id,
      label: item?.getEmployeeCode,
    };
  });

  const RolesOptions =
    empRolesList?.roles &&
    Object.entries(empRolesList?.roles)
      .filter(([key, other], index) => other?.isActive)
      .map(([key, other], index) => {
        return {
          value: key,
          label: key,
        };
      });

  const Shiftoptions = shiftList?.shifts?.map((item) => {
    return {
      value: item?._id,
      label: item?.shiftName,
    };
  });

  const cosnotoptions = costNumber?.data?.departments?.map((item) => {
    return {
      value: item?._id,
      label: item?.dept_cost_center_id,
    };
  });

  const locationoption = locationList?.locationsData?.map((item) => {
    return {
      value: item?._id,
      label: item?.city,
    };
  });

  const salaryTemplateoption = SalaryTemp?.salaryTemplates?.map((item) => {
    return {
      value: item?._id,
      label: item?.name,
    };
  });

  const empTypesoption = empTypes?.empTypes?.map((item) => {
    return {
      value: item?._id,
      label: item?.title,
    };
  });

  const Designationoption = DesignationList?.designations?.map((item) => {
    return {
      value: item?._id,
      label: item?.designationName,
    };
  });

  // const ExpenseApproverOptions = expenseApproverList?.approvers?.map((item) => {

  //   return {
  //     value: item?._id,
  //     // label: `${item?.first_name} ${item?.last_name}`,
  //      label: `${item.first_name} ${item.last_name} (${item.profile.join(", ")})`
  //     //  label: `${item.profile})`
  //   };
  // });
  //above v2
  const ExpenseApproverOptions = expenseApproverList?.approvers?.map((item) => {
    return {
      value: item._id,
      label: `${item.first_name} ${item.last_name} (${item.profile
        .filter((role) =>
          [
            "Super-Admin",
            "Delegate-Super-Admin",
            "Department-Head",
            "Delegate-Department-Head",
            "HR",
            "Manager",
          ].includes(role)
        )
        .join(", ")})`,
    };
  });

  //pre
  // const ExpenseApproverOptions = expenseApproverList?.map((item) => {
  //   // Check if the user has any of the required roles
  //   const isApprover = item.profile.some(role =>
  //     ["Super-Admin", "Delegate-Super-Admin", "HR", "Manager", "Department-Head"].includes(role)
  //   );

  //   if (isApprover) {
  //     return {
  //       value: item._id,
  //       label: `${item.first_name} ${item.last_name} (${item.profile.join(", ")})`
  //     };
  //   }
  // }).filter(Boolean);

  // const ExpenseApproverOptions = expenseApproverList?.map((item) => {
  //   // Check if the user has any of the required roles
  //   const isApprover = item.profile.some(role =>
  //     ["Super-Admin", "Delegate-Super-Admin", "HR", "Manager", "Department-Head"].includes(role)
  //   );

  //   if (isApprover) {
  //     return {
  //       value: item._id,
  //       label: `${item.first_name} ${item.last_name} (${item.profile.join(", ")})`
  //     };
  //   }
  // }).filter(Boolean); // Remove undefined values

  return {
    Departmentoptions,
    Manageroptions,
    onBoardManageroptions,
    EmpCodeoptions,
    RolesOptions,
    Shiftoptions,
    cosnotoptions,
    locationoption,
    salaryTemplateoption,
    empTypesoption,
    Designationoption,
    HrOptions,
    ExpenseApproverOptions,
  };
};

export default useEmpOption;
