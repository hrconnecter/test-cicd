import { useQuery } from "react-query";
import axios from "axios";

const useOrganizationLoans = (authToken) => {
  return useQuery(
    ["organizationLoans"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/all-loans`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );
};

export default useOrganizationLoans;
