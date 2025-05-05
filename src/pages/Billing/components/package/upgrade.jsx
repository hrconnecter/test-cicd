// import { zodResolver } from "@hookform/resolvers/zod";
// import { FactoryOutlined, Numbers, RecyclingRounded, } from "@mui/icons-material";
// import { Button } from "@mui/material";
// import moment from "moment";
// import React, { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
// import ReusableModal from "../../../../components/Modal/component";
// import { packagesArray } from "../../../AddOrganisation/components/data";
// import useManageSubscriptionMutation from "./subscription-mutaiton";

// const UpgradePackage = ({ handleClose, open, organisation }) => {
//   const [amount, setAmount] = React.useState(0);
//   const { verifyPromoCodeMutation, mutate } = useManageSubscriptionMutation();

//   const packageSchema = z.object({
//     employeeToAdd: z
//       .string()
//       .min(0)
//       .refine(
//         (value) => {
//           // spaces not aloud
//           value = value.replace(/\s/g, "");
//           // check if value is not empty
//           return (
//             value.length > 0 && !isNaN(Number(value)) && Number(value) >= 0
//           );
//         },
//         { message: "Employee to add should be a greater than 0" }
//       ),
//     studentCount: z
//       .string()
//       .optional()
//       .refine(
//         (val) => !selectedPackages.includes("Fullskape") || (val && Number(val) > 0),
//         {
//           message: "Student Count is required and must be greater than 0 for Fullskape.",
//         }
//     ),

//     packageInfo: z.object({
//       value: z.string(),
//       label: z.string(),
//       isDisabled: z.boolean().optional(),
//     }),
//     promoCode: z.string().optional(),
//     paymentType: z.enum(["Phone_Pay", "RazorPay"]),
//     discount: z.number().optional(),
//     packages: z
//       .array(z.object({ value: z.string(), label: z.string() }))
//       .optional(),
//     cycleCount: z.string().refine((doc) => Number(doc) > 0, {
//       message: "Cycle Count is greater than 0",
//     }),
//   });

//   const { control, formState, handleSubmit, watch, setValue } = useForm({
    
//     defaultValues: {
//       employeeToAdd: 0,
//       packageInfo: {
//         value: organisation?.packageInfo,
//         label: organisation?.packageInfo,
//         isDisabled: false,
//       },
//       paymentType: undefined,
//       discount: 0,
//       cycleCount: `${organisation?.cycleCount}`,
//       packages: organisation?.packages?.map((pkg) => ({
//         value: pkg,
//         label: pkg,
//       })) || [],
//       studentCount: 0,
//     },
//     resolver: zodResolver(packageSchema),
//   });

//   const { errors } = formState;

//   async function onSubmit(data) {

//     const selectedPackages = data?.packages?.map((pkg) => pkg.value) || [];

//     mutate({
//       count: data?.employeeToAdd,
//       packageName: data?.packageInfo?.value,
//       packages: selectedPackages,
//       totalPrice: amount,
//       paymentType: data?.paymentType,
//       organisationId: organisation?._id,
//       cycleCount: data?.cycleCount,
//       studentCount: data?.studentCount,
//     });
//   }

//   const packageInfo = watch("packageInfo").value;
//   const employeeToAdd = Number(watch("employeeToAdd"));
//   const expirationDate = organisation?.subscriptionDetails?.expirationDate;
//   const paymentType = watch("paymentType");
//   const cycleCount = organisation?.cycleCount;

//   const promoCode = watch("discount");

//   useEffect(() => {
//     let perDayValue = 0;

//     const packages = watch("packages") || [] ;
//     const getPackagesPrice = packagesArray
//     .filter((item) =>
//      Array.isArray(packages)&& packages.find((pkg) => item?.value === pkg.value)
//     )
//     .reduce((acc, item) => acc + item.price, 0);
//     console.log("wuuu",watch("packages"));

//     console.log(`🚀 ~ getPackagesPrice:`, getPackagesPrice);

//     let remainingDays = Math.max(0, moment(expirationDate).diff(moment(), "days"));
//     console.log("remaining", remainingDays);

