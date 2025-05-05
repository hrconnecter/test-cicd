import axios from "axios";
import { useContext } from "react";
import { useMutation } from "react-query";
import { TestContext } from "../../../../State/Function/Main";
import useGetUser from "../../../../hooks/Token/useUser";

const useManageHiringSubscriptionMutation = () => {
  const { authToken, decodedToken } = useGetUser();
  const { handleAlert } = useContext(TestContext);

  const handleForm = async (data) => {
    const result = await axios.post(
      `${process.env.REACT_APP_API}/route/organization/organization-hiring/67d008504501776350afb966`,
      data,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return result.data;
  };

  const { mutate: renewMutate } = useMutation({
    mutationFn: handleForm,
    onSuccess: async (data) => {
      if (data?.paymentType === "Phone_Pay") {
        window.location.href = data?.redirectUrl;
      } else {
        const options = {
          key: data?.key,
          amount: data?.order?.amount,
          currency: "INR",
          name: "Hiring plan with AEGIS",
          description: "Get Access to all premium keys",
          image: data?.organization?.image,
          order_id: data.order.id,
          callback_url: data?.callbackURI,
          prefill: {
            name: `${decodedToken?.user?.first_name} ${decodedToken?.user?.last_name}`,
            email: decodedToken?.user?.email,
            contact: decodedToken?.user?.phone_number,
          },
          notes: {
            address:
              "C503, The Onyx-Kalate Business Park, near Euro School, Shankar Kalat Nagar, Wakad, Pune, Pimpri-Chinchwad, Maharashtra 411057",
          },
          theme: {
            color: "#1976d2",
          },
        };

        const razor = new window.Razorpay(options);
        razor.open();
      }
    },
    onError: async (data) => {
      handleAlert(
        true,
        "error",
        data?.response?.data?.message ?? "Please fill all mandatory fields"
      );
    },
  });

  return {
    renewMutate, // Now correctly returning renewMutate instead of mutate
  };
};

export default useManageHiringSubscriptionMutation;
