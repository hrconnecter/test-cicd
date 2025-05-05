import { zodResolver } from "@hookform/resolvers/zod";
import { Email } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import GroupIcon from "@mui/icons-material/Group";
import MessageIcon from "@mui/icons-material/Message";
import SubjectIcon from "@mui/icons-material/Subject";
import { Box, Button, Checkbox, FormControlLabel, Modal } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import AuthInputFiled from "../../InputFileds/AuthInputFiled";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  overflowY: "auto",
  maxHeight: "80vh",
};

const NewEditCommunication = ({
  handleClose,
  open,
  organisationId,
  emailCommuncationData,
  emailCommunicationId,
}) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  const [showSelectAll, setShowSelectAll] = useState(false);

  //for  Get Query to get communication type in organization
  const { data: communicationType } = useQuery(
    ["communication-type", organisationId],
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
  const communicationTypes = communicationType
    ? Array.from(
        new Set(communicationType.map((type) => type.communication[0]))
      ).map((type) => ({
        label: type,
        value: type,
        email: communicationType.find((comm) => comm.communication[0] === type)
          .email,
      }))
    : [];

  //for  Get Query to get employee email of organization
  const { data: employee } = useQuery(
    ["employee", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/${organisationId}/get-emloyee`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.employees;
    }
  );
  const employeeEmail = employee
    ? employee.map((emp) => ({
        label: emp.email,
        value: emp.email,
      }))
    : [];

  const handleSelectAll = (fieldName) => {
    setValue(fieldName, employeeEmail);
  };

  const EmpCommunicationSchema = z.object({
    from: z.object({
      label: z.string(),
      value: z.string(),
    }),
    communication: z.object({
        label: z.string(),
        value: z.string(),
      })
    ,
    to: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ),
    cc: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ),
    bcc: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ),
    subject: z.string(),
    body: z.string(),
    valediction: z.string().optional(),
    signature: z.string().optional(),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      communication: undefined,
      from: undefined,
      to: undefined,
      cc: undefined,
      bcc: undefined,
      subject: undefined,
      body: undefined,
      valediction: undefined,
      signature: undefined,
    },
    resolver: zodResolver(EmpCommunicationSchema),
  });

  const selectedCommunication = useWatch({ control, name: "communication" });
  // useEffect(() => {
  //   if (selectedCommunication && selectedCommunication.length > 0) {
  //     const selectedType = communicationType.find(
  //       (type) => type.communication[0] === selectedCommunication[0].value
  //     );
  //     // setValue("from", selectedType ? selectedType.email : undefined);
  //   } else {
  //     // setValue("from", undefined);
  //   }
  // }, [selectedCommunication, setValue, communicationType]);

  useEffect(() => {
    if (!showSelectAll) {
      setValue("to", []);
    }
  }, [showSelectAll, setValue]);

  useEffect(() => {
    if (emailCommuncationData) {
      setValue("signature", emailCommuncationData.signature);
      setValue("valediction", emailCommuncationData.valediction);
      setValue("body", emailCommuncationData.body);
      setValue("subject", emailCommuncationData.subject);
      setValue(
        "from",
     {
          label: emailCommuncationData.from,
          value: emailCommuncationData.from,
        }
      );
      // const communicationValue = emailCommuncationData.communication.map(
      //   (item) => ({
      //     label: item.label,
      //     value: item.value,
      //   })
      // );
      setValue("communication", {
        label: emailCommuncationData.communication[0].label,
        value: emailCommuncationData.communication[0].value,
      });
      setValue(
        "to",
        emailCommuncationData.to.map((item) => ({
          label: item.label,
          value: item.value,
        }))
      );
      setValue(
        "cc",
        emailCommuncationData.cc.map((item) => ({
          label: item.label,
          value: item.value,
        }))
      );
      setValue(
        "bcc",
        emailCommuncationData.bcc.map((item) => ({
          label: item.label,
          value: item.value,
        }))
      );
    }
  }, [emailCommuncationData, setValue]);

  // for edit email
  const EditEmail = useMutation(
    async (data) => {
      const updatedData = {
        ...data,
        from: data.from.label,
      };
      const res = await axios.put(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/updateEmail-communication/${emailCommuncationData._id}`,
        updatedData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return res?.data;
      // console.log("Edit EMail", data);
    },
    {
      onSuccess: (data) => {
        if (!data?.success) {
          handleAlert(true, "error", data?.message);
          return;
        }
        queryClient.invalidateQueries({ queryKey: ["getEmailCommunication"] });
        handleClose();
        handleAlert(true, "success", "Edit email successfully");
        reset();
      },
      onError: () => {},
    }
  );

  const onSubmit = async (data) => {
    try {
      if (!data.from) {
        handleAlert(true, "error", "From field is required");
        return;
      }
      console.log(data);
      await EditEmail.mutateAsync(data);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "An Error occurred update communication");
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          className="border-none !z-10 !pt-0 !px-0 !w-[90%] lg:!w-[50%] md:!w-[60%] shadow-md outline-none rounded-md"
        >
          <div className="flex justify-between py-4 items-center  px-4">
            <h1 className="text-xl pl-2 font-semibold font-sans">
              Edit Communication
            </h1>
            <CloseIcon onClick={handleClose} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-5 space-y-4 mt-4">
              <div className="space-y-2 ">
                <div className="space-y-2 ">
                  <AuthInputFiled
                    name="communication"
                    icon={GroupIcon}
                    control={control}
                    type="autocomplete"
                    placeholder="Communication Type*"
                    label="Communication Type*"
                    readOnly={false}
                    isMulti={false}
                    maxLimit={15}
                    errors={errors}
                    error={errors.communication}
                    optionlist={communicationTypes ? communicationTypes : []}
                  />
                </div>
              </div>
              <div className="space-y-2 ">
                <AuthInputFiled
                  name="from"
                  icon={Email}
                  control={control}
                  type="select"
                  placeholder="From"
                  label="From *"
                  errors={errors}
                  error={errors.from}
                  options={communicationType
                    ?.filter((type) => {
                      return type.communication.includes(
                        selectedCommunication?.label
                      );
                    })
                    .map((type) => ({
                      label: type.email,
                      value: type.email,
                    }))}
                />
              </div>

              <div className="space-y-2 ">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showSelectAll}
                      onChange={(e) => setShowSelectAll(e.target.checked)}
                    />
                  }
                  label="Do you want to select all employee emails?"
                />
              </div>

              {showSelectAll && (
                <div className="space-y-2 ">
                  <Button
                    variant="outlined"
                    onClick={() => handleSelectAll("to")}
                  >
                    Select All
                  </Button>
                </div>
              )}

              <div className="space-y-2 ">
                <AuthInputFiled
                  name="to"
                  icon={Email}
                  control={control}
                  type="autocomplete"
                  placeholder="To"
                  label="To"
                  isMulti={true}
                  readOnly={false}
                  maxLimit={15}
                  errors={errors}
                  error={errors.to}
                  optionlist={employeeEmail ? employeeEmail : []}
                />
              </div>

              <div className="space-y-2 ">
                <AuthInputFiled
                  name="cc"
                  icon={Email}
                  control={control}
                  type="autocomplete"
                  placeholder="CC"
                  label="CC"
                  isMulti={true}
                  errors={errors}
                  error={errors.cc}
                  optionlist={employeeEmail ? employeeEmail : []}
                />
              </div>
              <div className="space-y-2 ">
                <AuthInputFiled
                  name="bcc"
                  icon={Email}
                  control={control}
                  type="autocomplete"
                  placeholder="BCC"
                  label="BCC"
                  isMulti={true}
                  errors={errors}
                  error={errors.bcc}
                  optionlist={employeeEmail ? employeeEmail : []}
                />
              </div>
              <div className="space-y-2 ">
                <AuthInputFiled
                  name="subject"
                  icon={SubjectIcon}
                  control={control}
                  type="texteditors"
                  placeholder="Subject"
                  label="Subject"
                  errors={errors}
                  error={errors.subject}
                />
              </div>
              <div className="space-y-2 ">
                <AuthInputFiled
                  name="body"
                  icon={SubjectIcon}
                  control={control}
                  type="texteditor"
                  placeholder="Body"
                  label="Body"
                  errors={errors}
                  error={errors.body}
                />
              </div>
              <div className="space-y-2 ">
                <AuthInputFiled
                  name="valediction"
                  icon={MessageIcon}
                  control={control}
                  type="text"
                  placeholder="Valediction"
                  label="Valediction"
                  errors={errors}
                  error={errors.valediction}
                />
              </div>
              <div className="space-y-2 ">
                <AuthInputFiled
                  name="signature"
                  icon={EditIcon}
                  control={control}
                  type="texteditor"
                  placeholder="Signature"
                  label="Signature"
                  errors={errors}
                  error={errors.signature}
                />
              </div>
              <div className="flex gap-4 mt-4 justify-end">
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Send Mail
                </Button>
              </div>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default NewEditCommunication;
