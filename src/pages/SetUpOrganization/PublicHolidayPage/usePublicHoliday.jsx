import axios from "axios";
import moment from "moment";
import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";

const usePublicHoliday = (id) => {
  const [allPublicHoliday, setAllPublicHoliday] = useState([]);
  let filteredHolidayWithStartAndEnd = [];
  const authToken = useAuthToken();

  const { empId } = useParams("");
  const role = UserProfile().useGetCurrentRole();

  const { data, isLoading, isError } = useQuery(
    "holidays",
    async () => {
      try {
        const response = await axios.get(
          role === "Employee"
            ? `${process.env.REACT_APP_API}/route/holiday/getbylocation/${id}`
            : `${process.env.REACT_APP_API}/route/holiday/getbylocation/${id}?empId=${empId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return response.data.holidays;
      } catch (error) {
        console.error("Error fetching holidays:", error);
       
      }
    },
    {
      onSuccess: (data) => {
        setAllPublicHoliday(data);
      },
    }
  );
  filteredHolidayWithStartAndEnd = data?.map((holiday) => {
    return {
      ...holiday,
      start: moment(holiday.date),
      end: moment(holiday.date),
      title: holiday.name,
    };
  });
  return {
    data,
    isLoading,
    isError,
    filteredHolidayWithStartAndEnd,
    allPublicHoliday,
  };
};

export default usePublicHoliday;
