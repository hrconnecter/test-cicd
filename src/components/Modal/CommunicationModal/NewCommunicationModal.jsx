import { zodResolver } from "@hookform/resolvers/zod";
import { Email } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import GroupIcon from "@mui/icons-material/Group";
import MessageIcon from "@mui/icons-material/Message";
import SubjectIcon from "@mui/icons-material/Subject";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import AuthInputFiled from "../../InputFileds/AuthInputFiled";
import ReusableModal from "../component";

const NewCommunication = ({ handleClose, open, organisationId }) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  const [showSelectAll, setShowSelectAll] = useState(false);

  // const [visiblePassword, setVisiblePassword] = useState(false);

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
    communication: z.object({
      label: z.string(),
      value: z.string(),
    }),
    from: z.object({
      label: z.string(),
      value: z.string(),
    }),
    to: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ).nonempty("Required"),
    cc: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ).optional(),
    bcc: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ).optional(),
    subject: z.string(),
    body: z.string(),
    valediction: z.string().optional(),
    signature: z.string().optional(),
    // password: z.string().min(1, "Password is required"),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      communication: undefined,
      to: undefined,
      from: {},
      cc: undefined,
      bcc: undefined,
      subject: undefined,
      body: undefined,
      valediction: undefined,
      signature: undefined,
      // password: undefined,
    },
    resolver: zodResolver(EmpCommunicationSchema),
  });

  console.log("errors" , errors);

  const selectedCommunication = useWatch({ control, name: "communication" });
  useEffect(() => {
    if (selectedCommunication && selectedCommunication.length > 0) {
      const selectedType = communicationType.find(
        (type) => type.communication[0] === selectedCommunication[0].value
      );
      setValue("from", selectedType ? selectedType.email : undefined);
    } else {
      setValue("from", undefined);
    }
  }, [selectedCommunication, setValue, communicationType]);

  useEffect(() => {
    if (!showSelectAll) {
      setValue("to", []);
    }
  }, [showSelectAll, setValue]);

  // for send
  const SendEmailCommunication = useMutation(
    async (data) => {
      const updatedData = {
        ...data,
        from: data.from.label,
      };
      const res = await axios.post(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/sendEmail-communication`,
        updatedData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return res?.data;
    },

    {
      onSuccess: (data) => {
        if (!data?.success) {
          handleAlert(true, "error", data?.message);
          return;
        }
        queryClient.invalidateQueries({ queryKey: ["getEmailCommunication"] });
        handleClose();
        handleAlert(true, "success", " Send communication  successfully");
        reset();
      },
      onError: () => {},
    }
  );
  const onSubmit = async (data) => {
    try {
      await SendEmailCommunication.mutateAsync(data);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "An Error occurred send the communication");
    }
  };

  // for preview data
  // const [previewCommunicationModal, setPreviewCommunicationModal] =
  //   useState(false);
  // const [previewData, setPreviewData] = useState(null);
  // const handleOpenPreviewCommunicationModal = (data) => {
  //   setPreviewCommunicationModal(true);
  //   setPreviewData(data);
  // };
  // const handleClosePreviewCommunicationModal = () => {
  //   setPreviewCommunicationModal(false);
  // };

  // for save for latter
  const SaveForLatter = useMutation(
    async (data) => {
      console.log("data has been called", data);
      const updatedData = {
        ...data,
        from: data.from.label,
      };
      await axios.post(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/saveEmail-communication`,
        updatedData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getEmailCommunication"] });
        handleClose();
        handleAlert(true, "success", "Saved communication successfully");
        reset();
      },
      onError: () => {},
    }
  );
  const handleSaveForLater = async (data) => {
    try {
      console.log(data);
      await SaveForLatter.mutateAsync(data);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "An Error occurred  to save communication");
    }
  };

  return (
    <>
      <ReusableModal
        open={open}
        onClose={handleClose}
        heading="New Communication"
        className="!pt-0 !px-0 !w-[90%] lg:!w-[50%] md:!w-[60%]"
      >
        <form autoComplete={"off"} onSubmit={handleSubmit(onSubmit)}>
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
          {/* <AuthInputFiled
            name="password"
            visible={visiblePassword}
            setVisible={setVisiblePassword}
            icon={Lock}
            control={control}
            type="password"
            placeholder="****"
            label="Password *"
            errors={errors}
            error={errors.password}
            descriptionText={
              "Note: Your SMTP email password will not be stored and will only be used for email broadcast."
            }
          /> */}
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
              <Button variant="outlined" onClick={() => handleSelectAll("to")}>
                Select All
              </Button>
            </div>
          )}
          <AuthInputFiled
            name="to"
            icon={Email}
            control={control}
            type="autocomplete"
            placeholder="To"
            label="To *"
            readOnly={false}
            isMulti={true}
            maxLimit={15}
            errors={errors}
            error={errors.to}
            optionlist={employeeEmail ? employeeEmail : []}
          />
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
          <AuthInputFiled
            name="bcc"
            icon={Email}
            control={control}
            type="autocomplete"
            placeholder="BCC"
            isMulti={true}
            label="BCC"
            errors={errors}
            error={errors.bcc}
            optionlist={employeeEmail ? employeeEmail : []}
          />
          <AuthInputFiled
            name="subject"
            icon={SubjectIcon}
            control={control}
            type="texteditors"
            placeholder="Subject"
            label="Subject *"
            errors={errors}
            error={errors.subject}
          />
          <AuthInputFiled
            name="body"
            icon={SubjectIcon}
            control={control}
            type="texteditor"
            placeholder="Body"
            label="Body *"
            errors={errors}
            error={errors.body}
          />
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
          <div className="flex gap-4 mt-4 justify-end">
            {/* <Button
              color="primary"
              variant="outlined"
              onClick={() => handleOpenPreviewCommunicationModal(getValues())}
            >
              Preview
            </Button> */}
            <Button
              color="primary"
              variant="outlined"
              onClick={() => handleSaveForLater(getValues())}
            >
              Save for later
            </Button>
            <Button
              type="submit"
              disabled={SendEmailCommunication?.isLoading}
              variant="contained"
              color="primary"
            >
              Send
            </Button>
          </div>
        </form>
      </ReusableModal>

      {/* <PreviewCommunicationModal
        handleClose={handleClosePreviewCommunicationModal}
        open={previewCommunicationModal}
        data={previewData}
      /> */}
    </>
  );
};

export default NewCommunication;
