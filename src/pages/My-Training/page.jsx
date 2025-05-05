import { Info } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { RiAlarmWarningFill } from "react-icons/ri";
import { TbSchool } from "react-icons/tb";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import useAuthToken from "../../hooks/Token/useAuth";
import TrainingDetailCard from "../Training/SingleTraining/Components/Card";
import TableRow from "../Training/training-table/components/TableRow";

const MyTraining = () => {
  const authToken = useAuthToken();
  const { organizationId } = useParams();
  const [selectedCard, setSelectedCard] = useState({
    title: "All Trainings",
    data: [],
  });

  const { data, isLoading, isFetching } = useQuery(
    ["trainingForEmployee"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/training-employee/getAllTrainingsOfEmployee/${organizationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      setSelectedCard({
        title: "All Trainings",
        data: response?.data?.data,
      });
      return response.data;
    }
  );

  const handleCardClick = (title, trainings = () => {}) => {
    setSelectedCard({
      title,
      data: trainings ? trainings : data?.data,
    });
  };

  return (
    <>
      {isLoading || isFetching ? (
        <div className="flex justify-center items-center h-screen">
          <CircularProgress />
        </div>
      ) : (
        <>
          <BoxComponent>
            <HeadingOneLineInfo
              heading={"Trainings"}
              info={
                "This section provides an overview and detailed about trainings ."
              }
            />

            <div className="flex gap-4 flex-wrap">
              <div onClick={() => handleCardClick("All Trainings", data?.data)}>
                <TrainingDetailCard
                  title={"All Trainings"}
                  icon={TbSchool}
                  desc={data?.getAllTrainings}
                  className={`bg-blue-100 text-blue-500 ${
                    selectedCard?.title === "All Trainings"
                      ? "border-2 border-blue-500"
                      : ""
                  }`}
                />
              </div>
              <div
                className="cursor-pointer"
                onClick={() =>
                  handleCardClick("My Trainings", data?.mytrainings)
                }
              >
                <TrainingDetailCard
                  title={"My Trainings"}
                  icon={TbSchool}
                  desc={data?.totalResults}
                  className={`bg-purple-100 text-purple-500 ${
                    selectedCard?.title === "My Trainings"
                      ? "border-2 border-purple-500"
                      : ""
                  }`}
                />
              </div>
              <div
                className="cursor-pointer"
                onClick={() =>
                  handleCardClick(
                    "Total On Going",
                    data?.getAllPendingTrainings
                  )
                }
              >
                <TrainingDetailCard
                  title={"Total On Going "}
                  icon={RiAlarmWarningFill}
                  desc={data?.getPendingTrainings}
                  className={`bg-yellow-100 text-yellow-500 ${
                    selectedCard?.title === "Total On Going"
                      ? "border-2 border-yellow-500"
                      : ""
                  }`}
                />
              </div>
              <div
                className="cursor-pointer"
                onClick={() =>
                  handleCardClick("Over Due's Training", data?.OverdueTrainings)
                }
              >
                <TrainingDetailCard
                  title={"Over Due's Training"}
                  icon={RiAlarmWarningFill}
                  desc={data?.getOverDueTrainings}
                  className={`bg-red-100 text-red-500 ${
                    selectedCard?.title === "Over Due's Training"
                      ? "border-2 border-red-500"
                      : ""
                  }`}
                />
              </div>
              <div
                className="cursor-pointer"
                onClick={() =>
                  handleCardClick("Total Completed", data?.completeTrainings)
                }
              >
                <TrainingDetailCard
                  title={"Completed Training"}
                  icon={TbSchool}
                  desc={data?.getCompletedTrainings}
                  className={`bg-green-100 text-green-500 ${
                    selectedCard?.title === "Completed Training"
                      ? "border-2 border-green-500"
                      : ""
                  }`}
                />
              </div>
            </div>
          </BoxComponent>

          <div className="mt-6">
            <div className="flex flex-wrap gap-4">
              {selectedCard?.data?.length === 0 ? (
                <>
                  <div className="flex items-center p-4 w-full  bg-blue-50 rounded-md shadow-md">
                    <h1 className="text-lg font-bold text-blue-500">
                      <Info /> Training Not Found
                    </h1>
                  </div>
                </>
              ) : (
                selectedCard?.data?.map((doc) => (
                  <div key={doc?._id} className="relative">
                    <TableRow
                      logo={
                        doc?.trainingLogo
                          ? doc?.trainingLogo
                          : doc?.trainingId?.trainingLogo
                      }
                      doc={
                        selectedCard?.title === "All Trainings"
                          ? doc
                          : doc?.trainingId
                      }
                      status={doc?.status}
                      empStartDate={doc?.startDate}
                      empEndDate={doc?.endDate}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </>
    // <div className="pt-14 p-8">
    //   <div className="flex flex-col gap-8 w-full border-b-2 border-dashed pb-8 mb-8">
    //     <h1 className="font-bold text-2xl">My Training</h1>
    //     <div className="flex justify-between w-full">
    //       <TextFiledColumn
    //         setOpen={setOpen}
    //         length={upcomingTraining?.data?.length}
    //         text={"Upcoming Trainings"}
    //         Icon={EventNote}
    //         className={"!bg-blue-500 !hover:bg-blue-600"}
    //       />
    //       <TextFiledColumn
    //         setOpen={setOpen2}
    //         length={ongoingTraining?.data?.length}
    //         text={"Ongoing Trainings"}
    //         className={"!bg-green-500 !hover:bg-screen-600"}
    //         Icon={PlayCircleOutlineOutlined}
    //       />
    //       <TextFiledColumn
    //         setOpen={setOpen3}
    //         length={overdueTraining?.data?.length}
    //         text={"Overdue training"}
    //         className={"!bg-red-500 !hover:bg-red-600"}
    //         Icon={Warning}
    //       />
    //       <TextFiledColumn
    //         setOpen={setOpen4}
    //         length={completedTraining?.data?.length}
    //         text={"Completed training"}
    //         className={"!bg-gray-500 !hover:bg-red-600"}
    //         Icon={CheckCircleOutlineOutlined}
    //       />
    //     </div>
    //   </div>
    //   <EmployeeTable
    //     data={data?.data}
    //     setPage={setPage}
    //     isLoading={isLoading}
    //     totalResult={data?.totalResults}
    //     page={page}
    //   />
    //   <Modal
    //     open={open}
    //     onClose={() => setOpen(false)}
    //     aria-labelledby="modal-modal-title"
    //     aria-describedby="modal-modal-description"
    //   >
    //     <Box className="border-none shadow-md outline-none rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%] md:w-[70%] z-10 p-4 bg-white">
    //       <Modal1 />
    //     </Box>
    //   </Modal>
    //   <Modal
    //     open={open2}
    //     onClose={() => setOpen2(false)}
    //     aria-labelledby="modal-modal-title"
    //     aria-describedby="modal-modal-description"
    //   >
    //     <Box className="border-none shadow-md outline-none rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%] md:w-[70%] z-10 p-4 bg-white">
    //       <Modal2 />
    //     </Box>
    //   </Modal>
    //   <Modal
    //     open={open3}
    //     onClose={() => setOpen3(false)}
    //     aria-labelledby="modal-modal-title"
    //     aria-describedby="modal-modal-description"
    //   >
    //     <Box className="border-none shadow-md outline-none rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%] md:w-[70%] z-10 p-4 bg-white">
    //       <Modal3 />
    //     </Box>
    //   </Modal>
    //   <Modal
    //     open={open4}
    //     onClose={() => setOpen4(false)}
    //     aria-labelledby="modal-modal-title"
    //     aria-describedby="modal-modal-description"
    //   >
    //     <Box className="border-none shadow-md outline-none rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%] md:w-[70%] z-10 p-4 bg-white">
    //       <Modal4 />
    //     </Box>
    //   </Modal>
    // </div>
  );
};

export default MyTraining;
