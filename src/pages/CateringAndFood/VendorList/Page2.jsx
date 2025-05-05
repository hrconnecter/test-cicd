

// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
// import useVendorState from "../../../hooks/Vendor-Onboarding/useVendorState";
// import { Work, ContactMail, Key, KeyOff } from "@mui/icons-material";

// const Page2 = ({ isLastStep, nextStep, prevStep }) => {
//   const [visiblePassword, setVisiblePassword] = useState(false);
//   const [visibleCPassword, setVisibleCPassword] = useState(false);

//   const {
//     vendorId,
//     confirmPassword,
//     password,
//     payment_info,
//     selectedFrequency,
//     companyname,
//     setStep2Data,
//   } = useVendorState();

//   const VendorSchema = z
//     .object({
//       password: z
//         .string()
//         .min(8)
//         .refine(
//           (value) =>
//             /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
//               value
//             ),
//           {
//             message:
//               "Password must be 8+ characters with 1 number and 1 special character.",
//           }
//         ),
//       confirmPassword: z.string(),
//       payment_info: z.string(),
//       vendorId: z
//         .string()
//         .min(1, { message: "Vendor code is required" })
//         .max(25, { message: "Vendor code cannot exceed 25 characters." }),
//       companyname: z.string(),
//       profile: z.string().array().optional(),

//       selectedFrequency: z.object(
//         {
//           label: z.string(),
//           value: z.string(),
//         },
//         "selected value"
//       ),
//     })
//     .refine((data) => data.password === data.confirmPassword, {
//       message: "Passwords don't match",
//       path: ["confirmPassword"],
//     });

//   const { control, formState,setValue, handleSubmit } = useForm({
//     defaultValues: {
//       vendorId,
//       confirmPassword,
//       password,
//       selectedFrequency,
//       payment_info,
//       companyname,
//     },
//     resolver: zodResolver(VendorSchema),
//   });

//   const { errors } = formState;


//   const onSubmit = (data) => {
//     console.log("Form data:", {
//       ...data,
//       // uploadedFiles,
//       // selectedDocumentType,
//       selectedFrequency,
//     });
//     setStep2Data(data);
//     nextStep();
//   };

//   return (
//     <div className="w-full mt-1">
//       <h1 className="text-2xl mb-3 font-bold">Company Info</h1>
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="w-full flex flex-col space-y-4"
//       >
//         <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-4">
//           <AuthInputFiled
//             name="vendorId"
//             icon={Work}
//             control={control}
//             type="text"
//             placeholder="Vendor Code"
//             label="Vendor Code *"
//             errors={errors}
//             error={errors.vendorId}
//             className="text-sm"
//           />
//           <AuthInputFiled
//             name="companyname"
//             icon={ContactMail}
//             control={control}
//             type="text"
//             placeholder="Company Name"
//             label="Vendor Company Name *"
//             errors={errors}
//             error={errors.companyname} // Corrected from companyemail to companyname
//             className="text-sm"
//             wrapperMessage="Note this email is used for login credentials"
//           />
//         </div>

//         <AuthInputFiled
//           name="selectedFrequency"
//           control={control}
//           type="select"
//           options={[
//             { label: "Daily", value: "Daily" },
//             { label: "Weekly", value: "Weekly" },
//             { label: "Monthly", value: "Monthly" },
//             { label: "Fortnightly", value: "Fortnightly" },
//           ]}
//           placeholder="Select Frequency"
//           label="Select Frequency *"
//           descriptionText= {
//             " Vendor can upload the menu based on the selected frequency."
//           }
//           errors={errors}
//           error={errors.selectedFrequency}
//         />

//         <AuthInputFiled
//           name="payment_info"
//           control={control}
//           placeholder="Enter Upi_Id"
//           type="text"
//           label="Payment Information (UPI ID)"
//           errors={errors}
//           error={errors.payment_info}
//         />

//         <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-4">
//           <AuthInputFiled
//             name="password"
//             visible={visiblePassword}
//             setVisible={setVisiblePassword}
//             icon={Key}
//             control={control}
//             type="password"
//             label="Password *"
//             errors={errors}
//             error={errors.password}
//             className="text-sm"
//           />
//           <AuthInputFiled
//             name="confirmPassword"
//             visible={visibleCPassword}
//             setVisible={setVisibleCPassword}
//             icon={KeyOff}
//             control={control}
//             type="password"
//             label="Confirm Password *"
//             errors={errors}
//             error={errors.confirmPassword}
//             className="text-sm"
//           />
//         </div>

