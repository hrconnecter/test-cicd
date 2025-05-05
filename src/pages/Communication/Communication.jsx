import { Add, ArrowBack, FilterList, Info } from "@mui/icons-material";
import {
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Popover,
  TextField,
} from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import DOMPurify from "dompurify";
import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import BasicButton from "../../components/BasicButton";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import NewCommunication from "../../components/Modal/CommunicationModal/NewCommunicationModal";
import NewEditCommunication from "../../components/Modal/CommunicationModal/NewEditCommunicationModal";

const Communication = () => {
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const { organisationId } = useParams();
  const queryClient = useQueryClient();

  const { data: getEmailCommunication, isLoading } = useQuery(
    ["getEmailCommunication", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/getEmail-communication`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );

  // const [anchorEl, setAnchorEl] = useState(null);
  // const [emailCommunicationId, setEmailCommunicationId] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filterEmail, setFilterEmail] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [emailOptions, setEmailOptions] = useState([]);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showEmailList, setShowEmailList] = useState(true);

  useEffect(() => {
    if (getEmailCommunication) {
      const uniqueEmails = [
        ...new Set(getEmailCommunication.map((email) => email.from)),
      ];
      setEmailOptions(
        uniqueEmails.map((email) => ({ value: email, label: email }))
      );
    }
  }, [getEmailCommunication]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    if (isMobileView) {
      setShowEmailList(false);
    }
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterEmailChange = (selectedOption) => {
    setFilterEmail(selectedOption ? selectedOption.value : "");
  };

  const handleFilterDateChange = (event) => {
    setFilterDate(event.target.value);
  };

  const resetFilters = () => {
    setFilterEmail("");
    setFilterDate("");
    queryClient.invalidateQueries("getEmailCommunication");
    handleFilterClose();
  };

  const [openCommunciationModal, setOpenCommunicationModal] = useState(false);
  const handleOpenCommunicationModal = () => {
    setOpenCommunicationModal(true);
  };
  const handleCloseCommunicationModal = () => {
    setOpenCommunicationModal(false);
    // setAnchorEl(null);
  };

  const [editCommunciationModal, setEditCommunicationModal] = useState(false);
  const [emailCommuncationData, setEmailCommunicationData] = useState(null);
  const handleOpenEditCommunicationModal = (communication) => {
    setEditCommunicationModal(true);
    setEmailCommunicationData(communication);
  };
  const handleCloseEditCommunicationModal = () => {
    setEditCommunicationModal(false);
    // setAnchorEl(null);
  };

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
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/deleteEmailCommunication/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("getEmailCommunication");
        handleAlert(
          true,
          "success",
          "Email communication deleted successfully"
        );
      },
    }
  );

  const [showAllTo, setShowAllTo] = useState(false);

  const handleShowAllTo = () => {
    setShowAllTo(!showAllTo);
  };

  return (
    <BoxComponent>
      <div className="flex justify-between items-center mb-4">
        <HeadingOneLineInfo heading="Broadcast mails" />
        <BasicButton
          onClick={handleOpenCommunicationModal}
          icon={Add}
          title="Compose"
        />
        {/* <Button
          className="!font-semibold !bg-sky-500 flex items-center gap-2"
          variant="contained"
          onClick={handleOpenCommunicationModal}
        >
          <Add />
          Compose
        </Button> */}
      </div>

      <div className={`flex overflow-auto ${isMobileView ? "flex-col" : ""}`}>
        <div
          className={`w-full md:w-1/4 bg-white rounded-lg border !h-[80vh] p-4 overflow-y-auto ${
            !showEmailList && isMobileView ? "hidden" : ""
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Senders</h2>
            <FilterList
              className="cursor-pointer"
              onClick={handleFilterClick}
            />
            <Popover
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <div className="p-4">
                <div className="mb-4">
                  <Select
                    options={emailOptions}
                    onChange={handleFilterEmailChange}
                    placeholder="Filter by Email"
                    isClearable
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                </div>
                <div className="mb-4">
                  <TextField
                    label="Filter by Date"
                    type="date"
                    variant="outlined"
                    size="small"
                    value={filterDate}
                    onChange={handleFilterDateChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={resetFilters}
                  fullWidth
                >
                  Reset Filters
                </Button>
              </div>
            </Popover>
          </div>
          {isLoading ? (
            <CircularProgress />
          ) : getEmailCommunication && getEmailCommunication.length > 0 ? (
            <div>
              {getEmailCommunication
                .filter((communication) => {
                  const emailMatch = filterEmail
                    ? communication.from
                        .toLowerCase()
                        .includes(filterEmail.toLowerCase())
                    : true;
                  const dateMatch = filterDate
                    ? format(
                        new Date(communication.createdAt),
                        "yyyy-MM-dd"
                      ) === filterDate
                    : true;
                  return emailMatch && dateMatch;
                })
                .map((communication, id) => (
                  <div
                    key={id}
                    className={`mb-2 !text-base cursor-pointer p-2 rounded ${
                      selectedEmail?._id === communication._id
                        ? "bg-gray-200"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleEmailClick(communication)}
                  >
                    <h1 className="text-gray-600 !truncate !font-bold text-lg">
                      {communication.from}
                    </h1>
                    <p>{format(new Date(communication.createdAt), "PP")}</p>
                  </div>
                ))}
            </div>
          ) : (
            <p>No email communication found.</p>
          )}
        </div>

        <div
          className={`w-full md:w-3/4 p-4 overflow-y-auto flex flex-col ${
            showEmailList && isMobileView ? "hidden" : ""
          }`}
        >
          {selectedEmail ? (
            <div>
              {isMobileView && (
                <div className="flex items-center mb-4">
                  <IconButton onClick={() => setShowEmailList(true)}>
                    <ArrowBack />
                  </IconButton>
                  <HeadingOneLineInfo heading="Email Details" />
                </div>
              )}
              <div
                className="!text-2xl px-3 font-bold mb-4"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(selectedEmail.subject),
                }}
              />
              <div className="bg-white rounded-lg border p-4">
                <div className="mb-2 flex justify-between items-center">
                  <div className="flex">
                    <h1 className="text-gray-600 text-base font-bold w-20">
                      From:
                    </h1>
                    <span className="text-base">{selectedEmail.from}</span>
                  </div>
                  <div className="flex gap-2">
                    <BasicButton
                      onClick={() =>
                        handleOpenEditCommunicationModal(selectedEmail)
                      }
                      title="Edit"
                      color="primary"
                    />
                    <BasicButton
                      onClick={() =>
                        handleDeleteConfirmation(selectedEmail._id)
                      }
                      title="Delete"
                      color="danger"
                    />
                  </div>
                </div>
                <div className="mb-2 flex">
                  <h1 className="text-gray-600 text-base font-bold w-20">
                    To:
                  </h1>
                  <div className="flex flex-wrap">
                    {selectedEmail.to
                      ?.slice(0, showAllTo ? selectedEmail.to.length : 1)
                      .map((item, index) => (
                        <div key={index} className="m-1">
                          <Chip label={item.label} size="small" />
                        </div>
                      ))}
                    {selectedEmail.to?.length > 1 && !showAllTo && (
                      <div
                        className="m-1 cursor-pointer"
                        onClick={handleShowAllTo}
                      >
                        <Chip label="..." size="small" />
                      </div>
                    )}
                  </div>
                  {showAllTo && (
                    <div
                      className="cursor-pointer text-blue-500"
                      onClick={handleShowAllTo}
                    >
                      Show less
                    </div>
                  )}
                </div>
                <div className="mb-2 flex">
                  <h1 className="text-gray-600 text-base font-bold w-20">
                    CC:
                  </h1>
                  <span className="text-base">
                    {selectedEmail.cc?.map((item) => item.label).join(", ")}
                  </span>
                </div>
                <div className="mb-2 flex">
                  <h1 className="text-gray-600 text-base font-bold w-20">
                    BCC:
                  </h1>
                  <span className="text-base">
                    {selectedEmail.bcc?.map((item) => item.label).join(", ")}
                  </span>
                </div>
                <div className="mb-2 flex">
                  <h1 className="text-gray-600 text-base font-bold w-20">
                    Subject:
                  </h1>
                  <div
                    className="text-base"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(selectedEmail.subject),
                    }}
                  />
                </div>
                <div className="mb-2 ">
                  <h1 className="text-gray-600 text-base font-bold w-20">
                    Body:
                  </h1>
                  <div
                    className="text-base"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(selectedEmail.body),
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-100 rounded-lg p-2 py-4 flex gap-2">
              <Info />
              <p className="text-lg">Select an email to view details.</p>
            </div>
          )}
        </div>
      </div>

      <NewCommunication
        handleClose={handleCloseCommunicationModal}
        open={openCommunciationModal}
        organisationId={organisationId}
      />

      <NewEditCommunication
        handleClose={handleCloseEditCommunicationModal}
        open={editCommunciationModal}
        organisationId={organisationId}
        emailCommuncationData={emailCommuncationData}
        // emailCommunicationId={emailCommunicationId}
      />

      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this email communication, as
            this action cannot be undone.
          </p>
        </DialogContent>
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
      </Dialog>
    </BoxComponent>
  );
};

export default Communication;
