import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../../../../hooks/Token/useAuth";
import UserProfile from "../../../../hooks/UserData/useUser";

const useGetAllTrainings = (organisationId, page, search = "") => {
  const role = UserProfile().useGetCurrentRole();
  const authToken = useAuthToken();
  const getAllTrainingsWithStats = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/training/getAllTrainingsWithStats/${organisationId}?role=${role}$page=${page}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return response.data;
  };

  const { data, isFetching } = useQuery({
    queryKey: [`getAllTrainingsWithStats`, search],
    queryFn: getAllTrainingsWithStats,
  });

  return { data, isFetching };
};

export default useGetAllTrainings;
