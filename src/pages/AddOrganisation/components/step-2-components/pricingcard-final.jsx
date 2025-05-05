import { Card, CardContent } from "@mui/material";
import React, { useMemo } from "react";
import useOrg from "../../../../State/Org/Org";

const PricingCardSummary = ({
  packageInfo = {},
  basePrice = 0,
  discount = 0,
  gstRate = 18, // Allow dynamic GST rate
  paymentType = "",
  selectedPackages = [],
}) => {
  // Function to determine base package price
  const getBasePackagePrice = useMemo(() => {
    const { packageName, count = 0 } = packageInfo || {};
    const packagePrices = {
      "Basic Plan": 55,
      "Essential Plan": 25,
      "Intermediate Plan": 85,
    };

    if (packagePrices[packageName]) return packagePrices[packageName];
    if (packageName === "Fullskape Plan") {
      if (count <= 25) return 16;
      if (count <= 199) return 14;
      return 12;
    }
    return 0;
  }, [packageInfo]);

  console.log("sdsad", selectedPackages);

  // Calculate additional package total
  const additionalPackagesTotal = useMemo(() => {
    return selectedPackages.reduce((sum, pkg) => sum + (pkg.price || 0), 0);
  }, [selectedPackages]);

  // Calculate final per-employee price
  const pricePerEmployee = useMemo(() => {
    return getBasePackagePrice + additionalPackagesTotal;
  }, [getBasePackagePrice, additionalPackagesTotal]);

  // Dynamic GST calculation
  const gstAmount = useMemo(
    () => (basePrice - discount) * (gstRate / 100),
    [basePrice, discount, gstRate]
  );

  // Platform fee calculation (Only for RazorPay)ß
  const platformFee = useMemo(() => {
    if (paymentType === "RazorPay") {
      return (basePrice + gstAmount) * 0.02; // 2% fee
    }
    return 0;
  }, [paymentType, basePrice, gstAmount]);

  const { hiringPosition } = useOrg();
  console.log("hiringPosition", hiringPosition);

  return (
    <Card className="max-w-2xl w-full mx-auto p-6 sm:p-8 shadow-lg rounded-2xl border border-gray-300 bg-white">
      <CardContent className="space-y-6 text-gray-800">
        {/* Price Per Employee at the top */}
        <div className="border-b pb-4 text-center text-xl font-semibold text-gray-900">
          <p>Price per Employee: ₹{pricePerEmployee.toFixed(2)}</p>
        </div>

        {/* Selected Additional Packages */}
        {selectedPackages.length > 0 && (
          <div className="border-b pb-4">
            <h3 className="font-medium text-lg">Additional Packages</h3>
            <ul className="text-md">
              {selectedPackages.map((pkg, index) => (
                <li key={index} className="flex justify-between">
                  <span>{pkg.label}</span>
                  {pkg.value === "Hiring" ? (
                    <span className="font-medium">
                      ₹{(pkg.price * hiringPosition).toFixed(2)}
                    </span>
                  ) : (
                    <span className="font-medium">₹{pkg.price.toFixed(2)}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Price Breakdown */}
        <div className="space-y-2 text-md">
          <p className="flex justify-between">
            <span>Base Price:</span>
            <span className="font-medium">₹{basePrice.toFixed(2)}</span>
          </p>
          {discount > 0 && (
            <p className="flex justify-between text-green-600">
              <span>Discount:</span>
              <span className="font-medium">-₹{discount.toFixed(2)}</span>
            </p>
          )}
          <p className="flex justify-between">
            <span>GST ({gstRate}%):</span>
            <span className="font-medium">₹{gstAmount.toFixed(2)}</span>
          </p>
          {platformFee > 0 && (
            <p className="flex justify-between">
              <span>Platform Fee (2%):</span>
              <span className="font-medium">₹{platformFee.toFixed(2)}</span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCardSummary;
