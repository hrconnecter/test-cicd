import axios from "axios";
import { useContext } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import useAuthToken from "../../../../hooks/Token/useAuth";
import { TestContext } from "../../../../State/Function/Main";

const useCreateLeaveSetting = (setOpenSettingsModal) => {
  const authToken = useAuthToken();
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);
  const { organisationId } = useParams("");
  const handleCompOff = async (data) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/route/leave-types/settings/${organisationId}`,
        { ...data },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      await queryClient.invalidateQueries("leaveSetting");
      setOpenSettingsModal(false);

      handleAlert(true, "success", "Leave settings changed successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return { handleCompOff };
};

export default useCreateLeaveSetting;