//         <div className="flex items-end justify-between w-full">
//           <button
//             type="button"
//             onClick={prevStep}
//             className="flex items-center justify-center px-6 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 rounded-md"
//           >
//             Prev
//           </button>
//           <button
//             type="submit"
//             disabled={isLastStep}
//             className="flex items-center justify-center px-6 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 rounded-md"
//           >
//             Next
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Page2;




import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useVendorState from "../../../hooks/Vendor-Onboarding/useVendorState";
import { Work, ContactMail, Key, KeyOff } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { useQuery } from "react-query";
import { useParams } from "react-router";
import axios from "axios";
import { UseContext } from "../../../State/UseState/UseContext";

const Page2 = ({ isLastStep, nextStep, prevStep }) => {
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleCPassword, setVisibleCPassword] = useState(false);

  const { setStep2Data } = useVendorState();
  // const { vendorId } = useParams();
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { employeeId } = useParams();
  const VendorSchema = z
    .object({
      vendorId: z
        .string()
        .min(1, { message: "Vendor code is required" })
        .max(25, { message: "Vendor code cannot exceed 25 characters." }),
      companyname: z.string(),
      password: z
        .string()
        .min(8)
        .refine(
          (value) =>
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
              value
            ),
          {
            message:
              "Password must be 8+ characters with 1 number and 1 special character.",
          }
        ),
      confirmPassword: z.string(),
      payment_info: z.string(),
      selectedFrequency: z.object({
        label: z.string(),
        value: z.string(),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  const { control, formState, setValue, handleSubmit } = useForm({
    defaultValues: {
      vendorId: "",
      companyname: "",
      password: "",
      confirmPassword: "",
      payment_info: "",
      selectedFrequency: { label: "", value: "" },
    },
    resolver: zodResolver(VendorSchema),
  });

 // for getting the data existing employee and set the value
 const { isLoading } = useQuery(
  ["employeeId", employeeId],
  async () => {
    if (employeeId !== null && employeeId !== undefined) {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/get/profile/${employeeId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      return response.data;
    }
  },

    {
      onSuccess: (data) => {
        if (data) {
          setValue("vendorId", data.employee.vendorId || "");
          setValue("companyname", data.employee.companyname || "");
          // setValue("password", data.employee.password || "");
          // setValue("confirmPassword", data.employee.confirmPassword || "");
          setValue("payment_info", data.employee.payment_info || "");
          setValue("selectedFrequency", {label: data.employee.selectedFrequency[0]?.label , value: data.employee.selectedFrequency[0]?.value} || {});
        }
      },
    }
  );

  const { errors } = formState;

  const onSubmit = (data) => {
    setStep2Data(data);
    nextStep();
  };

  return (
    <div className="w-full mt-1">
      <h1 className="text-2xl mb-3 font-bold">Company Info</h1>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-4">
            <AuthInputFiled
              name="vendorId"
              icon={Work}
              control={control}
              type="text"
              placeholder="Vendor Code"
              label="Vendor Code *"
              errors={errors}
              error={errors.vendorId}
              className="text-sm"
            />
            <AuthInputFiled
              name="companyname"
              icon={ContactMail}
              control={control}
              type="text"
              placeholder="Company Name"
              label="Vendor Company Name *"
              errors={errors}
              error={errors.companyname}
              className="text-sm"
            />
          </div>

          <AuthInputFiled
            name="selectedFrequency"
            control={control}
            type="select"
            options={[
              { label: "Daily", value: "Daily" },
              { label: "Weekly", value: "Weekly" },
              { label: "Monthly", value: "Monthly" },
              { label: "Fortnightly", value: "Fortnightly" },
            ]}
            placeholder="Select Frequency"
            label="Select Frequency *"
            errors={errors}
            error={errors.selectedFrequency}
          />

          <AuthInputFiled
            name="payment_info"
            control={control}
            placeholder="Enter UPI ID"
            type="text"
            label="Payment Information (UPI ID)"
            errors={errors}
            error={errors.payment_info}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-4">
            <AuthInputFiled
              name="password"
              visible={visiblePassword}
              setVisible={setVisiblePassword}
              icon={Key}
              control={control}
              type="password"
              label="Password *"
              errors={errors}
              error={errors.password}
              className="text-sm"
            />
            <AuthInputFiled
              name="confirmPassword"
              visible={visibleCPassword}
              setVisible={setVisibleCPassword}
              icon={KeyOff}
              control={control}
              type="password"
              label="Confirm Password *"
              errors={errors}
              error={errors.confirmPassword}
              className="text-sm"
            />
          </div>

          <div className="flex items-end justify-between w-full">
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center justify-center px-6 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 rounded-md"
            >
              Prev
            </button>
            <button
              type="submit"
              disabled={isLastStep}
              className="flex items-center justify-center px-6 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 rounded-md"
            >
              Next
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Page2;