//     const currentEmployeeCount = organisation?.memberCount || 0;
//     console.log("currentEmployeeCount", currentEmployeeCount);

//     const isPackageChanged = packageInfo !== organisation?.packageInfo;
//     const effectiveEmployeeCount = isPackageChanged ? currentEmployeeCount + employeeToAdd : employeeToAdd + currentEmployeeCount;
//     console.log("effectiveEmployeeCount", effectiveEmployeeCount);

//     if (packageInfo === "Basic Plan") {
//       perDayValue = 55;
//     } else if (packageInfo === "Intermediate Plan") {
//       perDayValue = 85;
//     } else if (packageInfo === "Essential Plan") {
//       perDayValue = 30;
//     } else if (packageInfo === "Fullskape Plan") {
//       if (effectiveEmployeeCount <= 25) {
//         perDayValue = 16;
//       } else if (effectiveEmployeeCount >= 51 && effectiveEmployeeCount <= 199) {
//         perDayValue = 14;
//       } else if (effectiveEmployeeCount >= 200) {
//         perDayValue = 12;
//       }
//     } else {
//       perDayValue = 115;
//     }

//     // Calculate base package amount for the existing plan
//     let basePackagePerDayValue = 0;

//     if (organisation?.packageInfo === "Basic Plan") {
//       basePackagePerDayValue = 55;
//     } else if (organisation?.packageInfo === "Intermediate Plan") {
//       basePackagePerDayValue = 85;
//     } else if (organisation?.packageInfo === "Essential Plan") {
//       basePackagePerDayValue = 30;
//     } else if (organisation?.packageInfo === "Fullskape Plan") {
//       if (currentEmployeeCount <= 25) {
//         basePackagePerDayValue = 16;
//       } else if (currentEmployeeCount >= 51 && currentEmployeeCount <= 199) {
//         basePackagePerDayValue = 14;
//       } else if (currentEmployeeCount >= 200) {
//         basePackagePerDayValue = 12;
//       }
//     } else {
//       basePackagePerDayValue = 115;
//     }

//     const basepackageamount =
//       (basePackagePerDayValue / 30) * remainingDays * currentEmployeeCount;
//     console.log("basepackageamount", basepackageamount);

//     // Apply discount if promo code is valid
//     const discountedToMinus =
//       perDayValue * effectiveEmployeeCount * remainingDays * (promoCode / 100);
//     console.log("perDayValue", perDayValue);
//     // let basepackageamount = (perDayValue / 30) * remainingDays * effectiveEmployeeCount;
//     // console.log("basepackageamount", basepackageamount);
//     perDayValue = isPackageChanged ? perDayValue : perDayValue / 30; // Convert to per-day rate
//     // console.log("perDayValue", perDayValue);
//     let baseprice = 0;

//     baseprice = isPackageChanged ? (perDayValue * effectiveEmployeeCount * (cycleCount * 3)) - basepackageamount + (getPackagesPrice * effectiveEmployeeCount * (cycleCount * 3)) : (perDayValue * employeeToAdd * remainingDays) + ((getPackagesPrice / 30) * remainingDays * effectiveEmployeeCount);

//     console.log("baseprice", ((getPackagesPrice / 30) * remainingDays * effectiveEmployeeCount));


//     const gst = baseprice * 0.18;

//     const addedAmountIfRazorPay =
//       (baseprice + gst) * (paymentType === "RazorPay" ? 0.02 : 0);


//     setAmount(
//       Math.round(
//         baseprice + gst - discountedToMinus + addedAmountIfRazorPay
//       )
//     );

//     // Ensure no cleanup function is returned
//   }, [
//     employeeToAdd,
//     // eslint-disable-next-line   
//     watch("packages"),
//     watch,
//     packageInfo,
//     expirationDate,
//     promoCode,
//     paymentType,
//     cycleCount,
//     organisation,
//   ]);


//   const filteredPackages = packagesArray?.filter((pkg) => {
//     // Check if the package includes the selected plan
//     if (pkg.package) {
//       return pkg.package.includes(packageInfo);
//     }
//     return []; // Include packages without a `package` property
//   });

