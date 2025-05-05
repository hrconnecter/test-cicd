import { Box, Tab, Tabs, Typography, Tooltip } from "@mui/material";
import React, { useState, cloneElement } from "react";
import UserProfile from "../../../hooks/UserData/useUser";
import { useQuery } from "react-query";
import axios from "axios";
import useGetUser from "../../../hooks/Token/useUser";

const TabPanel = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const Card = ({ card = [], filterOrgId }) => {
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  const { authToken } = useGetUser();
  const [selectedTab, setSelectedTab] = useState(0);
  const [tabName, setTabName] = useState(card[0]?.name || "");

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setTabName(card[newValue]?.name || "");
  };

  const {
    data: filterOrgData,
    isLoading,
    error,
  } = useQuery(
    ["getFilterOrgData", filterOrgId, tabName],
    async () => {
      const url = filterOrgId
        ? `${process.env.REACT_APP_API}/route/organization/${filterOrgId}/get-notification-orgWise?key=${tabName}`
        : `${process.env.REACT_APP_API}/route/organization/get-notification-all?key=${tabName}`; // ✅ Fetch all if no organization is selected

      const response = await axios.get(url, {
        headers: { Authorization: authToken },
      });
      return response?.data;
    },
    {
      enabled: Boolean(tabName) && role !== "Employee",
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="card tabs"
        className="bg-white"
      >
        {card.map((item, index) => (
          <Tooltip key={index} title={item.tooltipName} arrow>
            <Tab
              label={
                <span style={{ display: "flex", alignItems: "center" }}>
                  <span>{item.name}</span>
                  {item.count > 0 && (
                    <div
                      className="badge"
                      style={{
                        padding: "1px 6px",
                        backgroundColor: "#1976d2",
                        borderRadius: "50%",
                        marginLeft: "4px",
                        color: "white",
                      }}
                    >
                      {item.count}
                    </div>
                  )}
                </span>
              }
              id={`simple-tab-${index}`}
              aria-controls={`simple-tabpanel-${index}`}
            />
          </Tooltip>
        ))}
      </Tabs>

      {card.map((item, index) => (
        <TabPanel value={selectedTab} index={index} key={index}>
          {role === "Employee" || role === "Teacher"
            ? item?.empPage
            : item?.page
            ? cloneElement(item.page, {
                filterOrgId,
                filterOrgData,
                isLoading,
                error,
              })
            : "Page content not available"}
        </TabPanel>
      ))}
    </div>
  );
};

export default Card;
