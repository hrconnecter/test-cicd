import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../../../../hooks/Token/useAuth";
import UserProfile from "../../../../hooks/UserData/useUser";

const useGetAllEmployeeTraining = (organisationId, page, search) => {
  const authToken = useAuthToken();
  const role = UserProfile().useGetCurrentRole();
  const getAllTrainings = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/training/getAllEmployeesWithTrainingData/${organisationId}?page=${page}&search=${search}&role=${role}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return response.data;
  };

  const { data, isFetching } = useQuery({
    queryKey: [`getAllEmployeeTrainingsData`, search, page],
    queryFn: getAllTrainings,
  });

  return { data, isFetching };
};

export default useGetAllEmployeeTraining;
