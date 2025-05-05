import { zodResolver } from "@hookform/resolvers/zod";
import {
  CropFree,
  FactoryOutlined,
  Inventory,
  Numbers,
  RecyclingRounded,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import moment from "moment";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TestContext } from "../../../../State/Function/Main";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
import ReusableModal from "../../../../components/Modal/component";
import { packagesArray } from "../../../AddOrganisation/components/data";
import useManageSubscriptionMutation from "./subscription-mutaiton";

const RenewPackage = ({ handleClose, open, organisation }) => {

  const [amount, setAmount] = React.useState(0);
  const { verifyPromoCodeMutation, renewMutate } =
    useManageSubscriptionMutation();
  const { handleAlert } = useContext(TestContext);

  const packageSchema = z.object({
    memberCount: z
      .string()
      .min(0)
      .refine((value) => {
        value = value.replace(/\s/g, "");
        return value.length > 0 && !isNaN(Number(value)) && Number(value) >= 0;
      }, { message: "Employee to add should be greater than 0" }),
  
    packageInfo: z.object({
      value: z.string(),
      label: z.string(),
      isDisabled: z.boolean().optional(),
    }),
    promoCode: z.string().optional(),
    paymentType: z.enum(["Phone_Pay", "RazorPay"]),
    discount: z.number().optional(),
    cycleCount: z.string().refine((doc) => Number(doc) > 0, {
      message: "Cycle Count should be greater than 0",
    }),
    packages: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  
    studentCount: z
      .string()
      .optional()
      .refine((val) => {
        const selectedPackages = watch("packages") || []; // Fix here
        return !selectedPackages.some(pkg => pkg.value === "Fullskape") || (val && Number(val) > 0);
      }, {
        message: "Student Count is required and must be greater than 0 for Fullskape.",
      }),
  });
  

  const { control, formState, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      memberCount: `${organisation?.memberCount}`,
      packageInfo: {
        value: organisation?.packageInfo,
        label: organisation?.packageInfo,
      },
      paymentType: undefined,
      discount: 0,
      cycleCount: `${organisation?.cycleCount}`,
      packages: organisation?.packages?.map((pkg) => ({
        value: pkg,
        label: pkg,
      })) || [],
      studentCount : `${organisation?.studentCount}`
    },
    resolver: zodResolver(packageSchema),
  });
  
  const packageInfo = watch("packageInfo").value;
  const employeeToAdd = Number(watch("memberCount"));
  const paymentType = watch("paymentType");
  const promoCode = watch("discount");
  const cycleCount = Number(watch("cycleCount"));
  const studentCount = Number(watch("studentCount"));

  useEffect(() => {
    const selectedPackages = watch("packages") || [];
  
    // Calculate the total price from packages that are not "Fullskape"
    const nonFullskapePackagesPrice = packagesArray
      .filter(item =>
        selectedPackages.some(pkg => item?.value === pkg.value) &&
        item.value !== "Fullskape" // exclude "Fullskape" from this sum
      )
      .reduce((acc, item) => acc + item.price, 0);
  
    // Determine if "Fullskape" is selected
    const isFullskapeSelected = selectedPackages.some(pkg => pkg.value === "Fullskape");
  
    // Calculate fullskape price per student based on studentCount
    let fullskapePricePerStudent = 0;
    if (studentCount <= 25) {
      fullskapePricePerStudent = 16;
    } else if (studentCount >= 26 && studentCount <= 199) {
      fullskapePricePerStudent = 14;
    } else if (studentCount >= 200) {
      fullskapePricePerStudent = 12;
    }
  
    // Calculate perDayValue based on packageInfo pricing
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
      if (employeeToAdd <= 25) {
        perDayValue = 16;
      } else if (employeeToAdd >= 51 && employeeToAdd <= 199) {
        perDayValue = 14;
      } else if (employeeToAdd >= 200) {
        perDayValue = 12;
      }
    } else {
      // For Enterprise Plan or any other plan
      perDayValue = 115;
    }
  
    // Calculate the base price:
    // For employees, add the cost from package info pricing (perDayValue)
    // and the cost of selected packages (nonFullskapePackagesPrice).
    // For students (if "Fullskape" is selected), use the fullskape pricing.
    const baseEmployeePrice = employeeToAdd * (nonFullskapePackagesPrice + perDayValue);
    const baseStudentPrice = isFullskapeSelected ? (studentCount * fullskapePricePerStudent) : 0;
    let basePrice = (baseEmployeePrice + baseStudentPrice) * (cycleCount * 3);
  
    // Calculate GST (18% of base price)
    
  
    // Calculate discount (promoCode is taken as a discount percentage)
    const discountAmount = basePrice * (promoCode / 100);
    basePrice -= discountAmount;

    const gst = basePrice * 0.18;
    // Additional 2% charge if the payment type is RazorPay
    const addedAmountIfRazorPay = (basePrice + gst) * (paymentType === "RazorPay" ? 0.02 : 0);

    // Final amount calculation (rounded to 2 decimals)
    const finalAmount = Math.round((basePrice + gst + addedAmountIfRazorPay ) * 100) / 100;

    console.log("Detailed Pricing:", {
      nonFullskapePackagesPrice,
      perDayValue,
      fullskapePricePerStudent,
      baseEmployeePrice,
      baseStudentPrice,
      basePrice,
      gst,
      discountAmount,
      addedAmountIfRazorPay,
      finalAmount
    });
  
    setAmount(finalAmount);
  }, [employeeToAdd, promoCode, paymentType, cycleCount, watch, studentCount, packageInfo]);
  
  const { errors } = formState;

  async function onSubmit(data) {

    const upComingDate = new Date(
      organisation?.upcomingPackageInfo?.packageName
    );
    const currentDate = new Date();
    if (
      organisation?.upcomingPackageInfo?.packageName &&
      upComingDate > currentDate
    ) {
      console.log("testing it", organisation?.upcomingPackageInfo);
      // You already have a package waiting to be activated from January 06, 2024 to January 06, 2024. Please wait for it to happen.
      // January 06
      // moment(organisation?.upcomingPackageInfo?.endDate).format("")
      handleAlert(
        true,
        "warning",
        `You already have a package waiting to be activated from ${moment(
          organisation?.upcomingPackageInfo?.startDate
        ).format("MMMM DD, YYYY")} to ${moment(
          organisation?.upcomingPackageInfo?.endDate
        ).format("MMMM DD, YYYY")} please wait for it to be activated.`
      );
    } else {
      let packageStartDate = moment(
        organisation?.subscriptionDetails?.expirationDate
      );

      // let packageEndDate = moment().add(3, "months");
      const selectedPackages = data?.packages?.map((pkg) => pkg.value) || [];


      renewMutate({
        memberCount: data?.memberCount,
        packageName: data?.packageInfo?.value,
        totalPrice: amount,
        packages: selectedPackages,
        paymentType: data?.paymentType,
        organisationId: organisation?._id,
        packageStartDate,
        cycleCount: data?.cycleCount,
        studentCount: data?.studentCount,
        // packageEndDate,
      });
    }
  }

  const filteredPackages = packagesArray.filter((pkg) => {
    // Check if the package includes the selected plan
    if (pkg.package) {
      return pkg.package.includes(packageInfo);
    }
    return true; // Include packages without a `package` property 
  });

  return (
    <ReusableModal
      heading={"Renew Subscription"}
      open={open}
      onClose={handleClose}
    >
     <form
        onSubmit={handleSubmit(onSubmit)}
        className="h-full flex flex-col"
      >
        {/* Scrollable content */}
        <div className="flex flex-col gap-4 max-h-[450px] overflow-auto h-auto">
          <AuthInputFiled
            name="memberCount"
            icon={Numbers}
            control={control}
            type="number"
            placeholder="Employee Count"
            label="Employee Count*"
            errors={errors}
            error={errors.memberCount}
            descriptionText={"Employee count you want to add in your package"}
            readOnly={true}
          />
        {((organisation?.packages && organisation.packages.includes("Fullskape")) ||  ["Fullskape Plan"].includes(packageInfo) )&& (
          <AuthInputFiled
            name="studentCount"
            icon={Numbers}
            control={control}
            type="number"
            placeholder="Student Count"
            label="Student Count*"
            errors={errors}
            error={errors.studentCount}
            descriptionText={"Student count you want to add in your package"}
            readOnly={true}
          />
        )}
          <AuthInputFiled
            name="packageInfo"
            icon={Inventory}
            control={control}
            type="select"
            placeholder="Package Name "
            label="Package Name *"
            errors={errors}
            error={errors.packageInfo}
            readOnly={true}
            options={[
              { value: "Enterprise Plan", label: "Enterprise Plan" },
              { value: "Intermediate Plan", label: "Intermediate Plan" },
              { value: "Basic Plan", label: "Basic Plan" },
              { value: "Fullskape Plan", label: "Fullskape Plan" },
            ]}
            descriptionText={"Select the package you want to subscribe"}
          />
          
          {["Enterprise Plan", "Basic Plan", "Essential Plan", "Intermediate Plan", "Fullskape Plan"].includes(packageInfo) && (
            <AuthInputFiled
              name="packages"
              icon={FactoryOutlined}
              control={control}
              type="select"
              isMulti={true}
              options={filteredPackages}
              placeholder="Ex: Remote Task"
              label="Select Package Addition "
              errors={errors}
              error={errors.packages}
              readOnly={true}
            />
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
            control={control}
            type="selectItem"
            placeholder="Select your Merchant"
            label="Payment Gateway *"
            errors={errors}
            error={errors.paymentType}
            options={[
              { value: "Phone_Pay", label: "Phone_Pay" },
              { value: "RazorPay", label: "RazorPay" }]}
            descriptionText={"Additional 2% charges on every transaction"}
          />

          <AuthInputFiled
            name="promoCode"
            icon={CropFree}
            control={control}
            type="input-action"
            placeholder="#summer2021"
            label="Promo Code"
            errors={errors}
            readOnly={watch("discount") > 0}
            error={errors.promoCode}
            descriptionText={
              watch("discount") ? `You will get ${watch("discount")}% discount on your total amount.` : ""
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

        {/* Fixed bottom button */}
        <div className="sticky bottom-0 bg-white shadow-md p-4">
          <Button variant="contained" type="submit" className="!w-full normal-case" style={{ textTransform: "none" }}>
            PAY Rs. {amount}
            {/* PAY */}
          </Button>
        </div>
      </form>

    </ReusableModal>
  );
};

export default RenewPackage;
