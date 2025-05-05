// import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Button} from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
// import useGeoMutation from "../Mutation/useGeoCard";
import SmallInputForm from "../../Geo-Fence/utils/SmallInputForm";
import TableComponent from "../../Geo-Fence/utils/TableComponent";
import useEmployeeListStore from "../../Geo-Fence/Mutation/employeeListStore";
import { useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";

//get added employee in geofence area
const fetchAddedEmployee = async (circleId , organizationId) => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API}/route/foundation-geo-fence/${circleId}/${organizationId}`
  );
  return data?.employees;
};

const ManageEmployeeModal = ({ onClose, circleId }) => {
  const { handleSubmit, register, setValue, watch } = 
  useForm();

  const {handleAlert} = useContext(TestContext);

const {organisationId} = useParams("")
const queryClient = useQueryClient();


const addEmployeeToCircleMutate = useMutation(
  async ({ circleId, employeeId, onClose }) => {
    const response = await axios.post(
        `${process.env.REACT_APP_API}/route/manageEmployee/${circleId}/${organisationId}`, { employeeId }
    );
    return response.data;
},
  {
    onSuccess: (data) => {
         queryClient.invalidateQueries(`fdemployees`);
         queryClient.invalidateQueries(`foundationSetup`);
         handleAlert(true, "success", "Employee added in geo fence area successfully");
        onClose();
    },
    }
);


  const { incrementPage, decrementPage, employeeList, page } =
    useEmployeeListStore();

  const onSubmit = (data) => {
    const selected = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== false) {
        acc[key] = value;
      }
      return acc;
    }, {});  
    const selectedId = Object.keys(selected).filter(
      (key) => key !== "selectAll"
    );

     addEmployeeToCircleMutate.mutate({ circleId, employeeId: selectedId, onClose });
  };


      const { data: addedEmployee } = useQuery(
    ["fdemployees", circleId],
    () => fetchAddedEmployee(circleId , organisationId),
    {
      enabled: !!circleId,
    }
  );


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex gap-4 flex-col overflow-scroll"
    >
      <SmallInputForm circleId={circleId} />
      <div className="flex flex-col gap-4 max-h-[300px] overflow-auto h-auto">
        <TableComponent
          register={register}
          setValue={setValue}
          watch={watch}
          addedEmployee={addedEmployee}
        />
      </div>
      <div className="flex flex-row-reverse gap-4">
        <Button
          type="button"
          onClick={incrementPage}
          disabled={employeeList?.length < 10}
          variant="outlined"
          className="!py-1 !w-[20px]"
        >
          Next
        </Button>
        <Button
          onClick={decrementPage}
          disabled={page <= 0}
          type="button"
          variant="outlined"
          className="!py-1 !w-[20px]"
        >
          Pre
        </Button>
      </div>
      <Button
        // disabled={!(selectedEmployee?.length > 0)}
        type="submit"
        variant="contained"
      >
        Save
      </Button>
    </form>
  );
};

export default ManageEmployeeModal;
