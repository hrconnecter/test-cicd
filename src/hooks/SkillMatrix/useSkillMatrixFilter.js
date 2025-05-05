import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import useAuthToken from "../Token/useAuth";

export default function useSkillMatrixFilter(organisationId) {
  const authToken = useAuthToken();
  
  // States for filters
  const [department, setDepartment] = useState("");
  const [manager, setManager] = useState("");
  const [locations, setLocations] = useState("");

  // Fetch Department data
  const { data: Department } = useQuery(
    ["departments-data", organisationId],
    async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/department/get/${organisationId}`,
          {
            headers: { Authorization: authToken },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    }
  );

  // Fetch Location data
  const { data: location } = useQuery(
    ["organization-locations", organisationId],
    async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/location/getOrganizationLocations/${organisationId}`,
          {
            headers: { Authorization: authToken },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    }
  );
  

  // Fetch Manager data
  const { data: Managers } = useQuery(
    ["all-manager", organisationId],
    async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/employee/get-manager/${organisationId}`,
          {
            headers: { Authorization: authToken },
          }
        );
        return response.data.manager;
      } catch (error) {
        console.error("Error fetching managers:", error);
      }
    }
  );

  // Options for dropdowns
  const Departmentoptions = Department?.departments?.map((item) => ({
    value: item?._id,
    label: item?.departmentName,
  }));

  const managerOptions = Managers?.map((item) => ({
    value: item?.managerId?._id,
    label: `${item?.managerId?.first_name} ${item?.managerId?.last_name}`,
  }));

//   const locationOptions = location?.locationsData?.map((item) => ({
//     value: item._id,
//     label: item.shortName,
//   }));
const locationOptions = location?.locationsData?.map((item) => ({
  value: item._id,
  label: `${item.city}`,
}));


  return {
    department,
    setDepartment,
    manager,
    setManager,
    locations,
    setLocations,
    Departmentoptions,
    managerOptions,
    locationOptions,
  };
}