//   const selectedPackages = watch("packages")?.map((pkg) => pkg.value) || [];


//   return (
//     <ReusableModal
//       heading={"Upgrade Subscription"}
//       open={open}
//       onClose={handleClose}
//     >
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="h-full flex flex-col"
//       >
//         <div className="fflex flex-col gap-4 max-h-[450px] overflow-auto h-auto">
//           <AuthInputFiled
//             name="employeeToAdd"
//             icon={Numbers}
//             control={control}
//             type="number"
//             placeholder="Employee To Add "
//             label="Employee To Add *"
//             errors={errors}
//             error={errors.employeeToAdd}
//             descriptionText={`Current employee count is ${organisation?.memberCount}. Add the number of new employees.`}

//           />
//           <AuthInputFiled
//             name="packageInfo"
//             icon={Numbers}
//             control={control}
//             type="select"
//             placeholder="Package Name "
//             label="Package Name *"
//             errors={errors}
//             error={errors.packageInfo}
//             options={[
//               { value: "Enterprise Plan", label: "Enterprise Plan" },
//               { value: "Intermediate Plan", label: "Intermediate Plan" },
//               {
//                 value: "Basic Plan",
//                 label: "Basic Plan",
//                 isDisabled:
//                   organisation?.packageInfo === "Intermediate Plan"
//                     ? true
//                     : false,
//               },
//               { value: "Fullskape Plan", label: "Fullskape Plan" }
//             ]}
//             descriptionText={"Select your package to upgrade"}
//           />

//           {["Enterprise Plan", "Basic Plan", "Essential Plan", "Intermediate Plan"].includes(packageInfo) && (
//             <AuthInputFiled
//               name="packages"
//               icon={FactoryOutlined}
//               control={control}
//               type="select"
//               isMulti={true}
//               options={filteredPackages}
//               placeholder="Ex: Remote Task"
//               label="Select Package Addition "
//               errors={errors}
//               error={errors.packages}
//             />
//           )}
          
//            {selectedPackages.includes("Fullskape") && (
//           <div className="my-4">
//             <AuthInputFiled
//               name="studentCount"
//               icon={FactoryOutlined}
//               control={control}
//               type="number"
//               placeholder="Enter Student Count"
//               label="Student Count *"
//               errors={errors}
//               error={errors.studentCount}
//               descriptionText={
//                 "Enter the number of students if you have selected the Fullskape package."
//               }
//             />
//           </div>
//         )}
//           <AuthInputFiled
//             name="cycleCount"
//             icon={RecyclingRounded}
//             control={control}
//             type="number"
//             placeholder="Cycle count used for recycle your subscription"
//             label="Cycle Count *"
//             errors={errors}
//             error={errors.cycleCount}
//             descriptionText={
//               "Selecting 2 means you'll be charged once for a 6-month subscription, covering two 3-month cycles."
//             }
//           />

//           <AuthInputFiled
//             name="paymentType"
//             icon={FactoryOutlined}
//             className={"mb-4"}
//             control={control}
//             type="selectItem"
//             placeholder="Select your Merchant"
//             label="Payment Gateway *"
//             errors={errors}
//             error={errors.paymentType}
//             options={[
//               // { value: "Phone_Pay", label: "Phone_Pay" },
//               { value: "RazorPay", label: "RazorPay" },
//             ]}
//             descriptionText={"Additional 2% charges on every transaction"}
//           />

//           <AuthInputFiled
//             name="promoCode"
//             icon={Numbers}
//             control={control}
//             type="input-action"
//             placeholder="#summer2021"
//             label="Promo Code"
//             errors={errors}
//             readOnly={watch("discount") > 0}
//             error={errors.promoCode}
//             descriptionText={
//               watch("discount")
//                 ? `You will get ${watch(
//                   "discount"
//                 )}% discount on your total amount.`
//                 : ""
//             }
//             onInputActionClick={(value) => {
//               verifyPromoCodeMutation({ promoCode: value, setValue });
//             }}
//             onInputActionClear={() => {
//               setValue("discount", 0);
//               setValue("promoCode", "");
//             }}
//           />
//         </div>
//         <div className="gap-4 flex w-full">
//           <Button
//             variant="contained"
//             disabled={amount === 0}
//             type="submit"
//             className="!w-full"
//           >
//             Pay {amount} Rs
//             {/* Pay */}
//           </Button>
//         </div>
//       </form>
//     </ReusableModal>
//   );
// };

