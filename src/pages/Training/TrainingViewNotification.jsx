import { Avatar } from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import React, { useContext, useState } from "react";
import BasicButton from "../../components/BasicButton";
import ReusableModal from "../../components/Modal/component";
import useAuthToken from "../../hooks/Token/useAuth";
import { TestContext } from "../../State/Function/Main";

const TrainingViewNotification = ({ employee, isArchive }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [proofUrl, setProofUrl] = useState("");
  const authToken = useAuthToken();
  const { handleAlert } = useContext(TestContext);

  const handleViewProof = (url) => {
    setProofUrl(url);
    setModalOpen(true);
  };

  const isImage = (url) => {
    return /\.(jpg|jpeg|png|gif)$/.test(url);
  };

  const updateTrainingStatus = async (id, status) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API}/route/training/updateTrainingEmployeeStatus/${id}`,
        { status },
        {
          headers: { Authorization: authToken },
        }
      );

      // Handle success (e.g., show a success message)
      handleAlert(true, "success", "Training status updated successfully");
    } catch (error) {
      console.error("Error updating training status:", error);
      // Handle error (e.g., show an error message)
    }
  };

  console.log("tre", employee);

  return (
    <>
      {employee?.length === 0 && (
        <h1 className="text-center text-2xl text-gray-500 mt-5">No data</h1>
      )}
      <div className="space-y-2">
        {employee
          ?.filter((i) =>
            isArchive
              ? i?.isArchive ||
                i?.status === "rejected" ||
                i?.status === "completed"
              : i?.status !== "rejected" &&
                i?.status !== "completed" &&
                !i?.isArchive
          )
          ?.map((tre, id) => (
            <div
              key={id}
              className="flex items-center gap-3 bg-white shadow-sm p-3 rounded-lg"
            >
              <div className="relative">
                <Avatar src={tre?.trainingId?.trainingLogo} alt={id} />
              </div>
              <div className="flex flex-col w-full">
                <p className=" text-gray-900 items-start flex gap-2">
                  <span className="text-xl">
                    {tre?.trainingId?.trainingName}
                  </span>
                  <span className="flex bg-blue-100 w-max text-xs px-3 py-1 rounded-full font-semibold">
                    <span className="text-[#1414fe]">
                      {tre?.trainingId?.trainingLocation?.address}
                    </span>
                  </span>
                  {tre?.isArchive}
                  <span className="flex bg-gray-100 w-max text-xs px-3 py-1 rounded-full font-semibold">
                    <span className="text-gray-600">
                      {format(new Date(tre?.startDate), "PP")} -
                      {format(new Date(tre?.endDate), "PP")}
                    </span>
                  </span>
                  {/* <span className="flex bg-red-100 w-max text-xs px-3 py-1 rounded-full font-semibold">
                  <span className="text-red-500">Over Due</span>
                </span> */}
                </p>
                <div className="flex items-center  w-full justify-between">
                  <p className="text-base text-gray-500">
                    {tre?.status !== "ratingPending"
                      ? "Training completed"
                      : "Training has been overdue"}
                  </p>
                  {tre?.status !== "ratingPending" && (
                    <BasicButton
                      variant="success"
                      title={"View Proof"}
                      onClick={() => handleViewProof(tre?.proofOfSubmissionUrl)}
                    />
                  )}
                  {/* <span className="text-xs   text-gray-500">1m ago</span> */}
                </div>
                {tre?.status === "ratingPending" && (
                  <div className="flex gap-2 mt-2">
                    <BasicButton
                      variant="success"
                      title={"View Proof"}
                      onClick={() => handleViewProof(tre?.proofOfSubmissionUrl)}
                    />
                    <BasicButton
                      color="success"
                      title={"Approve"}
                      onClick={() => updateTrainingStatus(tre._id, "completed")}
                    />
                    <BasicButton
                      color="danger"
                      title={"Reject"}
                      onClick={() => updateTrainingStatus(tre._id, "rejected")}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>

      <ReusableModal
        heading={"Proof"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        {isImage(proofUrl) ? (
          <img src={proofUrl} alt="Proof of Submission" width="100%" />
        ) : (
          <object
            data={proofUrl}
            type="application/pdf"
            width="100%"
            height="500px"
          >
            <p>Proof of submission cannot be displayed.</p>
          </object>
        )}
      </ReusableModal>
    </>
  );
};

export default TrainingViewNotification;
