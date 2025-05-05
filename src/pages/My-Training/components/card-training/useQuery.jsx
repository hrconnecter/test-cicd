import axios from "axios";
import React, { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import useGetUser from "../../../../hooks/Token/useUser";
import { TestContext } from "../../../../State/Function/Main";

const useCardQuery = ({ trainingId, setOpenForAssign }) => {
  const [open, setOpen] = React.useState(false);
  const { handleAlert } = useContext(TestContext);
  const { organisationId } = useParams();

  const uploadProof = async (tdsfile) => {
    const data = await axios.get(
      `${process.env.REACT_APP_API}/route/s3createFile/trainings`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      }
    );

    await axios.put(data?.data?.url, tdsfile, {
      headers: {
        "Content-Type": tdsfile?.type,
      },
    });

    return data?.data?.url?.split("?")[0];
  };

  const { authToken } = useGetUser();
  const queryClient = useQueryClient();
  const getEmployeeTrainingInfo = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/training/get-employee-training-info/${trainingId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };
  const { data, isLoading, error } = useQuery({
    queryKey: [`get-employee-training-info-${trainingId}`],
    queryFn: getEmployeeTrainingInfo,
    onSuccess: (data) => {
      //   console.log("onSuccess", data);
    },
    refetchOnMount: false,
  });
  const createTrainingEmployee = async (data) => {
    const response = await axios.put(
      `${process.env.REACT_APP_API}/route/training/create-training-employee/${trainingId}/${organisationId}`,
      data,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };
  const { mutate, isLoading: isFetching } = useMutation(
    createTrainingEmployee,
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [`get-employee-training-info-${trainingId}`],
        });
        await queryClient.invalidateQueries({
          queryKey: ["getTrainingDetails"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["getTrainingDetails"],
        });
        handleAlert(true, "success", "Training Assigned Successfully");
        setOpenForAssign(false);
      },
      onError: (error) => {
        console.error("onError", error);
      },
    }
  );
  const getProofOfSubmissionUrl = async (fullObject) => {
    const result = await axios.get(
      `${process.env.REACT_APP_API}/route/s3createFile/training-proof-of-submission-${fullObject?.employeeTrainingId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      }
    );
    await axios.put(result?.data?.url, fullObject?.trainingImage, {
      headers: {
        "Content-Type": fullObject?.proofOfSubmissionUrl?.type,
      },
    });
    fullObject.proofOfSubmissionUrl = result?.data?.url?.split("?")[0];
    return fullObject;
  };

  const { mutate: getProofMutate } = useMutation(getProofOfSubmissionUrl, {
    onSuccess: async (data) => {
      completeTrainingAndCreateFeedbackMutate(data);
    },
    onError: (error) => {
      console.error("onError", error);
    },
  });
  const completeTrainingAndCreateFeedbackFunction = async (data) => {
    const response = await axios.put(
      `${process.env.REACT_APP_API}/route/training/complete-training-and-create-feedback/${data?.trainingId}`,
      data,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };

  const { mutate: completeTrainingAndCreateFeedbackMutate } = useMutation(
    completeTrainingAndCreateFeedbackFunction,
    {
      onSuccess: async () => {
        console.log("onSuccess");
        setOpen(false);

        await queryClient.invalidateQueries({
          queryKey: [`getTrainingDetails`],
        });
        await queryClient.invalidateQueries({
          queryKey: [`get-overdue-training`],
        });
        await queryClient.invalidateQueries({
          queryKey: [`get-upcoming-training`],
        });
        await queryClient.invalidateQueries({
          queryKey: [`get-completed-training`],
        });
        await queryClient.invalidateQueries({
          queryKey: [`get-training-employee`],
        });
        await queryClient.invalidateQueries({
          queryKey: [`get-training-employee-info`],
        });
        await queryClient.invalidateQueries(`get-ongoing-training`);
        handleAlert(true, "success", "Training Assigned Successfully");
        setOpenForAssign(false);
      },
      onError: (error) => {
        console.error("onError", error);
      },
    }
  );

  return {
    data,
    uploadProof,
    isLoading,
    error,
    mutate,
    isFetching,
    open,
    setOpen,
    getProofMutate,
    completeTrainingAndCreateFeedbackMutate,
  };
};

export default useCardQuery;
