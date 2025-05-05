// import { AddCircle, QuestionMark } from "@mui/icons-material";
// import { IconButton } from "@mui/material";
// import React, { useState } from "react";
// import BasicButton from "../../../../components/BasicButton";
// import PackageInfo from "../../../../components/Modal/PackagesModal/package-info";
// const array = [
//   {
//     packageName: "Access control",
//     Basic: "✓",
//     Intermediate: "✓",
//     Enterprise: "✓",
//     Fullskape: "✓",
//   },
//   {
//     packageName: "Dual approval workflow",
//     Basic: "✓",
//     Intermediate: "✓",
//     Enterprise: "✓",
//   },
//   {
//     packageName: "Employee onboarding / offboarding",
//     Basic: "✓",
//     Intermediate: "✓",
//     Enterprise: "✓",
//     Fullskape: "✓",
//   },
//   {
//     packageName: "Department creation",
//     Basic: "✓",
//     Intermediate: "✓",
//     Enterprise: "✓",
//     Fullskape: "✓",
//   },
//   {
//     packageName: "Dashboard",
//     Basic: "✓",
//     Intermediate: "✓",
//     Enterprise: "✓",
//     Fullskape: "✓",
//   },
// ];

// const tiers = [
//   { tier: "Tier 1", students: 25, price: 16 },
//   { tier: "Tier 2", students: 50, price: 14 },
//   { tier: "Tier 3", students: 200, price: 12 },
// ];
 
// const PricingCard = ({
//   h1 = "Basic Plan",
//   price = 55,
//   mapArray = array,
//   downDescriptionText = "Click to 11 more packages",
//   onChange = () => null,
//   packageId,
//   value,
//   disabled = false,
//   button = true,
//   isFullskape = false,
// }) => {
//   const [confirmOpen, setConfirmOpen] = useState(false);

//   return (
//     <div
//       className={`group shadow-xl w-full max-w-[270px]  relative rounded-lg bg-white p-[20px] flex flex-col gap-2 border hover:border-brand/primary-blue ${
//         value?.packageId === packageId
//           ? "border-brand/primary-blue" // Highlight selected card
//           : "border-Brand-washed-blue/brand-washed-blue-8"
//       }`}
//       onClick={() => {
//         if (!disabled) {
//           onChange({ packageName: h1, packageId });
//         }
//       }}
//     >
//       <IconButton
//         color="info"
//         className="h-8 w-8 !absolute !bg-[#1414fe] right-4 top-4"
//         aria-label="check"
//         onClick={() => setConfirmOpen(true)}
//       >
//         <QuestionMark className="text-white text-xs" />
//       </IconButton>
//       <div className="flex-grow">
//         <h1 className="text-2xl font-medium">{h1}</h1>
//         <h3 className="text-lg font-bold">
//           ₹ {price} <span className="text-sm font-medium">{isFullskape ? "/student" : "/emp"}</span>
//         </h3>
//         <div className="text-sm">billed quarterly</div>
//         <div className="flex flex-col gap-2 text-sm">
//           {mapArray.map((doc, key) => (
//             <div key={key} className="flex gap-2">
//               <div className="w-6 h-6 text-center">✓</div>
//               <div className="text-Brand-washed-blue/brand-washed-blue-10">
//                 {doc?.packageName}
//               </div>
//             </div>
//           ))}
//           <div
//             className="flex gap-2 text-[#1414fe] cursor-pointer"
//             onClick={async () => setConfirmOpen(true)}
//           >
//             <div className="w-6 h-6 text-center ">
//               <AddCircle className="text-xs" fontSize="small" />
//             </div>
//             <div>{downDescriptionText}</div>
//           </div>
//         </div>
//       </div>
//       {button && (
//         <div className="w-full">
//           <BasicButton
//             className="!w-[100%]"
//             title={"Get Started"}
//             type="submit"
//             disabled={disabled}
//           />
//         </div>
//       )}
//       <PackageInfo
//         open={confirmOpen}
//         handleClose={() => {
//           setConfirmOpen(false);
//         }}
//       />
//     </div>
//   );
// };

// export default PricingCard;


import { AddCircle, QuestionMark } from "@mui/icons-material";
import { IconButton, Select, MenuItem } from "@mui/material";
import React, { useState } from "react";
import BasicButton from "../../../../components/BasicButton";
import PackageInfo from "../../../../components/Modal/PackagesModal/package-info";

