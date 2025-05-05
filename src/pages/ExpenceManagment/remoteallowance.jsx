/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { Button, Typography } from "@mui/material";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";

const allowanceSchema = z.object({
  enableAllowance: z.boolean(),
  allowanceAmount: z
    .string()
    .min(1, { message: "Minimum 4 characters required" }),
  currency: z.string(),
});

const RemotePunchAllowanceSection = ({ organisationId, authToken, handleAlert, queryClient }) => {
  const { 
    control, 
    handleSubmit, 
    setValue, 
    watch, 
    register, // Added for checkbox handling
    formState: { errors },
  } = useForm({
    resolver: zodResolver(allowanceSchema),
    defaultValues: {
      enableAllowance: false,
      allowanceAmount: "",
      // allowanceAmount: z
      // .union([z.string(), z.number()])
      // .transform(val => val.toString()), // Convert number to string if needed
      currency: "INR",
    },
  });

  const updateAllowanceSettingsMutation = useMutation(
    async (settings) => {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/${organisationId}/remote-punch-allowance`,
        settings,
        { headers: { Authorization: authToken } }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        handleAlert(true, "success", "Remote punch allowance settings updated successfully");
        queryClient.invalidateQueries(["remote-punch-allowance"]);
      },
      onError: (error) => {
        console.error("Mutation error:", error);
      },
    }
  );

  useQuery(
    ["remote-punch-allowance", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/${organisationId}/remote-punch-allowance`,
        { headers: { Authorization: authToken } }
      );
      return response.data;
    },
    {
      onSuccess: (data) => {
        setValue("enableAllowance", data.remotePunchAllowance.enableAllowance);
        // setValue("allowanceAmount", data.remotePunchAllowance.allowanceAmount || "");
        setValue("allowanceAmount", data.remotePunchAllowance.allowanceAmount?.toString() || "");
        setValue("currency", data.remotePunchAllowance.currency || "USD");
      },
    }
  );

  const currencyOptions = [
    { label: "INR (₹)", value: "INR" },
    { label: "USD ($)", value: "USD" },
    { label: "EUR (€)", value: "EUR" },
    { label: "GBP (£)", value: "GBP" },
    { label: "JPY (¥)", value: "JPY" },
    { label: "CAD (C$)", value: "CAD" },
    { label: "AUD (A$)", value: "AUD" },
    { label: "SGD (S$)", value: "SGD" },
  ];

  const onSubmit = (data) => {
    updateAllowanceSettingsMutation.mutate({
      ...data,
      allowanceAmount: data.allowanceAmount ? Number(data.allowanceAmount) : undefined, // Ensure it's a number
    });
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow">
      <Typography variant="h6" className="mb-4">
        Remote Punch Allowance
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register("enableAllowance")} // Used register here
            className="form-checkbox h-5 w-5 text-primary"
          />
          <span className="text-gray-700">Enable Remote Punch Allowance</span>
        </label>

        {watch("enableAllowance") && (
          <div className="flex space-x-4 items-center">
            <div className="w-1/2">
              <AuthInputFiled
                label="Allowance Amount /km"
                type="number"
                name="allowanceAmount"
                placeholder="Enter allowance amount"
                control={control}
                error={errors.allowanceAmount?.message}
                errors={errors}
              />
            </div>

            <div className="w-1/2">
              <select
                {...register("currency")}
                className="border p-2 rounded w-full"
              >
                {currencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <Button type="submit" variant="contained" disabled={updateAllowanceSettingsMutation.isLoading}>
          {updateAllowanceSettingsMutation.isLoading ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  );
};

export default RemotePunchAllowanceSection;
