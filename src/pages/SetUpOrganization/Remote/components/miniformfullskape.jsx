import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LocationSearching,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
import BasicButton from "../../../../components/BasicButton";
import useSubscriptionGet from "../../../../hooks/QueryHook/Subscription/hook";
import { useParams } from "react-router-dom";


const organizationSchema = z.object({
  isVisibleAttendanceCalender: z.boolean(),
  allowance: z.boolean(),
  allowanceQuantity: z.string().refine(
    (doc) => {
      return Number(doc) >= 0 && Number(doc) < 100000;
    },
    {
      message: "The Allowance Quantity must be between 0 and 1,00,000",
    }
  ),
  dualWorkflow: z.boolean(),
  geoFencing: z.boolean(),
  faceRecognition: z.boolean(),
  geoFencingFullskape: z.boolean(),
  notifyWhatsApp: z.boolean().optional(),
});
const MiniFormFullskape = ({ data, mutate }) => {
  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      allowance: data?.remotePunchingObject?.allowance || false,
      allowanceQuantity: data?.remotePunchingObject?.allowanceQuantity
        ? `${data?.remotePunchingObject?.allowanceQuantity}`
        : "0",
      dualWorkflow: data?.remotePunchingObject?.dualWorkflow || false,
      isVisibleAttendanceCalender: data?.remotePunchingObject?.isVisibleAttendanceCalender || false,
      geoFencing: data?.remotePunchingObject?.geoFencing || false,
      faceRecognition: data?.remotePunchingObject?.faceRecognition || false,
      geoFencingFullskape: data?.remotePunchingObject?.geoFencingFullskape || false,
      notifyWhatsApp: data?.remotePunchingObject?.notifyWhatsApp || false,
    },
    resolver: zodResolver(organizationSchema),
  });

  const { errors } = formState;

  const onSubmit = (formData) => {
    // Include all conditional fields in the payload
    const payload = {
      ...formData,
      allowanceQuantity: Number(formData.allowanceQuantity), // Convert to number
      // geoFencingFullskape: formData.geoFencingFullskape || false,
      // notifyWhatsApp: formData.geoFencingFullskape || false
    };
    mutate(payload);
  };


  const { organisationId } = useParams();
  const { data: subscriptionData } = useSubscriptionGet({ organisationId });
  const isFullskapePlan =
    subscriptionData?.organisation?.packageInfo === "Fullskape Plan" ||
    subscriptionData?.organisation?.packages?.includes("Fullskape");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 p-4 gap-4">
        

          <>
            <AuthInputFiled
              name="geoFencingFullskape"
              icon={LocationSearching}
              control={control}
              type="checkbox"
              placeholder="Fullskape"
              label="Fullskape"
              errors={errors}
              error={errors.geoFencingFullskape}
              descriptionText={
                "Enabling Fullskape will allow notifications via WhatsApp."
              }
              visible={isFullskapePlan}
            />

            <AuthInputFiled
              name="notifyWhatsApp"
              control={control}
              type="checkbox"
              placeholder="WhatsApp Notification"
              label="Receive Notification on WhatsApp"
              errors={errors}
              error={errors.notifyWhatsApp}
            />
          </>
        
        
      </div>
      <div className="w-full flex justify-end">
        <BasicButton type="submit" title="Apply For Changes" />
      </div>
    </form>
  );

};

export default MiniFormFullskape;
