import axios from "axios";
import { useQuery } from "react-query";
import useGetUser from "../../Token/useUser";

const useRemotePunchStatus = ({ employeeId }) => {
  const { authToken } = useGetUser();

  const fetchRemotePunchStatus = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/employee/${employeeId}/remotepunch`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["remotePunchStatus", employeeId],
    queryFn: fetchRemotePunchStatus,
    onSuccess: (data) => {
      if (data?.remotepunch === true) {
        console.log("Employee has remote punching enabled");
        // handleAlert(true, "success", "Remote punching is enabled for this employee.");
      } else {
        console.log("Employee does not have remote punching enabled");
        // handleAlert(true, "info", "Remote punching is not enabled for this employee.");
      }
    },
    onError: (error) => {
      console.error("Error fetching remote punch status", error);
    //   handleAlert(true, "error", "Failed to check remote punch status.");
    },
    enabled: !!employeeId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    isRemote: data?.remotepunch === true,
    isLoading,
    isError,
  };
};

export default useRemotePunchStatus;
