import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, ErrorOutlineOutlined } from "@mui/icons-material";
import {
  Backdrop,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { differenceInMinutes, format } from "date-fns";
import moment from "moment-timezone";
import React, { useContext, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { TestContext } from "../../State/Function/Main";
import useGetUser from "../../hooks/Token/useUser";
import UserProfile from "../../hooks/UserData/useUser";
import useGetLeaveSetting from "../../pages/SetUpOrganization/LeaveComponents/hook/useGetLeaveSetting";
import usePublicHoliday from "../../pages/SetUpOrganization/PublicHolidayPage/usePublicHoliday";
import BasicButton from "../BasicButton";
import AuthInputFiled from "../InputFileds/AuthInputFiled";
import ReusableModal from "../Modal/component";
import MiniForm from "./components/mini-form";
import useSubscriptionGet from "../../hooks/QueryHook/Subscription/hook";

const CAppDatePicker = ({
  employeeLeaves,
  data,
  handleUpdateFunction,
  selectEvent,
  setselectEvent,
  setNewAppliedLeaveEvents,
  selectedLeave,
  setSelectedLeave,
  newAppliedLeaveEvents,
  shiftData,
  deleteLeaveMutation,
  setIsCAppDatePickerVisible,
  calLoader,
  setCalLoader,
  setCalendarOpen,
  selectedMonth,
  setSelectedMonth,
  setSelectedYear,
  setIsLeaveTableModalOpen,
}) => {
  const localizer = momentLocalizer(moment);

  moment.tz.setDefault("Asia/Kolkata");
  const queryClient = useQueryClient();
  const { organisationId } = useParams();
  const [Delete, setDelete] = useState(false);
  const [update, setUpdate] = useState(false);
  const { handleAlert } = useContext(TestContext);
  const { authToken } = useGetUser();
  const [openDelete, setOpenDelete] = useState(false);
  const { filteredHolidayWithStartAndEnd, allPublicHoliday } =
    usePublicHoliday(organisationId);
  const [openJustificationModal, setOpenJustificationModal] = useState(null);
  const [justification, setJustification] = useState(false);
  const { leaveSetting } = useGetLeaveSetting(openJustificationModal !== null);


  const fetchTodayAttendance = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API}/route/face-model/check-manual-foundation`, {
      headers: { Authorization: authToken },
    });
  
    return response.data;
  };
  
  const { data: attendanceData } = useQuery("today-attendance", fetchTodayAttendance);

  const increaseEndDateByOneDay = (events) => {
    return events?.map((event) => ({
      ...event,
      end: moment(event.end).add(1, "days").toDate(),
    }));
  };

  const role = UserProfile().useGetCurrentRole();

  const { data : subscriptiondata } = useSubscriptionGet({
    organisationId: organisationId,
  });

  const isemployee = role === "Employee";
  const isfoundation = subscriptiondata?.organisation?.packages?.includes("Foundation");

  const leaves = increaseEndDateByOneDay(data?.currentYearLeaves || []);
  const newAppliedLeaveEvent = increaseEndDateByOneDay(
    newAppliedLeaveEvents || []
  );

  const { data: data2 } = useQuery(
    "employee-disable-weekends",
    async () => {
      setCalLoader(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/weekend/get`,
        {
          headers: { Authorization: authToken },
        }
      );

      return response.data;
    },
    {
      onSuccess: () => {
        setCalLoader(false);
      },
      onError: () => {
        setCalLoader(false);
      },
    }
  );

  const isOffboarded = employeeLeaves?.employee?.isOffboarded;
  console.log("isOffboarded", isOffboarded);

  const handleSelectEvent = (event) => {
    if (isOffboarded) {
      if (event?.justification) {
        setOpenJustificationModal(event);
      }
      return; // Disable event selection for offboarded employees
    }
    setJustification(event?.justification ? true : false);
    if (
      event.title === "present" ||
      event.title === "partial" || 
      event.title === "late arrival"||
      event.title === "checkin not done" ||
      event.title === "checkout not done" ||
      (event.title === "Half Day" && (event.punchInTime || event.punchOutTime))
    ) {
      setOpenJustificationModal(event);

    }
     if (isOffboarded) return; 
    setCalLoader(true);
    setSelectedLeave(event);

    if (
      event.title === "present" ||
      event.title === "partial" || 
      event.title === "late arrival"||
      event.title === "checkin not done" ||
      event.title === "checkout not done" ||
      event.title === "ⓜ partial" || 
      event.title === "ⓜ late arrival"||
      event.title === "ⓜ checkin not done" ||
      event.title === "ⓜ checkout not done" ||
      (event.title === "Half Day" && (event.punchInTime || event.punchOutTime))
    ) {
      setOpenJustificationModal(event);
      setDelete(false);
      setUpdate(false);
      return;
    }

    if (event.title === "Selected Leave") {
      setDelete(true);
      setUpdate(false);
    } else if (event.color) {
      setUpdate(true);
      setDelete(true);
    } else {
      setDelete(false);
      setUpdate(false);
    }
    setCalLoader(false);
  };

  const dayPropGetter = (date) => {
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });

    // Check if the current day is in the data2 array
    const isDisabled = data2?.days?.days?.some((day) => {
      return day.day === dayOfWeek;
    });

    const isPublicHoliday = filteredHolidayWithStartAndEnd.some((holiday) =>
      moment(date).isSame(holiday.start, "day")
    );

    if (isDisabled || isPublicHoliday) {
      return {
        style: {
          pointerEvents: isDisabled ? "none" : "auto",
          backgroundColor: "#ffcccb", // light red
        },
      };
    }

    return {};
  };

  const handleSelectSlot = async ({ start, end }) => {
    if (isOffboarded) {
      return handleAlert(true, "warning", "Offboarded employees cannot apply for leave.");
    }
    setCalLoader(true);

    const selectedStartDate = moment(start).startOf("day");
    const selectedEndDate = moment(end).startOf("day").subtract(1, "days");

    const currentDate = moment(selectedStartDate);

    const includedDays = data2.days?.days?.map((day) => day.day);

    let extraDays = 0;
    let isExtraDay = false;

    while (currentDate.isSameOrBefore(selectedEndDate)) {
      const currentDay = currentDate.format("ddd");
      const isDisabled = includedDays?.includes(currentDay);
      const isPublicHoliday = filteredHolidayWithStartAndEnd?.some((holiday) =>
        moment(currentDate).isSame(holiday.start, "day")
      );

      if (isDisabled) {
        // if (isDisabled || isPublicHoliday) {
        setCalLoader(false);
        return handleAlert(true, "warning", "You cannot select holidays ");
      }

      if (isDisabled || isPublicHoliday) {
        extraDays++;
        isExtraDay = true;
        console.log(`🚀 ~ isExtraDay:`, isExtraDay);
      }

      currentDate.add(1, "day");
    }

    await queryClient.invalidateQueries("employee-leave-table-without-default");

    const isOverlap = [
      ...data?.currentYearLeaves,
      ...newAppliedLeaveEvents,
      ...shiftData?.requests,
    ].some((range) => {
      const rangeStart = range.start;
      const rangeEnd = moment(range.end).startOf("day");

      const isStartBetween = selectedStartDate.isBetween(
        rangeStart,
        rangeEnd,
        undefined,
        "[)"
      );

      const isEndBetween = selectedEndDate.isBetween(
        rangeStart,
        rangeEnd,
        undefined,
        "(]"
      );

      const isOverlap =
        selectedStartDate.isSameOrBefore(rangeEnd) &&
        selectedEndDate.isSameOrAfter(rangeStart);

      const isSameOverlap = selectedStartDate.isSame(rangeStart);

      return isStartBetween || isEndBetween || isOverlap || isSameOverlap;
    });

    if (isOverlap) {
      setCalLoader(false);
      return handleAlert(
        true,
        "warning",
        "You have already selected this leave"
      );
    } else {
      const newLeave = {
        // title: isExtraDay
        //   ? "Extra Day"
        //   : selectEvent
        //   ? "Updated Leave"
        //   : "Selected Leave",

        title: selectEvent ? "Updated Leave" : "Selected Leave",
        start: new Date(start).toISOString(),
        end: new Date(selectedEndDate).toISOString(),
        color: selectEvent ? "black" : "blue",
        leaveTypeDetailsId: "",
        _id: selectEvent ? selectedLeave?._id : null,
        extraDays,
      };

      setNewAppliedLeaveEvents((prevEvents) => [...prevEvents, newLeave]);
      setSelectedLeave(null);
      setselectEvent(false);
    }
    setCalLoader(false);
  };

  const CustomToolbar = (toolbar) => {
    const handleMonthChange = (event) => {
      const newMonth = event.target.value;
      setSelectedMonth(newMonth + 1);
      const newDate = moment(toolbar.date).month(newMonth).toDate();
      toolbar.onNavigate("current", newDate); // Ensure "current" is used

      console.log("employeeLeaves data", employeeLeaves);
      // Get the first date using user's birthdate and year
      const userBirthdate = moment(employeeLeaves?.employee.joining_date);
      console.log(`🚀 ~ userBirthdate:`, userBirthdate);
      const firstDate = userBirthdate
        .year(moment(toolbar.date).year())
        .toDate();
      console.log("First Date:", firstDate);
    };

    const handleYearChange = (event) => {
      setCalLoader(true);
      const newYear = event.target.value;
      const newDate = moment(toolbar.date)
        .year(newYear)
        .month(selectedMonth - 1)
        .toDate(); // Set month to current month
      toolbar.onNavigate("current", newDate); // Ensure "current" is used
      setSelectedYear(newYear);
      setCalLoader(false);
    };

    return (
      <>
        <h1 className="text-xl  text-gray-600 font-semibold ">
          {moment.months().find((_, id) => moment(toolbar.date).month() === id)}{" "}
          {moment(toolbar.date).year()}
        </h1>
        <div className=" !m-0 !p-0 flex md:flex-row flex-col justify-between  ">
          <div className="flex my-2  gap-2  justify-start">
            <Select
              className=" bg-white"
              size="small"
              value={moment(toolbar.date).month()}
              onChange={handleMonthChange}
            >
              {moment.months().map((month, index) => (
                <MenuItem key={index} value={index}>
                  {month}
                </MenuItem>
              ))}
            </Select>
            <Select
              className="bg-white"
              size="small"
              value={moment(toolbar.date).year()}
              onChange={handleYearChange}
            >
              {Array.from({
                length:
                  moment().year() -
                  moment(employeeLeaves?.employee.joining_date).year() +
                  1,
              }).map((_, index) => (
                <MenuItem
                  key={index}
                  value={
                    moment(employeeLeaves?.employee.joining_date).year() + index
                  }
                >
                  {moment(employeeLeaves?.employee.joining_date).year() + index}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="flex justify-end gap-1 items-center p-2">
          {/* {(
              <BasicButton
                color={"success"}
                title={"Punch In"}
                onClick={handlePunchIn}
                disabled={isOffboarded} // Disable delete button if offboarded
              />
            )} */}
            {isemployee && isfoundation && (
              !attendanceData?.data?.hasPunchedIn ? (
                <BasicButton
                  color="success"
                  title="Punch In"
                  onClick={handlePunchIn}
                  disabled={isOffboarded}
                />
              ) : (
                <BasicButton
                  color="danger"
                  title="Punch Out"
                  onClick={handlePunchOut}
                  disabled={isOffboarded}
                />
              )
            )}

            {update && (
              <BasicButton
                title={"Edit"}
                color={"success"}
                onClick={async () => {
                  await handleUpdateFunction();
                  setDelete(false);
                  setUpdate(false);
                }}
                disabled={isOffboarded} // Disable edit button if offboarded
              />
            )}
            {Delete && (
              <BasicButton
                color={"danger"}
                title={"Delete"}
                onClick={handleDelete}
                disabled={isOffboarded} // Disable delete button if offboarded
              />
            )}
         { 
         isOffboarded ? 
         <p className="text-red-500">

          Note: This employee has been offboarded. Leave cannot be applied.
         </p>
         :
         <BasicButton
              title={"Apply"}
              disabled={calLoader || newAppliedLeaveEvent?.length === 0 || isOffboarded} // Disable apply button if offboarded
              onClick={() => {
                setCalLoader(false);
                if (newAppliedLeaveEvents?.length > 0) {
                  setIsCAppDatePickerVisible(false);
                }
                setDelete(false);
                setUpdate(false);
                setCalendarOpen(false);
              }}
            />}
          </div>
        </div>
        <div className="md:hidden flex justify-end p-2">
          <BasicButton
            title={"View Leave Table"}
            onClick={() => setIsLeaveTableModalOpen(true)}
          />
        </div>
      </>
    );
  };

  const handleDelete = (e) => {
    if (selectedLeave.title === "Selected Leave") {
      setNewAppliedLeaveEvents((prev) =>
        prev.filter((data) => {
          return (
            data.title !== selectedLeave.title &&
            data.start !== selectedLeave.start &&
            data.end !== selectedLeave.end
          );
        })
      );
    } else {
      setOpenDelete(true);
    }
    setDelete(false);
    setUpdate(false);
  };

  const punchInMutation = useMutation(
    async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API}/route/face-model/manual-foundation`,
        {
          method: "POST",
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ activity: "Punch In" }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Punch In failed");
      }
  
      return response.json();
    },
    {
      onSuccess: (data) => {
        if (data.success) {
          queryClient.invalidateQueries("today-attendance"); // Refresh attendance data
          queryClient.invalidateQueries("employee-leave-table-without-default"); // Refresh attendance data
         handleAlert(true, "success", "Successfully Punched In");
        } 
      },
      onError: (error) => {
        handleAlert(true, "error", "Failed to Punch In.");
      },
    }
  );

  const handlePunchIn = () => {
    punchInMutation.mutate();
  };

  const punchOutMutation = useMutation(
    async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API}/route/face-model/manual-foundation`,
        {
          method: "POST",
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ activity: "Punch Out" }),
        }
      );
  
  
      return response.json();
    },
    {
      onSuccess: (data) => {
        if (data.success) {
          queryClient.invalidateQueries("today-attendance"); // Refresh attendance data
          queryClient.invalidateQueries("employee-leave-table-without-default"); // Refresh attendance data
         handleAlert(true, "success", "Successfully Punched Out");
        } 
      },
      onError: (error) => {
        console.error("Error punching out:", error);
        handleAlert(true, "error", "Failed to Punch Out.");
      },
    }
  );
  
  const handlePunchOut = () => {
    punchOutMutation.mutate();
  };



  const eventPropGetter = (event) => {
    let backgroundColor = "blue";
    let color = "white";

    switch (event.status) {
      case "Pending":
        backgroundColor = "orange";
        break;
      case "Rejected":
        backgroundColor = "red";
        break;
      case "Approved":
        backgroundColor = "green";
        break;
      default:
        backgroundColor = "blue";
        break;
    }

    const matchingLeave = leaves?.find(
      (leave) => leave.leaveTypeDetailsId === event.leaveTypeDetailsId
    );

    if (matchingLeave) {
      backgroundColor = matchingLeave.color;
    }

    // const dayOfWeek = moment(event.start).format("ddd");
    // const isDisabled = data2?.days?.days?.some((day) => day.day === dayOfWeek);
    const isPublicHoliday = filteredHolidayWithStartAndEnd.some((holiday) =>
      moment(event.start).isSame(holiday.start, "day")
    );

    if (event?.title === "Unavailable") {
      backgroundColor = "transparent";
    }

    if (isPublicHoliday && !event?.status) {
      if (event.title === "Available") {
        backgroundColor = event?.color;
      }
      if (event.title === "Selected Leave") {
        backgroundColor = "blue"; // light red
      } else {
        backgroundColor = "#ffcccb"; // light red
      }
    }

    return {
      style: {
        backgroundColor,
        color,
        fontSize: "14px",
        fontWeight: event.isPublicHoliday ? "bold" : "normal",
      },
    };
  };

  const baseHeader = ({ label }) => {
    return (
      <div className="!border-none !outline-none p-2 ">
        <h1 className="font-medium text-gray-600 ">{label}</h1>
      </div>
    );
  };

  const CustomEvent = ({ event }) => {
    const eventStyle = {
      // height: "2em",
    };

    if (event.isPublicHoliday) {
      return (
        <span
          className="tracking-wide  leading-none font-bold  text-[14px] flex items-center text-[red] "
          style={eventStyle}
        >
          {event.title}
        </span>
      );
    }

    if (event?.title === "Unavailable") {
      return (
        <Tooltip
          title={
            "Add paid leave or  available otherwise it will count as a unpaid leave "
          }
        >
          <span
            className="   tracking-wide   text-[14px] flex items-center text-gray-500 "
            style={eventStyle}
          >
            <ErrorOutlineOutlined className="!text-[15px] " /> {event.title}
          </span>
        </Tooltip>
      );
    }
    return (
      <span style={eventStyle}>
        {event.title === "present"
          ? "Available"
          : event.title === "partial"
          ? "Partial"
          : event?.title === "checkout not done"
          ? "Checkout Not Done"
          : event?.title}
      </span>
    );
  };

  const DateCellContent = ({ label, date }) => {
    const isPublicHoliday = filteredHolidayWithStartAndEnd.some((holiday) =>
      moment(date).isSame(holiday.start, "day")
    );

    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });
    const isDisabled = data2?.days?.days?.some((day) => day.day === dayOfWeek);


    console.log("isDisabled" , isDisabled)

    return (
      <div
        style={{
          color: isPublicHoliday || isDisabled ? "red" : "grey",
          fontSize: "0.9em",
          padding: "10px 0 5px",
          width: "100%",
        }}
        className="flex justify-end"
      >
        <h1 className={`rounded-full px-1`}>{label}</h1>
      </div>
    );
  };

  const JustificationSchema = z.object({
    message: z.string().min(5, { message: "Minimum 5 characters" }).optional(),
  });

  const {
    handleSubmit,
    control,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(JustificationSchema),
    defaultValues: {
      message: openJustificationModal?.justification ?? undefined,
    },
  });

  const addJustificationMutation = useMutation(
    (data) =>
      axios.put(
        `${process.env.REACT_APP_API}/route/leave/addJustification/${openJustificationModal._id}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("justifications");
        await queryClient.invalidateQueries(
          "employee-leave-table-without-default"
        );
        await queryClient.invalidateQueries("employee-leave-table");
        handleAlert(true, "success", "Justification added successfully.");
        reset();
        setOpenJustificationModal(null);
      },
      onError: (err) => {
        handleAlert(true, "error", err?.response?.data?.error);
      },
    }
  );

  const onSubmit = (data, isHalfDay = false) => {
    if (!isHalfDay && !data.message) {
      setError("message", {
        type: "manual",
        message: "Justification is required",
      });
      return;
    }
    const payload = isHalfDay
      ? { ...data, justification: "Half Day", title: "Half Day" }
      : data;
    addJustificationMutation.mutate(payload);
    setCalLoader(false);
  };

  const generateUnavailableEvents = (events, startMonth, endMonth) => {
    const startOfMonth = moment().month(startMonth).startOf("month");
    const endOfMonth = moment().month(endMonth).endOf("month");
    const unavailableEvents = [];

    for (
      let date = startOfMonth;
      date.isBefore(endOfMonth);
      date.add(1, "day")
    ) {
      const currentMonth = moment().month();
      if (date.month() >= currentMonth) {
        continue; // Skip current and future months
      }

      const dayOfWeek = date.format("ddd");
      const isDisabled = data2?.days?.days?.some(
        (day) => day.day === dayOfWeek
      );
      const isPublicHoliday = filteredHolidayWithStartAndEnd?.some((holiday) =>
        moment(date).isSame(holiday.start, "day")
      );

      const hasEvent = events?.some((event) =>
        moment(date).isBetween(
          event.start,
          moment(event.end).subtract(1, "days"),
          "day",
          "[]"
        )
      );

      if (!hasEvent && !isDisabled && !isPublicHoliday) {
        unavailableEvents.push({
          title: "Unavailable",
          start: date.toDate(),
          end: date.toDate(),
          allDay: true,
        });
      }
    }

    return unavailableEvents;
  };

  const events = data
    ? [
        ...leaves,
        ...(shiftData?.requests || []),
        ...newAppliedLeaveEvent,
        ...(filteredHolidayWithStartAndEnd?.map((holiday) => ({
          ...holiday,
          isPublicHoliday: true,
        })) || []),
      ]
    : [
        ...newAppliedLeaveEvent,
        ...(filteredHolidayWithStartAndEnd?.map((holiday) => ({
          ...holiday,
          isPublicHoliday: true,
        })) || []),
      ];

  const monthsWithEvents = leaves.map((leave) => moment(leave.start).month());
  const startMonth = Math.min(...monthsWithEvents);
  const endMonth = Math.max(...monthsWithEvents);

  const allEvents =
    monthsWithEvents.length > 0
      ? [...events, ...generateUnavailableEvents(events, startMonth, endMonth)]
      : events;

  return (
    <div className="relative">
      {calLoader && (
        <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center z-50 bg-opacity-50 bg-gray-800">
          <Backdrop style={{ position: "absolute" }} open={true}>
            <CircularProgress />
          </Backdrop>
        </div>
      )}
      <div className="z-10 p-2">
        <div className="w-full flex items-center justify-center">
          {allPublicHoliday &&
            filteredHolidayWithStartAndEnd &&
            shiftData?.requests &&
            data?.currentYearLeaves && (
              <Calendar
                localizer={localizer}
                views={["month"]}
                components={{
                  event: CustomEvent,
                  header: baseHeader,
                  week: baseHeader,
                  toolbar: CustomToolbar,
                  dateHeader: DateCellContent,
                }}
                events={allEvents}
                startAccessor="start"
                endAccessor="end"
                style={{
                  height: "400px",
                  width: "100%",
                }}
                selectable={!isOffboarded} // Disable calendar selection if offboarded
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                datePropGetter={selectedLeave}
                eventPropGetter={eventPropGetter}
                titleAccessor={(event) =>
                  event.isPublicHoliday ? event.title : event.title
                }
                dayPropGetter={dayPropGetter}
                className="rbc-calendar" // Add this class to ensure proper alignment
              />
            )}
        </div>
      </div>

      <ReusableModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        heading={"Are you sure want delete ?"}
      >
        <MiniForm
          id={selectedLeave?._id}
          mutate={deleteLeaveMutation?.mutate}
          onClose={() => setOpenDelete(false)}
        />
      </ReusableModal>

      <ReusableModal
        open={openJustificationModal !== null}
        onClose={() => {
          setOpenJustificationModal(null);
          reset();
          setCalLoader(false);
        }}
        heading={`Attendance Status: ${
          openJustificationModal &&
          format(new Date(openJustificationModal?.start), "PP")
        }`}
      >
        {openJustificationModal && (
          <>
            <div className="space-y-2 my-2">
              <div className="flex gap-3 items-center">
                <h1 className="text-xl font-bold tracking-tighter text-gray-500">
                  {openJustificationModal.title === "present"
                    ? "Present"
                    : openJustificationModal.title}
                </h1>

                {openJustificationModal?.title !== "present" && (
                  <Chip
                    size="small"
                    color={
                      openJustificationModal?.status === "Rejected"
                        ? "error"
                        : openJustificationModal?.status === "Approved"
                        ? "success"
                        : "warning"
                    }
                    label={
                      !openJustificationModal?.justification &&
                      openJustificationModal?.title !== "Half Day"
                        ? "Justification Required"
                        : openJustificationModal?.status
                    }
                  />
                )}
              </div>

              {openJustificationModal?.title !== "present" &&
                openJustificationModal?.title !== "Half Day" &&
                !openJustificationModal?.justification && (
                  <h1 className="text-red-500">
                    Note* : If justification is not provided, it will be
                    considered as leave
                  </h1>
                )}
              <div className="flex gap-2 items-center">
                <div className="flex gap-1 py-1 px-4 rounded-lg bg-gray-50 border">
                  <h1>Punch In Time:</h1>{" "}
                  <p>
                    {openJustificationModal?.punchInTime
                      ? moment(openJustificationModal?.punchInTime)
                          .tz("Asia/Kolkata")
                          .format("hh:mm a")
                      : "Check in not done"}
                  </p>
                </div>
                <div className="flex gap-1 py-1 px-4 rounded-lg bg-gray-50 border">
                  <h1>Punch Out Time:</h1>{" "}
                  <p>
                    {openJustificationModal.punchOutTime
                      ? moment(openJustificationModal?.punchOutTime)
                          .tz("Asia/Kolkata")
                          .format("hh:mm a")
                      : "Checkout not done"}
                  </p>
                </div>
              </div>

              {openJustificationModal.punchOutTime &&
                openJustificationModal.punchInTime && (
                  <div className="flex gap-1 w-max py-1 px-4 rounded-lg bg-gray-50 border">
                    <h1>Available Time:</h1>{" "}
                    {Math.floor(
                      differenceInMinutes(
                        new Date(openJustificationModal.punchOutTime),
                        new Date(openJustificationModal.punchInTime)
                      ) / 60
                    )}{" "}
                    hours{" "}
                    <p>
                      {differenceInMinutes(
                        new Date(openJustificationModal.punchOutTime),
                        new Date(openJustificationModal.punchInTime)
                      ) % 60}{" "}
                      minutes
                    </p>
                  </div>
                )}
            </div>

            {(role === "Employee" || role === "HR") &&
              openJustificationModal?.title !== "present" &&
              openJustificationModal?.status !== "Justification" && (
                <div className="flex justify-between items-center gap-1 py-1 px-4 rounded-lg bg-gray-50 border">
                  {/* {justification && ( */}
                  <div className="flex gap-1">
                    <h1>Justification:</h1>{" "}
                    <p>
                      {openJustificationModal?.justification
                        ? openJustificationModal?.justification
                        : "No justification Provided"}
                    </p>
                  </div>
                  {/* )} */}
                  {((role === "HR" && leaveSetting?.data?.isHRJustify) ||
                    role === "Employee") &&
                    openJustificationModal.title !== "present" &&
                    openJustificationModal.status === "Pending" && (
                      <IconButton
                        onClick={() => {
                          setValue(
                            "message",
                            openJustificationModal?.justification ?? ""
                          );
                          setJustification(false);
                        }}
                      >
                        <Edit color="primary" />
                      </IconButton>
                    )}
                </div>
              )}

            {!justification &&
              openJustificationModal?.message &&
              openJustificationModal?.status === "Approved" && (
                <div className="flex mt-2 justify-between items-center gap-1 py-1 px-4 rounded-lg bg-gray-50 border">
                  <div className="flex gap-1">
                    <h1>Manager Message:</h1>{" "}
                    <p>{openJustificationModal?.message}</p>
                  </div>
                </div>
              )}
            {((role === "HR" && leaveSetting?.data?.isHRJustify) ||
              role === "Employee") &&
              openJustificationModal.title !== "present" &&
              (openJustificationModal.status !== "Pending" ||
                !justification) && (
                <form
                  onSubmit={handleSubmit((data) => onSubmit(data))}
                  className="w-full space-y-4"
                >
                  <AuthInputFiled
                    name="message"
                    control={control}
                    type="textarea"
                    placeholder="Add justification here"
                    label="Justification *"
                    errors={errors}
                    error={errors.message}
                  />

                  <div className="flex justify-end gap-2">
                    <BasicButton
                      title={"Cancel"}
                      color={"error"}
                      variant="outlined"
                      onClick={() => {
                        setOpenJustificationModal(null);
                        setCalLoader(false);
                        reset();
                      }}
                      type="button"
                    />

                    <BasicButton
                      title={"Apply Half Day"}
                      color={"warning"}
                      type="button"
                      onClick={handleSubmit((data) => onSubmit(data, true))}
                    />
                    <BasicButton
                      disabled={addJustificationMutation?.isLoading}
                      title={"Submit"}
                      type="submit"
                    />
                  </div>
                </form>
              )}
          </>
        )}
      </ReusableModal>
    </div>
  );
};

export default CAppDatePicker;
