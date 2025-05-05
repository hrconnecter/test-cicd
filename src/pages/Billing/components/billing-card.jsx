import {
  AttachMoney,
  Autorenew,
  Circle,
  ControlPoint,
  Discount,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Loop,
  People,
  PriorityHigh,
  RecyclingRounded,
  ShoppingBag,
  Subscriptions,
  TrendingUp,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  Menu,
  MenuItem,
  alpha,
  styled,
} from "@mui/material";
import moment from "moment";
import jsPDF from "jspdf";
import React, { useContext, useState } from "react";
import DescriptionBox from "./descripton-box";
import PaySubscription from "./package/pay-sub";
import RenewPackage from "./package/renew";
import UpgradePackage from "./package/upgrade";
import html2canvas from "html2canvas";
import { toWords } from "number-to-words";
import BasicButton from "../../../components/BasicButton";
import { packagesArray } from "../../AddOrganisation/components/data";
import axios from "axios";
import { UseContext } from "../../../State/UseState/UseContext";
import { useMutation } from "react-query";
import UserProfile from "../../../hooks/UserData/useUser";
import HiringPayment from "./package/hiring-payment";
import InvoiceModal from "./InvoiceModal";
const StyledMenu = styled((props) => (
  <Menu
    style={{ background: "rgb(244 247 254 / var(--tw-bg-opacity))" }}
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 140,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const BillingCard = ({ doc }) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [confirmOpen1, setConfirmOpen1] = useState(false);
  const [confirmOpenHiring, setConfirmOpeHiring] = useState(false);
  const [confirmOpen2, setConfirmOpen2] = useState(false);
  const [confirmOpen3, setConfirmOpen3] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const checkHasOrgDisabled = () => {
    // if organization subscriptionDetails.status is pending and the difference between the current date and the expiration date is greater than 0 then return true else return false
    if (doc?.subscriptionDetails?.status === "Active") {
      // check if expired by checking subscriptionDetails.expirationDate
      if (
        moment(doc?.subscriptionDetails?.expirationDate).diff(
          moment(),
          "days"
        ) > 0
      ) {
        return false;
      } else {
        if (doc?.upcomingPackageInfo?.packageName) {
          return false;
        } else {
          return true;
        }
      }
    } else if (doc?.subscriptionDetails?.status === "Pending") {
      return true;
    }
    return true;
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModal = async () => {
    try {
      // Open the modal
      setOpenModal(true);

      // Delay to allow the modal to render fully
      setTimeout(async () => {
        const pdfContent = document.getElementById("pdfContent");
        if (!pdfContent) {
          console.error("PDF content not found!");
          // alert("Failed to find the PDF content. Please try again.");
          return;
        }

        // Generate and upload PDF
        await generateAndUploadPDF(pdfContent, authToken);
      }, 500); // Delay of 500ms
    } catch (error) {
      console.error("Error generating or uploading PDF:", error);
      // alert("Failed to upload invoice. Please try again.");
    }
  };

  const generateAndUploadPDF = async (pdfContent, authToken) => {
    try {
      // Generate PDF using html2canvas
      const canvas = await html2canvas(pdfContent, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      const pdfBlob = pdf.output("blob");
      const file = new File([pdfBlob], "invoice.pdf", {
        type: "application/pdf",
      });

      // Upload the PDF to S3
      const s3Url = await uploadInvoice(file, authToken);
      console.log("Uploaded PDF URL:", s3Url);
      sendInvoiceEmail(s3Url);
    } catch (error) {
      console.error("Error generating or uploading the invoice:", error);
    }
  };

  const uploadInvoice = async (file, authToken) => {
    try {
      // Step 1: Get a pre-signed URL from your server
      const {
        data: { url },
      } = await axios.get(
        `${process.env.REACT_APP_API}/route/s3createFile/addInvoice`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
        }
      );

      // Step 2: Upload the PDF to S3 using the pre-signed URL
      await axios.put(url, file, {
        headers: {
          "Content-Type": "application/pdf",
        },
      });

      // Step 3: Return the S3 URL without query params
      return url.split("?")[0];
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw error;
    }
  };

  const getPackagePrice = (selectedPackages) => {
    let additionalPrice = 0;

    // Ensure selectedPackages is an array
    if (!Array.isArray(selectedPackages)) {
      selectedPackages = [selectedPackages];
    }

    selectedPackages.forEach((pkg) => {
      const matchedPackage = packagesArray.find(
        (item) => item.label === pkg || item.value === pkg
      );

      if (matchedPackage) {
        additionalPrice += matchedPackage.price;
      }
    });
    return additionalPrice;
  };

  const getPrice = (packageInfo, selectedEnterprise, selectedPackages) => {
    let basePrice = 0;
    switch (packageInfo) {
      case "Essential Plan":
        return "30";
      case "Basic Plan":
        return "55";
      case "Intermediate Plan":
        return "85";
      case "Enterprise Plan":
        if (selectedEnterprise === "Basic Plan") {
          basePrice = 55;
        } else if (selectedEnterprise === "Essential Plan") {
          basePrice = 30;
        } else if (selectedEnterprise === "Intermediate Plan") {
          basePrice = 85;
        }
        basePrice += getPackagePrice(selectedPackages);
        return basePrice.toString();
      case "Fullskape Plan":
        if (memberCount < 25) {
          return "16";
        } else if (memberCount > 25 && memberCount <= 199) {
          return "14";
        } else if (memberCount >= 200) {
          return "12";
        }
        break;
      default:
        return "0";
    }
  };

  const memberCount = Number(doc?.memberCount) || 0;
  const cycleCount = Number(doc?.cycleCount) * 3 || 0;
  const selectedPackages = doc?.packages;
  const pricePerEmployee = getPrice(
    doc?.packageInfo,
    doc?.selectedEnterprise,
    selectedPackages
  );

  const formatCurrency = (amount) => `₹ ${amount.toFixed(2)}`;
  const totalIntermediatePrice = pricePerEmployee * memberCount * cycleCount;
  const GST = totalIntermediatePrice * 0.18;
  const Total = totalIntermediatePrice + GST;
  const capitalizeFirstLetter = (text) => {
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  let amountInWords = toWords(Total);

  amountInWords = capitalizeFirstLetter(amountInWords.replace(/[-,]/g, ""));

  const paymentDate = new Date(doc?.subscriptionDetails?.paymentDate);
  const paymentformattedDate = `${String(paymentDate.getDate()).padStart(
    2,
    "0"
  )}-${String(paymentDate.getMonth() + 1).padStart(
    2,
    "0"
  )}-${paymentDate.getFullYear()}`;
  const expirationDate = doc?.subscriptionDetails?.expirationDate;
  const date = new Date(expirationDate);
  const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${date.getFullYear()}`;

  const formattedInvoiceNumber = String(
    doc?.subscriptionDetails?.invoiceNumber
  ).padStart(4, "0");

  //send to mail
  const mutation = useMutation(async (formData) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API}/route/organization/sendInvoiceEmail`,
      formData,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  });

  const sendInvoiceEmail = async (uploadedS3Url) => {
    if (!uploadedS3Url) {
      return;
    }

    const formData = {
      email: "mayurijugdar16@gmail.com",
      s3Url: uploadedS3Url,
      invoiceContent: {
        firstName: user?.first_name,
        lastName: user?.last_name,
        invoiceNumber: formattedInvoiceNumber,
        paymentDate: paymentformattedDate,
        expirationDate: formattedDate,
        totalAmount: formatCurrency(Total),
        amountInWords,
      },
      invoiceNumber: formattedInvoiceNumber,
    };

    mutation.mutate(formData, {
      onSuccess: (data) => {
        console.log("Email sent successfully:", data);
        // alert("Invoice email sent successfully!");
      },
      onError: (error) => {
        console.error("Error sending email:", error);
        // alert("Failed to send email. Please try again.");
      },
    });
  };

  return (
    <>
      <div className="grid grid-cols-6">
        <div className="col-span-6 md:col-span-5 pl-4 pt-4 pb-4 gap-4 flex flex-col">
          <div className=" bg-white p-4">
            <div className="flex justify-between ">
              <div className="flex gap-4 items-end">
                <img
                  src={doc?.logo_url}
                  alt=""
                  className="h-10 w-10 rounded-md border border-brand/purple"
                />
                <div className="text-2xl font-bold">{doc?.orgName}</div>
              </div>
              <div className="flex gap-4">
                <div className="flex gap-4">
                  {moment(doc?.subscriptionDetails?.expirationDate).diff(
                    moment(),
                    "days"
                  ) <= 0 && (
                    <BasicButton
                      title={"Renew"}
                      onClick={() => setConfirmOpen1(true)}
                    />
                  )}
                  {moment(doc?.subscriptionDetails?.expirationDate).diff(
                    moment(),
                    "days"
                  ) > 0 && (
                    <Button
                      id="demo-customized-button"
                      aria-controls={open ? "demo-customized-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      variant="outlined"
                      disableElevation
                      onClick={handleClick}
                      endIcon={
                        open ? <KeyboardArrowUp /> : <KeyboardArrowDown />
                      }
                    >
                      Options
                    </Button>
                  )}
                </div>
              </div>
              <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                  "aria-labelledby": "demo-customized-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    setConfirmOpen1(true);
                  }}
                  disableRipple
                >
                  <Autorenew />
                  Renew
                </MenuItem>

                {moment(doc?.subscriptionDetails?.expirationDate).diff(
                  moment(),
                  "days"
                ) > 0 && (
                  <MenuItem
                    onClick={() => {
                      setConfirmOpen2(true);
                      handleClose();
                    }}
                    disableRipple
                  >
                    <TrendingUp />
                    Upgrade
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    setConfirmOpeHiring(true);
                  }}
                  disableRipple
                >
                  <Autorenew />
                  Hiring
                </MenuItem>
                {/* {window.innerWidth < 300 && checkHasOrgDisabled() && (
                <MenuItem
                  onClick={() => {
                    setConfirmOpen2(true);
                    handleClose();
                  }}
                  disableRipple
                >
                  <TrendingUp />
                  Pay
                </MenuItem>
              )} */}
              </StyledMenu>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              {!checkHasOrgDisabled() ? (
                <>
                  <DescriptionBox
                    Icon={Subscriptions}
                    descriptionText={"Subscription charge date"}
                    mainText={moment(
                      doc?.subscriptionDetails?.paymentDate
                    ).format("DD MMM YYYY")}
                  />
                  <DescriptionBox
                    Icon={Subscriptions}
                    descriptionText={"Subscription end date"}
                    mainText={moment(
                      doc?.subscriptionDetails?.expirationDate ?? moment()
                    ).format("DD MMM YYYY")}
                  />
                </>
              ) : (
                <>
                  <DescriptionBox
                    Icon={RecyclingRounded}
                    descriptionText={"Your subscription is on trial"}
                    mainText={
                      moment(doc?.createdAt)
                        .add(7, "days")
                        .diff(moment(), "days") > 0
                        ? `Only ${moment(doc?.createdAt)
                            .add(7, "days")
                            .diff(moment(), "days")} days left`
                        : "But trial has expired"
                    }
                  />
                  <DescriptionBox
                    Icon={RecyclingRounded}
                    descriptionText={"Your subscription trial start Date"}
                    mainText={moment(doc?.createdAt).format("DD MMM YYYY")}
                  />
                </>
              )}
              <DescriptionBox
                Icon={AttachMoney}
                descriptionText={"Billing frequency"}
                mainText={"Quarterly"}
              />
              <DescriptionBox
                Icon={ShoppingBag}
                descriptionText={"Purchased Plan"}
                mainText={doc?.packageInfo}
              />
              <DescriptionBox
                Icon={People}
                descriptionText={"Allowed employee count"}
                mainText={doc?.memberCount}
              />
              <DescriptionBox
                Icon={Circle}
                descriptionText={"Subscription status"}
                mainText={
                  moment(doc?.subscriptionDetails?.expirationDate).diff(
                    moment(),
                    "days"
                  ) > 0
                    ? "Active"
                    : "Inactive"
                }
              />
              {moment(doc?.subscriptionDetails?.expirationDate).diff(
                moment(new Date()),
                "days"
              ) > 0 && (
                <DescriptionBox
                  Icon={Loop}
                  descriptionText={"Your next renewal is after"}
                  mainText={`${moment(
                    doc?.subscriptionDetails?.expirationDate
                  ).diff(moment(new Date()), "days")} days`}
                />
              )}
              <DescriptionBox
                Icon={Discount}
                descriptionText={"Organisation discount for next subscription"}
                mainText={`${Math.round(doc?.remainingBalance)}`}
              />
            </div>
          </div>
        </div>
        <div className=" col-span-1 justify-center items-center hidden md:flex">
          {doc?.subscriptionDetails?.status === "Active" ? (
            <div className="flex justify-center items-start p-8 rounded-full animate-pulse">
              <BasicButton
                title={"Invoice"}
                onClick={handleModal}
                variant="outlined"
              />
            </div>
          ) : doc?.subscriptionDetails?.status === "Pending" ? (
            <div className="bg-[#E8A454] flex justify-center items-start p-2 rounded-full animate-pulse">
              <PriorityHigh className="text-white " fontSize="large" />
            </div>
          ) : doc?.subscriptionDetails?.status === "Expired" ? (
            <div className="bg-[#6578DB] flex justify-center items-start p-8 rounded-full animate-pulse">
              <ControlPoint className="text-white " fontSize="large" />
            </div>
          ) : null}
        </div>

        <RenewPackage
          open={confirmOpen1}
          handleClose={() => {
            setConfirmOpen1(false);
            handleClose();
          }}
          organisation={doc}
        />
        <UpgradePackage
          open={confirmOpen2}
          handleClose={() => {
            setConfirmOpen2(false);
            handleClose();
          }}
          organisation={doc}
        />
        <PaySubscription
          open={confirmOpen3}
          handleClose={() => {
            setConfirmOpen3(false);
            handleClose();
          }}
          organisation={doc}
        />
        <HiringPayment
          open={confirmOpenHiring}
          handleClose={() => {
            setConfirmOpeHiring(false);
            handleClose();
          }}
          organisation={doc}
        />
      </div>
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="lg"
        fullWidth={true}
      >
        <DialogContent>
          <InvoiceModal doc={doc} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BillingCard;
