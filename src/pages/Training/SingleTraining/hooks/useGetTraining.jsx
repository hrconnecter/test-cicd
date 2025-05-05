import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../../../../hooks/Token/useAuth";

const useGetTraining = (id) => {
  const authToken = useAuthToken();

  const getTrainingDetails = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/training/${id}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return response?.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [`getTrainingDetails`, id],
    queryFn: getTrainingDetails,
  });

  return { data, isLoading, error };
};

export default useGetTraining;
