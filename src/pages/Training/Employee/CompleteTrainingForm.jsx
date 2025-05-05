import { zodResolver } from "@hookform/resolvers/zod";
import { Feedback, StarBorder } from "@mui/icons-material";
import { Button } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import BasicButton from "../../../components/BasicButton";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import ReusableModal from "../../../components/Modal/component";
import UserProfile from "../../../hooks/UserData/useUser";
import useCardQuery from "../../My-Training/components/card-training/useQuery";

const CompleteTrainingMiniForm = ({ doc, status }) => {
  console.log(`🚀 ~ docTraining f:`, doc);
  const [open, setOpen] = useState(false);
  const { completeTrainingAndCreateFeedbackMutate: mutate, uploadProof } =
    useCardQuery({
      trainingId: "",
      setOpenForAssign: setOpen,
    });
  const user = UserProfile().getCurrentUser();
  const formSchema = z.object({
    proofOfSubmissionUrl: doc?.proofSubmissionRequired
      ? z.any().refine(
          (file) => {
            return !!file && file.size <= 500 * 1024;
          },
          { message: "File size must be less than 500kb" }
        )
      : z.any().optional(),
    rating: z.number(),
    feedback: z.string().min(10),
  });

  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      //   proofOfSubmissionUrl: undefined,
      rating: undefined,
      feedback: undefined,
    },
    resolver: zodResolver(formSchema),
  });
  const { errors } = formState;
  console.log(`🚀 ~ errors:`, errors);
  const onSubmit = async (data) => {
    let proof = data?.proofOfSubmissionUrl;

    let proofOfSubmissionUrl = "";
    let updatedData;

    if (proof) {
      proofOfSubmissionUrl = await uploadProof(data?.proofOfSubmissionUrl);
      console.log(`🚀 ~ proofOfSubmissionUrl:`, proofOfSubmissionUrl);
      updatedData = {
        ...data,
        trainingId: doc._id,
        employeeId: user?._id,
        proofOfSubmissionUrl,
      };
    } else {
      updatedData = {
        ...data,
        trainingId: doc._id,
        employeeId: user?._id,
      };
    }
    mutate(updatedData);
  };

  return (
    <>
      <BasicButton
        title={
          status !== "started" ? "Reapply for complete" : "Mark As Complete"
        }
        variant="success"
        onClick={() => setOpen(true)}
      />
      <ReusableModal
        heading={"Complete Training"}
        onClose={() => setOpen(false)}
        open={open}
      >
        <form
          className="flex flex-col gap-4 items-center w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          {doc?.proofSubmissionRequired && (
            <AuthInputFiled
              name="proofOfSubmissionUrl"
              control={control}
              type="Typefile"
              placeholder="Upload Proof"
              label="Upload Proof*"
              errors={errors}
              className={"w-full"}
              error={errors.proofOfSubmissionUrl}
            />
          )}
          <AuthInputFiled
            name="rating"
            label="Rating*"
            control={control}
            type="selectItem"
            icon={StarBorder}
            placeholder="Rating"
            error={errors.rating}
            errors={errors}
            options={[
              { value: 1, label: 1 },
              { value: 2, label: 2 },
              { value: 3, label: 3 },
              { value: 4, label: 4 },
              { value: 5, label: 5 },
            ]}
          />
          <AuthInputFiled
            name="feedback"
            label="Feedback*"
            icon={Feedback}
            control={control}
            type="text"
            placeholder="Feedback"
            error={errors.feedback}
            errors={errors}
            className={"w-full"}
          />

          <Button
            type="submit"
            disabled={mutate.isLoading}
            variant="contained"
            color="primary"
            className="!w-fit"
          >
            Submit
          </Button>
        </form>
      </ReusableModal>
    </>
  );
};

export default CompleteTrainingMiniForm;
