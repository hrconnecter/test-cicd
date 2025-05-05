import axios from "axios";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import useAuthToken from "../../Token/useAuth";

const useOrganisationMutation = () => {
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();
  const authToken = useAuthToken();

  const handleEditConfirmation = async ({
    id,
    data,
    handleCloseConfirmation,
  }) => {
    const formData = new FormData();

    formData.append("logo_url", data.logo_url);
    formData.append("orgName", data.orgName);
    formData.append("foundation_date", data.foundation_date);
    formData.append("web_url", data.web_url);
    formData.append("industry_type", data.industry_type);
    formData.append("email", data.email);
    formData.append("gst_number",data.gst_number);
    formData.append("organization_linkedin_url", data.organization_linkedin_url);
    formData.append("location", JSON.stringify(data.location));
    formData.append("contact_number", data.contact_number);
    formData.append("description", data.description);

    const response = await axios.patch(
      `${process.env.REACT_APP_API}/route/organization/edit/${id}`,
      formData,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    response.data.function = handleCloseConfirmation;
    return response.data;
  };

  const removeLogo = async (organizationId) => {
    const response = await axios.delete(
      `${process.env.REACT_APP_API}/route/organization/logo/${organizationId}/remove`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };

  const updateOrganizationMutation = useMutation(handleEditConfirmation, {
    onSuccess: (data) => {
      handleAlert(true, "success", "Organisation Updated Successfully");
      data?.function();
      queryClient.invalidateQueries("orglist");
      queryClient.setQueryData("currentOrg", (oldData) => ({
        ...oldData,
        logo_url: data.logo_url,
      }));
      data?.function();
    },
    onError: (error) => {
      console.error(`🚀 ~ file: mutation.jsx:39 ~ error:`, error);
      handleAlert(true, "error", "Failed to update Organization");
    },
  });

  const removeLogoMutation = useMutation(removeLogo, {
    onSuccess: () => {
      handleAlert(true, "success", "Logo removed successfully");
      queryClient.invalidateQueries("currentOrg");
      queryClient.setQueryData("currentOrg", (oldData) => ({
        ...oldData,
        logo_url: null,
      }));
    },
    onError: () => {
      handleAlert(true, "error", "Failed to remove logo");
    },
  });

  return { updateOrganizationMutation, removeLogoMutation };
};

export default useOrganisationMutation;
