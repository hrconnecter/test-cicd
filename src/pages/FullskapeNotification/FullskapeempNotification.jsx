
import { Info } from "@mui/icons-material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { Avatar, CircularProgress, TextField, Select, MenuItem, Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useMutation, useQueryClient } from "react-query";
import moment from "moment";
import UserProfile from "../../hooks/UserData/useUser";

const FullskapeempNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: "", PRN: "", Status: "" });

  const queryClient = useQueryClient();

  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const organizationId = user && user.organizationId;

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/${organizationId}/notifications`
      );
      const data = response.data.data || [];
      setNotifications(data);
      setFilteredNotifications(data); // Initialize filtered notifications
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  }, [organizationId]);

  // Mark notifications as read
  const markNotificationsAsReadMutation = useMutation(
    async () => {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/notifications/markasread/${organizationId}`
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("notifications");
      },
    }
  );

  // Apply filters to notifications
  const applyFilters = useCallback(() => {
    const { name, PRN, Status } = filters;
    const filtered = notifications.filter((notif) => {
      const matchesName = name ? notif.name?.toLowerCase().includes(name.toLowerCase()) : true;
      const matchesPRN = PRN ? notif.PRN?.toLowerCase().includes(PRN.toLowerCase()) : true;
      const matchesStatus = Status ? notif.type?.toLowerCase() === Status.toLowerCase() : true;
      return matchesName && matchesPRN && matchesStatus;
    });
    setFilteredNotifications(filtered);
  }, [filters, notifications]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
    markNotificationsAsReadMutation.mutate();
    //eslint-disable-next-line
  }, [fetchNotifications]);

  // Apply filters whenever the filters or notifications change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <div>
      <h1 className="w-full pt-5 text-xl font-bold px-14 py-3 shadow-md bg-white border-b border-gray-300 flex items-center gap-3">
        <Avatar className="text-white !bg-blue-500">
          <AssignmentTurnedInIcon />
        </Avatar>
        <div>
          Fullskape Notifications
          <p className="text-sm font-extralight">
            Here Teacher can view live updates on Fullskape notifications.
          </p>
        </div>
      </h1>

      <section className="min-h-[90vh] flex flex-col">
        <div className="p-4 flex flex-wrap gap-4 items-center">
          {/* Filter Inputs */}
          <TextField
            label="Filter by Name"
            name="name"
            variant="outlined"
            size="small"
            value={filters.name}
            onChange={handleFilterChange}
          />
          <TextField
            label="Filter by PRN"
            name="PRN"
            variant="outlined"
            size="small"
            value={filters.PRN}
            onChange={handleFilterChange}
          />
          <Select
            name="Status"
            value={filters.Status}
            onChange={handleFilterChange}
            displayEmpty
            variant="outlined"
            size="small"
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="punch in">Punch In</MenuItem>
            <MenuItem value="punch out">Punch Out</MenuItem>
          </Select>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchNotifications}
          >
            Refresh
          </Button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            onClick={() => setFilters({ name: "", PRN: "", Status: "" })}
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
              <h1 className="text-lg w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
                <Info /> No Fullskape Notifications Found
              </h1>
            </div>
          ) : (
            <>
              <div className="md:px-4 px-0">
                {filteredNotifications.map((notif, index) => (
                  <div
                    key={index}
                    className="w-full bg-white shadow-md mb-3 p-4 rounded-md"
                  >
                    <div className="flex justify-between items-center px-2">
                      <div>
                        <h2>
                          <span className="md:text-lg text-base font-semibold">
                            Name
                          </span>{" "}
                          : {notif.name || "N/A"}
                        </h2>
                        <h2>
                          <span className="md:text-lg text-base font-semibold">
                            PRN
                          </span>{" "}
                          : {notif.PRN || "N/A"}
                        </h2>
                        <h2>
                          <span className="md:text-lg text-base font-semibold">
                            Status
                          </span>{" "}
                          : {notif.type || "N/A"}
                        </h2>
                        <h2>
                          <span className="md:text-lg text-base font-semibold">
                            Time
                          </span>{" "}
                          : {new Date(notif.timestamp).toLocaleString()}
                        </h2>
                      </div>
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="text-sm text-gray-700 underline">
                          {moment(notif.timestamp).fromNow()}
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

export default FullskapeempNotification;
