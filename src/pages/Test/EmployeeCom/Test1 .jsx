import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AccountBalance,
  AccountBox,
  ContactEmergency,
  Email,
  LocationOn,
  Person,
  TodayOutlined,
} from "@mui/icons-material";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useEmpState from "../../../hooks/Employee-OnBoarding/useEmpState";
import BasicButton from "../../../components/BasicButton";
import { useParams } from "react-router-dom";
import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";
import { useEffect, useState } from "react";
import axios from "axios";

export const isAtLeastNineteenYearsOld = (value) => {
  const currentDate = new Date();
  const dob = new Date(value);
  let differenceInYears = currentDate.getFullYear() - dob.getFullYear();
  const monthDiff = currentDate.getMonth() - dob.getMonth();

  // If the birth month is after the current month, reduce the age by 1
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && currentDate.getDate() < dob.getDate())
  ) {
    differenceInYears--;
  }

  return differenceInYears >= 19;
};

const Test1 = ({ nextStep, prevStep, isFirstStep, isLastStep }) => {
  const {
    setStep1Data,
    first_name,
    last_name,
    email,
    gender,
    phone_number,
    address,
    citizenship,
    adhar_card_number,
    pan_card_number,
    bank_account_no,
    date_of_birth,
    pwd,
    uanNo,
    esicNo,
    remotepunch,
  } = useEmpState();

  const { organisationId } = useParams();

  const { data } = useSubscriptionGet({ organisationId });

  const isremotepunching =
    data?.organisation?.packages?.includes("Remote Punching");
  console.log("isremotepunching", data?.organisation?.packages);

  const [remotePunchCount, setRemotePunchCount] = useState(0);
  const [finalcount, setFinalCount] = useState(0);

  console.log(`🚀 ~ remotePunchCount:`, remotePunchCount);

  console.log("test");

  const EmployeeSchema = z.object({
    first_name: z
      .string()
      .min(1, { message: "Minimum 1 character required" })
      .max(15, { message: "Maximum 15 character allowed" })
      .regex(/^[a-zA-Z]+$/, { message: "Only character allowed" }),
    last_name: z
      .string()
      .min(1, { message: "Minimum 1 character required" })
      .max(15, { message: "Maximum 15 character allowed" })
      .regex(/^[a-zA-Z]+$/, { message: "Only character allowed" }),
    gender: z.string(),
    // email: z.string().email(),
    email: z
      .string()
      .email({ message: "Invalid email format" })
      .regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, {
        message:
          "Email must be in lowercase and should not contain capital letters",
      }),

    phone_number: z
      .string()
      // .max(10, { message: "Phone Number must be 10 digits" })
      .regex(/^\d*$/, {
        message: "Phone Number must be non-negative and contain only digits",
      })
      .refine((value) => value.length === 10 || value.length === 0, {
        message: "Phone Number must be exactly 10 digits or empty",
      }),
    address: z.string(),
    date_of_birth: z.string().refine(isAtLeastNineteenYearsOld, {
      message: "Employee must be at least 19 years old",
    }),
    citizenship: z
      .string()
      .min(3, { message: "min 3 character required" })
      .regex(/^[a-zA-Z]+$/, { message: "Only character allowed" }),
    adhar_card_number: z
      .string()
      .length(12, { message: "Aadhar number must be 12 digits." })
      .regex(/^(?:0|[1-9]\d*)$/, {
        message: "Aadhar number cannot be negative.",
      }),
    pan_card_number: z
      .string()
      .regex(/^([A-Z]){5}([0-9]){4}([A-Z]){1}$/, {
        message: "Invalid PAN No.",
      })
      .regex(/^[^*@]+$/, {
        message: "A PAN No cannot contain a special character, e.g., *,#.",
      }),
    bank_account_no: z
      .string()
      .max(35, { message: "Only 35 numbers allowed" })
      .regex(/^\d*$/, {
        message: "Bank number cannot be negative.",
      }),
    pwd: z.boolean().optional(),
    remotepunch: z.boolean().optional(),

    uanNo: z
      .string()
      .refine((value) => value === "" || /^\d{12}$/.test(value), {
        message: "UAN number must be a 12-digit number",
      })
      .optional(),
    esicNo: z
      .string()
      .refine((value) => value === "" || /^\d{17}$/.test(value), {
        message: "ESIC number must be a 17-digit number",
      })
      .optional(),
  });

  const { control, formState, handleSubmit, watch } = useForm({
    defaultValues: {
      first_name: first_name,
      last_name: last_name,
      date_of_birth: date_of_birth,
      email: email,
      gender: gender,
      phone_number: phone_number,
      address: address,
      citizenship: citizenship,
      adhar_card_number: adhar_card_number,
      pan_card_number: pan_card_number,
      bank_account_no: bank_account_no,
      pwd,
      uanNo: uanNo ? uanNo : undefined,
      esicNo: esicNo ? esicNo : undefined,
      remotepunch: remotepunch ? remotepunch : undefined,
    },
    resolver: zodResolver(EmployeeSchema),
  });

  const { errors } = formState;

  useEffect(() => {
    const fetchRemotePunchCount = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/remote-punch-employees`
      );
      const remotePunchCount = response.data.remotePunchCount;
      setFinalCount(remotePunchCount);
      setRemotePunchCount(remotePunchCount);
    };

    if (organisationId) {
      fetchRemotePunchCount();
    }
    // eslint-disable-next-line
  }, [organisationId]);

  useEffect(() => {
    if (remotePunchCount !== undefined && watch("remotepunch")) {
      setRemotePunchCount((prev) => prev - 1);
    } else {
      setRemotePunchCount(finalcount);
    }
    // eslint-disable-next-line
  }, [watch("remotepunch")]);

  useEffect(() => {
    const fetchRemotePunchCount = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/remote-punch-employees`
      );
      const remotePunchCount = response.data.remotePunchCount;
      setRemotePunchCount(remotePunchCount);
    };

    if (organisationId) {
      fetchRemotePunchCount();
    }
    // eslint-disable-next-line
  }, [organisationId]);

  // const remoteempcount = data?.organisation?.remoteEmpCount;
  const descriptionText = `Remote Employees you can add ${remotePunchCount}`;

  const onSubmit = async (data) => {
    // Convert the email to lowercase
    const processedData = {
      ...data,
      email: data.email.toLowerCase(), // Ensure the email is in lowercase
      profile: data.profile?.map((role) => role.value),
    };

    console.log(`🚀 ~ processedData:`, processedData);
    setStep1Data(processedData);
    nextStep();
  };

  return (
    <div className="w-full mt-1">
      <h1 className="text-2xl mb-3 font-bold">Personal Details</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex  flex-1 space-y-1 flex-col"
      >
        <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4">
          <AuthInputFiled
            name="first_name"
            icon={Person}
            control={control}
            type="text"
            placeholder="john"
            label="Employee First Name *"
            errors={errors}
            error={errors.first_name}
            className="text-sm"
          />

          <AuthInputFiled
            name="last_name"
            icon={Person}
            control={control}
            type="text"
            placeholder="Doe"
            label="Employee Last Name *"
            errors={errors}
            error={errors.last_name}
            className="text-sm"
          />

          <AuthInputFiled
            name="date_of_birth"
            icon={TodayOutlined}
            control={control}
            type="date"
            placeholder="dd-mm-yyyy"
            label="Date Of Birth *"
            errors={errors}
            error={errors.date_of_birth}
            className="text-sm"
          />
        </div>
        <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4">
          <AuthInputFiled
            name="email"
            icon={Email}
            control={control}
            type="text"
            placeholder="Employee Email"
            label="Employee  Email *"
            errors={errors}
            error={errors.email}
            className="text-sm"
          />

          <AuthInputFiled
            name="phone_number"
            icon={ContactEmergency}
            control={control}
            value={phone_number}
            type="number"
            placeholder="1234567890"
            label="Contact *"
            errors={errors}
            error={errors.phone_number}
            className="text-sm"
          />

          <AuthInputFiled
            name="address"
            icon={Person}
            control={control}
            // type="textarea"
            type="text"
            placeholder="Address"
            label="Current Address *"
            errors={errors}
            error={errors.address}
            className="text-sm"
          />
        </div>

        <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4">
          <div className=" ">
            <label
              htmlFor={"gender"}
              className={`${
                errors.gender && "text-red-500"
              }  text-gray-500  font-bold  text-sm `}
            >
              Gender *
            </label>
            <Controller
              control={control}
              name={"gender"}
              id={"gender"}
              render={({ field }) => (
                <>
                  <div
                    className={`flex items-center gap-5 rounded-md  px-2   bg-white py-1 md:py-[4px]`}
                  >
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      {...field}
                    >
                      <FormControlLabel
                        value="female"
                        // control={<Radio />}
                        control={<Radio size="small" />}
                        label="Female"
                      />
                      <FormControlLabel
                        value="male"
                        // control={<Radio />}
                        control={<Radio size="small" />}
                        label="Male"
                      />
                      <FormControlLabel
                        value="transgender"
                        // control={<Radio />}
                        control={<Radio size="small" />}
                        label="Transgender"
                      />
                    </RadioGroup>
                  </div>
                </>
              )}
            />
            <div className="h-4 w-[200px]  !z-50   !mb-1">
              <ErrorMessage
                errors={errors}
                name={"gender"}
                render={({ message }) => (
                  <p className="text-sm mb-4 relative !bg-white  text-red-500">
                    {message}
                  </p>
                )}
              />
            </div>
          </div>

          <AuthInputFiled
            name={"pwd"}
            placeholder={"Person with disability"}
            label={"Person with disability"}
            control={control}
            type="checkbox"
            errors={errors}
            error={errors.pwd}
            className="mt-2 pt-2 text-sm
          "
          />

          {finalcount > 0 && isremotepunching && (
            <AuthInputFiled
              name={"remotepunch"}
              placeholder={"Enable remote punch"}
              label={"Enable remote punch"}
              control={control}
              type="checkbox"
              descriptionText={descriptionText}
              errors={errors}
              error={errors.remotepunch}
              className="mt-2 pt-2 text-sm"
            />
          )}
        </div>
        <div className="grid grid-cols-1  md:grid-cols-3 w-full gap-4">
          <AuthInputFiled
            name="adhar_card_number"
            icon={AccountBox}
            control={control}
            type="number"
            placeholder="Aadhar No"
            label="Employee Aadhar No *"
            errors={errors}
            error={errors.adhar_card_number}
            className=" text-sm
          "
          />
          <AuthInputFiled
            name="pan_card_number"
            icon={AccountBox}
            control={control}
            type="text"
            placeholder="Employee PAN No"
            label="Employee PAN No *"
            errors={errors}
            error={errors.pan_card_number}
            className=" text-sm
          "
          />

          <AuthInputFiled
            name="bank_account_no"
            icon={AccountBalance}
            control={control}
            type="number"
            placeholder="Bank Account No"
            label="Bank Account No*"
            errors={errors}
            error={errors.bank_account_no}
            className="text-sm
          "
          />
        </div>
        <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-4">
          {/* <div className="grid grid-cols-1  md:grid-cols-2 w-full gap-2"> */}
          <AuthInputFiled
            name="citizenship"
            icon={LocationOn}
            control={control}
            type="text"
            placeholder="Citizenship Status."
            label="Citizenship Status. *"
            errors={errors}
            error={errors.citizenship}
            pattern="[A-Za-z\s]+"
            className=" text-sm
          "
          />
          {/* </div> */}

          {/* <div className="grid grid-cols-1  md:grid-cols-2 w-full gap-2"> */}
          <AuthInputFiled
            name="uanNo"
            icon={AccountBalance}
            control={control}
            type="number"
            placeholder="UAN No"
            label="Employee UAN No"
            errors={errors}
            error={errors.uanNo}
            className="text-sm
          "
          />
          <AuthInputFiled
            name="esicNo"
            icon={AccountBalance}
            control={control}
            type="text"
            placeholder="ESIC No"
            label="Employee ESIC No"
            errors={errors}
            error={errors.esicNo}
            pattern="[A-Za-z\s]+"
            className=" text-sm"
          />
        </div>

        <div className="flex justify-end  ">
          <BasicButton title="Next" type="submit" disabled={isLastStep} />
        </div>
      </form>
    </div>
  );
};

export default Test1;
