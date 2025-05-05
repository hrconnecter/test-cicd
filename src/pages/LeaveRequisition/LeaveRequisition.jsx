import React, { useContext, useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "tailwindcss/tailwind.css";
import AppDatePicker from "../../components/date-picker/date-picker";
// import HeaderBackComponent2 from "../../components/header/HeaderBackComponent2";
import { Avatar, useMediaQuery } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useQuery } from "react-query";
import { useParams } from "react-router";
import BasicButton from "../../components/BasicButton";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import CAppDatePicker from "../../components/date-picker/Cdate-picker";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import ReusableModal from "../../components/Modal/component";
import useLeaveData from "../../hooks/Leave/useLeaveData";
import useLeaveTable from "../../hooks/Leave/useLeaveTable";
import UserProfile from "../../hooks/UserData/useUser";
import { UseContext } from "../../State/UseState/UseContext";
import LeaveTable from "./components/LeaveTabel";
import Mapped from "./components/mapped-form";

const LeaveRequisition = () => {
  const { organisationId, empId } = useParams();
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [isApplyButtonLoading, setIsApplyButtonLoading] = useState(false);
  const {
    data,
    isLoading: balenceLoading,
    shiftData,
    setCalendarOpen,
    handleSubmit,
    newAppliedLeaveEvents,
    setNewAppliedLeaveEvents,
    isCalendarOpen,
    handleUpdateFunction,
    selectEvent,
    setSelectedLeave,
    selectedLeave,
    setselectEvent,
    deleteLeaveMutation,
    calLoader,
    setCalLoader,
  } = useLeaveData(empId, selectedMonth, selectedYear);

  const { cookies } = useContext(UseContext);

  const { useGetCurrentRole } = UserProfile();

  const role = useGetCurrentRole();
  const authToken = cookies["aegis"];

  const { data: machinePunchingRecord, isLoading: isMachineLoading } = useQuery(
    ["machinePunching", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/availableRecords`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data.data[0]?.availableRecords;
    }
  );

  const [isCAppDatePickerVisible, setIsCAppDatePickerVisible] = useState(true);

  const [isLeaveTableModalOpen, setIsLeaveTableModalOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { data: leaves, isLoading } = useLeaveTable(
    selectedMonth,
    selectedYear,
    empId
  );

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setIsApplyButtonLoading(true); // Ensure this is invoked correctly
    try {
      await handleSubmit(e); // Handle the actual logic
    } catch (error) {
      console.error("Error applying leave:", error);
    }
  };

  useEffect(() => {
    if (newAppliedLeaveEvents.length > 0 || !isMachineLoading) {
      setIsApplyButtonLoading(false);
    }
  }, [newAppliedLeaveEvents, isMachineLoading]);

  useEffect(() => {
    if (
      newAppliedLeaveEvents.length <= 0 &&
      Array.isArray(newAppliedLeaveEvents)
    ) {
      setIsCAppDatePickerVisible(true);
    }
    //eslint-disable-next-line
  }, [newAppliedLeaveEvents]);

  return (
    <BoxComponent sx={{ p: "0 !important" }}>
      <div
        className="!bg-[#F9FAFC] "
        style={{ overflowY: "auto", bgcolor: "#F9FAFC" }}
      >
        <div className="flex flex-col lg:flex-row">
          {!isMobile && (
            <div className="flex flex-col lg:w-[25%]">
              <div className="h-full space-y-2 my-2">
                <div className="my-4">
                  <HeadingOneLineInfo
                    heading="Attendance Calender"
                    info="In order to apply request select date click on the apply button"
                  />
                </div>
                {role !== "Employee" && (
                  <div className="mt-4 rounded-md bg-white border !py-2 !px-4 !pr-8 items-center flex gap-4 ">
                    <Avatar
                      variant="circular"
                      src={leaves?.employee?.user_logo_url}
                      alt="none"
                      sx={{ width: 45, height: 45 }}
                    />
                    <div>
                      <h1 className="font-bold text-lg tracking-tighter leading-none text-gray-600">
                        {leaves?.employee?.first_name}{" "}
                        {leaves?.employee?.last_name}
                      </h1>
                      <h1>{leaves?.employee?.email}</h1>
                    </div>
                  </div>
                )}
                <LeaveTable
                  data={leaves}
                  isLoading={isLoading}
                  balenceLoading={balenceLoading}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col my-1 lg:w-[75%]">
            <CAppDatePicker
              employeeLeaves={leaves}
              data={data}
              shiftData={shiftData}
              machinePunchingRecord={machinePunchingRecord}
              handleUpdateFunction={handleUpdateFunction}
              selectEvent={selectEvent}
              setselectEvent={setselectEvent}
              setCalendarOpen={setCalendarOpen}
              setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
              selectedLeave={selectedLeave}
              setSelectedLeave={setSelectedLeave}
              newAppliedLeaveEvents={newAppliedLeaveEvents}
              isCalendarOpen={isCalendarOpen}
              deleteLeaveMutation={deleteLeaveMutation}
              calLoader={calLoader}
              setCalLoader={setCalLoader}
              setIsCAppDatePickerVisible={setIsCAppDatePickerVisible}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              setIsLeaveTableModalOpen={setIsLeaveTableModalOpen}
            />
          </div>
        </div>

        {isMobile && (
          <ReusableModal
            heading={"Leave Table"}
            open={isLeaveTableModalOpen}
            onClose={() => setIsLeaveTableModalOpen(false)}
          >
            <LeaveTable
              data={leaves}
              isLoading={isLoading}
              balenceLoading={balenceLoading}
            />
          </ReusableModal>
        )}

        <ReusableModal
          heading={"Apply Leave"}
          open={!isCAppDatePickerVisible}
          onClose={() => setIsCAppDatePickerVisible(true)}
        >
          <>
            <form onSubmit={handleApplySubmit}>
              <div className="space-y-4">
                {newAppliedLeaveEvents.map((item, index) => (
                  <Mapped
                    empId={empId}
                    month={selectedMonth}
                    year={selectedYear}
                    key={index}
                    setCalendarOpen={setCalendarOpen}
                    subtractedLeaves={data?.LeaveTypedEdited}
                    item={item}
                    index={index}
                    newAppliedLeaveEvents={newAppliedLeaveEvents}
                    setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
                  />
                ))}
                <div className="w-full gap-2 flex justify-end my-1">
                  <BasicButton
                    title="Cancel"
                    variant="outlined"
                    onClick={() => setIsCAppDatePickerVisible(true)}
                    type="button"
                    color={"danger"}
                  />
                  <BasicButton
                    title={"Apply"}
                    type="submit"
                    disabled={isApplyButtonLoading} // Disable button during loading
                    color="primary"
                  />
                </div>
              </div>
            </form>

            <AppDatePicker
              data={data}
              shiftData={shiftData}
              machinePunchingRecord={machinePunchingRecord}
              handleUpdateFunction={handleUpdateFunction}
              selectEvent={selectEvent}
              setselectEvent={setselectEvent}
              setCalendarOpen={setCalendarOpen}
              setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
              selectedLeave={selectedLeave}
              setSelectedLeave={setSelectedLeave}
              newAppliedLeaveEvents={newAppliedLeaveEvents}
              isCalendarOpen={isCalendarOpen}
              deleteLeaveMutation={deleteLeaveMutation}
              calLoader={calLoader}
              setCalLoader={setCalLoader}
            />
          </>
        </ReusableModal>
      </div>
    </BoxComponent>
  );
};

export default LeaveRequisition;
