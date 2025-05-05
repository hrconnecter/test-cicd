import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../../../../hooks/Token/useAuth";
import UserProfile from "../../../../hooks/UserData/useUser";

const useGetStatusCard = (organisationId) => {
  const authToken = useAuthToken();
  const role = UserProfile().useGetCurrentRole();
  const getAllTrainings = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/training/getOverallTrainingStats/${organisationId}?role=${role}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    console.warn("response.data", response.data);
    return response.data;
  };

  const { data, isFetching } = useQuery({
    queryKey: [`getAllEmployeeTrainingsData`],
    queryFn: getAllTrainings,
  });

  return { data, isFetching };
};

export default useGetStatusCard;
