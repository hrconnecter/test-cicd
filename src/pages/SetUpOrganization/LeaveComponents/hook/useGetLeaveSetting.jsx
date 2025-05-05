import axios from "axios";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import useAuthToken from "../../../../hooks/Token/useAuth";

const useGetLeaveSetting = (openSettingsModal = true) => {
  const { organisationId } = useParams("");
  const authToken = useAuthToken();
  const getLeaveSetting = async () => {
    const data = await axios.get(
      `${process.env.REACT_APP_API}/route/leave-types/settings/${organisationId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return data;
  };

  const {
    data: leaveSetting,
    isFetching,
    isLoading,
  } = useQuery(["leave-Setting", openSettingsModal], getLeaveSetting);

  return { leaveSetting, isFetching, isLoading };
};

export default useGetLeaveSetting;
