import {
  CheckCircleOutline,
  Close,
  FlagOutlined,
  StarOutline,
} from "@mui/icons-material";
import { Avatar, Box, IconButton, Modal } from "@mui/material";
import DOMPurify from "dompurify";
import React from "react";
import { useQuery } from "react-query";
import usePerformanceApi from "../../../../../hooks/Performance/usePerformanceApi";
import useAuthToken from "../../../../../hooks/Token/useAuth";
import DashboardCardTab from "../../Dashboard/Tabs/DashboardCardTab";
import PreviewSkeleton from "../Skelton/PreviewSkeleton";

const DashboardModel = ({ open, handleClose, id }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    overflow: "auto",
    maxHeight: "60vh",
    p: 4,
  };

  const authToken = useAuthToken();
  const { getEmployeePerformanceTable, setDashboardData } = usePerformanceApi();

  const { data: empData, isFetching: empDashFetching } = useQuery(
    {
      queryKey: ["employeePerformanceTable", id],
      queryFn: async () => {
        const data = await getEmployeePerformanceTable({
          authToken,
          empId: id,
        });
        setDashboardData(data);
        return data;
      },
    },
    {
      enabled: id !== null || id !== undefined,
    }
  );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={style}
        className="border-none !z-10 !pt-0 !px-0 !w-[90%] lg:!w-[70%] md:!w-[70%] shadow-md outline-none rounded-md"
      >
        {empDashFetching ? (
          <PreviewSkeleton />
        ) : (
          <>
            <div className="flex justify-between py-4 items-center  px-4">
              <div className="flex w-max items-center gap-4">
                <Avatar
                  sx={{ height: 50, width: 50 }}
                  src={empData?.empId?.user_logo_url}
                />
                <div>
                  <h1 className="text-2xl font-semibold font-sans space-x-3 truncate">
                    {empData?.empId?.first_name} {empData?.empId?.last_name}
                  </h1>

                  <div className="flex flex-wrap w-full py-1 gap-4 items-center">
                    <div className="flex gap-1 items-center">
                      <StarOutline className="text-yellow-500 !text-[18px]" />
                      <p>
                        Rating:{" "}
                        {empData?.managerRating
                          ? empData?.managerRating
                          : "Rating not given"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircleOutline className="!text-[18px] text-green-500" />
                      <p>
                        Goals Completed:{" "}
                        {empData?.goals?.reduce((i, acc) => {
                          if (acc?.goalStatus === "Completed") {
                            return i + 1;
                          }
                          return i;
                        }, 0)}{" "}
                        / {empData?.goals?.length}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <FlagOutlined className="!text-[18px] text-red-500" />
                      <p>
                        Goals Overdue:{" "}
                        {empData?.goals?.reduce((i, acc) => {
                          const { goalStatus, endDate } = acc;
                          const today = new Date();
                          const goalEndDate = new Date(endDate);
                          if (
                            goalEndDate < today &&
                            goalStatus !== "Completed"
                          ) {
                            return i + 1;
                          }
                          return i;
                        }, 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <IconButton onClick={handleClose}>
                <Close className="!text-[16px]" />
              </IconButton>
            </div>
            <div className="space-y-4 px-4 pb-4 ">
              <div>
                <h1 className="text-lg text-[#67748E] font-bold">Review :</h1>
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      empData?.managerFeedback
                        ? ` ${empData?.managerFeedback} `
                        : " Not yet reviewed by manager"
                    ),
                  }}
                  className="w-max"
                ></div>
              </div>

              <DashboardCardTab />
            </div>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default DashboardModel;
