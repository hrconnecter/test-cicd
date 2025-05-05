
import { useState, useEffect } from "react";
import axios from "axios";
import useAuthToken from "../../../hooks/Token/useAuth";
import { useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import {
//   Button,
  CircularProgress,
  Pagination,
  PaginationItem,
  Stack,
  Typography,
  Chip,
} from "@mui/material";

const AssessmentDetails = () => {
  const { organisationId } = useParams();
  const authToken = useAuthToken();
  const [assessments, setAssessments] = useState([]);
  const [error, setError] = useState("");
  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  // const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  // const [excelConfirmation, setExcelConfirmation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [uploadedFileName, setUploadedFileName] = useState(null);
  // const [file, setFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  // const debouncedNameSearch = useDebounce(nameSearch, 500); // Debounce with a 500ms delay
  // const debouncedDeptSearch = useDebounce(deptSearch, 500);
  // const debouncedLocationSearch = useDebounce(locationSearch, 500);
  // const [sortBy, setSortBy] = useState(""); // 'name' or 'location'
  // const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  // const [totalEmployees, setTotalEmployees] = useState(0);

  const getStatusColor = (status) => {
    const statusMap = {
      "Pending": { color: "#FFF4E5", textColor: "#FFB020" },
      "Completed": { color: "#E8F5E9", textColor: "#4CAF50" },
      "In Progress": { color: "#E3F2FD", textColor: "#2196F3" },
      "Rejected": { color: "#FBE9E7", textColor: "#D32F2F" }
    };
    return statusMap[status] || { color: "#F5F5F5", textColor: "#666666" };
  };

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/organization/${organisationId}/assessment/details/AllStatus`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        setIsLoading(true);
        console.log(" ashu API Response:", response);
        setAssessments(response.data.data);
        setIsLoading(false);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch assessment details"
        );
      }
    };

    fetchAssessments();
  }, [organisationId, authToken, currentPage]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <BoxComponent>
      {isLoading && (
        <div className="fixed z-[100000] flex items-center justify-center bg-black/10 top-0 bottom-0 left-0 right-0">
          <CircularProgress />
        </div>
      )}

      <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
        <table className="min-w-full bg-white text-left !text-sm font-light">
          <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
            <tr className="!font-semibold">
              <th scope="col" className="!text-left pl-8 py-3">
                Sr. No
              </th>
              <th
                scope="col"
                className="!text-left pl-8 py-3"
                // onClick={() => handleSort("assessmentFormSentOn")}
              >
                Assessment Date Assigned
                {/* {sortBy === "assessmentFormSentOn" &&
              (sortOrder === "asc" ? <SwapVertIcon /> : <SwapVertIcon />)} */}
              </th>
              <th
                scope="col"
                className="!text-left pl-8 py-3"
                // onClick={() => handleSort("employeeName")}
              >
                Assessment Sent To
                {/* {sortBy === "employeeName" &&
              (sortOrder === "asc" ? <SwapVertIcon /> : <SwapVertIcon />)} */}
              </th>
              <th
                scope="col"
                className="!text-left pl-8 py-3"
                // onClick={() => handleSort("managerName")}
              >
                Manager Name
                {/*{sortBy === "managerName" &&
              (sortOrder === "asc" ? <SwapVertIcon /> : <SwapVertIcon />)} */}
              </th>
              <th
                scope="col"
                className="!text-left pl-8 py-3"
                // onClick={() => handleSort("status")}
              >
                Status
                {/* {sortBy === "status" &&
              (sortOrder === "asc" ? <SwapVertIcon /> : <SwapVertIcon />)} */}
              </th>
            </tr>
          </thead>
          <tbody>
          {assessments.length > 0 ? (
  assessments.map((assessment, idx) => {
    const statusStyle = getStatusColor(assessment.status);
    return (
      <tr className="!font-medium border-b" key={assessment.srNo}>
        <td className="!text-left pl-8 py-3">{idx + 1}</td>
        <td className="py-3 pl-8">
          {new Date(assessment.assessmentFormSentOn).toLocaleDateString()}
        </td>
        <td className="py-3 pl-8">{assessment.employeeName}</td>
        <td className="py-3 pl-8">{assessment.managerName}</td>
        <td className="py-3 pl-8">
          <Chip
            label={assessment.status}
            sx={{
              backgroundColor: statusStyle.color,
              color: statusStyle.textColor,
              fontWeight: 600,
              '&:hover': {
                backgroundColor: statusStyle.color,
              },
              height: '28px',
              borderRadius: '14px'
            }}
          />
        </td>
      </tr>
    );
  })
) : (
  <tr>
    <td colSpan="5" className="text-center py-3">
      No assessments found.
    </td>
  </tr>
)}

          </tbody>
        </table>

        {/* Pagination */}
        <Stack
          direction={"row"}
          className="border-[.5px] border-gray-200 bg-white border-t-0 px-4 py-2 h-full items-center w-full justify-between"
        >
          <div>
            <Typography variant="body2">
              Showing page {currentPage} of {totalPages} pages
            </Typography>
          </div>

          <Pagination
            count={totalPages}
            page={currentPage}
            color="primary"
            shape="rounded"
            siblingCount={0}
            boundaryCount={0}
            hidePrevButton={currentPage === 1}
            hideNextButton={currentPage === totalPages}
            onChange={(event, value) => setCurrentPage(value)}
            renderItem={(item) => (
              <PaginationItem
                {...item}
                components={{
                  previous: ArrowBackIcon,
                  next: ArrowForwardIcon,
                }}
              />
            )}
          />
        </Stack>
      </div>
    </BoxComponent>
  );
};

export default AssessmentDetails;




 // <div>
    //   {assessments.length > 0 ? (
    //     <table>
    //       <thead>
    //         <tr>
    //           <th>Sr. No</th>
    //           <th>Assessment DateAssigned</th>
    //           <th>Assessment Sent To</th>
    //           <th>Manager Name</th>
    //           <th>Status</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {assessments.map((assessment) => (
    //           <tr key={assessment.srNo}>
    //             <td>{assessment.srNo}</td>
    //             <td>{new Date(assessment.assessmentFormSentOn).toLocaleDateString()}</td>
    //             <td>{assessment.employeeName}</td>
    //             <td>{assessment.managerName}</td>
    //             <td>{assessment.status}</td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   ) : (
    //     <div>No assessments found.</div>
    //   )}
    // </div>