import { Tab } from "@headlessui/react";
import {
  Article,
  Cancel,
  CheckCircle,
  Close,
  Info,
  Search,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import HeadingOneLineInfo from "../../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import useIncomeTax from "../../../../hooks/IncomeTax/useIncomeTax";
import useAuthToken from "../../../../hooks/Token/useAuth";
import TDSDeclarationModel from "./components/TDSDeclarationModel";

const DeclarationPage = ({ filterOrgId }) => {
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const tabArray = [
    {
      title: "TDS Requests",

      isArchive: false,
      disabled: false,
    },
    {
      title: "Archived",

      isArchive: true,
      disabled: false,
    },
  ];
  const authToken = useAuthToken();
  const [id, setId] = useState(null);
  const [investment, setInvestment] = useState({});
  const [isReject, setIsReject] = useState(false);
  const [pdf, setPdf] = useState(null);
  const { financialYear } = useIncomeTax();
  const queryClient = useQueryClient();
  const handlePDF = (id) => {
    setPdf(id);
  };

  const handleClosePDF = () => {
    setPdf(null);
  };

  const [searchEmp, setSearchEmp] = useState("");
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setInvestment({});
  };

  const { data: empTDSData, isLoading: empDataLoading } = useQuery({
    queryKey: ["EmpData", id],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/tds/getTDSWorkflow/${id}/${financialYear}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: id !== undefined,
    onSuccess: (data) => {
      queryClient.invalidateQueries("getAllInvestment");
    },
  });

  const handleDownload = (pdf) => {};

  //filter org wise
  const { data: filterOrgData, isLoading1 } = useQuery(
    ["getFilterOrgData", filterOrgId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${filterOrgId}/get-notification-orgWise?key=TDS`,
        { headers: { Authorization: authToken } }
      );
      return response?.data;
    },
    { enabled: !!filterOrgId }
  );

  console.log("filterOrgData 123", empTDSData?.investment);

  return (
    <div>
      <section className="min-h-[90vh] flex">
        <article className="md:w-[25%] w-[200px] overflow-auto h-[90vh]">
          <div className="p-2 my-2">
            <div className="space-y-2">
              {/* Search Box */}
              <div className="flex rounded-md items-center px-2 outline-none border-gray-200 border-[.5px] bg-white py-1 md:py-[6px]">
                <Search className="text-gray-700 md:text-lg !text-[1em]" />
                <input
                  type="text"
                  onChange={(e) => setSearchEmp(e.target.value)}
                  placeholder="Search Employee"
                  className="border-none w-full outline-none px-2"
                />
              </div>
            </div>
          </div>

          {isLoading1 ? (
            // Loading State
            <div className="flex items-center justify-center my-2">
              <CircularProgress />
            </div>
          ) : filterOrgData?.data?.tds?.length < 1 ? (
            // No Data
            <h1 className="px-6 text-lg text-center">No declarations</h1>
          ) : (
            // Employee List
            filterOrgData?.data?.tds[0]?.arrayOfEmployee
              ?.filter((item) =>
                searchEmp
                  ? item?.employeeName
                      ?.toLowerCase()
                      .includes(searchEmp.toLowerCase())
                  : true
              )
              .map((ele) => (
                <Link
                  key={ele?.employeeId}
                  onClick={() => setId(ele?.employeeId)}
                  // to={`/organisation/${organisationId}/notification/${ele?.employeeId}`}
                  className={`px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50 ${
                    ele?.employeeId === id &&
                    "bg-blue-500 text-white hover:!bg-blue-300"
                  }`}
                >
                  <Avatar />
                  <div>
                    <h1 className="text-[1.2rem]">{ele?.employeeName}</h1>
                    <h1
                      className={`text-sm text-gray-500 ${
                        ele?.employeeId === id && "text-white"
                      }`}
                    >
                      {ele?.employeeEmail}
                    </h1>
                  </div>
                </Link>
              ))
          )}
        </article>

        <article
          className={`md:w-[75%] w-full flex flex-col min-h-[90vh] border-l-[.5px]  bg-gray-50 ${
            !id && "md:!flex !hidden"
          }`}
        >
          <div className="px-4 pt-2">
            <HeadingOneLineInfo
              heading={"Employee Declarations"}
              info={
                "Here user can able to view employee declarations and approvals"
              }
            />
          </div>
          {empDataLoading ? (
            <div className="flex items-center justify-center my-2">
              <CircularProgress />
            </div>
          ) : id ? (
            empTDSData?.length <= 0 || empTDSData?.investment?.length <= 0 ? (
              <div className="flex px-4 w-full items-center my-4">
                <h1 className="text-lg w-full  text-gray-700 border bg-blue-200 p-4 rounded-md">
                  <Info /> No declarations found
                </h1>
              </div>
            ) : (
              <>
                <div className="min-h-[85vh] px-4 bg-gray-50">
                  <Tab.Group>
                    <Tab.List className="mb-3 flex w-max space-x-1 rounded-xl bg-gray-200 p-1">
                      {tabArray.map((tab, index) => (
                        <Tab
                          key={index}
                          disabled={tab.disabled}
                          className={({ selected }) =>
                            classNames(
                              "w-full rounded-lg py-2 px-6 text-sm font-medium leading-5 whitespace-nowrap",
                              selected
                                ? "bg-white text-blue-700 shadow"
                                : "text-black hover:bg-gray-200 ",
                              tab.disabled &&
                                "cursor-not-allowed text-gray-400 hover:bg-gray-100"
                            )
                          }
                        >
                          {tab?.title}
                        </Tab>
                      ))}
                    </Tab.List>
                    <Tab.Panels>
                      {tabArray.map((tab, index) => (
                        <Tab.Panel key={index}>
                          {tab?.isArchive ? (
                            <div className="space-y-3">
                              {empTDSData?.investment
                                ?.filter((itm) => itm?.status !== "Pending")
                                ?.map((item, itemIndex) => (
                                  <div
                                    key={itemIndex}
                                    className="bg-white border rounded-lg px-5 py-2  space-y-2"
                                  >
                                    <div className="flex items-center justify-between">
                                      <h1 className="text-lg ">{item?.name}</h1>
                                      <Chip
                                        label={item?.status}
                                        color={
                                          item?.status === "Approved"
                                            ? "success"
                                            : "error"
                                        }
                                        size="small"
                                      />
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <p>
                                        INR{" "}
                                        {parseFloat(item.declaration).toFixed(
                                          2
                                        )}
                                      </p>

                                      <p
                                        className={`
                     
                        px-2 leading-7 text-[16px]`}
                                      >
                                        {item.proof ? (
                                          <div
                                            onClick={() =>
                                              handlePDF(item.proof)
                                            }
                                            className="px-2 flex gap-2 items-center h-max w-max  cursor-pointer"
                                          >
                                            <Article className="text-blue-500" />
                                            <h1>View Proof</h1>
                                          </div>
                                        ) : (
                                          "No Proof Found"
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : empTDSData?.investment?.filter(
                              (itm) => itm?.status === "Pending"
                            ).length <= 0 ? (
                            <div className="md:flex hidden  px-4 w-full items-center my-4">
                              <h1 className="text-lg w-full  text-gray-700 border bg-blue-200 p-4 rounded-md">
                                <Info /> No investment declaration found
                              </h1>
                            </div>
                          ) : (
                            <div className="px-4 overflow-x-auto">
                              <table className=" table-auto border  border-collapse min-w-full bg-white  text-left  !text-sm font-light">
                                <thead className="border-b bg-gray-100  font-bold">
                                  <tr className="!font-semibold ">
                                    <th
                                      scope="col"
                                      className="!text-center px-2 leading-7 text-[16px] w-max py-3 border"
                                    >
                                      Sr. No
                                    </th>
                                    <th
                                      scope="col"
                                      className="py-3 leading-7 text-[16px] px-2 border"
                                    >
                                      Declaration Name
                                    </th>

                                    <th
                                      scope="col"
                                      className="py-3 leading-7 text-[16px] px-2 border"
                                    >
                                      Amount
                                    </th>
                                    <th
                                      scope="col"
                                      className="py-3 leading-7 text-[16px] px-2 border"
                                    >
                                      Proofs
                                    </th>
                                    <th
                                      scope="col"
                                      className="py-3 px-2 leading-7 text-[16px] border"
                                    >
                                      Actions
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {empTDSData?.investment
                                    ?.filter((itm) => itm?.status === "Pending")
                                    ?.map((item, itemIndex) => (
                                      <tr
                                        className={`!font-medium h-14 border-b 
                
                `}
                                        key={itemIndex}
                                      >
                                        <td className="!text-center px-2 leading-7 text-[16px] w-[80px] border ">
                                          {itemIndex + 1}
                                        </td>
                                        <td className="leading-7 text-[16px] truncate text-left w-[500px] border px-2">
                                          <p>{item.name}</p>
                                        </td>

                                        <td className=" text-left !p-0 w-[200px] border ">
                                          <p
                                            className={`
                     
                        px-2 leading-7 text-[16px]`}
                                          >
                                            INR{" "}
                                            {parseFloat(
                                              item.declaration
                                            ).toFixed(2)}
                                          </p>
                                        </td>
                                        <td className=" text-left !p-0 w-[200px] border ">
                                          <p
                                            className={`
                     
                        px-2 leading-7 text-[16px]`}
                                          >
                                            {item.proof ? (
                                              <div
                                                onClick={() =>
                                                  handlePDF(item.proof)
                                                }
                                                className="px-2 flex gap-2 items-center h-max w-max  cursor-pointer"
                                              >
                                                <Article className="text-blue-500" />
                                                <h1>View Proof</h1>
                                              </div>
                                            ) : (
                                              "No Proof Found"
                                            )}
                                          </p>
                                        </td>
                                        <td className=" text-left !px-2 w-[200px] border ">
                                          <Tooltip title="Accept declaration">
                                            <IconButton
                                              onClick={() => {
                                                setInvestment(item);
                                                setOpen(true);
                                                setIsReject(false);
                                              }}
                                            >
                                              <CheckCircle color="success" />
                                            </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Reject declaration">
                                            <IconButton
                                              onClick={() => {
                                                setInvestment(item);
                                                setOpen(true);
                                                setIsReject(true);
                                              }}
                                            >
                                              <Cancel color="error" />
                                            </IconButton>
                                          </Tooltip>
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </Tab.Panel>
                      ))}
                    </Tab.Panels>
                  </Tab.Group>
                </div>
              </>
            )
          ) : (
            <div className="md:flex hidden  px-4 w-full items-center my-4">
              <h1 className="text-lg w-full  text-gray-700 border bg-blue-200 p-4 rounded-md">
                <Info /> Select employee to see their declarations
              </h1>

              {/* <img
                src="https://aegis-dev.s3.ap-south-1.amazonaws.com/remote-punching/65d86569d845df6738f87646/5f0cbf6977b8cc2f3661247706171db7"
                alt="none"
                height={500}
              /> */}
            </div>
          )}
        </article>
      </section>
      <TDSDeclarationModel
        open={open}
        empId={id}
        handleClose={handleClose}
        isReject={isReject}
        investment={investment}
      />

      <Dialog open={pdf !== null} onClose={handleClosePDF}>
        <DialogTitle className="flex justify-between items-center">
          <h1>Document</h1>
          <IconButton onClick={handleClosePDF}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="scrollt ">
            <object
              type="application/pdf"
              data={`${pdf}`}
              alt="none"
              aria-label="pdfSalary"
              className="min-h-[60vh] !w-[400px] "
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => handleDownload(pdf)}>
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeclarationPage;
