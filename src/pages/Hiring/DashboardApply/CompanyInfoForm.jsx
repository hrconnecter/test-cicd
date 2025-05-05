import React, { useContext, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircularProgress, Grid } from "@mui/material";
import { Work } from "@mui/icons-material";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import BasicButton from "../../../components/BasicButton";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { UseContext } from "../../../State/UseState/UseContext";
import { useNavigate, useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";

// Validation Schema using Zod
const companySchema = z.object({
  companyName: z.string().min(2, "Company Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  contact: z.string().regex(/^\d{10}$/, "Contact must be a 10-digit number"),
  email: z.string().email("Invalid email format"),
  linkedIn: z.string().optional(),
  website: z.string().optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
});

const CompanyInfoForm = ({ nextStep, initialData }) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { organisationId } = useParams();
  const navigate = useNavigate();
  const { handleAlert } = useContext(TestContext);
  const { data } = useSubscriptionGet({ organisationId });
  console.log("data in org", data);

  const { control, formState, handleSubmit, reset } = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: initialData || {
      companyName: "",
      address: "",
      contact: "",
      email: "",
      linkedIn: "",
      website: "",
      description: "",
    },
  });

  const { errors } = formState;

  // useMutation to handle API request
  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/create-company-dashboard`,
        formData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Success:", data);
      navigate(
        `/organisation/${organisationId}/manager-open-job-vacancy/hiring`
      );
    },
    onError: (error) => {
      console.error("Error:", error.response?.data || error.message);
      handleAlert(true, "error", error?.response?.data?.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/update-dashboard/hiring`,
        formData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Updated:", data);
      navigate(
        `/organisation/${organisationId}/manager-open-job-vacancy/hiring`
      );
    },
    onError: (error) => {
      console.error("Error:", error.response?.data || error.message);
      handleAlert(true, "error", error?.response?.data?.message);
    },
  });
  const onSubmit = (formData) => {
    const finalData = {
      ...formData,
      logo_url: dataDashboard?.logo_url || data?.organisation?.logo_url || "",
    };

    if (dataDashboard) {
      updateMutation.mutate(finalData);
    } else {
      mutation.mutate(finalData);
    }
  };

  const { data: dataDashboard } = useQuery(["differentdata"], async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-dashboard/hiring`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return response?.data?.data;
  });
  console.log("dataDashboard", dataDashboard);
  useEffect(() => {
    if (dataDashboard) {
      reset({
        companyName: dataDashboard.companyName || "",
        address: dataDashboard.address || "",
        contact: dataDashboard.contact?.toString() || "",
        email: dataDashboard.email || "",
        linkedIn: dataDashboard.linkedIn || "",
        website: dataDashboard.website || "",
        description: dataDashboard.description || "",
        logo_url: dataDashboard?.logo_url || "",
      });
    } else if (data?.organisation) {
      reset({
        companyName: data.organisation.orgName || "",
        address: data.organisation.location?.address || "",
        contact: data.organisation.contact_number?.toString() || "",
        email: data.organisation.email || "",
        linkedIn: data.organisation.organization_linkedin_url || "",
        website: data.organisation.web_url || "",
        description: data.organisation.description || "",
        logo_url: dataDashboard?.logo_url || "",
      });
    }
  }, [dataDashboard, data, reset]);

  return (
    <div className="w-full mt-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col space-y-4"
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <AuthInputFiled
              name="companyName"
              icon={Work}
              control={control}
              type="text"
              placeholder="Company Name"
              label="Company Name*"
              errors={errors}
              error={errors.companyName?.message}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <AuthInputFiled
              name="address"
              icon={Work}
              control={control}
              type="text"
              placeholder="Address"
              label="Address*"
              errors={errors}
              error={errors.address?.message}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <AuthInputFiled
              name="contact"
              icon={Work}
              control={control}
              type="text"
              placeholder="Contact Number"
              label="Contact Number*"
              errors={errors}
              error={errors.contact?.message}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <AuthInputFiled
              name="email"
              icon={Work}
              control={control}
              type="text"
              placeholder="Email ID"
              label="Email ID*"
              errors={errors}
              error={errors.email?.message}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <AuthInputFiled
              name="linkedIn"
              icon={Work}
              control={control}
              type="text"
              placeholder="LinkedIn URL"
              label="LinkedIn URL"
              errors={errors}
              error={errors.linkedIn?.message}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <AuthInputFiled
              name="website"
              icon={Work}
              control={control}
              type="text"
              placeholder="Website URL"
              label="Website URL"
              errors={errors}
              error={errors.website?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <AuthInputFiled
              name="description"
              icon={Work}
              control={control}
              type="text"
              placeholder="Company Description"
              label="Company Description"
              errors={errors}
              error={errors.description?.message}
            />
          </Grid>
        </Grid>
        <div className="flex justify-end">
          <BasicButton
            title={
              mutation.isLoading || updateMutation.isLoading ? (
                <CircularProgress
                  size={20}
                  sx={{ p: "0px 20px" }}
                  style={{ color: "white" }}
                />
              ) : dataDashboard ? (
                "Update"
              ) : (
                "Submit"
              )
            }
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default CompanyInfoForm;
