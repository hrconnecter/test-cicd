import axios from "axios";
import { useQuery } from "react-query";
import useAuthToken from "../../../../hooks/Token/useAuth";

const useGetAllTraining = (organisationId, select = "", type = "") => {
  const authToken = useAuthToken();
  const getAllTrainings = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/training-employee/getAllTrainings/${organisationId}?name=${select}&type=${type?.value}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return response.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: [`getAllTrainings`, select, type],
    queryFn: getAllTrainings,
    // onSuccess: (data) => {
    //   console.log("onSuccess", data);
    //   setTrainingData(data.data);
    //   setTotalResult(data.totalResults);
    // },
  });

  return { data, isLoading };
};

export default useGetAllTraining;
