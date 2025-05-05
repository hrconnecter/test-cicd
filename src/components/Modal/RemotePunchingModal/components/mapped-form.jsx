import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import useNotificationRemotePunching from "../../../../hooks/QueryHook/Remote-Punch/components/mutation";
import BasicButton from "../../../BasicButton";

const PunchMapModal = ({ items, idx, geoFence, tabname }) => {
  console.log("items in punch", items);

  //hooks
  const { organisationId } = useParams();
  //state
  const [openModal, setOpenModal] = useState(false);
  const [mReason, setMReason] = useState("");
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //handle reject button function
  const handleRejectButtonClick = () => {
    setOpenModal(true);
  };

  const handleRejectSubmit = (id) => {
    RejectManagerMutation.mutate({ id, mReason });
    setOpenModal(false);
  };

  // handle modal close function
  const handleModalClose = () => {
    setOpenModal(false);
    setMReason(""); // Reset mReason state when modal is closed
  };

  const { notifyAccountantMutation, RejectManagerMutation } =
    useNotificationRemotePunching();
  console.log(
    "notifyAccountantMutation",
    notifyAccountantMutation,
    "RejectManagerMutation",
    RejectManagerMutation
  );

  //handle image click
  const handleImageClick = () => {
    setImageModalOpen(true);
  };

  //handle image modal close
  const handleImageModalClose = () => {
    setImageModalOpen(false);
  };

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await notifyAccountantMutation.mutateAsync(items._id);
    } catch (error) {
      console.error("Error accepting request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full pl-6">
      <div
        className="w-full h-auto bg-white flex p-4  justify-between items-center"
        style={{
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          borderRadius: "5px",
        }}
      >
        <Grid container sm={12}>
          {geoFence !== "geoFence" && (
            <Grid item xs={12} sm={12} md={2}>
              <div className="flex items-center">
                {geoFence !== "geoFence" && (
                  <div className="">
                    <h1>
                      {items?.punchData[0]?.image === "" ? null : (
                        <h1 className="font-semibold">Punch Request</h1>
                      )}
                    </h1>
                    <div className="w-[150px]">
                      {geoFence !== "geoFence" && (
                        <div className="h-[100px] w-[100px]">
                          {items?.punchData[0]?.image === "" ? (
                            <img
                              style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "100%",
                                borderRadius: "20%",
                              }}
                              src={items.employeeId.user_logo_url}
                              alt="img"
                            />
                          ) : (
                            <div className="h-[100px] w-[100px]">
                              <img
                                style={{
                                  objectFit: "cover",
                                  width: "100%",
                                  height: "100%",
                                  borderRadius: "20%",
                                  cursor: "pointer",
                                }}
                                src={items?.punchData[0]?.image}
                                alt="img1"
                                onClick={handleImageClick}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Grid>
          )}

          <Grid item xs={12} sm={12} md={geoFence !== "geoFence" ? 7 : 9}>
            <div className={geoFence !== "geoFence" ? "mt-4" : "mt-0"}>
              <h1>
                Date:{" "}
                {items?.createdAt && (
                  <>{new Date(items?.createdAt).toLocaleDateString()} </>
                )}
              </h1>
              <h1>
                {items?.punchData[0]?.image === "" ? (
                  <h1>Missed Punch Request : {items.punchData.length} times</h1>
                ) : (
                  <h1>Punch Request : {items.punchData.length} times</h1>
                )}
              </h1>

              <Link
                to={`/organisation/${organisationId}/remote/info/${items?._id}`}
                className="font-semibold text-blue-500 hover:underline text-md mt-6"
              >
                View All Routes →
              </Link>
            </div>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={3}
            className="flex md:justify-end xs:justify-start sm:justify-start items-center"
          >
            <div>
              <div className="flex gap-3 mt-3 ">
                {tabname === "archive" ? (
                  <Typography
                    variant="body1"
                    sx={{
                      color:
                        items?.status === "Approved"
                          ? "green"
                          : items?.status === "Rejected"
                          ? "red"
                          : "black",
                      fontWeight: "bold",
                    }}
                  >
                    {items?.status}
                  </Typography>
                ) : (
                  <>
                    {" "}
                    <BasicButton
                      title={
                        isLoading ? <CircularProgress size={20} /> : "Accept"
                      }
                      // onClick={() => notifyAccountantMutation.mutate(items._id)}
                      onClick={handleAccept}
                      disabled={
                        isLoading ||
                        items?.punchData?.[items.punchData.length - 1]
                          ?.stopEndTime === "start"
                      }
                    />
                    <BasicButton
                      title={"Reject"}
                      onClick={handleRejectButtonClick}
                      color={
                        items?.punchData?.[items.punchData.length - 1]
                          ?.stopEndTime === "start"
                          ? undefined
                          : "danger"
                      }
                      disabled={
                        items?.punchData?.[items.punchData.length - 1]
                          ?.stopEndTime === "start"
                      }
                    />
                  </>
                )}

                {/*show modal for reject request*/}
                <Dialog open={openModal} fullWidth onClose={handleModalClose}>
                  <DialogTitle>Enter Rejection Reason</DialogTitle>
                  <DialogContent>
                    <TextField
                      size="small"
                      autoFocus
                      className="!mt-2"
                      id="mReason"
                      label="Rejection Reason"
                      type="text"
                      fullWidth
                      value={mReason}
                      onChange={(e) => setMReason(e.target.value)}
                    />
                  </DialogContent>
                  <DialogActions>
                    <div className="mb-2 flex gap-4">
                      <Button
                        onClick={handleModalClose}
                        color="error"
                        variant="contained"
                        size="small"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleRejectSubmit(items._id)}
                        color="primary"
                        variant="contained"
                        size="small"
                      >
                        Submit
                      </Button>
                    </div>
                  </DialogActions>
                </Dialog>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>

      {/* Image Modal */}
      <Dialog
        open={imageModalOpen}
        onClose={handleImageModalClose}
        maxWidth="md"
      >
        <DialogContent>
          <img
            src={items?.punchData[0]?.image}
            alt=""
            style={{ width: "100%", height: "auto" }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PunchMapModal;
