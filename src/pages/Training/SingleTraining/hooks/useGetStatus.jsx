import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../../../../hooks/Token/useAuth";

const useGetStatus = (trainingId, search, page, statusFilter) => {
  const authToken = useAuthToken();
  const getTrainingStatus = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/trainings/getTrainingStatus/${trainingId}?employee=${search}&page=${page}&status=${statusFilter}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return data;
  };
  const getTrainingStatusDetails = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/trainings/getTrainingStatusInfo/${trainingId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return data;
  };

  const { data: traningStatus, isFetching: isLoading } = useQuery(
    ["training-status", trainingId, search, page, statusFilter],
    getTrainingStatus
  );

  const { data: trainingDetails, isLoading: trainingLoading } = useQuery(
    ["training-status-details", trainingId],
    getTrainingStatusDetails
  );

  return { traningStatus, isLoading, trainingDetails, trainingLoading };
};

export default useGetStatus;