// export default UpgradePackage;

import { zodResolver } from "@hookform/resolvers/zod";
import { FactoryOutlined, Numbers, RecyclingRounded } from "@mui/icons-material";
import { Button } from "@mui/material";
import moment from "moment";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
import ReusableModal from "../../../../components/Modal/component";
import { packagesArray } from "../../../AddOrganisation/components/data";
import useManageSubscriptionMutation from "./subscription-mutaiton";

const UpgradePackage = ({ handleClose, open, organisation }) => {
  const [amount, setAmount] = React.useState(0);
  const { verifyPromoCodeMutation, mutate } = useManageSubscriptionMutation();

  const packageSchema = z.object({
    employeeToAdd: z
      .string()
      .min(0)
      .refine(
        (value) => {
          // spaces not allowed
          value = value.replace(/\s/g, "");
          // check if value is not empty
          return (
            value.length > 0 && !isNaN(Number(value)) && Number(value) >= 0
          );
        },
        { message: "Employee to add should be a greater than 0" }
      ),
    studentCount: z
      .string()
      .optional()
      .refine(
        (val) =>
          !selectedPackages.includes("Fullskape") || (val && Number(val) > 0),
        {
          message:
            "Student Count is required and must be greater than 0 for Fullskape.",
        }
      ),
    packageInfo: z.object({
      value: z.string(),
      label: z.string(),
      isDisabled: z.boolean().optional(),
    }),
    promoCode: z.string().optional(),
    paymentType: z.enum(["Phone_Pay", "RazorPay"]),
    discount: z.number().optional(),
    packages: z
      .array(z.object({ value: z.string(), label: z.string(), isDisabled: z.boolean().optional() }))
      .optional(),
    cycleCount: z.string().refine((doc) => Number(doc) > 0, {
      message: "Cycle Count is greater than 0",
    }),
  });

  const { control, formState, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      employeeToAdd: "0",
      packageInfo: {
        value: organisation?.packageInfo,
        label: organisation?.packageInfo,
        isDisabled: false,
      },
      paymentType: undefined,
      discount: 0,
      cycleCount: `${organisation?.cycleCount}`,
      // Mark already‐subscribed packages as disabled so that they cannot be removed.
      packages: [],
      studentCount: "",
    },
    resolver: zodResolver(packageSchema),
  });

  const { errors } = formState;
  console.log("eroorors", errors);
  async function onSubmit(data) {
    console.log("dataaa", data);
    const selectedPackages = data?.packages?.map((pkg) => pkg.value) || [];

    mutate({
      count: data?.employeeToAdd,
      packageName: data?.packageInfo?.value,
      packages: selectedPackages,
      totalPrice: amount,
      paymentType: data?.paymentType,
      organisationId: organisation?._id,
      cycleCount: data?.cycleCount,
      studentCount: data?.studentCount,
    });
  }

  const packageInfo = watch("packageInfo").value;
  const employeeToAdd = Number(watch("employeeToAdd"));
  const expirationDate = organisation?.subscriptionDetails?.expirationDate;
  const paymentType = watch("paymentType");
  const cycleCount = Number(watch("cycleCount"));
  const promoCode = watch("discount");
  const studentCountInput = Number(watch("studentCount"));

  // Get the current selected additional packages from the form.
  const selectedPackages = (watch("packages") || []).map((pkg) => pkg.value);

  // Filter packages based on the currently selected packageInfo.
  // Also, mark options as disabled if they are already part of the organisation.
  // Filter packages based on the currently selected packageInfo.
