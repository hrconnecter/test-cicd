import {
  Box,
  Button,
  Grid,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import hrmsImg from "../../../assets/hrmsImg.png";
import SignImg from "../../../assets/sign.png";
import QRcodeImg from "../../../assets/QRcode.svg";
import html2pdf from "html2pdf.js";
import { packagesArray } from "../../AddOrganisation/components/data";
import { toWords } from "number-to-words";

// Create priceStore dynamically

const InvoiceModal = ({ doc }) => {
  console.log("doc in invoice", doc);
  const priceStore = {};

  packagesArray?.forEach(({ label, price }) => {
    priceStore[label] =
      label === "Fullskape" && doc?.studentCount <= 25
        ? 16
        : label === "Fullskape" &&
          doc?.studentCount >= 26 &&
          doc?.studentCount < 200
        ? 14
        : label === "Fullskape" && doc?.studentCount <= 200
        ? 12
        : price;
  });

  const packageName = doc?.packageInfo;

  const baseHrmsPrice =
    packageName === "Essential Plan"
      ? 25
      : packageName === "Basic Plan"
      ? 55
      : packageName === "Intermediate Plan"
      ? 85
      : packageName === "Enterprise Plan"
      ? doc?.selectedEnterprise === "Intermediate Plan"
        ? 85
        : doc?.selectedEnterprise === "Basic Plan"
        ? 55
        : doc?.selectedEnterprise === "Essential Plan"
        ? 25
        : 85
      : packageName === "Fullskape Plan"
      ? 20
      : 0;

  //selected package array
  const selectedPackages = doc?.packages;

  //Aegis hrms
  const memberCount = Number(doc?.memberCount) || 0;
  const cycleCount = Number(doc?.cycleCount) * 3 || 0;
  const remoteEmpCount = Number(doc?.remoteEmpCount) || 0;
  const studentCount = Number(doc?.studentCount) || 0;
  const baseHrmsPriceTotal = baseHrmsPrice * memberCount * cycleCount;
  const baseHrmsGST = baseHrmsPriceTotal * 0.18;
  const baseHrmsGSTTotal = baseHrmsPriceTotal + baseHrmsGST;

  //Add on package Price
  // const packageTotals = packagesArray?.map(({ label }) => ({
  //   name: label,
  //   total:
  //     priceStore[label] *
  //     cycleCount *
  //     (((packageName === "Remote Punching" || packageName === "Remote Task") &&
  //       doc?.packageInfo !== "Intermediate Plan") ||
  //     doc?.packageInfo !== "Enterprise Plan" ||
  //     doc?.packageInfo !== "Essential Plan" ||
  //     doc?.packageInfo !== "Basic Plan"
  //       ? remoteEmpCount
  //       :   packagesArray?.forEach(({ label, price }) => {
  //         priceStore[label] =
  //           label === "Fullskape" && doc?.studentCount <= 25
  //             ? 16
  //             : label === "Fullskape" &&
  //               doc?.studentCount >= 26 &&
  //               doc?.studentCount < 200
  //             ? 14
  //             : label === "Fullskape" && doc?.studentCount <= 200
  //             ? 12
  //             : price;
  //       })
  //       ? studentCount
  //       : memberCount),
  // }));
  // First, update the Fullskape price based on studentCount
  const updatedPackagesArray = packagesArray.map(({ label, price }) => {
    if (label === "Fullskape") {
      if (doc?.studentCount <= 25) {
        priceStore[label] = 16;
      } else if (doc?.studentCount >= 26 && doc?.studentCount < 200) {
        priceStore[label] = 14;
      } else if (doc?.studentCount >= 200) {
        priceStore[label] = 12;
      } else {
        priceStore[label] = price;
      }
    }
    return { label, price: priceStore[label] || price };
  });

  // Then, compute the totals
  const packageTotals = updatedPackagesArray.map(({ label }) => {
    const isRemote =
      (packageName === "Remote Punching" || packageName === "Remote Task") &&
      ![
        "Intermediate Plan",
        "Enterprise Plan",
        "Essential Plan",
        "Basic Plan",
      ].includes(doc?.packageInfo);

    const quantity = isRemote
      ? remoteEmpCount
      : label === "Fullskape"
      ? studentCount
      : memberCount;

    return {
      name: label,
      total: priceStore[label] * cycleCount * quantity,
    };
  });

  // const packageGSTTotals = packagesArray?.map(({ label }) => {
  //   const baseTotal =
  //     priceStore[label] *
  //       cycleCount *
  //       (((packageName === "Remote Punching" ||
  //         packageName === "Remote Task") &&
  //         doc?.packageInfo !== "Intermediate Plan") ||
  //       doc?.packageInfo !== "Enterprise Plan" ||
  //       doc?.packageInfo !== "Essential Plan" ||
  //       doc?.packageInfo !== "Basic Plan"
  //         ? remoteEmpCount
  //         : label === "Fullskape"
  //         ? studentCount
  //         : memberCount) || 0;

  //   return {
  //     name: label,
  //     gst: parseFloat((baseTotal * 0.18).toFixed(2)),
  //   };
  // });
  // Apply Fullskape pricing rule
  if (packagesArray.some((pkg) => pkg.label === "Fullskape")) {
    if (doc?.studentCount <= 25) {
      priceStore["Fullskape"] = 16;
    } else if (doc?.studentCount >= 26 && doc?.studentCount < 200) {
      priceStore["Fullskape"] = 14;
    } else if (doc?.studentCount >= 200) {
      priceStore["Fullskape"] = 12;
    }
  }

  // Calculate GST per package
  const packageGSTTotals = packagesArray.map(({ label }) => {
    const isRemote =
      (packageName === "Remote Punching" || packageName === "Remote Task") &&
      ![
        "Intermediate Plan",
        "Enterprise Plan",
        "Essential Plan",
        "Basic Plan",
      ].includes(doc?.packageInfo);

    const quantity = isRemote
      ? remoteEmpCount
      : label === "Fullskape"
      ? studentCount
      : memberCount;

    const baseTotal = (priceStore[label] || 0) * cycleCount * quantity;

    return {
      name: label,
      gst: parseFloat((baseTotal * 0.18).toFixed(2)),
    };
  });

  // const packageFinalTotals = packagesArray?.map(({ label }) => {
  //   const baseTotal =
  //     priceStore[label] *
  //       cycleCount *
  //       (((packageName === "Remote Punching" ||
  //         packageName === "Remote Task") &&
  //         doc?.packageInfo !== "Intermediate Plan") ||
  //       doc?.packageInfo !== "Enterprise Plan" ||
  //       doc?.packageInfo !== "Essential Plan" ||
  //       doc?.packageInfo !== "Basic Plan"
  //         ? remoteEmpCount
  //         : label === "Fullskape"
  //         ? studentCount
  //         : memberCount) || 0;

  //   const gstAmount = baseTotal * 0.18;
  //   const finalTotal = baseTotal + gstAmount;

  //   return {
  //     name: label,
  //     finalTotal: parseFloat(finalTotal.toFixed(2)),
  //   };
  // });

  //calculate total for column taxable
  // Step 1: Apply Fullskape pricing logic based on studentCount
  if (packagesArray.some((pkg) => pkg.label === "Fullskape")) {
    if (doc?.studentCount <= 25) {
      priceStore["Fullskape"] = 16;
    } else if (doc?.studentCount >= 26 && doc?.studentCount < 200) {
      priceStore["Fullskape"] = 14;
    } else if (doc?.studentCount >= 200) {
      priceStore["Fullskape"] = 12;
    }
  }

  // Step 2: Calculate final totals including GST
  const packageFinalTotals = packagesArray.map(({ label }) => {
    const isRemote =
      (packageName === "Remote Punching" || packageName === "Remote Task") &&
      ![
        "Intermediate Plan",
        "Enterprise Plan",
        "Essential Plan",
        "Basic Plan",
      ].includes(doc?.packageInfo);

    const quantity = isRemote
      ? remoteEmpCount
      : label === "Fullskape"
      ? studentCount
      : memberCount;

    const baseTotal = (priceStore[label] || 0) * cycleCount * quantity;
    const gstAmount = baseTotal * 0.18;
    const finalTotal = baseTotal + gstAmount;

    return {
      name: label,
      finalTotal: parseFloat(finalTotal.toFixed(2)),
    };
  });

  function calculateTotal(selectedPackages, packageTotals, baseHrmsPriceTotal) {
    console.log(
      "selectedPackages,packageTotals,baseHrmsPriceTotal",
      selectedPackages,
      packageTotals,
      baseHrmsPriceTotal
    );

    const selectedTotal = packageTotals
      .filter((pkg) => selectedPackages.includes(pkg.name))
      .reduce((sum, pkg) => sum + pkg.total, 0);
    console.log("selectedTotal", selectedTotal);

    return selectedTotal + baseHrmsPriceTotal;
  }
  console.log(
    "Invoice Total Amount:",
    calculateTotal(selectedPackages, packageTotals, baseHrmsPriceTotal)
  );

  //calculate total for column GST Amount (18%)
  const calculateTotalGST = (selectedPackages, packageTotals, baseHrmsGST) => {
    const packageTotal = packageTotals
      .filter((pkg) => selectedPackages.includes(pkg.name))
      .reduce((sum, pkg) => sum + pkg.total, 0);

    const totalAmount = packageTotal * 0.18;
    const gstAmount = totalAmount + baseHrmsGST;
    return gstAmount.toFixed(2);
  };

  const finalGSTAmount =
    Number(
      calculateTotal(selectedPackages, packageTotals, baseHrmsPriceTotal)
    ) + Number(calculateTotalGST(selectedPackages, packageTotals, baseHrmsGST));

  //pdf download
  const handleDownloadClick = () => {
    const element = document.getElementById("pdfContent");
    const opt = {
      margin: 1,
      filename: "invoice.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();
  };

  const formattedInvoiceNumber = String(
    doc?.subscriptionDetails?.invoiceNumber
  ).padStart(4, "0");

  //invoice year
  // Get the current year
  const currentYear = new Date().getFullYear();

  // Determine the financial year range (e.g., "24-25" for 2024-2025)
  const financialYearStart = String(currentYear).slice(-2); // Last two digits of current year
  const financialYearEnd = String(currentYear + 1).slice(-2); // Last two digits of next year
  const financialYearRange = `${financialYearStart}-${financialYearEnd}`;

  // Invoice Number in the desired format
  const invoiceNumber = `${financialYearRange}/ATS/IT${formattedInvoiceNumber}`;

  // Calculate totals for each service
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

  const capitalizeFirstLetter = (text) => {
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  let amountInWords = toWords(finalGSTAmount);

  amountInWords = capitalizeFirstLetter(amountInWords.replace(/[-,]/g, ""));

  let fullskagePrice =
    doc?.studentCount <= 25
      ? 16
      : doc?.studentCount >= 26 && doc?.studentCount < 200
      ? 14
      : doc?.studentCount >= 200
      ? 12
      : 0;

  return (
    <div>
      <Grid
        lg={12}
        md={12}
        sm={12}
        xs={12}
        container
        id="pdfContent"
        direction="row"
        sx={{
          justifyContent: "flex-start",
          alignItems: "center",
          border: "1px solid grey",
        }}
      >
        <Grid
          lg={12}
          md={12}
          sm={12}
          xs={12}
          className="flex justify-center"
          sx={{ borderBottom: "1px solid grey", pb: 1 }}
        >
          <Typography sx={{ fontSize: "28px" }}>Tax Invoice</Typography>
        </Grid>
        <Grid item lg={3} md={3} sm={6} xs={12}>
          <img
            src={hrmsImg || "/placeholder.svg"}
            alt=""
            style={{ width: "150px" }}
          />
        </Grid>
        <Grid
          item
          lg={9}
          md={9}
          sm={6}
          xs={12}
          sx={{ textAlign: "right", pr: 2, pb: 2 }}
        >
          <Typography variant="h5">
            Argan Technology Services Private Limited
          </Typography>
          <Typography variant="body2">
            Address:14th floor office no 1401, S.No 36/2,
            <br />
            Maruti Chowk Mumbai-Pune-Bengaluru Highway, Pune Banglore Highway
            <br />
            Pashan Exit, next to Tata Showroom, Baner, Pune, Maharashtra 411045
            <br />
            Ph. no.: 9082462161 Email: sales@aegishrms.com
            <br />
            GSTIN: 27AAVCA3805B1ZS
            <br />
            State: 27-Maharashtra
          </Typography>
        </Grid>
        <Grid container lg={12}>
          <Grid item lg={6} sx={{ borderRight: "1px solid grey" }}>
            <Box sx={{ bgcolor: "#1976d2", pb: 2, px: 2 }}>
              <Typography variant="body1" sx={{ color: "white" }}>
                Bill To
              </Typography>
            </Box>
            <Box sx={{ pb: 2, px: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {`${doc?.orgName}`}
              </Typography>
              <Typography variant="body2">
                {`${doc?.location?.address}`}
                <br />
                Contact No.: {`${doc?.contact_number}`}
              </Typography>
              <Typography variant="body2">
                {`${doc?.location?.address}`}
                <br />
              </Typography>
              {doc?.gst_number ? (
                <Typography variant="body2">
                  GST No.: {doc.gst_number}
                </Typography>
              ) : null}
            </Box>
          </Grid>
          <Grid
            item
            lg={6}
            sx={{ borderRight: "1px solid grey", textAlign: "right" }}
          >
            <Box sx={{ bgcolor: "#1976d2", pb: 2, px: 2 }}>
              <Typography variant="body1" sx={{ color: "white" }}>
                Invoice Details
              </Typography>
            </Box>
            <Box sx={{ pb: 2, px: 2 }}>
              <Typography variant="body2">
                Invoice No.: {invoiceNumber}
                <br />
                Date: {paymentformattedDate}
                <br />
                Due Date: {formattedDate}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Invoice Table */}
        <TableContainer
          component={Paper}
          sx={{ width: "100%", border: "1px solid grey" }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#1976d2" }}>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    borderRight: "1px solid grey",
                  }}
                >
                  Sr. No
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    borderRight: "1px solid grey",
                  }}
                >
                  Item Name
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    borderRight: "1px solid grey",
                  }}
                >
                  SAC
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    borderRight: "1px solid grey",
                  }}
                >
                  Price per Employee
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    borderRight: "1px solid grey",
                  }}
                >
                  number of months
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    borderRight: "1px solid grey",
                  }}
                >
                  Total Employee/Nos
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    borderRight: "1px solid grey",
                  }}
                >
                  Taxable Price
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    borderRight: "1px solid grey",
                  }}
                >
                  GST(18%)
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell
                  sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                >
                  1
                </TableCell>
                <TableCell
                  sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                >
                  Aegis HRMS Software ({packageName})
                </TableCell>
                <TableCell
                  sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                >
                  997331
                </TableCell>
                <TableCell
                  sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                >
                  ₹ {baseHrmsPrice}
                </TableCell>
                <TableCell
                  sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                >
                  {cycleCount}
                </TableCell>
                <TableCell
                  sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                >
                  {memberCount}
                </TableCell>
                <TableCell
                  sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                >
                  ₹ {baseHrmsPriceTotal}
                </TableCell>
                <TableCell
                  sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                >
                  ₹ {baseHrmsGST}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  ₹ {baseHrmsGSTTotal}
                </TableCell>
              </TableRow>
              {doc?.packageInfo === "Fullskape Plan" && studentCount > 0 ? (
                <TableRow>
                  <TableCell
                    sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                  >
                    {2}
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                  >
                    Fullskape{" "}
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                  >
                    997331
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                  >
                    ₹ {fullskagePrice}
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                  >
                    {cycleCount}
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                  >
                    {studentCount}
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                  >
                    ₹{fullskagePrice * studentCount * cycleCount}
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                  >
                    ₹
                    {parseFloat(
                      (
                        fullskagePrice *
                        studentCount *
                        cycleCount *
                        0.18
                      ).toFixed(2)
                    )}
                  </TableCell>

                  <TableCell sx={{ textAlign: "center" }}>
                    ₹
                    {(
                      fullskagePrice *
                      studentCount *
                      cycleCount *
                      1.18
                    ).toFixed(2)}
                  </TableCell>
                </TableRow>
              ) : null}
              {doc?.packages?.map((packageName, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                  >
                    {index + 2}
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                  >
                    {packageName}
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                  >
                    997331
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                  >
                    ₹ {priceStore[packageName] || 0}
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                  >
                    {cycleCount}
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                  >
                    {(packageName === "Remote Punching" ||
                      packageName === "Remote Task") &&
                    doc?.packageInfo !== "Intermediate Plan" &&
                    doc?.packageInfo !== "Enterprise Plan"
                      ? remoteEmpCount
                      : packageName === "Fullskape"
                      ? studentCount
                      : memberCount}
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                  >
                    ₹{" "}
                    {packageTotals.find((pkg) => pkg.name === packageName)
                      ?.total || 0}
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                  >
                    ₹{" "}
                    {packageGSTTotals.find((pkg) => pkg.name === packageName)
                      ?.gst || 0}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    ₹{" "}
                    {packageFinalTotals.find((pkg) => pkg.name === packageName)
                      ?.finalTotal || 0}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell
                  sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                ></TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    borderRight: "1px solid grey",
                    fontWeight: "bold",
                  }}
                >
                  Total
                </TableCell>
                <TableCell
                  sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                ></TableCell>
                <TableCell
                  sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                ></TableCell>
                <TableCell
                  sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                ></TableCell>
                <TableCell
                  sx={{ textAlign: "center", borderRight: "1px solid grey" }}
                ></TableCell>
                {doc?.packageInfo === "Fullskape Plan" && studentCount > 0}
                <TableCell
                  sx={{
                    textAlign: "center",
                    borderRight: "1px solid grey",
                    fontWeight: "bold",
                  }}
                >
                  ₹{" "}
                  {calculateTotal(
                    selectedPackages,
                    packageTotals,
                    baseHrmsPriceTotal
                  )}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    borderRight: "1px solid grey",
                    fontWeight: "bold",
                  }}
                >
                  ₹{" "}
                  {calculateTotalGST(
                    selectedPackages,
                    packageTotals,
                    baseHrmsGST
                  )}
                </TableCell>
                <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>
                  ₹ {finalGSTAmount}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container>
          <Grid lg={6} sx={{ borderRight: "1px solid grey" }}>
            <Grid
              sx={{
                bgcolor: "#1976d2",
                borderRight: "1px solid grey",
                px: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", color: "white", p: 1 }}
              >
                Amount In Words
              </Typography>
            </Grid>
            <Box sx={{ pb: 2, px: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1 }}>
                {amountInWords} Rupees Only
              </Typography>
            </Box>
          </Grid>
          <Grid container lg={6}>
            <Grid lg={12} sx={{ borderRight: "1px solid grey" }}>
              <Grid
                sx={{
                  bgcolor: "#1976d2",
                  borderRight: "1px solid grey",
                  px: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "white", p: 1 }}
                >
                  Total Amount
                </Typography>
              </Grid>
              <Box sx={{ pb: 2, px: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1 }}>
                  ₹ {finalGSTAmount}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Grid container sx={{ mb: 4 }}>
          <Grid
            item
            lg={12}
            sx={{
              borderRight: "1px solid grey",
              borderBottom: "1px solid grey",
            }}
          >
            <Box sx={{ bgcolor: "#1976d2", pb: 2, px: 2 }}>
              <Typography variant="body1" sx={{ color: "white" }}>
                Bank Details
              </Typography>
            </Box>
            <Grid
              container
              sx={{ borderRight: "1px solid grey", height: "300px" }}
            >
              <Grid lg={6} sx={{ borderRight: "1px solid grey", p: 2 }}>
                <Box sx={{ display: "flex" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Name : HDFC BANK, WAKAD
                    <br />
                    Account No. : 50200060324080
                    <br />
                    IFSC code : HDFC0004887
                    <br />
                    Name : Argan Technology Services Pvt Ltd
                  </Typography>
                  <img
                    src={QRcodeImg || "/placeholder.svg"}
                    alt=""
                    style={{
                      width: "150px",
                      height: "200px",
                      marginLeft: "20px",
                    }}
                  />
                </Box>
              </Grid>
              <Grid
                container
                lg={6}
                sx={{
                  p: 2,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Grid item lg={12} sx={{ textAlign: "center" }}>
                  <Typography variant="p" sx={{ fontSize: "30px" }}>
                    Authorized Signature
                  </Typography>
                  <br />
                </Grid>
                <Grid
                  item
                  lg={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <img
                    src={SignImg || "/placeholder.svg"}
                    alt=""
                    style={{ width: "250px" }}
                  />
                </Grid>
                <Typography variant="p" sx={{ fontSize: "22px" }}>
                  Rahul Gaikwad
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid sx={{ borderTop: "1px solid grey", p: 2, mt: "100px" }}>
          <Typography variant="body2">
            1. AEGIS HRMS subscription will be activated post receipt of
            complete payment of selected subscription module.
            <br />
            2. Client has to provide necessary date related to Company Name,
            Hierarchy/Organisation Structure, employee details, Attendance
            System if any to integrate the input data in AEGIS HRMS for smooth
            operations.
            <br /> 3. Revised scope in subscription, change in employee numbers,
            additional customised modules apart from selected subscription will
            lead to price revision & to be paid separately.
            <br /> 4. Applicable 18 % GST as Indian Govt Taxation rules will be
            extra.
            <br />
            2% charge applies to third-party payments as a platform fee.
            <br /> 5. Validity of this proposal is for 14 days from the date of
            the proposal.
            <br /> 6. All AEGIS HRMS subscription /licence needs to be renewed
            per year as these Solutions are valid for 1 year from the date of
            activation.
            <br /> 7. All AEGIS HRMS subscription /licence operates on the Auto
            renewal mode unless notified for deactivation.
            <br /> 8. All AEGIS HRMS subscription /licence require Internet
            Connection during the operation.
            <br /> 9. All AEGIS HRMS subscription /licence provides inbuilt Data
            management & secure file exchange features.
            <br /> 10. Technical Updates:-As per the application update cycle
            for 1 year Technical Support:- One Year. Training:-3 to 4 days
            Dedicated Session on AEGIS HRMS online or at Pune location at no
            other extra charges.
            <br /> 11. AEGIS HRMS will provide training to client nominated reps
            for smoother operations through online.
            <br /> 12. The proposal does not cover the costs for travel to
            client premises if any post installation for training etc. All such
            cost be extra.
            <br /> 13. Terms & Conditions ,Intellectual Property Rights and
            Other conditions are applicable as mentioned on our website
            www.aegishrms.com
            <br /> 14. Subject to Pune, Maharashtra Jurisdiction
          </Typography>
          <Typography sx={{ fontWeight: "bold" }}>
            Note:-Payment made & Order once placed cannot be cancelled.
          </Typography>
        </Grid>
      </Grid>

      <div className="flex justify-end item-right">
        <IconButton onClick={handleDownloadClick}>
          <Button variant="outlined">Download</Button>
        </IconButton>
      </div>
    </div>
  );
};

export default InvoiceModal;
