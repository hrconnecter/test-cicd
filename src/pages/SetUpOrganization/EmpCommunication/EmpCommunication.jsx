import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Button, DialogActions, IconButton } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import BasicButton from "../../../components/BasicButton";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import AddCommunicationModal from "../../../components/Modal/CommunicationModal/AddCommunicationModal";
import EditCommunicationModal from "../../../components/Modal/CommunicationModal/EditCommunicationModal";
import ReusableModal from "../../../components/Modal/component";
import useGetCommunicationPermission from "../../EmployeeSurvey/useContext/Permission";
import Setup from "../Setup";
import EmployeeTypeSkeleton from "../components/EmployeeTypeSkeleton";

const EmpCommunication = () => {
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();

  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const { organisationId } = useParams();
  console.log("organisationId././", organisationId);
  const { data } = useGetCommunicationPermission(organisationId);
  console.log(`🚀 ~ getCommunication:`, data);

  // Form schema
  const formSchema = z.object({
    smtpServer: z.string().nonempty("SMTP Server is required"),
    surveyPermission: z.boolean(),
  });

  const { handleSubmit, control, formState, setValue } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      surveyPermission: false,
    },
  });

  useEffect(() => {
    if (data !== undefined) {
      setValue("surveyPermission", data?.surveyPermission ?? false);
      setValue("smtpServer", data?.smtpServer ?? "");
    }
  }, [data, setValue]);

  // Add Communication Permission
  const mutationPermission = useMutation(
    async (formData) => {
      await axios.post(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/employee-survey-permission`,
        formData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("survey-permission");
        handleAlert(
          true,
          "success",
          data === undefined
            ? "Survey permission saved successfully"
            : "Changes updated successfully"
          // : "Survey permission updated successfully"
        );
        window.location.Reload();
      },
    }
  );

  //for  Get Query
  const { data: getCommunication, isLoading } = useQuery(
    ["emailCommunication", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-communication`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );

  const onSubmit = (data) => {
    mutationPermission.mutate(data);
    handleCloseSettingsModal();
  };

  // for add
  const [openCommunciationModal, setOpenCommunicationModal] = useState(false);
  const handleOpenCommunicationModal = () => {
    setOpenCommunicationModal(true);
  };
  const handleCloseCommunicationModal = () => {
    setOpenCommunicationModal(false);
  };

  // for update
  const [editCommunicationModal, setEditCommunicationModal] = useState(false);
  const [editCommunicationId, setEditCommunicationId] = useState(null);

  const handleOpenEditCommunicationModal = (communicationId) => {
    setEditCommunicationModal(true);
    queryClient.invalidateQueries(["communicationId", communicationId]);
    setEditCommunicationId(communicationId);
  };

  const handleCloseEditCommunicationModal = () => {
    setEditCommunicationModal(false);
  };

  // for delete
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    handleCloseConfirmation();
  };

  const deleteMutation = useMutation(
    (id) =>
      axios.delete(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/${id}/delete-communication`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        // Invalidate and refetch the data after successful deletion
        queryClient.invalidateQueries("emailCommunication");
        handleAlert(true, "success", "Email deleted successfully");
      },
    }
  );

  // for settings modal
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const handleOpenSettingsModal = () => {
    setOpenSettingsModal(true);
  };
  const handleCloseSettingsModal = () => {
    setOpenSettingsModal(false);
  };

  return (
    <>
      <BoxComponent sx={{ p: 0 }}>
        <Setup>
          <div className="h-[90vh] overflow-y-auto scroll px-3">
            <div className="flex justify-between items-center gap-2">
              <HeadingOneLineInfo
                className="!my-3"
                heading="Communication"
                info="Here you can manage organisational communication as well as employee surveys."
              />
              <BasicButton
                color="primary"
                title={"Communication Settings"}
                onClick={handleOpenSettingsModal}
              />
            </div>
            <div className="flex justify-between items-center gap-2">
              <HeadingOneLineInfo
                className="!my-3"
                heading="Add Email"
                info="Add the required email for communication."
              />
              <BasicButton
                onClick={handleOpenCommunicationModal}
                title="Add Email"
              />
            </div>
            {isLoading ? (
              <EmployeeTypeSkeleton />
            ) : getCommunication?.length > 0 ? (
              <div className=" xs:mt-3 sm:mt-3 md:mt-0">
                <table className="min-w-full bg-white  text-left !text-sm font-light">
                  <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                    <tr className="!font-semibold">
                      <th
                        scope="col"
                        className="whitespace-nowrap !text-left pl-8 py-3"
                      >
                        Sr. No
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap !text-left pl-8 py-3"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap !text-left pl-8 py-3"
                      >
                        Communication Type
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap !text-left pl-8 py-3"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(getCommunication) &&
                      getCommunication?.map((communciation, id) => (
                        <tr className="!font-medium border-b" key={id}>
                          <td className="whitespace-nowrap !text-left pl-8 ">
                            {id + 1}
                          </td>
                          <td className="whitespace-nowrap pl-8">
                            {communciation?.email}
                          </td>
                          <td className="whitespace-nowrap pl-8">
                            {communciation?.communication.join(",  ")}
                          </td>

                          <td className="whitespace-nowrap pl-8">
                            <IconButton
                              color="primary"
                              aria-label="edit"
                              onClick={() =>
                                handleOpenEditCommunicationModal(
                                  communciation?._id
                                )
                              }
                            >
                              <EditOutlinedIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              aria-label="delete"
                              onClick={() =>
                                handleDeleteConfirmation(communciation?._id)
                              }
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
                <article className="flex items-center mb-1 text-red-500 gap-2">
                  <Info className="!text-2xl" />
                  <h1 className="text-lg font-semibold">Add Email</h1>
                </article>
                <p>No email found for communication. Please add the email.</p>
              </section>
            )}
          </div>
        </Setup>

        {/* for add */}
        <AddCommunicationModal
          handleClose={handleCloseCommunicationModal}
          open={openCommunciationModal}
          organisationId={organisationId}
        />

        {/* for update */}
        <EditCommunicationModal
          handleClose={handleCloseEditCommunicationModal}
          organisationId={organisationId}
          open={editCommunicationModal}
          editCommunicationId={editCommunicationId}
        />

        {/* for delete */}
        <ReusableModal
          open={deleteConfirmation !== null}
          onClose={handleCloseConfirmation}
          heading="Confirm Deletion"
        >
          <p>
            Please confirm your decision to delete this email, as this action
            cannot be undone.
          </p>
          <DialogActions>
            <Button
              onClick={handleCloseConfirmation}
              variant="outlined"
              color="primary"
              size="small"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleDelete(deleteConfirmation)}
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </ReusableModal>

        {/* for settings */}
        <ReusableModal
          open={openSettingsModal}
          onClose={handleCloseSettingsModal}
          heading="Communication Settings"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <AuthInputFiled
              name="surveyPermission"
              control={control}
              label="Employee Survey"
              descriptionText={
                "By enabling this checkbox you are allowing to create employee surveys."
              }
              type="switch"
              errors={formState.errors}
              error={formState.errors.surveyPermission}
            />
            <AuthInputFiled
              name="smtpServer"
              control={control}
              label="SMTP Server *"
              type="text"
              placeholder="Enter SMTP Server"
              errors={formState.errors}
              descriptionText={
                "Note: This field is required to send mails using your own SMTP domain mails."
              }
              error={formState.errors.smtpServer}
            />

            <div className="flex gap-2 justify-end">
              <BasicButton
                variant="outlined"
                title={"Cancel"}
                color={"danger"}
                onClick={handleCloseSettingsModal}
                type="button"
              />
              <BasicButton title={"Save"} color={"primary"} type="submit" />
            </div>
          </form>
        </ReusableModal>
      </BoxComponent>
    </>
  );
};

export default EmpCommunication;
