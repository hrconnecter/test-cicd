import { zodResolver } from "@hookform/resolvers/zod";
import { Email } from "@mui/icons-material";
import GroupIcon from "@mui/icons-material/Group";
import { Button } from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import AuthInputFiled from "../../InputFileds/AuthInputFiled";
import ReusableModal from "../component";

const communicationOptions = [
  { label: "HR Communication", value: "HR Communication" },
  { label: "Accounts Communication", value: "Accounts Communication" },
  {
    label: "CEO/Leadership Communication",
    value: "CEO/Leadership Communication",
  },
];

const AddCommunicationModal = ({ handleClose, open, organisationId }) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  const [error, setError] = useState();
  const [visiblePassword, setVisiblePassword] = useState(false);

  const EmpCommunicationSchema = z.object({
    email: z.string().email(),
    communication: z.object({
      label: z.string(),
      value: z.string(),
    }),
    password: z.string(),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      email: undefined,
      communication: undefined,
      password: undefined,
    },
    resolver: zodResolver(EmpCommunicationSchema),
  });

  const AddEmailCommunication = useMutation(
    (data) =>
      axios.post(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/add-communication`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),

    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["emailCommunication"] });
        handleClose();
        handleAlert(true, "success", "Email added successfully");
        reset();
      },
      onError: () => {
        setError("An Error occurred while setup the email.");
      },
    }
  );

  const onSubmit = async (data) => {
    try {
      const formData = {
        email: data.email,
        communication: data.communication.label,
        password: data.password,
      };
      await AddEmailCommunication.mutateAsync(formData);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to add the communication");
      setError("Failed to add the loan type");
    }
  };
  console.log(error);
  return (
    <ReusableModal
      open={open}
      onClose={handleClose}
      heading="Add Email"
      className="!pt-0 !px-0 !w-[90%] lg:!w-[50%] md:!w-[60%]"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
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
          optionlist={communicationOptions ? communicationOptions : []}
        />

        <AuthInputFiled
          name="email"
          icon={Email}
          control={control}
          type="text"
          placeholder="Email"
          label="Email *"
          errors={errors}
          error={errors.email}
        />

        <AuthInputFiled
          name="password"
          icon={Email}
          control={control}
          type="password"
          visible={visiblePassword}
          setVisible={setVisiblePassword}
          placeholder="Password"
          label="Password *"
          errors={errors}
          error={errors.password}
        />

        <div className="flex gap-4 mt-4 justify-end">
          <Button onClick={handleClose} color="error" variant="outlined">
            Cancel
          </Button>

          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </div>
      </form>
    </ReusableModal>
  );
};

export default AddCommunicationModal;
