/* eslint-disable no-unused-vars */
import axios from "axios"; 
import { useQuery } from "react-query";
import { useContext } from "react";
import { UseContext } from "../../State/UseState/UseContext";
import UserProfile from "../../hooks/UserData/useUser";
import { useQueryClient } from 'react-query';

const useRecordHook = () => {
  // to define the state , hook , import other function if needed
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
 const queryClient = useQueryClient();
    const { getCurrentUser } = UserProfile();
  const user = getCurrentUser(); 
  const organizationId = user.organizationId;
  const employeeId = user?._id;


  console.log("Hook - Current Organization ID:", organizationId);

  //to get the data of employee who have uploaded document
  const { data: getRecordOfEmployee } = useQuery(
    ["getRecordOfEmployee",employeeId, organizationId],
    async () => {
      console.log("Hook api Call - Organization ID:", organizationId);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get-document/to-approval-id`,
        {
          headers: {
            Authorization: authToken,
          }, 
        }
      );
      return response.data.data;
    }
  );
  const refreshDocuments = () => {
    // queryClient.invalidateQueries(["getRecordOfEmployee"]);
    queryClient.invalidateQueries(["getRecordOfEmployee", employeeId, organizationId]);
  };


  return {
    getRecordOfEmployee,
    refreshDocuments
  };
};

export default useRecordHook;