const array = [
  { packageName: "Access control", Basic: "✓", Intermediate: "✓", Enterprise: "✓", Fullskape: "✓" },
  { packageName: "Dual approval workflow", Basic: "✓", Intermediate: "✓", Enterprise: "✓" },
  { packageName: "Employee onboarding / offboarding", Basic: "✓", Intermediate: "✓", Enterprise: "✓", Fullskape: "✓" },
  { packageName: "Department creation", Basic: "✓", Intermediate: "✓", Enterprise: "✓", Fullskape: "✓" },
  { packageName: "Dashboard", Basic: "✓", Intermediate: "✓", Enterprise: "✓", Fullskape: "✓" },
];

const tiers = [
  { tier: "Tier 1", description: "For up to 25 students", price: 16 },
  { tier: "Tier 2", description: "For 26 to 200 students", price: 14 },
  { tier: "Tier 3", description: "For more than 200 students", price: 12 },
];

const PricingCard = ({
  h1 = "Basic Plan",
  price = 55,
  mapArray = array,
  downDescriptionText = "Click to 11 more packages",
  onChange = () => null,
  packageId,
  value,
  disabled = false,
  button = true,
  isFullskape = false,
  isFullskapestep4 = false,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null); // Track selected tier

  const handleTierSelect = (tier) => {
    setSelectedTier(tier); // Update the selected tier
  };

  return (
    <div
      className={`group shadow-xl w-full max-w-[270px] relative rounded-lg bg-white p-[20px] flex flex-col gap-2 border hover:border-brand/primary-blue ${
        value?.packageId === packageId ? "border-brand/primary-blue" : "border-Brand-washed-blue/brand-washed-blue-8"
      }`}
      onClick={() => {
        if (!disabled) {
          onChange({ packageName: h1, packageId });
        }
      }}
    >
      <IconButton
        color="info"
        className="h-8 w-8 !absolute !bg-[#1414fe] right-4 top-4"
        aria-label="check"
        onClick={() => setConfirmOpen(true)}
      >
        <QuestionMark className="text-white text-xs" />
      </IconButton>
      <div className="flex-grow">
        <h1 className="text-2xl font-medium">{h1}</h1>
        <h3 className="text-lg font-bold">
          ₹ {selectedTier?.price || price}{" "}
          <span className="text-sm font-medium">{isFullskape || isFullskapestep4 ? "/student" : "/emp"}</span>
        </h3>
        <div className="text-sm">billed quarterly</div>
        <div className="flex flex-col gap-2 text-sm">
          {mapArray.map((doc, key) => (
            <div key={key} className="flex gap-2">
              <div className="w-6 h-6 text-center">✓</div>
              <div className="text-Brand-washed-blue/brand-washed-blue-10">{doc?.packageName}</div>
            </div>
          ))}
          <div
            className="flex gap-2 text-[#1414fe] cursor-pointer"
            onClick={async () => setConfirmOpen(true)}
          >
            <div className="w-6 h-6 text-center ">
              <AddCircle className="text-xs" fontSize="small" />
            </div>
            <div>{downDescriptionText}</div>
          </div>
        </div>
        {isFullskape && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Select a Tier:</label>
            <Select
              value={selectedTier?.tier || ""}
              onChange={(e) => handleTierSelect(tiers.find((tier) => tier.tier === e.target.value))}
              fullWidth
              displayEmpty
              disabled={disabled}
            >
              <MenuItem value="" disabled>
                Choose Tier
              </MenuItem>
              {tiers.map((tier, index) => (
                <MenuItem key={index} value={tier.tier}>
                  <div>
                    <strong>{tier.tier}</strong> - ₹{tier.price} / student
                    <div className="text-xs text-gray-500">{tier.description}</div>
                  </div>
                </MenuItem>
              ))}
            </Select>
          </div>
        )}
      </div>
      {button && (
        <div className="w-full">
          <BasicButton
            className="!w-[100%]"
            title={"Get Started"}
            type="submit"
            disabled={(isFullskape) && !selectedTier} // Button is disabled if isFullskape is true and no tier is selected
          />
        </div>
      )}

      <PackageInfo
        open={confirmOpen}
        handleClose={() => {
          setConfirmOpen(false);
        }}
      />
    </div>
  );
};

export default PricingCard;
