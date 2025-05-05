import { zodResolver } from "@hookform/resolvers/zod";
import { Numbers } from "@mui/icons-material";
import { Button } from "@mui/material";
import moment from "moment";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TestContext } from "../../../../State/Function/Main";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
import ReusableModal from "../../../../components/Modal/component";
import useManageHiringSubscriptionMutation from "./hiring-sub-mutation";

const HiringPayment = ({ handleClose, open, organisation }) => {
  const [amount, setAmount] = React.useState(0);
  const hiringCostPerPosition = 50;
  const { renewMutate } = useManageHiringSubscriptionMutation();
  const { handleAlert } = useContext(TestContext);

  // Ensure `organisation` is defined before accessing properties
  const defaultHiringCount = organisation?.hiringPositionCount || 1;

  const packageSchema = z.object({
    hiringPositionCount: z
      .string()
      .min(1, { message: "Position count must be at least 1" })
      .refine(
        (value) => {
          value = value.replace(/\s/g, "");
          return value.length > 0 && !isNaN(Number(value)) && Number(value) > 0;
        },
        { message: "Hiring position count should be greater than 0" }
      ),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      hiringPositionCount: String(defaultHiringCount),
    },
    resolver: zodResolver(packageSchema),
  });

  // Watch the hiring position count
  const hiringPositionCount = watch("hiringPositionCount");

  useEffect(() => {
    const count = Number(hiringPositionCount) || 0;
    setAmount(count * hiringCostPerPosition);
  }, [hiringPositionCount]);

  async function onSubmit(data) {
    const upComingDate = new Date(
      organisation?.upcomingPackageInfo?.packageName
    );
    const currentDate = new Date();

    if (
      organisation?.upcomingPackageInfo?.packageName &&
      upComingDate > currentDate
    ) {
      handleAlert(
        true,
        "warning",
        `You already have a package waiting to be activated from ${moment(
          organisation?.upcomingPackageInfo?.startDate
        ).format("MMMM DD, YYYY")} to ${moment(
          organisation?.upcomingPackageInfo?.endDate
        ).format("MMMM DD, YYYY")} please wait for it to be activated.`
      );
    } else {
      renewMutate({
        hiringPositionCount: Number(data?.hiringPositionCount),
        totalPrice: amount,
      });
    }
  }

  return (
    <ReusableModal
      heading={"Hiring Subscription"}
      open={open}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
        {/* Scrollable content */}
        <div className="flex flex-col gap-4 max-h-[450px] overflow-auto h-auto">
          <AuthInputFiled
            name="hiringPositionCount"
            icon={Numbers}
            control={control}
            type="number"
            placeholder="Hiring Position Count"
            label="Hiring Position Count*"
            errors={errors}
            error={errors.hiringPositionCount}
            descriptionText={"Each hiring position price ₹50"}
          />
        </div>

        {/* Fixed bottom button */}
        <div className="sticky bottom-0 bg-white shadow-md p-4">
          <Button
            variant="contained"
            type="submit"
            className="!w-full normal-case"
            style={{ textTransform: "none" }}
            disabled={amount <= 0}
          >
            PAY Rs. {amount}
          </Button>
        </div>
      </form>
    </ReusableModal>
  );
};

export default HiringPayment;
