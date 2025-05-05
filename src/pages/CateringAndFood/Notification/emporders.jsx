import { Info } from "@mui/icons-material";
import { Avatar, CircularProgress, Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import moment from "moment";
import UserProfile from "../../../hooks/UserData/useUser";
import { useMutation, useQueryClient } from "react-query";

const EmployeeOrdersNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const employeeId = user?._id;

  const queryClient = useQueryClient();


  const fetchNotifications = useCallback(async () => {
    try {
        setLoading(true);
        console.log("Fetching notifications for employeeId:", employeeId);
        const response = await axios.get(
            `${process.env.REACT_APP_API}/route/notifications/${employeeId}`
        );
        console.log("API Response:", response);

        if (response.status === 200) {
            console.log("API call successful");
            const data = response.data.data || [];
            setNotifications(data);

            // Call onSuccess function
        } else {
            console.error("Unexpected response status:", response.status);
        }
    } catch (error) {
        console.error("Error fetching notifications:", error);
        if (error.response) {
            console.error("Error Response Data:", error.response.data);
            console.error("Error Status:", error.response.status);
        }
    } finally {
        setLoading(false);
    }
}, [employeeId]);


const markNotificationsAsReadMutation = useMutation(
    async () => {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/notifications/mark-as-read/${employeeId}`
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("ordernotifications");
      },
    }
  );

  useEffect(() => {
    fetchNotifications();
    markNotificationsAsReadMutation.mutate();
    //eslint-disable-next-line
  }, [fetchNotifications]);

  return (
    <div>
      <h1 className="w-full pt-5 text-xl font-bold px-14 py-3 shadow-md bg-white border-b border-gray-300 flex items-center gap-3">
        <Avatar className="text-white !bg-blue-500">
          <Info />
        </Avatar>
        <div>
          Order Notifications
          <p className="text-sm font-extralight">View your latest order updates.</p>
        </div>
      </h1>

      <section className="min-h-[90vh] flex flex-col">
        <div className="p-4 flex gap-4 items-center">
          <Button variant="contained" color="primary" onClick={fetchNotifications}>
            Refresh
          </Button>
        </div>

        <article className="w-[100%] min-h-[90vh] border-l-[.5px] bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center my-2">
              <CircularProgress />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex px-4 w-full items-center my-4">
              <h1 className="text-lg w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
                <Info /> No Notifications Found
              </h1>
            </div>
          ) : (
            notifications.map((item, index) => (
              <div key={index} className="w-full bg-white shadow-md mb-3 p-4 rounded-md">
                <p className="text-gray-900 font-semibold">{item.notification?.message}</p>
                <div className="text-sm text-gray-700 underline mb-2">
                  {moment(item.notification.createdAt).fromNow()}
                </div>
                <div className="text-sm text-gray-800">
                  <p><strong>Order Number:</strong> {item.order.orderNumber}</p>
                  <p><strong>Items:</strong> {item.order.items.map(i => `${i.name} (x${i.quantity})`).join(", ")}</p>
                  <p><strong>Total Price:</strong> ₹{item.order.grandTotal}</p>
                  <p><strong>Placed At:</strong> {moment(item.order.placedAt).format("LLL")}</p>
                </div>
              </div>
            ))
          )}
        </article>
      </section>
    </div>
  );
};

export default EmployeeOrdersNotifications;
