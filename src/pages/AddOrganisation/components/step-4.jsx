/* eslint-disable no-unused-vars */
import { Box, CircularProgress } from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useContext, useMemo, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import useOrg from "../../../State/Org/Org";
import PackageInfo from "../../../components/Modal/PackagesModal/package-info";
import useGetUser from "../../../hooks/Token/useUser";
import { packageArray } from "../../../utils/Data/data";
import { packagesArray } from "./data";
// import PricingCard from "./step-2-components/pricing-card";
import BasicButton from "../../../components/BasicButton";
import PricingCardSummary from "./step-2-components/pricingcard-final";

const Step4 = ({ prevStep }) => {
  // to define state , hook , import other function
  const [confirmOpen, setConfirmOpen] = useState(false);
  const data = useOrg();
  const { handleAlert } = useContext(TestContext);
  const navigate = useNavigate();
  const { authToken, decodedToken } = useGetUser();
  const [selectedPlan, setselectedPlan] = useState("");
  const config = {
    headers: {
      Authorization: authToken,
    },
  };
  const handleForm = async () => {
    if (data.packageInfo === undefined) {
      return "Please Select Plan And Package";
    }
    const finalPrice = calculateFinalPrice();
    const mainData = {
      ...data,
      coupan: data?.verifyToken?.coupan,
      packageInfo: data?.packageInfo?.packageName,
      totalPrice: parseFloat(finalPrice.toFixed(2)),

      selectedPlan,
    };
    console.log(" mainData...", mainData);

    const response = await axios.post(
      `${process.env.REACT_APP_API}/route/organization`,
      mainData,
      config
    );
    return response?.data;
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: handleForm,
    onSuccess: async (data) => {
      console.log("API Response Data:", data);

      if (data?.paymentType === "Phone_Pay") {
        window.location.href = data?.redirectUrl;
      } else if (data?.paymentType === "RazorPay") {
        const options = {
          key: data?.key,
          amount: data?.order?.amount,
          currency: "INR",
          name: "Aegis Plan for software", //your business name
          description: "Get Access to all premium keys",
          image: data?.organization?.image,
          order_id: data?.order?.id,
          callback_url: data?.callbackURI,
          prefill: {
            name: `${decodedToken?.user?.first_name} ${decodedToken?.user?.last_name}`, //your customer's name
            email: decodedToken?.user?.email,
            contact: decodedToken?.user?.phone_number,
          },
          notes: {
            address:
              "C503, The Onyx-Kalate Business Park, near Euro School, Shankar Kalat Nagar, Wakad, Pune, Pimpri-Chinchwad, Maharashtra 411057",
          },
          theme: {
            color: "#1976d2",
          },
          modal: {
            ondismiss: function () {
              console.log("Checkout form closed by the user");
            },
          },
        };
        const razor = new window.Razorpay(options);
        razor.open();
      } else {
        console.log("data ", data);
        console.log("Organization Data:", data?.org?._id);
        handleAlert(true, "success", data?.message);
        navigate(`/organisation/${data}/setup/add-roles`);
      }
    },
    onError: async (data) => {
      console.error(`🚀 ~ file: mini-form.jsx:48 ~ data:`, data);
      console.log("baficbasnf",data?.response?.data?.message);
      handleAlert(
        true,
        "error",
        data?.response?.data?.message || "Please fill all mandatory field...."
      );
    },
  });

  const handlePrevStep = () => {
    localStorage.removeItem("selectedPackages");
    localStorage.removeItem("selectedPackageEnterprise");
    prevStep();
  };

  // to define the function for package calculation
  const getPriceMain = useMemo(() => {
    const expirationDate = moment().add(3 * data?.cycleCount, "months");
    const dateDifference = expirationDate.diff(moment(), "days");

    if (data?.packageInfo?.packageName === "Basic Plan") {
      const perDayPrice = 55;
      return perDayPrice ?? 0;
    } else if (data?.packageInfo?.packageName === "Essential Plan") {
      const perDayPrice = 25;
      return perDayPrice ?? 0;
    } else if (data?.packageInfo?.packageName === "Intermediate Plan") {
      const perDayPrice = 85;
      return perDayPrice ?? 0;
    }
    // else if (data?.packageInfo?.packageName === "Foundation Plan") {
    //   const perDayPrice = 30;
    //   return (perDayPrice ?? 0);
    // }
    else if (data?.packageInfo?.packageName === "Fullskape Plan") {
      let perDayPrice;
      if (data.count <= 25) {
        perDayPrice = 16;
      } else if (data.count >= 26 && data.count <= 199) {
        perDayPrice = 14;
      } else if (data.count >= 200) {
        perDayPrice = 12;
      }
      return Math.round(perDayPrice ?? 0);
    } else if (data?.selectedEnterprise) {
      let enterprisePrice = 0; // Default for enterprise plan
      if (data?.selectedEnterprise === "Basic Plan") {
        enterprisePrice = 55; // If "Basic Plan" is selected for enterprise
      } else if (data?.selectedEnterprise === "Intermediate Plan") {
        enterprisePrice = 85; // Adjust accordingly for other enterprise plans
      } else if (data?.selectedEnterprise === "Essential Plan") {
        enterprisePrice = 25;
      }
      return enterprisePrice ?? 0;
    }
  }, [
    data?.cycleCount,
    data?.packageInfo?.packageName,
    data?.count,
    data?.selectedEnterprise,
  ]);

  if (!data?.packageInfo) {
    return "Please Select Plan And Package";
  }

  const calculateFinalPrice = () => {
    const selectedPackages = data?.packages
      ? data?.packages
          .map((pkg) => packagesArray.find((item) => item.label === pkg))
          .filter(Boolean)
      : [];

    const studentCount = data?.studentCount || 0; // Assuming studentCount exists in data
    const remoteEmpCount = data?.remoteEmpCount || 0; // Assuming remoteEmpCount exists in data

    console.log("STuudent count", studentCount);
    // Determine Fullskape price per student based on studentCount
    let fullskapePricePerStudent = 0;
    if (studentCount <= 25) {
      fullskapePricePerStudent = 16;
    } else if (studentCount >= 26 && studentCount <= 199) {
      fullskapePricePerStudent = 14;
    } else if (studentCount >= 200) {
      fullskapePricePerStudent = 12;
    }
    console.log("Fullskape plann", data?.packageInfo);
    // If packageInfo is "Fullskape Plan", use the specific calculation
    if (data?.packageInfo?.packageName === "Fullskape Plan") {
      let basePrice =
        (studentCount * fullskapePricePerStudent + data?.count * 20) *
        data?.cycleCount *
        3;

      console.log("Fullskape Plan Base Price:", basePrice);

      // Apply discount if available
      let discount = 0;
      if (data?.verifyToken?.discount) {
        discount = (basePrice * data?.verifyToken?.discount) / 100;
      }

      // Apply GST and payment type adjustments
      if (data?.paymentType === "RazorPay") {
        const gstFinal = basePrice - discount + basePrice * 0.18;
        const finalPrice = gstFinal + gstFinal * 0.02;
        return finalPrice;
      } else {
        return basePrice - discount + basePrice * 0.18;
      }
    }

    // Default logic for other plans
    let fullskapePrice = 0;
    let otherPackagesPrice = 0;
    let remotePunchingPrice = 0;
    let remotetaskprice = 0;

    selectedPackages.forEach((pkg) => {
      if (pkg.label === "Fullskape") {
        fullskapePrice = fullskapePricePerStudent; // Use calculated price per student
        console.log("Fullskape price 1:", fullskapePrice);
      } else if (pkg.label === "Remote Punching") {
        remotePunchingPrice += pkg.price;
      } else if (pkg.label === "Remote Task") {
        remotetaskprice += pkg.price;
      } else {
        otherPackagesPrice += pkg.price;
      }
    });

    console.log(
      "Base price 1:",
      (getPriceMain + otherPackagesPrice) * data?.count * data?.cycleCount * 3
    );
    console.log("otherPackagesPrice:", otherPackagesPrice);
    console.log("remotePunchingPrice:", remotePunchingPrice);
    console.log("Price 2:", fullskapePrice * studentCount);

    const isinter = data?.packageInfo?.packageName === "Intermediate Plan" || data?.packageInfo?.packageName === "Enterprise Plan";
    console.log("isinter", isinter);


    // Calculate base price
    let basePrice =
    isinter ? ((getPriceMain + otherPackagesPrice + remotetaskprice) * data?.count +
    fullskapePrice * studentCount ) * data?.cycleCount * 3 : ((getPriceMain + otherPackagesPrice) * data?.count +
        fullskapePrice * studentCount +
        (remotePunchingPrice + remotetaskprice) * remoteEmpCount) *
        data?.cycleCount * 3;
      

    console.log("Base Price remote:", basePrice);

    // Calculate discount if available
    let discount = 0;
    if (data?.verifyToken?.discount) {
      discount = (basePrice * data?.verifyToken?.discount) / 100;
    }

    // Apply GST and payment type adjustments
    if (data?.paymentType === "RazorPay") {
      const gstFinal = basePrice - discount + basePrice * 0.18;
      const finalPrice = gstFinal + gstFinal * 0.02;
      return finalPrice;
    } else {
      return basePrice - discount + basePrice * 0.18;
    }
  };


  //for cardsummary-----------------

  let otherPackagesPrice = data?.otherPackagesPrice || 0;
  let fullskapePrice = data?.fullskapePrice || 0;
  let studentCount = data?.studentCount || 0;
  let remotePunchingPrice = data?.remotePunchingPrice || 0;
  let remotetaskprice = data?.remotetaskprice || 0;

  let remoteEmpCount = data?.remoteEmpCount || 0;
  
  let fullskapePricePerStudent = 0;
  if (studentCount <= 25) {
    fullskapePricePerStudent = 16;
  } else if (studentCount >= 26 && studentCount <= 199) {
    fullskapePricePerStudent = 14;
  } else if (studentCount >= 200) {
    fullskapePricePerStudent = 12;
  }
  
  const selectedPackages = data?.packages
    ? data?.packages
        .map((pkg) => packagesArray.find((item) => item.label === pkg))
        .filter(Boolean)
    : [];
  
  selectedPackages.forEach((pkg) => {
    if (pkg.label === "Fullskape") {
      fullskapePrice = fullskapePricePerStudent; // ✅ No more error
    } else if (pkg.label === "Remote Punching") {
      remotePunchingPrice += pkg.price; // ✅ No more error
    } else if (pkg.label === "Remote Task") {
      remotetaskprice += pkg.price;
    } else {
      otherPackagesPrice += pkg.price; // ✅ No more error
    }
  });

  console.log("Remote task price", remotetaskprice)

  const isinter = data?.selectedEnterprise === "Intermediate Plan";
  
  // Base price calculation
  const basePrice =
  isinter ? ((getPriceMain + otherPackagesPrice + remotetaskprice) * data?.count +
  fullskapePrice * studentCount ) * data?.cycleCount * 3 : ((getPriceMain + otherPackagesPrice) * data?.count +
      fullskapePrice * studentCount +
      (remotePunchingPrice + remotetaskprice) * remoteEmpCount) *
      data?.cycleCount * 3;

  console.log("Base Price:", basePrice);
  
  // Discount calculation
  const discount = data?.verifyToken?.discount
    ? (basePrice * data?.verifyToken?.discount) / 100
    : 0;
  
  // GST calculation
  const gst = (basePrice - discount) * 0.18;
  
  // Final price calculation
  const finalPrice =
    data?.paymentType === "RazorPay"
      ? (basePrice - discount + gst) * 1.02
      : basePrice - discount + gst;
  

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  console.log("Data:", data?.packages.map((pkg) =>
    packagesArray.find((item) => item.label === pkg)
  ) , packagesArray , data?.packages);
  return (
    <div className="grid bg-[#f8fafb] rounded-md items-center">
      <div className="gap-4 flex flex-col items-center">
        <div className="">
          <h2 className="font-semibold text-gray-500 text-xl text-center">
            Your Package Pricing
          </h2>
          <p className="text-gray-500 text-center">
            {`You have selected the ${data?.packageInfo?.packageName} package of ₹${getPriceMain}.`}
          </p>
          <p className="text-gray-500 text-center">
            {data?.verifyToken?.discount ? (
              <>
                Base Price: ₹
                {(getPriceMain * data?.count * data?.cycleCount * 3).toFixed(2)}{" "}
                <br />
                Discount: {data?.verifyToken?.discount}% <br />
                <span className="font-semibold">
                  Total Price After Discount and Charges: ₹
                  {/* {pricingDetails.finalPrice.toFixed(2)} */}
                  {calculateFinalPrice().toFixed(2)}
                </span>
              </>
            ) : (
              <>
                {/* Base Price: ₹{(getPriceMain * data?.count).toFixed(2)} <br /> */}
                <span className="fborder-b pb-4 text-center text-xl font-semibold text-gray-900">
                  {/* Total Price: ₹{pricingDetails.finalPrice.toFixed(2)} */}
                  Total Price: ₹{calculateFinalPrice().toFixed(2)}
                </span>
              </>
            )}
          </p>
        </div>
        <div className="flex flex-col gap-2 !row-span-4">

          <PricingCardSummary
            packageInfo={data?.packageInfo}
            basePrice={basePrice}
            gst={gst}
            finalPrice={finalPrice}
            paymentType={data?.paymentType}
            selectedPackages={
              data?.packages
                ? data?.packages.map((pkg) =>
                    packagesArray.find((item) => item.label === pkg)
                  )
                : []
            }
          />
        </div>
        <div className="flex justify-center space-x-4 mt-4">
          <BasicButton
            title="Back"
            variant="outlined"
            onClick={handlePrevStep}
          />
          <BasicButton
            onClick={(e) => {
              e.preventDefault();
              mutate();
            }}
            type="submit"
            title="Submit"
          />
          <PackageInfo
            open={confirmOpen}
            handleClose={() => {
              setConfirmOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Step4;

const returnArray = (plan = "Basic Plan") => {
  if (plan === "Basic Plan") {
    return packageArray.filter((doc, index) => doc.Basic === "✓" && index <= 5);
  } else if (plan === "Intermediate Plan") {
    return packageArray
      .filter((doc, index) => doc.Intermediate === "✓" && index <= 5)
      .reverse();
  } else if (plan === "Essential Plan") {
    return packageArray
      .filter((doc, index) => doc.Essential === "✓" && index <= 5)
      .reverse();
  } else if (plan === "Fullskape Plan") {
    return packageArray
      .filter((doc, index) => doc.Fullskape === "✓" && index <= 5)
      .reverse();
  } else {
    return packageArray
      .filter((doc, index) => doc.Enterprise === "✓")
      .reverse()
      .filter((doc, index) => index <= 5);
  }
};
