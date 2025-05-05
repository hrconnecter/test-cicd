import { Info } from "@mui/icons-material";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Modal,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";
import {
  differenceInDays,
  differenceInMinutes,
  format,
  parseISO,
} from "date-fns";
import moment from "moment";
import React, { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useAuthToken from "../../../hooks/Token/useAuth";
import { TestContext } from "../../../State/Function/Main";
import useNotificationCount from "../../app-layout/notification-zustand";
import useLeaveData from "./useLeaveData";
import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";
import { useParams } from "react-router-dom";

const LeaveRejectmodal = ({ length, employeeId, isLoading, isArchive }) => {
  //hooks
  const authToken = useAuthToken();
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);
  const { acceptDeleteLeaveMutation, rejectDeleteLeaveMutation } =
    useLeaveData();
  const { reduceNotificationCount } = useNotificationCount();

  //states
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedLeaveId, setSelectedLeaveId] = useState();
  const [loadingIds, setLoadingIds] = useState([]);
  const { organisationId } = useParams();
  

  const { data : subscriptiondata } = useSubscriptionGet({
    organisationId: organisationId,
  });
  const isfoundation = subscriptiondata?.organisation?.packages?.includes("Foundation") && subscriptiondata?.organisation?.packageInfo === "Essential Plan";

  //reject api
  const { mutate: rejectMutate, isLoading: rejectLoading } = useMutation(
    async (length) => {
      await axios.post(
        `${process.env.REACT_APP_API}/route/leave/reject/${selectedLeaveId}`,
        { message },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      reduceNotificationCount(length);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("getFilterOrgData");
        queryClient.invalidateQueries("EmpDataLeave");
        handleAlert(true, "success", "Leave request rejected successfully.");
        handleClose();
      },
    }
  );

  //accept api
  const { mutateAsync: acceptLeaveMutation } = useMutation(
    ({ id, length }) => {
      axios.post(
        `${process.env.REACT_APP_API}/route/leave/accept/${id}`,
        { message: "Your Request is successfully approved" },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      reduceNotificationCount(length);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("employee-leave");
        queryClient.invalidateQueries("EmpDataLeave");
        handleAlert(true, "success", "Leave request accepted successfully");
        queryClient.invalidateQueries("getFilterOrgData");
      },
    }
  );

  // Employee accept or rejected data list
  const { data: EmpNotification, isLoading: empDataLoading } = useQuery({
    queryKey: ["EmpDataLeave", employeeId],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/leave/get/${employeeId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: !!employeeId,
  });

  //handle accept click
  const handleAcceptClick = (id, length) => {
    setLoadingIds((prev) => [...prev, id]);
    acceptLeaveMutation({ id, length });
    setLoadingIds((prev) => prev.filter((loadingId) => loadingId !== id));
  };

  //handle submit function of reject
  const handleSubmit = (e) => {
    e.preventDefault();
    rejectMutate(length);
  };

  //handle close functon
  const handleClose = () => {
    setOpen(false);
  };

  return empDataLoading ? (
    <div className="flex items-center justify-center my-2">
      <CircularProgress size={20} />
    </div>
  ) : employeeId ? (
    EmpNotification?.leaveRequests?.filter((item) =>
      isArchive
        ? item?.status !== "Pending" && item?.status !== "Deleted"
        : item?.status === "Pending" || item?.status === "Deleted"
    ).length <= 0 ? (
      <div className="flex  w-full items-center my-4">
        <h1 className="text-lg w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
          <Info /> There are no leave requests submitted at the moment.
        </h1>
      </div>
    ) : (
      EmpNotification?.leaveRequests
        ?.filter((item) =>
          isArchive
            ? item?.status !== "Pending" && item?.status !== "Deleted"
            : item?.status === "Pending" || item?.status === "Deleted"
        )
        ?.map((items, itemIndex) => (
          <Box
            key={itemIndex}
            sx={{
              py: 1,
            }}
          >
            <Box className="flex md:flex-row items-center  justify-center flex-col gap-1 ">
              <div className="space-y-1 w-full flex flex-col items-center md:items?-start justify-center">
                <div className="flex md:flex-row flex-col items-center bg-white py-1 px-4 border rounded-md w-full justify-between">
                  <div>
                    {differenceInDays(
                      parseISO(items?.end),
                      parseISO(items?.start)
                    ) !== 1 ? (
                      items?.status === "Deleted" ? (
                        <div className="space-y-1">
                          <h1 className="text-xl  tracking-tighter text-gray-500 font-bold lowercase ">
                            {items?.creatorId?._id === items?.employeeId?._id
                              ? `${items?.employeeId?.first_name} ${items?.employeeId?.last_name}`
                              : `${items?.creatorId?.first_name} ${items?.creatorId?.last_name}`}
                            {!items?.creatorId?._id ||
                            items?.creatorId?._id === items?.employeeId?._id
                              ? " has requested the deletion of "
                              : ` has requested the deletion of ${items?.employeeId?.first_name} ${items?.employeeId?.last_name}'s `}
                            {items?.leaveTypeDetailsId?.leaveName} record{" "}
                          </h1>
                          <p>
                            {moment(items?.end).isSame(items?.start)
                              ? "For"
                              : "From"}{" "}
                            {format(new Date(items?.start), "dd-MM-yyyy")}
                            {moment(items?.end).isSame(items?.start)
                              ? ""
                              : ` to ${moment(items?.end).format(
                                  "DD-MM-YYYY"
                                )}`}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <h1 className="text-xl  tracking-tighter text-gray-500 font-bold ">
                            {items?.creatorId &&
                            !items?.punchInTime &&
                            !items?.punchOutTime
                              ? `${items?.creatorId?.first_name}
    
                            ${items?.creatorId?.last_name}`
                              : `${items?.employeeId?.first_name}
                        ${items?.employeeId?.last_name}`}{" "}
                            {items?.creatorId?._id === items?.employeeId?._id ||
                            (items?.punchInTime && items?.punchOutTime)
                              ? " has requested "
                              : ` has raised a request for `}
                            {items?.title}{" "}
                            {items?.justification &&
                              isfoundation? "against selfie attendance" :"against biometric attendance"}
                          </h1>

                          <p>
                            {moment(items?.end).isSame(items?.start)
                              ? "for"
                              : "from"}{" "}
                            {format(new Date(items?.start), "dd-MM-yyyy")}
                            {moment(items?.end).isSame(items?.start)
                              ? ""
                              : ` to ${moment(items?.end).format(
                                  "DD-MM-YYYY"
                                )}`}
                          </p>

                          {
                            // {new Date(items?.punchInTime)}
                            // {new Date(items?.start).}
                            (items?.title === "Half Day" ||
                              (items?.punchInTime || items?.punchOutTime)) && (
                                <div className="flex flex-wrap items-center gap-4">
                                  <p
                                    className={
                                      "bg-gray-50 border p-1 rounded-lg"
                                    }
                                  >
                                    Check In Time :{" "}
                                    {
                                    items?.punchInTime ? 
                                    format(
                                      new Date(items?.punchInTime),
                                      "hh:mm a"
                                    ): "Checkin not done"}
                                  </p>
                                  <p
                                    className={
                                      "bg-gray-50 border p-1 rounded-lg"
                                    }
                                  >
                                    Check Out Time :{" "}
                                    {items?.punchOutTime
                                      ? format(
                                          new Date(items?.punchOutTime),
                                          "hh:mm a"
                                        )
                                      : "Checkout not done"}
                                  </p>

                                  {(items?.punchOutTime && items?.punchInTime) && (
                                    <div className="flex  gap-1 w-max p-1 rounded-lg bg-gray-50 border">
                                      <h1>Available Time:</h1>{" "}
                                      {Math.floor(
                                        differenceInMinutes(
                                          new Date(items?.punchOutTime),
                                          new Date(items?.punchInTime)
                                        ) / 60
                                      )}{" "}
                                      hours{" "}
                                      <p>
                                        {differenceInMinutes(
                                          new Date(items?.punchOutTime),
                                          new Date(items?.punchInTime)
                                        ) % 60}{" "}
                                        minutes
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                        </div>
                      )
                    ) : items?.status === "Deleted" ? (
                      <div className="space-y-1">
                        <h1 className="text-xl  tracking-tighter text-gray-500 font-bold lowercase ">
                          {items?.creatorId?._id === items?.employeeId?._id
                            ? `${items?.employeeId?.first_name} ${items?.employeeId?.last_name}`
                            : `${items?.creatorId?.first_name} ${items?.creatorId?.last_name}`}
                          {!items?.creatorId?._id ||
                          items?.creatorId?._id === items?.employeeId?._id
                            ? " has requested a deletion of "
                            : ` has requested to delete  ${items?.employeeId?.first_name} ${items?.employeeId?.last_name} `}
                          {items?.leaveTypeDetailsId?.leaveName} record{" "}
                        </h1>
                        <p>
                          {moment(items?.end).isSame(items?.start)
                            ? "For"
                            : "From"}{" "}
                          {format(new Date(items?.start), "dd-MM-yyyy")}
                          {moment(items?.end).isSame(items?.start)
                            ? ""
                            : ` to ${moment(items?.end).format("DD-MM-YYYY")}`}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <h1 className="text-xl  tracking-tighter text-gray-500 font-bold lowercase ">
                          {items?.creatorId
                            ? `${items?.creatorId?.first_name}
                        ${items?.creatorId?.last_name}`
                            : `${items?.employeeId?.first_name}
                        ${items?.employeeId?.last_name}`}{" "}
                          {!items?.creatorId?._id ||
                          items?.creatorId?._id === items?.employeeId?._id
                            ? " has requested "
                            : ` has raised a leave request for ${items?.employeeId?.first_name} ${items?.employeeId?.last_name} `}
                          {items?.leaveTypeDetailsId?.leaveName} from{" "}
                          {format(new Date(items?.start), "dd-MM-yyyy")}{" "}
                          {moment(items?.end).isSame(items?.start)
                            ? ""
                            : ` to ${moment(items?.end).format("DD-MM-YYYY")}`}
                        </h1>
                        <p>
                          {moment(items?.end).isSame(items?.start)
                            ? "For"
                            : "From"}{" "}
                          {format(new Date(items?.start), "dd-MM-yyyy")}
                          {moment(items?.end).isSame(items?.start)
                            ? ""
                            : ` to ${moment(items?.end).format("DD-MM-YYYY")}`}
                        </p>
                      </div>
                    )}

                    {(items?.message || items?.justification) && (
                      <p
                        className={
                          "bg-gray-50 my-2 w-full border p-1 rounded-lg"
                        }
                      >
                        {items?.justification
                          ? "Justification : "
                          : "Message : "}{" "}
                        {items?.justification ?? items?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    {items.status === "Pending" ? (
                      <Box sx={{ mt: 3, mb: 3 }}>
                        <Stack direction="row" spacing={3}>
                          <Button
                            variant="contained"
                            onClick={() => handleAcceptClick(items._id, length)}
                            color="primary"
                            sx={{
                              fontSize: "12px",
                              padding: "5px 30px",
                              textTransform: "capitalize",
                              position: "relative",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {loadingIds.includes(items._id) ? (
                              <CircularProgress
                                size={12} // Smaller size for the loader
                                sx={{
                                  color: "white",
                                  position: "absolute", // Positions the loader in the center
                                }}
                              />
                            ) : (
                              "Accept"
                            )}
                          </Button>

                          <Button
                            onClick={() => {
                              setSelectedLeaveId(items?._id); // Set the selected leave ID when opening the modal
                              setOpen(true);
                            }}
                            variant="contained"
                            sx={{
                              fontSize: "12px",
                              padding: "5px 30px",
                              textTransform: "capitalize",
                              position: "relative",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#BB1F11",
                              "&:hover": {
                                backgroundColor: "#BB1F11",
                              },
                            }}
                          >
                            Reject
                          </Button>
                        </Stack>
                      </Box>
                    ) : items.status === "Rejected" ? (
                      <Box>
                        <Chip label="Request rejected" color="error" />
                      </Box>
                    ) : items.status === "Deleted" ? (
                      <Box sx={{ mt: 3, mb: 3 }}>
                        <Stack direction="row" spacing={3}>
                          <Button
                            // disabled={isLoading || isFetching}
                            variant="contained"
                            onClick={() =>
                              acceptDeleteLeaveMutation({ id: items._id })
                            }
                            color="primary"
                            sx={{
                              fontSize: "12px",
                              padding: "5px 30px",
                              textTransform: "capitalize",
                            }}
                          >
                            Accept
                          </Button>
                          <Button
                            onClick={() =>
                              rejectDeleteLeaveMutation({ id: items._id })
                            }
                            variant="contained"
                            sx={{
                              fontSize: "12px",
                              padding: "5px 30px",
                              textTransform: "capitalize",
                              backgroundColor: "#BB1F11",
                              "&:hover": {
                                backgroundColor: "#BB1F11",
                              },
                            }}
                          >
                            Reject
                          </Button>
                        </Stack>
                      </Box>
                    ) : (
                      <Box>
                        <Chip label="Request Approved" color="success" />
                      </Box>
                    )}
                  </div>
                </div>
              </div>
            </Box>

            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              keepMounted
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                  p: 4,
                }}
                className="border-none md:w-[40%] w-[40%] shadow-md outline-none rounded-md"
              >
                <header className="flex items-center mb-4 gap-2">
                  <EventBusyIcon className="h-4 w-4 text-gray-700 !text-[1.7rem]" />
                  <h1
                    id="modal-modal-title"
                    className="text-xl font-semibold leading-relaxed "
                  >
                    Reject leave request
                  </h1>
                </header>
                <form onSubmit={handleSubmit}>
                  <div className="w-full space-y-2 flex flex-col">
                    <TextField
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      size="small"
                      id="outlined-basic"
                      label="Enter Description for rejecting the leave request"
                      variant="outlined"
                    />
                  </div>
                  <div className="flex gap-4 mt-4 justify-end">
                    <Button
                      type="button"
                      size="small"
                      onClick={async (e) => {
                        handleClose();
                      }}
                      color="error"
                      variant="contained"
                    >
                      cancel
                    </Button>
                    <Button
                      type="submit"
                      size="small"
                      variant="contained"
                      color="primary"
                      disabled={rejectLoading}
                    >
                      submit
                    </Button>
                  </div>
                </form>
              </Box>
            </Modal>
          </Box>
        ))
    )
  ) : null;
};

export default LeaveRejectmodal;
