/* eslint-disable no-unused-vars */
import { Info, West } from "@mui/icons-material";
import { Avatar, CircularProgress } from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import moment from "moment";
import React from "react";
import { Link, useParams } from "react-router-dom";
import useExpenseNotification from "../../../hooks/QueryHook/notification/expense-notification/useExpenseNotification";

const EmployeeExpenseNotifications = () => {
  const { organisationId } = useParams();
  const { getEmployeeExpenseNotifications } = useExpenseNotification();
  const notifications =
    getEmployeeExpenseNotifications.data?.notifications || [];

  const getStatusColor = (type) => {
    switch (type) {
      case "STATUS_CHANGE":
        return "text-blue-600";
      case "PAYMENT":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div>
      {/* <header className="text-xl w-full pt-6 border bg-white shadow-md p-4"> */}
        {/* <Link to={`/organisation/${organisationId}/expenses`}>
          <West className="mx-4 !text-xl" />
        </Link>
        Expense Status  */}

        <div className="p-4 space-y-1 flex items-center gap-3  shadow-md bg-white border-b border-gray-300">
                <Avatar className="text-white !bg-blue-500">
                  <AssignmentTurnedInIcon />
                </Avatar>
                <div>
                  <h1 className="md:text-xl text-lg  font-bold  ">Expense Status</h1>
                  <p className="text-sm font-extralight">
                    Track your expense report status and updates
                  </p>
                </div>
              </div>
 
      {/* </header> */}
      <section className=" pt-6  min-h-[90vh] flex">
        <article className="w-[100%] min-h-[90vh] border-l-[.5px] bg-gray-50">
          {getEmployeeExpenseNotifications.isLoading ? (
            <div className="flex items-center justify-center my-2">
              <CircularProgress />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex px-4 w-full items-center my-4">
              <h1 className="text-lg w-full text-gray-700 border bg-blue-200 p-4 rounded-md">
                <Info /> No expense updates found
              </h1>
            </div>
          ) : (
            <>
              
              <div className="md:px-4 px-0">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className="w-full bg-white shadow-md mb-3 p-4 rounded-md"
                  >
                    <div className="flex justify-between items-center px-2">
                      <div>
                        {/* <h2 className="md:text-lg text-base font-semibold"> */}
                        <h2 className={`md:text-lg text-base font-semibold ${getStatusColor(notification.notificationType)}`}>
                          {notification.message}
                        </h2>

                        <div className="text-sm text-gray-600">
                          {/* Expense ID: {notification.expenseId?.expenseId} */}
                          Report Name: {notification.expenseId?.reportName || notification.expenseId?.expenseName}
                        </div>

                        {/* <div className="text-sm text-gray-600"> */}
                        {/* <div className={`text-sm ${getStatusColor(notification.notificationType)}`}>
                          Status: {notification.notificationType}
                        </div> */}

                        <div className="text-sm text-gray-800">
                          Amount: ₹
                          {notification.expenseId?.amount ||
                            notification.expenseId?.totalAmount}
                        </div>

                        {notification.notificationType === "PAYMENT" && (
                          <div className="text-sm text-green-600 font-medium">
                            {/* Payment Method: {notification.paymentMethod} */}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-700 underline">
                        {moment(notification.createdAt).fromNow()}
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

export default EmployeeExpenseNotifications;
