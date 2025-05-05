import { Search } from "@mui/icons-material";
import Skeleton from "@mui/material/Skeleton";
import React, { useState } from "react";
import { PiStudent } from "react-icons/pi";
import { useParams } from "react-router-dom";
import Select from "react-select";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import useSetupTraining from "../../../hooks/QueryHook/Setup/training";
import useDebounce from "../../../hooks/QueryHook/Training/hook/useDebounce";
import TableRow from "../training-table/components/TableRow";
import useGetAllTraining from "./hooks/useGetAllTraining";

const SelectTrainingField = ({ organizationId, onChange }) => {
  const { data } = useSetupTraining(organizationId);
  return (
    <div className={`min-w-[200px] w-max`}>
      <div
        className={`flex outline-none h-max border-gray-200 border-[.5px] rounded-md items-center px-2 bg-white`}
      >
        <PiStudent />
        <Select
          aria-errormessage=""
          isClearable
          placeholder={"Select Training Type"}
          styles={{
            control: (styles) => ({
              ...styles,
              borderWidth: "0px",
              boxShadow: "none",
            }),
          }}
          //   value={fySelect}
          onChange={onChange}
          className={`bg-white w-full !outline-none !shadow-none !border-none !border-0`}
          options={data?.data?.trainingType?.map((doc) => ({
            value: doc.value,
            label: doc.value,
          }))}
        />
      </div>
    </div>
  );
};

const EmployeeTrainings = () => {
  const { organizationId } = useParams();
  const [select, setSelect] = useState("");
  const [trainingType, setTrainingType] = useState(null);
  const debouncedSelect = useDebounce(select, 500);
  const { data, isLoading } = useGetAllTraining(
    organizationId,
    debouncedSelect,
    trainingType
  );

  return (
    <BoxComponent>
      <div className="container mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <HeadingOneLineInfo heading="All Trainings" />
          <div className="flex gap-2 items-center">
            <div className="outline-none border-gray-200 border-[.5px] flex rounded-md items-center px-2 max-w-[400px] bg-white py-3 md:py-[6px]">
              <Search className="text-gray-700 md:text-lg !text-[1em]" />
              <input
                type={"text"}
                value={select}
                onChange={(e) => setSelect(e.target.value)}
                placeholder={"Search Training"}
                className={`border-none bg-white w-full outline-none px-2`}
                formNoValidate
              />
            </div>
            <SelectTrainingField
              organizationId={organizationId}
              onChange={(value) => setTrainingType(value)}
            />
          </div>
        </div>

        <aside className="flex flex-wrap gap-4">
          {isLoading
            ? Array.from(new Array(6)).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  width={300}
                  height={200}
                  className="rounded-lg"
                />
              ))
            : data?.data?.map((doc) => (
                <div key={doc._id} className="relative">
                  <TableRow logo={doc?.trainingLogo} doc={doc} />
                </div>
              ))}
        </aside>
      </div>
      {/* <SearchableModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        heading="Search Training"
      >
        <div className="flex p-2 justify-between border-b items-center">
          <div className="flex gap-2 items-center">
            <Search className="text-gray-700" />
            <input
              type="text"
              placeholder="Search Training"
              className="border-none outline-none p-2 w-full"
            />
          </div>
          <IconButton>
            <Close />
          </IconButton>
        </div>
        <div className="p-2">
          <h1 className="text-lg text-center !font-sans">No Trainings found</h1>
        </div>
      </SearchableModal> */}
    </BoxComponent>
  );
};

export default EmployeeTrainings;
