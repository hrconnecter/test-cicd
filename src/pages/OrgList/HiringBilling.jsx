import React, { useContext } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import BasicButton from "../../components/BasicButton";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
import { FactoryOutlined } from "@mui/icons-material";
import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";
import { useNavigate } from "react-router-dom";

const HiringBilling = ({ open, onClose, organizationId }) => {
  const { cookies, handleAlert, decodedToken } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const { data: orgData, isLoading } = useQuery(
    ["organization", organizationId],
    () =>
      axios
        .get(
          `${process.env.REACT_APP_API}/route/organization/${organizationId}`
        )
        .then((res) => res.data),
    { enabled: !!organizationId }
  );

  const handleForm = async (formData) => {
    if (!formData.hiringPosition) {
      return "Please Enter Job Position Count";
    }

    const hiringPosition = parseInt(formData.hiringPosition);
    const totalPrice = hiringPosition * 50;

    const payload = {
      hiringPosition,
      usedHiringPosition: 0,
      totalPrice,
      paymentType: "RazorPay",
    };

    const response = await axios.post(
      `${process.env.REACT_APP_API}/route/organization/organization-upgrade/${organizationId}`,
      payload,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return response?.data;
  };

  const { mutate, isLoading: mutationLoading } = useMutation({
    mutationFn: handleForm,
    onSuccess: async (data) => {
      console.log("API Response Data:", data);

      if (data?.paymentType === "Phone_Pay") {
        window.location.href = data?.redirectUrl;
      } else if (data?.paymentType === "RazorPay") {
        if (!window.Razorpay) {
          handleAlert(
            true,
            "error",
            "Razorpay SDK not loaded. Please refresh."
          );
          return;
        }

        const options = {
          key: data?.key,
          amount: data?.order?.amount,
          currency: "INR",
          name: "Aegis Plan for Software", // Your business name
          description: "Get Access to all premium features",
          image: data?.organization?.image || "/default-logo.png",
          order_id: data?.order?.id,
          callback_url: data?.callbackURI,
          prefill: {
            name: `${decodedToken?.user?.first_name || ""} ${
              decodedToken?.user?.last_name || ""
            }`,
            email: decodedToken?.user?.email || "",
            contact: decodedToken?.user?.phone_number || "",
          },
          notes: {
            address:
              "C503, The Onyx-Kalate Business Park, Wakad, Pune, Maharashtra 411057",
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
        handleAlert(true, "success", data?.message || "Upgrade successful");
        navigate(`/organisation/${data?.org?._id}/setup/add-roles`);
      }
    },
    onError: async (data) => {
      console.error("Error:", data);
      handleAlert(
        true,
        "error",
        data?.response?.data?.message || "Please fill all mandatory fields."
      );
    },
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Hiring Billing</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Typography>Loading organization data...</Typography>
        ) : (
          <>
            <AuthInputFiled
              name="hiringPosition"
              icon={FactoryOutlined}
              control={control}
              type="number"
              placeholder="Enter Job Position Count"
              label="Enter Job Position Count *"
              errors={errors}
              error={errors.hiringPosition}
              descriptionText="Enter the number of positions if you have selected the Hiring package."
            />
            <Box mt={2}>
              <Typography>
                Total: ₹{(watch("hiringPosition") || 0) * 50}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Existing Positions: {orgData?.hiringPosition || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Used Positions: {orgData?.usedHiringPosition || 0}
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <BasicButton onClick={onClose} variant="outlined" title="Cancel" />
        <BasicButton
          title="Submit"
          onClick={handleSubmit((data) => mutate(data))}
          disabled={mutationLoading}
        />
      </DialogActions>
    </Dialog>
  );
};

export default HiringBilling;