// Also, mark options as disabled if they are already part of the organisation,
// and update the label to indicate that the package is already added.
    const filteredPackages = packagesArray
    ?.filter((pkg) => {
      if (pkg.package) {
        return pkg.package.includes(packageInfo);
      }
      return false;
    })
    .map((pkg) => {
      if (organisation?.packages && organisation.packages.includes(pkg.value)) {
        return { 
          ...pkg, 
          isDisabled: true,
          label: `${pkg.label} (Existing)` // Appending a note to the label
        };
      }
      return pkg;
    });


  /*
   * Pricing Calculation:
   *
   * The upgrade amount is calculated only if any upgrade fields have been provided.
   * Allowed upgrade fields are: packageInfo, employeeToAdd, studentCount (if Fullskape is selected), cycleCount, and payment gateway.
   *
   * We separate out the calculation into:
   *   1. Base cost from upgrading package and/or adding employees.
   *   2. Additional packages cost:
   *         - For packages other than "Fullskape", use their price multiplied by effective employee count.
   *         - For "Fullskape", calculate based on student count.
   *   3. Finally, add GST and, if applicable, RazorPay additional charges.
   */
  useEffect(() => {
    // Do not calculate if no upgrade input is provided
    if (
      employeeToAdd === 0 &&
      selectedPackages.length === 0 &&
      studentCountInput === 0 &&
      packageInfo === organisation?.packageInfo
    ) {
      setAmount(0);
      return;
    }
  
    // Calculate subscription duration in months (each cycle is 3 months)
    const subscriptionDuration = cycleCount * 3;
  
    // Calculate remaining days for current subscription period.
    let remainingDays = Math.max(0, moment(expirationDate).diff(moment(), "days"));
  
    // Calculate effective employee count:
    // Whether package changed or not, new employees are added to the current count.
    const currentEmployeeCount = organisation?.memberCount || 0;
    const isPackageChanged = packageInfo !== organisation?.packageInfo;
    const effectiveEmployeeCount = currentEmployeeCount + employeeToAdd;
  
    // Determine per-day value for the selected packageInfo.
    let perDayValue = 0;
    if (packageInfo === "Basic Plan") {
      perDayValue = 55;
    } else if (packageInfo === "Intermediate Plan") {
      perDayValue = 85;
    } else if (packageInfo === "Essential Plan") {
      perDayValue = 25;
    } else if (packageInfo === "Enterprise Plan") {
      perDayValue = 85;
    } else if (packageInfo === "Fullskape Plan") {
      // For Fullskape plan base pricing, use employee count thresholds.
      if (effectiveEmployeeCount <= 25) {
        perDayValue = 16;
      } else if (effectiveEmployeeCount >= 51 && effectiveEmployeeCount <= 199) {
        perDayValue = 14;
      } else if (effectiveEmployeeCount >= 200) {
        perDayValue = 12;
      }
    } else {
      perDayValue = 115;
    }
  
    // Calculate the base package amount for the existing plan.
    let basePackagePerDayValue = 0;
    if (organisation?.packageInfo === "Basic Plan") {
      basePackagePerDayValue = 55;
    } else if (organisation?.packageInfo === "Intermediate Plan") {
      basePackagePerDayValue = 85;
    } else if (organisation?.packageInfo === "Essential Plan") {
      basePackagePerDayValue = 25;
    } else if (organisation?.packageInfo === "Enterprise Plan") {
      basePackagePerDayValue = 85;
    } else if (organisation?.packageInfo === "Fullskape Plan") {
      if (currentEmployeeCount <= 25) {
        basePackagePerDayValue = 16;
      } else if (currentEmployeeCount >= 51 && currentEmployeeCount <= 199) {
        basePackagePerDayValue = 14;
      } else if (currentEmployeeCount >= 200) {
        basePackagePerDayValue = 12;
      }
    } else {
      basePackagePerDayValue = 115;
    }
    const basepackageamount =
      (basePackagePerDayValue / 30) * remainingDays * currentEmployeeCount;
  
    let basePrice = 0;
  
    /* --- NEW LOGIC: Adding employees with no package change --- */
    if (!isPackageChanged && employeeToAdd > 0) {
      // 1. Compute the total pricing from non-Fullskape packages that the organisation already has...
      let existingNonFullskapeCost = 0;
      if (organisation?.packages) {
        organisation.packages.forEach((pkg) => {
          if (pkg !== "Fullskape") {
            const pkgData = packagesArray.find((item) => item.value === pkg);
            if (pkgData) {
              existingNonFullskapeCost += pkgData.price;
            }
          }
        });
      }
      // 2. ...and from any new non-Fullskape packages selected now.
      let newNonFullskapeCost = 0;
      selectedPackages.forEach((pkg) => {
        if (pkg !== "Fullskape") {
          const pkgData = packagesArray.find((item) => item.value === pkg);
          if (pkgData) {
            newNonFullskapeCost += pkgData.price;
          }
        }
      });
      const totalNonFullskapeCost = existingNonFullskapeCost + newNonFullskapeCost;
  
      // Add the base package per-day rate.
      const employeeRate = totalNonFullskapeCost + perDayValue;
      basePrice = employeeRate * employeeToAdd * subscriptionDuration;
  
      // Add student cost if Fullskape is already present or selected, and student count is provided.
      if (
        ((organisation?.packages && organisation.packages.includes("Fullskape")) ||
          selectedPackages.includes("Fullskape")) &&
        studentCountInput > 0
      ) {
        let fullskapePricePerStudent = 0;
        if (studentCountInput <= 25) {
          fullskapePricePerStudent = 16;
        } else if (studentCountInput >= 26 && studentCountInput <= 199) {
          fullskapePricePerStudent = 14;
        } else if (studentCountInput >= 200) {
          fullskapePricePerStudent = 12;
        }
        basePrice += studentCountInput * fullskapePricePerStudent * subscriptionDuration;
      }
    } else {
      /* --- ORIGINAL LOGIC --- */
      // (A) Cost due to package change or adding employees.
      if (isPackageChanged) {
        // For package upgrade: apply new rate on the entire effective employee count over the subscription duration,
        // then subtract the cost already paid for current employees.
        basePrice += perDayValue * effectiveEmployeeCount * subscriptionDuration - basepackageamount;
      } else {
        // For same package, if only adding employees then charge pro-rata for the new employees.
        basePrice += perDayValue * employeeToAdd * (remainingDays / 30);
      }
  
      // (B) Cost for additional packages.
      let additionalPackagesCost = 0;
      selectedPackages.forEach((pkg) => {
        if (pkg === "Fullskape") {
          // Determine price per student for Fullskape.
          let fullskapePricePerStudent = 0;
          if (studentCountInput <= 25) {
            fullskapePricePerStudent = 16;
          } else if (studentCountInput >= 26 && studentCountInput <= 199) {
            fullskapePricePerStudent = 14;
          } else if (studentCountInput >= 200) {
            fullskapePricePerStudent = 12;
          }
          additionalPackagesCost +=
            studentCountInput * fullskapePricePerStudent * subscriptionDuration;
        } else {
          const pkgData = packagesArray.find((item) => item.value === pkg);
          if (pkgData) {
            additionalPackagesCost +=
              pkgData.price * effectiveEmployeeCount * subscriptionDuration;
          }
        }
      });
      basePrice += additionalPackagesCost;
    }
  
    // (C) Apply any promo code discount.
    // The discount is based on the per-day rate, effective employees, and remaining days.
    const discountAmount =  basePrice * (promoCode / 100);

    basePrice -= discountAmount
  
    // (D) Add GST (18%) and extra 2% fee if RazorPay is selected.
    const gst = basePrice * 0.18;

    const extraPaymentFee = paymentType === "RazorPay" ? (basePrice + gst) * 0.02 : 0;
  
    const finalPrice = Math.round(basePrice + gst + extraPaymentFee);
  
    setAmount(finalPrice);
  }, [
    employeeToAdd,
    selectedPackages,
    studentCountInput,
    packageInfo,
    expirationDate,
    promoCode,
    paymentType,
    cycleCount,
    organisation,
  ]);
  

  return (
    <ReusableModal heading={"Upgrade Subscription"} open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
        <div className="flex flex-col gap-4 max-h-[450px] overflow-auto h-auto">
          <AuthInputFiled
            name="employeeToAdd"
            icon={Numbers}
            control={control}
            type="number"
            placeholder="Employee To Add"
            label="Employee To Add *"
            errors={errors}
            error={errors.employeeToAdd}
            descriptionText={`Current employee count is ${organisation?.memberCount}. Add the number of new employees.`}
          />

          <AuthInputFiled
            name="packageInfo"
            icon={Numbers}
            control={control}
            type="select"
            placeholder="Package Name"
            label="Package Name *"
            errors={errors}
            error={errors.packageInfo}
            options={[
              { value: "Enterprise Plan", label: "Enterprise Plan" },
              { value: "Intermediate Plan", label: "Intermediate Plan" },
              {
                value: "Basic Plan",
                label: "Basic Plan",
                isDisabled:
                  organisation?.packageInfo === "Intermediate Plan" ? true : false,
              },
              { value: "Fullskape Plan", label: "Fullskape Plan" },
            ]}
            descriptionText={"Select your package to upgrade"}
          />

          {["Enterprise Plan", "Basic Plan", "Essential Plan", "Intermediate Plan"].includes(packageInfo) && (
            <AuthInputFiled
              name="packages"
              icon={FactoryOutlined}
              control={control}
              type="select"
              isMulti={true}
              options={filteredPackages}
              placeholder="Ex: Remote Task"
              label="Select Package Addition"
              errors={errors}
              error={errors.packages}
            />
          )}

          {/* Only show student count input when Fullskape is either already present or is being added */}
          {(selectedPackages.includes("Fullskape") ||
            (organisation?.packages && organisation.packages.includes("Fullskape"))) && (
            <div className="my-4">
              <AuthInputFiled
                name="studentCount"
                icon={FactoryOutlined}
                control={control}
                type="number"
                placeholder="Enter Student Count"
                label="Student Count *"
                errors={errors}
                error={errors.studentCount}
                descriptionText={
                  "Enter the number of students. For Fullskape upgrades, pricing is based on the student count."
                }
              />
            </div>
          )}

          <AuthInputFiled
            name="cycleCount"
            icon={RecyclingRounded}
            control={control}
            type="number"
            placeholder="Cycle count used for recycle your subscription"
            label="Cycle Count *"
            errors={errors}
            error={errors.cycleCount}
            descriptionText={
              "Selecting 2 means you'll be charged once for a 6-month subscription, covering two 3-month cycles."
            }
          />

          <AuthInputFiled
            name="paymentType"
            icon={FactoryOutlined}
            className={"mb-4"}
            control={control}
            type="selectItem"
            placeholder="Select your Merchant"
            label="Payment Gateway *"
            errors={errors}
            error={errors.paymentType}
            options={[
              { value: "Phone_Pay", label: "Phone_Pay" },
              { value: "RazorPay", label: "RazorPay" },
            ]}
            descriptionText={"Additional 2% charges on every transaction"}
          />

          <AuthInputFiled
            name="promoCode"
            icon={Numbers}
            control={control}
            type="input-action"
            placeholder="#summer2021"
            label="Promo Code"
            errors={errors}
            readOnly={watch("discount") > 0}
            error={errors.promoCode}
            descriptionText={
              watch("discount")
                ? `You will get ${watch("discount")}% discount on your total amount.`
                : ""
            }
            onInputActionClick={(value) => {
              verifyPromoCodeMutation({ promoCode: value, setValue });
            }}
            onInputActionClear={() => {
              setValue("discount", 0);
              setValue("promoCode", "");
            }}
          />
        </div>
        <div className="gap-4 flex w-full">
          <Button variant="contained" disabled={amount === 0} type="submit" className="!w-full" style={{ textTransform: "none" }}>
            Pay Rs. {amount}
          </Button>
        </div>
      </form>
    </ReusableModal>
  );
};

export default UpgradePackage;
