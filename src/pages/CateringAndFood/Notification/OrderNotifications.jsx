import { Info } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Avatar,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useMutation, useQueryClient } from "react-query";
import moment from "moment";
import UserProfile from "../../../hooks/UserData/useUser";

const OrderNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ orderId: "", status: "" });

  // Fetch vendor's employee ID
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const employeeId = user?._id;
  const vendorId = employeeId;

  const queryClient = useQueryClient();

  // Fetch Notifications
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

  // Mark notifications as read
  const markNotificationsAsReadMutation = useMutation(
    async () => {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/notificationsvendor/mark-as-read/${vendorId}`
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("ordernotifications");
      },
    }
  );

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
    markNotificationsAsReadMutation.mutate();
    // eslint-disable-next-line
  }, [fetchNotifications]);

  // Handle Filter Change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Apply Filters
  const filteredNotifications = notifications.filter(({ order }) => {
    const matchesOrderId = filters.orderId
      ? order.orderNumber.includes(filters.orderId)
      : true;
    const matchesStatus = filters.status
      ? order.status?.toLowerCase() === filters.status.toLowerCase()
      : true;
    return matchesOrderId && matchesStatus;
  });

  return (
    <div>
      <h1 className="w-full pt-5 text-xl font-bold px-14 py-3 shadow-md bg-white border-b border-gray-300 flex items-center gap-3">
        <Avatar className="text-white !bg-green-500">
          <CheckCircleIcon />
        </Avatar>
        <div>
          Order Notifications
          <p className="text-sm font-extralight">
            View and manage incoming order notifications.
          </p>
        </div>
      </h1>

      <section className="min-h-[90vh] flex flex-col">
        <div className="p-4 flex flex-wrap gap-4 items-center">
          {/* Filter Inputs */}
          <TextField
            label="Filter by Order ID"
            name="orderId"
            variant="outlined"
            size="small"
            value={filters.orderId}
            onChange={handleFilterChange}
          />
          <Select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            displayEmpty
            variant="outlined"
            size="small"
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="accepted">Accepted</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
          <Button variant="contained" color="primary" onClick={fetchNotifications}>
            Refresh
          </Button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            onClick={() => setFilters({ orderId: "", status: "" })}
          >
            Clear Filters
          </button>
        </div>

        <article className="w-[100%] min-h-[90vh] border-l-[.5px] bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center my-2">
              <CircularProgress />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex px-4 w-full items-center my-4">
              <h1 className="text-lg w-full text-gray-700 border bg-green-200 p-4 rounded-md">
                <Info /> No Notifications Found
              </h1>
            </div>
          ) : (
            <>
              <div className="md:px-4 px-0">
                {filteredNotifications.map(({ order, notification }, index) => (
                  <div key={index} className="w-full bg-white shadow-md mb-3 p-4 rounded-md">
                    <div className="flex justify-between items-center px-2">
                      <div>
                        <h2>
                          <span className="md:text-lg text-base font-semibold">
                            Order ID
                          </span>{" "}
                          : {order.orderNumber || "N/A"}
                        </h2>
                        <h2>
                          <span className="md:text-lg text-base font-semibold">
                            Customer
                          </span>{" "}
                          : {order.userId || "N/A"}
                        </h2>
                        <h2>
                          <span className="md:text-lg text-base font-semibold">
                            Status
                          </span>{" "}
                          : <strong>{order.status || "Pending"}</strong>
                        </h2>
                        <h2>
                          <span className="md:text-lg text-base font-semibold">
                            Total Amount
                          </span>{" "}
                          : ₹{order.grandTotal.toFixed(2)}
                        </h2>
                        <h2>
                          <span className="md:text-lg text-base font-semibold">
                            Time
                          </span>{" "}
                          : {new Date(order.placedAt).toLocaleString()}
                        </h2>
                      </div>

                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="text-sm text-gray-700 underline">
                          {moment(notification.createdAt).fromNow()}
                        </div>
                        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md">
                          {notification.message}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </article>
      </section>
    </div>
  );
};

export default OrderNotifications;
