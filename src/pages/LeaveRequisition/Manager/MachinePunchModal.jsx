import { Tab as HeadlessTab } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Person } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  LinearProgress,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import { FaCheckCircle } from "react-icons/fa";
import { LuUpload } from "react-icons/lu";
import { useParams } from "react-router-dom";
import * as z from "zod";
import BasicButton from "../../../components/BasicButton";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useAuthToken from "../../../hooks/Token/useAuth";
import { TestContext } from "../../../State/Function/Main";
import useGetLeaveSetting from "../../SetUpOrganization/LeaveComponents/hook/useGetLeaveSetting";
import { Essl, zktecho } from "../utils/Biometrics";

const getSchema = (isEssl) =>
  z.object({
    start: z
      .object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
      .optional(isEssl),
    end: z
      .object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
      .optional(isEssl),
    hours: z
      .string()
      .nonempty("Hours are required")
      .refine((val) => !isNaN(Number(val)), {
        message: "Hours must be a number",
      })
      .refine((val) => Number(val) >= 1 && Number(val) <= 24, {
        message: "Hours must be between 1 and 24",
      }),
  });

const MachinePunch = ({ open, handleClose }) => {
  const fileInputRef = useRef(null);
  const [file, setFile] = React.useState(null);
  const { organisationId } = useParams();
  const [uploadedFileName, setUploadedFileName] = React.useState(null);
  const authToken = useAuthToken();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const { handleAlert } = useContext(TestContext);

  const { leaveSetting } = useGetLeaveSetting(open);

  const isEssl = leaveSetting?.data?.biometricMachine === "ESSL";

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(getSchema(isEssl)),
  });

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      // Handle no file selected
      return;
    }

    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(fileExtension)) {
      handleAlert(
        true,
        "error",
        "Invalid file type only xlsx, xls, csv files allowed"
      );
      // Handle invalid file type
      return;
    }

    setUploadedFileName(selectedFile.name);
    setFile(selectedFile);
  };

  const onSubmitExcel = async (data) => {
    if (!file) {
      handleAlert(true, "error", "Please upload a file");
      return;
    }
    try {
      if (leaveSetting?.data?.biometricMachine === "ESSL") {
        return await Essl(
          data,
          file,
          organisationId,
          authToken,
          setLoading,
          setSuccess
        );
      }

      if (leaveSetting?.data?.biometricMachine === "Zktecho") {
        return await zktecho(
          data,
          file,
          organisationId,
          authToken,
          setLoading,
          setSuccess
        );
      }

      if (!leaveSetting?.data?.biometricMachine) {
        alert("Please set the biometric machine in the settings");
        handleAlert(
          true,
          "error",
          "Please set the biometric machine in the settings"
        );
      }
    } catch (error) {
      handleAlert(true, "error", "Something went wrong");
    }
  };

  const onSubmitLiveSync = async (data) => {
    const { start, end, hours } = data;
    const endDate = new Date(end.startDate);
    endDate.setDate(endDate.getDate() + 1); // Add one day to endDate

    setLoading(true);

    try {
      const apiEndpoint = `${process.env.REACT_APP_API}/route/organization/${organisationId}/add-punching-data-from-db`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: authToken,
      };

      await axios.post(apiEndpoint, { start, end, hours }, { headers });
      setSuccess(true);
    } catch (error) {
      console.error(`Error sending data to the backend:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setFile(null);
    setUploadedFileName(null);
    setLoading(false);
    setSuccess(false);
    handleClose();
  };

  const handleFinalClose = () => {
    handleClose();
    setTimeout(() => {
      setFile(null);
      setUploadedFileName(null);
      setLoading(false);
      setSuccess(false);
    }, 300); // Delay to ensure modal closes first
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={!loading ? handleDialogClose : null}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          {loading ? (
            <div className="flex flex-col w-full py-4 justify-center gap-2 items-center">
              <h1 className="text-gray-600 font-bold text-xl tracking-tighter ">
                Adding data, please wait until the process is done. Do not
                reload the page.
              </h1>
              <div className="w-full">
                <LinearProgress />
              </div>
            </div>
          ) : success ? (
            <div className="space-y-3 flex items-center flex-col justify-center">
              <FaCheckCircle className=" text-green-600 !text-5xl" />
              <h1 className=" tracking-tighter font-bold text-xl">
                Employee data loaded successfully!
              </h1>
              <BasicButton onClick={handleFinalClose} title="Close" />
            </div>
          ) : (
            <HeadlessTab.Group>
              <HeadlessTab.List className="mb-3 flex w-max space-x-1 rounded-xl bg-gray-200 p-1">
                <HeadlessTab
                  className={({ selected }) =>
                    classNames(
                      "w-full  rounded-lg py-2.5 px-10 text-sm font-medium leading-5 whitespace-nowrap",
                      selected
                        ? "bg-white text-blue-700 shadow"
                        : "text-black hover:bg-gray-200 "
                    )
                  }
                >
                  Excel
                </HeadlessTab>
                <HeadlessTab
                  disabled={true}
                  className={({ selected }) =>
                    classNames(
                      "w-full hover:cursor-not-allowed rounded-lg py-2.5 px-10 text-sm font-medium leading-5 whitespace-nowrap",
                      selected
                        ? "bg-white text-blue-700 shadow"
                        : "text-black hover:bg-gray-200 "
                    )
                  }
                >
                  Live Sync
                </HeadlessTab>
              </HeadlessTab.List>
              <HeadlessTab.Panels>
                <HeadlessTab.Panel>
                  <form onSubmit={handleSubmit(onSubmitExcel)}>
                    <h1 className="text-[1.5rem] text-gray-700 font-semibold tracking-tight">
                      Machine Punching
                    </h1>
                    <p className="text-gray-500 leading-tight tracking-tight">
                      Add biometric data to the machine's punch ID system
                      effortlessly by importing information directly from an
                      Excel file.
                    </p>
                    <br />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".xlsx, .xls, .csv"
                      style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        marginBottom: "20px",
                        width: "100%",
                        boxSizing: "border-box",
                        display: "none",
                      }}
                    />
                    <div className={`space-y-1`}>
                      <label className={`font-semibold text-gray-500 text-md`}>
                        Upload excel file to generate employee attendance
                      </label>
                      <div
                        onClick={() => fileInputRef.current.click()}
                        className={`outline-none cursor-pointer border-gray-200 border-[.5px]
                         flex rounded-md items-center justify-center px-2 gap-4 bg-white py-2`}
                      >
                        <LuUpload className="text-xl text-gray-600" />
                        <h1 className="text-lg text-gray-600">
                          Click to upload the file
                        </h1>
                      </div>
                    </div>
                    {!file && (
                      <Typography className="text-center text-sm text-red-600">
                        Please upload a file
                      </Typography>
                    )}
                    {uploadedFileName && (
                      <>
                        <Typography className="text-center text-sm text-gray-600">
                          Uploaded File: {uploadedFileName}
                        </Typography>
                        {!isEssl && (
                          <div className="grid grid-cols-2 gap-4 my-2">
                            <AuthInputFiled
                              name="start"
                              asSingle={true}
                              icon={Person}
                              control={control}
                              type="calender"
                              placeholder="start date"
                              label="Enter Start Date*"
                              errors={errors}
                              error={errors.start}
                            />
                            <AuthInputFiled
                              name="end"
                              icon={Person}
                              asSingle={true}
                              control={control}
                              type="calender"
                              placeholder="End date"
                              label="Enter End Date*"
                              errors={errors}
                              error={errors.end}
                            />
                          </div>
                        )}
                        <AuthInputFiled
                          name="hours"
                          control={control}
                          type="text"
                          placeholder="hours"
                          label="Select hours Range*"
                          errors={errors}
                          error={errors.hours}
                        />
                      </>
                    )}
                    <DialogActions>
                      <BasicButton
                        onClick={handleDialogClose}
                        variant="outlined"
                        title="Cancel"
                      />
                      <BasicButton
                        type="submit"
                        title={"Submit"}
                        color={"primary"}
                      />
                    </DialogActions>
                  </form>
                </HeadlessTab.Panel>
                <HeadlessTab.Panel>
                  <form onSubmit={handleSubmit(onSubmitLiveSync)}>
                    <h1 className="text-[1.5rem] text-gray-700 font-semibold tracking-tight">
                      Live Sync
                    </h1>
                    <p className="text-gray-500 leading-tight tracking-tight">
                      Sync biometric data live with the machine's punch ID
                      system.
                    </p>
                    <br />
                    {!isEssl && (
                      <div className="grid grid-cols-2 gap-4 my-1">
                        <AuthInputFiled
                          name="start"
                          asSingle={true}
                          icon={Person}
                          control={control}
                          type="calender"
                          placeholder="start date"
                          label="Enter Start Date*"
                          errors={errors}
                          error={errors.start}
                        />
                        <AuthInputFiled
                          name="end"
                          icon={Person}
                          asSingle={true}
                          control={control}
                          type="calender"
                          placeholder="End date"
                          label="Enter End Date*"
                          errors={errors}
                          error={errors.end}
                        />
                      </div>
                    )}
                    <AuthInputFiled
                      name="hours"
                      control={control}
                      type="text"
                      placeholder="hours"
                      label="Select hours Range*"
                      errors={errors}
                      error={errors.hours}
                    />
                    <DialogActions>
                      <BasicButton
                        onClick={handleDialogClose}
                        variant="outlined"
                        title="Cancel"
                      />
                      <BasicButton
                        type="submit"
                        title={"Submit"}
                        color={"primary"}
                      />
                    </DialogActions>
                  </form>
                </HeadlessTab.Panel>
              </HeadlessTab.Panels>
            </HeadlessTab.Group>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MachinePunch;
