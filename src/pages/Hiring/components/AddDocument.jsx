import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import axios from "axios";

import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import Setup from "../../SetUpOrganization/Setup";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import BasicButton from "../../../components/BasicButton";
import { Description } from "@mui/icons-material";

// Make sure these contexts are imported correctly
import { UseContext } from "../../../State/UseState/UseContext";
import { TestContext } from "../../../State/Function/Main";
import { useParams } from "react-router-dom";

const AddDocument = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const { handleAlert } = useContext(TestContext);

  const { organisationId } = useParams(); // or get it from props/context if needed

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const mutation = useMutation(
    (data) =>
      axios.post(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/add-document-list`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        handleAlert(true, "success", "Document list saved successfully.");
      },
      onError: () => {
        handleAlert(true, "error", "An error occurred while saving documents.");
      },
    }
  );

  const onSubmit = (data) => {
    mutation.mutate({
      documentlist: data.documentlist.map((doc) => doc.value),
    });
  };

  const documentOptions = [
    { label: "Resume", value: "resume" },
    { label: "Marksheet", value: "marksheet" },
    { label: "Pancard", value: "pancard" },
    { label: "Aadhar Card", value: "aadhar_card" },
  ];

  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <div className="xs:block sm:block md:flex justify-between items-center">
            <HeadingOneLineInfo
              className="!my-3"
              heading="Required Documents"
              info="Here you can select and add required documents for job applications."
            />
          </div>
          <div className="w-full">
            <form onSubmit={handleSubmit(onSubmit)}>
              <AuthInputFiled
                name="documentlist"
                icon={Description}
                control={control}
                isMulti={true}
                type="autocomplete"
                optionlist={documentOptions}
                placeholder="Select required documents"
                label="Required Documents *"
                readOnly={false}
                maxLimit={15}
                errors={errors}
                error={errors.documentlist}
              />
              <div className="flex justify-end mt-4">
                <BasicButton
                  title={mutation.isLoading ? "Saving..." : "Submit"}
                  type="submit"
                  loading={mutation.isLoading}
                  disabled={mutation.isLoading}
                />
              </div>
            </form>
          </div>
        </div>
      </Setup>
    </BoxComponent>
  );
};

export default AddDocument;
