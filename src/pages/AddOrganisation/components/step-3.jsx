import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calculate,
  FactoryOutlined,
  RecyclingRounded,
} from "@mui/icons-material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import useOrg from "../../../State/Org/Org";
import BasicButton from "../../../components/BasicButton";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useAuthToken from "../../../hooks/Token/useAuth";
import { packagesArray } from "./data";

const Step3 = ({ nextStep, prevStep }) => {
  // to define the state, hook and import the other function
  const {
    count,
    setStep3Data,
    cycleCount,
    paymentType,
    packageInfo,
    setVerifyToken,
    coupan,
    studentCount,
    hiringPosition,
    remoteEmpCount,
  } = useOrg();

  // use useForm
  const { control, handleSubmit, formState, watch } = useForm({
    defaultValues: {
      count,
      cycleCount,
      paymentType,
      coupan,
      studentCount,
      hiringPosition,
      remoteEmpCount,
    },
    //   resolver: zodResolver(packageCountSchema),
    // });
    resolver: zodResolver(
      z.object({
        count: z
          .number()
          .min(1, { message: "Count must be greater than 0" })
          .or(
            z
              .string()
              .regex(/^\d+$/, "Count must be a valid number")
              .transform(Number)
          ),

        cycleCount: z
          .number()
          .min(1, { message: "Cycle Count must be greater than 0" })
          .or(
            z
              .string()
              .regex(/^\d+$/, "Cycle Count must be a valid number")
              .transform(Number)
          ),

        coupan: z.string().optional(),

        paymentType: z.enum(["Phone_Pay", "RazorPay"]),

        studentCount: z
          .number()
          .min(1, { message: "Student Count must be greater than 0" })
          .or(
            z
              .string()
              .regex(/^\d+$/, "Student Count must be greater than 0")
              .transform(Number)
          )
          .optional()
          .refine(
            (val) =>
              !selectedPackages.includes("Fullskape") || (val && val > 0),
            {
              message:
                "Student Count is required and must be greater than 0 for Fullskape.",
            }
          ),

        hiringPosition: z
          .number()
          .min(1, { message: "Position Count must be greater than 0" })
          .or(
            z
              .string()
              .regex(/^\d+$/, "Position Count must be greater than 0")
              .transform(Number)
          )
          .optional()
          .refine(
            (val) => !selectedPackages.includes("hiring") || (val && val > 0),
            {
              message:
                "Position Count is required and must be greater than 0 for hiring.",
            }
          ),
        remoteEmpCount: z
          .number()
          .min(1, { message: "Remote Employee Count must be greater than 0" })
          .or(
            z
              .string()
              .regex(/^\d+$/, "Remote Employee  Count must be greater than 0")
              .transform(Number)
          )
          .optional()
          .refine(
            (val) =>
              !selectedPackages.includes("Remote Punching") || (val && val > 0),
            {
              message:
                "Remote Employee Count is required and must be greater than 0 for Remote Punching.",
            }
          ),
      })
    ),
  });

  const authToken = useAuthToken();
  const { handleAlert } = useContext(TestContext);
  const { errors } = formState;

  // State to track selected packages
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [selectedPackageEnterprise, setSelectedPackageEnterprise] =
    useState(null);

  useEffect(() => {
    const storedPackages =
      JSON.parse(localStorage.getItem("selectedPackages")) || [];
    setSelectedPackages(storedPackages);

    const storedEnterprisePackage =
      JSON.parse(localStorage.getItem("selectedPackageEnterprise")) || null;
    setSelectedPackageEnterprise(storedEnterprisePackage);
  }, []);

  const handleCheckboxChange = (value) => {
    const updatedPackages = selectedPackages.includes(value)
      ? selectedPackages.filter((pkg) => pkg !== value)
      : [...selectedPackages, value];

    setSelectedPackages(updatedPackages);
    // Update local storage
    localStorage.setItem("selectedPackages", JSON.stringify(updatedPackages));
  };

  const handleCheckboxChangeEnterprise = (entpkgValue) => {
    // Directly update selectedPackageEnterprise without modifying selectedPackages
    setSelectedPackageEnterprise(entpkgValue);
    // Update local storage for selectedPackageEnterprise
    localStorage.setItem(
      "selectedPackageEnterprise",
      JSON.stringify(entpkgValue)
    );
  };

  const handlePrevStep = () => {
    localStorage.removeItem("selectedPackages");
    localStorage.removeItem("selectedPackageEnterprise");
    prevStep();
  };

  const handleselectpackageenterprise = (entpkgValue) => {
    handleCheckboxChangeEnterprise(entpkgValue); // Update Enterprise-specific selection logic
  };

  // const calculateTotalPriceHiring = () => {
  //   let total = selectedPackages.reduce((sum, pkg) => {
  //     const packageObj = packagesArray.find((item) => item.value === pkg);
  //     return sum + (packageObj ? packageObj.price : 0);
  //   }, 0);

  //   // Add Hiring Cost if Hiring is selected
  //   if (selectedPackages.includes("Hiring") && watch("hiringPosition")) {
  //     total += Number(watch("hiringPosition")) * 50;
  //   }

  //   return total;
  // };

  // to define the onSubmit function
  const onSubmit = async (data) => {
    if (selectedPackages.includes("Fullskape") && !data.studentCount) {
      return;
    }
    if (selectedPackages.includes("Remote Punching") && !data.remoteEmpCount) {
      return;
    }

    try {
      setVerifyToken(null);

      const packagesToSubmit = selectedPackages;
      if (selectedPackageEnterprise) {
        data.selectedEnterprise = selectedPackageEnterprise;
      }

      data.packages = packagesToSubmit;
      console.log("Packages to submit:", packagesToSubmit);

      if (watch("coupan") !== undefined && watch("coupan") !== "") {
        const checkToken = await axios.post(
          `${process.env.REACT_APP_API}/route/organization/verify/coupon`,
          {
            coupan: data?.coupan,
          },
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        if (!checkToken?.data?.status) {
          handleAlert(
            true,
            "error",
            checkToken?.data?.message || "Invalid Token"
          );
          return false;
        }

        if (checkToken?.data?.status) {
          setVerifyToken(checkToken?.data?.verfiyCoupan);
          handleAlert(
            true,
            "success",
            checkToken?.data?.message || "Coupan code is correct"
          );
        }
      }

      // Ensure studentCount is included if Fullskape is selected
      if (selectedPackages.includes("Fullskape")) {
        data.studentCount = Number(data.studentCount); // Convert to number
      }
      if (selectedPackages.includes("Remote Punching")) {
        data.remoteEmpCount = Number(data.remoteEmpCount); // Convert to number
      }

      setStep3Data(data);
      console.log("Step 3 Data:", data);
      nextStep();
    } catch (err) {
      console.log("Error form cop", err);
    }
  };

  // const totalPrice = calculateTotalPrice(); // Calculate total price

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="item-center flex flex-col"
        noValidate
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 w-full sm:gap-4 gap-4">
          <AuthInputFiled
            name="count"
            icon={Calculate}
            control={control}
            type="number"
            placeholder="Member Count"
            label="Member Count *"
            min={0}
            errors={errors}
            error={errors.count}
          />
          {["Fullskape Plan"].includes(packageInfo?.packageName) && (
            <AuthInputFiled
              name="studentCount"
              icon={FactoryOutlined}
              control={control}
              type="number"
              placeholder="Enter Student Count"
              label="Student Count *"
              min={0}
              errors={errors}
              error={errors.studentCount}
              descriptionText={
                "Enter the number of students if you have selected the Fullskape package."
              }
            />
          )}
          <AuthInputFiled
            name="cycleCount"
            icon={RecyclingRounded}
            control={control}
            type="number"
            min={0}
            placeholder="Cycle count used for recycle your subscription"
            label="Cycle Count *"
            errors={errors}
            error={errors.cycleCount}
            descriptionText={
              "if you select 2 then you will be charged every 3 months subscription with 2 cycle it mean it will be 6 months subscription just amount will be charged one time."
            }
          />
          {selectedPackages.includes("Fullskape") && (
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
                "Enter the number of students if you have selected the Fullskape package."
              }
            />
          )}
        </div>

        {[
          "Enterprise Plan",
          "Basic Plan",
          "Essential Plan",
          "Intermediate Plan",
        ].includes(packageInfo?.packageName) &&
          packageInfo?.packageName === "Enterprise Plan" && (
            <div className="flex flex-col pb-4 mb-4">
              <div className="package-selection">
                <h3 className="text-gray-500 text-md font-semibold mb-4">
                  Select Base Plan:
                </h3>
                {/* <div className="flex flex-wrap items-center gap-5"> */}
                <div className="flex flex-wrap items-center gap-5">
                  {[
                    {
                      label: "Essential Plan",
                      price: 25,
                      value: "Essential Plan",
                    },
                    { label: "Basic Plan", price: 55, value: "Basic Plan" },
                    {
                      label: "Intermediate Plan",
                      price: 85,
                      value: "Intermediate Plan",
                    },
                  ].map((pkg) => (
                    <div
                      key={pkg.value}
                      className={`border rounded-md shadow-sm p-3  ${
                        selectedPackageEnterprise === pkg.value
                          ? "bg-red-100 scale-105"
                          : "bg-white hover:bg-gray-100"
                      }`}
                      style={{ width: "260px", height: "50px" }}
                    >
                      <label className="flex justify-between items-center h-full cursor-pointer">
                        <span className="font-medium text-sm">
                          {pkg.label} - &nbsp; ({pkg.price} rs)
                        </span>
                        <input
                          type="radio"
                          name="packageSelection" // Ensures only one radio button can be selected at a time
                          id={pkg.value}
                          checked={selectedPackageEnterprise === pkg.value}
                          onChange={() =>
                            handleselectpackageenterprise(pkg.value)
                          } // Update selected package
                          className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        {(["Basic Plan", "Essential Plan", "Intermediate Plan"].includes(
          packageInfo?.packageName
        ) ||
          (packageInfo?.packageName === "Enterprise Plan" &&
            selectedPackageEnterprise)) && (
          <div className="flex flex-col pb-4 mb-4">
            <div className="package-selection">
              <h3 className="text-gray-500 text-md font-semibold mb-4">
                Select Package Additions:
              </h3>
              <div className="flex flex-wrap items-center gap-5">
                {packagesArray
                  .filter((pkg) => {
                    const isRemotePunchingSelected =
                      selectedPackages.includes("Remote Punching");

                    if (packageInfo?.packageName === "Enterprise Plan") {
                      if (selectedPackageEnterprise !== "Intermediate Plan") {
                        return (
                          [
                            "Fullskape",
                            "Hiring",
                            "Basic SkillMatrix",
                            "Advanced SkillMatrix",
                            "Remote Punching",
                            ...(isRemotePunchingSelected
                              ? ["Remote Task"]
                              : []),
                          ].includes(pkg.label) ||
                          (selectedPackageEnterprise === "Essential Plan" &&
                            pkg.label === "Foundation")
                        );
                      }
                      return [
                        "Fullskape",
                        "Performance",
                        "Hiring",
                        "Basic SkillMatrix",
                        "Advanced SkillMatrix",
                        "Remote Task",
                        "Recruitment",
                        "QR Code Attendance",
                        "Expense Management",
                        "Food & Catering",
                        "HR Help Desk",
                      ].includes(pkg.label);
                    }

                    if (packageInfo?.packageName === "Essential Plan") {
                      return [
                        "Fullskape",
                        "Hiring",
                        "Basic SkillMatrix",
                        "Advanced SkillMatrix",
                        "Foundation",
                        "Remote Punching",
                        ...(isRemotePunchingSelected ? ["Remote Task"] : []),
                      ].includes(pkg.label);
                    }

                    if (packageInfo?.packageName === "Basic Plan") {
                      return [
                        "Fullskape",
                        "Hiring",
                        "Basic SkillMatrix",
                        "Advanced SkillMatrix",
                        "Remote Punching",
                        ...(isRemotePunchingSelected ? ["Remote Task"] : []),
                      ].includes(pkg.label);
                    }

                    if (packageInfo?.packageName === "Intermediate Plan") {
                      return [
                        "Fullskape",
                        "Performance",
                        "Hiring",
                        "Basic SkillMatrix",
                        "Advanced SkillMatrix",
                        "Remote Task",
                      ].includes(pkg.label);
                    }

                    return false;
                  })
                  .map((pkg) => (
                    <div
                      key={pkg.value}
                      className={`border rounded-md shadow-sm p-3 transition-transform transform ${
                        selectedPackages.includes(pkg.value)
                          ? "bg-blue-100 scale-105"
                          : "bg-white hover:bg-gray-100"
                      }`}
                      style={{ width: "260px", height: "50px" }}
                    >
                      <label className="flex items-center h-full cursor-pointer">
                        <input
                          type="checkbox"
                          id={pkg.value}
                          checked={selectedPackages.includes(pkg.value)}
                          onChange={() => handleCheckboxChange(pkg.value)}
                          className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 flex flex-col justify-center">
                          <span className="font-medium text-sm">
                            {pkg.label} - &nbsp; ({pkg.price} rs)
                          </span>
                        </span>
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 grid-cols-1 w-full sm:gap-4 gap-4">
          {selectedPackages.includes("Remote Punching") && (
            <AuthInputFiled
              name="remoteEmpCount"
              icon={FactoryOutlined}
              control={control}
              type="number"
              placeholder="Enter Employee Count"
              label="Remote Employee Count *"
              errors={errors}
              error={errors.remoteEmpCount}
              descriptionText={
                "Enter the number of employees to add in Remote Punching."
              }
            />
          )}

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
              { value: "Phone_Pay", label: "Phone_Pay" }, // Commented out as requested
              { value: "RazorPay", label: "RazorPay" },
            ]}
            descriptionText={"Additional 2% charges on every transaction"}
            defaultValue={"RazorPay"} // Setting RazorPay as default
          />

          <div className="my-2">
            <AuthInputFiled
              name="coupan"
              icon={FactoryOutlined}
              control={control}
              type="text"
              placeholder="Ex: ABCD12345A"
              label="Enter Coupon Code "
              errors={errors}
              error={errors.coupan}
              descriptionText={
                "You can request for coupan code to get discount"
              }
            />
          </div>

          {selectedPackages.includes("Hiring") && (
            <AuthInputFiled
              name="hiringPosition"
              icon={FactoryOutlined}
              control={control}
              type="number"
              placeholder="Enter Job Positon Count"
              label="Enter Job Positon Count *"
              errors={errors}
              error={errors.hiringPosition}
              descriptionText={
                "Enter the number of position if you have selected the Hiring package."
              }
            />
          )}
          {/* Skillmatrix */}
          {/* <div className="my-2">
            <AuthInputFiled
              name="skillMatrix"
              icon={FactoryOutlined}
              control={control}
              type="text"
              placeholder="Ex: ABCD12345A"
              label="Skill Matrix "
              errors={errors}
              error={errors.coupan}
              descriptionText={
                "You can request for coupan code to get discount"
              }
            />
          </div> */}
        </div>
        <div className="flex justify-end space-x-4">
          <BasicButton
            title="Back"
            variant={"outlined"}
            onClick={handlePrevStep}
          />
          <BasicButton type="submit" title={"Confirm & Pay"} />
        </div>
      </form>
    </div>
  );
};

export default Step3;
