import axios from "axios";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import useSearchTrainingZustandStore from "../../../pages/Training/components/zustand-store";
import useGetUser from "../../Token/useUser";
import UserProfile from "../../UserData/useUser";
import useDebounce from "./hook/useDebounce";

const useTrainingHook = () => {
  const { trainingName, setTrainingData, page, setTotalResult } =
    useSearchTrainingZustandStore();
  const { authToken } = useGetUser();
  const debouncedSearchTerm = useDebounce(trainingName, 500);
  const { organisationId } = useParams();
  const role = UserProfile().useGetCurrentRole();

  const getTrainingDetailsWithNameLimit10WithCreatorId = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/training/getTrainingDetailsWithNameLimit10WithCreatorId/${organisationId}?name=${trainingName}&page=${page}&role=${role}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [
      `getTrainingDetailsWithNameLimit10WithCreatorId`,
      debouncedSearchTerm,
      organisationId,
      page,
    ],
    queryFn: getTrainingDetailsWithNameLimit10WithCreatorId,
    onSuccess: (data) => {
      console.log("onSuccess", data);
      setTrainingData(data.data);
      setTotalResult(data.totalResults);
    },
  });

  return { data, isLoading, error };
};

export default useTrainingHook;
