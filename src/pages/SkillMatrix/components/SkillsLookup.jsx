/* eslint-disable no-unused-vars */
//asli
import React, { useState, useContext, useCallback } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
  Slider,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer, 
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Divider,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import Select from "react-select";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import useSkillMatrixFilter from "../../../hooks/SkillMatrix/useSkillMatrixFilter";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/FilterList";
import WorkIcon from "@mui/icons-material/Work";
import PieChartIcon from "@mui/icons-material/PieChart";
import DownloadIcon from "@mui/icons-material/Download";
import FilterListIcon from "@mui/icons-material/FilterList";
import PeopleIcon from "@mui/icons-material/People";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

// Custom Select Styles
const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: "#d1d5db",
    boxShadow: "none",
    "&:hover": { borderColor: "#4f46e5" },
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "2px",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 1000,
    position: "absolute",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  }),
};
const FilterContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const ModernPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  padding: theme.spacing(3),
  backgroundColor: "#ffffff",
}));

// Skill Distribution Section Component
const SkillDistributionSection = ({ data , locations, 
  department, 
  manager }) => {
  // Transform data for chart
  const chartData = data.data.map((item) => ({
    //old is gold
    // name: item.skillName,
    name: item.skillName || item.city || item.departmentName || item.managerName,
    employees: item.count,
    averageRating: item.averageRating ? item.averageRating.toFixed(2) : "N/A",
    location: item.location
  }));

  return (
    <Grid container spacing={3}>
      {/* Table Section */}
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <WorkIcon sx={{ mr: 2, color: "primary.main" }} />
            <Typography variant="h6" fontWeight="bold">
              {/* //old is gold */}
              {/* Skill Distribution */}
              {locations ? `Skills in ${locations}` : 
               department ? `Skills in ${department}` : 
               manager ? `Skills under ${manager}` : 
               "Skill Distribution"}

            </Typography>
          </Box>
          <Typography variant="subtitle2" color="text.secondary" mb={2}>
             {/* //old is gold */}
            {/* Detailed breakdown of skills across the organization */}
            Detailed breakdown of skills 
            {locations ? ` in ${locations}` : 
             department ? ` in ${department}` : 
             manager ? ` under ${manager}` : 
             " across the organization"}

          </Typography>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                     {/* //old is gold */}
                    {/* <Typography fontWeight="bold">Skill</Typography> */}

                    <Typography fontWeight="bold">
                      {locations ? "Skill" : 
                       department ? "Skill" : 
                       manager ? "Skill" : 
                       "Skill"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography fontWeight="bold">Employees</Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Typography fontWeight="bold">Average Rating</Typography>
                  </TableCell>

                  {/* <TableCell>
//             <Box display="flex" alignItems="center">
//               <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
//               <Typography variant="body1" color="">
//                 {item.count} Employees
//               </Typography>
//             </Box>
//           </TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.data.map((item) => (
                  <TableRow key={item.skillName}>
                    <TableCell>{item.skillName}</TableCell>

                    <TableCell align="center">
                      <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
                      {item.count}
                    </TableCell>

                    <TableCell align="right">
                    <StarIcon sx={{ color: "gold", mr: 1 }} />
                      {item.averageRating ? item.averageRating.toFixed(2) : 'N/A'}
                    </TableCell>

                    {/* <TableCell align="right">
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-end"
                      >
                        {item.averageRating ? (
                          <>
                            <StarIcon sx={{ color: "gold", mr: 1 }} />
                            {item.averageRating.toFixed(2)}
                          </>
                        ) : (
                          <>
                            <StarBorderIcon sx={{ color: "gray", mr: 1 }} />
                            N/A
                          </>
                        )}
                      </Box>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>

      {/* Chart Section */}
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
          <Box display="flex" alignItems="center" mb={2}>
            <PieChartIcon sx={{ mr: 2, color: "primary.main" }} />
            <Typography variant="h6" fontWeight="bold">
              Skill Distribution Chart
            </Typography>
          </Box>
          <Typography variant="subtitle2" color="text.secondary" mb={2}>
            Visual representation of skill distribution
          </Typography>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              {/* <Tooltip /> */}
              <Tooltip
                formatter={(value, name, props) => {
                  if (name === "employees") return [value, "Employees"];
                  if (name === "averageRating") return [value, "Avg Rating"];
                  return [value, name];
                }}
              />
              <Legend />
              {/* <Bar dataKey="employees" fill="#8884d8" barSize={30} /> */}

              <Bar
                dataKey="employees"
                fill="#8884d8"
                barSize={30}
                name="Employees"
              />
              <Bar
                dataKey="averageRating"
                fill="#82ca9d"
                barSize={30}
                name="Avg Rating"
              />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

// Main SkillLookup Component
const SkillLookup = () => {
  // Context hooks
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  // URL Params
  const { organisationId } = useParams();

  // Local state for filters
  const [skill, setSkill] = useState("");
  const [rating, setRating] = useState([0, 5]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ratingRange, setRatingRange] = useState(null);
  const pageSize = 10;
  const [workLocationId, setWorkLocationId] = useState("");


  // Use custom filter hook
  const {
    department,
    setDepartment,
    manager,
    setManager,
    workLocations,
    setWorkLocations,
    locations,
  setLocations,
  locationOptions,
    Departmentoptions,
    managerOptions,
    workLocationOptions,
  } = useSkillMatrixFilter(organisationId);

  // Export handler
  // Update export handler
  const handleExport = () => {
    const convertToCSV = (data) => {
      const headers = ["Skill", "Employees", "Average Rating"];
      const csvRows = data.map(
        (item) =>
          `${item.skillName},${item.count},${
            item.averageRating ? item.averageRating.toFixed(2) : "N/A"
          }`
      );
      return [headers.join(","), ...csvRows].join("\n");
    };

    const csvData = convertToCSV(data.data);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "skill_insights.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fetch skills data query
  const fetchSkillsData = useCallback(async () => {
    try {
      console.log("Fetching skills data with filters:", {
        skillName: skill,
        departmentId: department,
        managerId: manager,
        workLocationId: locations || undefined, // Use locations instead of workLocationId
        ratingRange: ratingRange,
        page: currentPage,
        pageSize,
      });

      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/assessments/${organisationId}/getInsights`,
        {
          headers: { Authorization: authToken },
          params: {
            skillName: skill || undefined,
            departmentId: department || undefined,
            managerId: manager || undefined,
            workLocationId: workLocationId || undefined,
            // city: locations || undefined,
            ratingRange: ratingRange || undefined, // Pass rating range
            page: currentPage,
            pageSize,
            includeDetails: true,
            // groupBy:  workLocationId ? 'city' : 
            //          department ? 'department' : 
            //          manager ? 'manager' : 'skill'
             groupBy: locations ? 'city' : department ? 'department' : manager ? 'manager' : 'skill'

          },
        }
      );

      console.log("Skill data response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching skills data:", error);
      handleAlert(false, "error", "Failed to fetch skills data");
      throw error;
    }
  }, [
    skill,
    department,
    manager,
    ratingRange,
    workLocationId,
    locations,
    currentPage,
    organisationId,
    authToken,
    handleAlert,
  ]);

  // Use React Query for data fetching
  const { data, isLoading, error, refetch } = useQuery(
    [
      "skillsData",
      skill,
      department,
      manager,
      workLocationId,
      ratingRange,
      currentPage,
    ],
    fetchSkillsData,
    {
      keepPreviousData: true,
      retry: 1,
      onError: (error) => {
        console.error("Query error:", error);
        handleAlert(false, "error", error.message || "An error occurred");
      },
    }
  );

  const getRatingRangeLabel = (range) => {
    switch (range) {
      case "0-2":
        return "Beginner (0-2)";
      case "2-4":
        return "Intermediate (2-4)";
      case "4-5":
        return "Expert (4-5)";
      default:
        return "";
    }
  };
  // Search handler
  const handleSearch = () => {
    if (rating[0] > rating[1]) {
      handleAlert(false, "warning", "Invalid rating range!");
      return;
    }
    refetch();
  };

  // Reset handler
  const handleReset = () => {
    setSkill("");
    setDepartment("");
    setManager("");
    setWorkLocationId("");
    setRatingRange(null);
    setCurrentPage(1);
    refetch();
  };

  

  return (
    <Box sx={{ padding: 3 }}>
      <div className="flex justify-between items-center mb-6">
        <div>
        {/* h1.lg:text-2xl.sm:text-lg.text-base.!font-sans.leading-none.text- */}
          <h1 className="text-2xl text-gray-700  font-semibold  ">Skill Lookup</h1>
          <p className="mt-1 text-sm text-gray-500">
            Analyze and track skill distribution across your organization
          </p>
        </div>
        {/* <div className="flex space-x-4">
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
          >
            Export Data
          </Button>
        </div> */}
      </div>
      {/* Filters Grid */}
      <ModernPaper>
        {/* Filters */}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <TuneIcon className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          </div>
        </div>

        <Box sx={{ flex: 1, minWidth: 200 }}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1 }}
            className="text-gray-800 "
          >
            Skills
          </Typography>
          <TextField
            label="Search skills (eg.ReactJs, NodeJs)"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            fullWidth
            size="small"
            styles={customSelectStyles}
            sx={{ mb: 1 }}
            className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </Box>

        <FilterContainer sx={{ mb: 1 }}>
          {/* Skill Filter */}

          {/* Department Filter */}
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Department
            </Typography>
            <Select
              placeholder=" All Departments"
              options={Departmentoptions}
              value={
                department
                  ? Departmentoptions?.find((opt) => opt.value === department)
                  : null
              }
              onChange={(selectedOption) => {
                console.log("Ap Selected Department:", selectedOption);
                setDepartment(selectedOption ? selectedOption.value : "");
              }}
              styles={customSelectStyles}
              isClearable={true}
              noOptionsMessage={() => "No locations found"}
            />
          </Box>

          {/* Manager Filter */}
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Manager
            </Typography>
            <Select
              placeholder=" All Managers"
              options={managerOptions}
              value={
                manager
                  ? managerOptions?.find((opt) => opt.value === manager)
                  : null
              }
              onChange={(selectedOption) => {
                console.log(" Ap Selected Manager:", selectedOption);
                setManager(selectedOption ? selectedOption.value : "");
              }}
              styles={customSelectStyles}
              isClearable={true}
              noOptionsMessage={() => "No locations found"}
            />
          </Box>

          {/* Location Filter */}
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Location
            </Typography>
            <Select
  placeholder=" All Locations"
  options={locationOptions}
  value={
    locations 
      ? locationOptions?.find((opt) => opt.value === locations) || null 
      : null
  }
  onChange={(selectedOption) => {
    setLocations(selectedOption ? selectedOption.value : "");
    refetch();
  }}
  styles={customSelectStyles}
  isClearable={true}
/>
          </Box>

          {/* Rating Slider or Range Filter */}
          {/* slider */}
          {/* Rating Filter */}
          {/* <Grid item xs={12} sm={6} md={2}>
 <Typography>Rating Range</Typography>
 <Slider
   value={rating}
   onChange={(e, newValue) => setRating(newValue)}
   min={0}
   max={5}
   step={0.1}
   valueLabelDisplay="auto"
 />
</Grid> */}
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Average Skill Rating
            </Typography>
            {/* <Select
              placeholder="Select rating range"
              options={[
                { value: "0-2", label: "Beginner (0-2)" },
                { value: "2-4", label: "Intermediate (2-4)" },
                { value: "4-5", label: "Expert (4-5)" },
              ]}
              styles={customSelectStyles}
            /> */}

            {/* // Update rating range select */}
            <Select
              placeholder="Select rating crange"
              options={[
                { value: "0-2", label: "Beginner (0-2)" },
                { value: "2-4", label: "Intermediate (2-4)" },
                { value: "4-5", label: "Expert (4-5)" },
              ]}
              value={
                ratingRange
                  ? {
                      value: ratingRange,
                      label: getRatingRangeLabel(ratingRange),
                    }
                  : null
              }
              onChange={(selectedOption) => {
                setRatingRange(selectedOption ? selectedOption.value : null);
                refetch();
              }}
              styles={customSelectStyles}
              isClearable={true}
            />
          </Box>
        </FilterContainer>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* <SearchButton variant="contained" startIcon={<SearchIcon />}>
   Apply Filters
 </SearchButton> */}

          <Button
            variant="outlined"
            startIcon={<TuneIcon />}
            onClick={handleReset}
            disabled={isLoading}
            sx={{ mt: 3 }}
          >
            Reset Filters
          </Button>
        </Box>
      </ModernPaper>

      {/* Loading State */}
      {isLoading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Typography color="error" align="center" variant="h6">
          {error.message || "An unexpected error occurred"}
        </Typography>
      )}

      {/* Results Table
      {data && data.success && (
        <Box>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Skill</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Count</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.data.map((item) => (
                  <TableRow key={item.skillName}>
                    <TableCell>{item.skillName}</TableCell>
                    <TableCell>{item.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        
          <Box display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(data.totalCount / pageSize)}
              page={currentPage}
              onChange={(event, page) => setCurrentPage(page)}
              color="primary"
            />
          </Box>
        </Box>
      )} */}

      {/* Skill Distribution Section */}
      {data && data.success && (
        <Box mt={4}>
          <Divider sx={{ mb: 3 }}>
            <Typography variant="h5" color="text.secondary">
              Comprehensive Skill Insights
            </Typography>
          </Divider>

          <SkillDistributionSection data={data} />
        </Box>
      )}


       {data && data.metadata && (
          <div className="mt-4 bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Insights Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Total Skills Analyzed</p>
                <p className="text-xl font-bold">{data.metadata.totalSkillsAnalyzed}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Avg Overall Rating</p>
                <p className="text-xl font-bold">
                  {data.metadata.averageOverallRating?.toFixed(2) || 'N/A'}
                </p>
              </div>

              {data.metadata.skillGapInsights && (
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Low Rated Skills</p>
                  <p className="text-xl font-bold">
                    {data.metadata.skillGapInsights.lowRatedSkillsCount}
                  </p>
                </div>
              )}
            </div>
          </div>
        )} 
    </Box>


  );
};

export default SkillLookup;

// // _________
// import React, { useState, useContext, useCallback } from "react";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Grid,
//   Typography,
//   Slider,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Pagination,
//   Divider,
// } from "@mui/material";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { useParams } from "react-router-dom";
// import { useQuery } from "react-query";
// import axios from "axios";
// import Select from "react-select";
// import { TestContext } from "../../../State/Function/Main";
// import { UseContext } from "../../../State/UseState/UseContext";
// import useSkillMatrixFilter from "../../../hooks/SkillMatrix/useSkillMatrixFilter";
// import { styled } from "@mui/material/styles";
// import SearchIcon from "@mui/icons-material/Search";
// import TuneIcon from "@mui/icons-material/FilterList";
// import WorkIcon from "@mui/icons-material/Work";
// import PieChartIcon from "@mui/icons-material/PieChart";
// import DownloadIcon from "@mui/icons-material/Download";
// import FilterListIcon from "@mui/icons-material/FilterList";
// import PeopleIcon from "@mui/icons-material/People";
// import StarIcon from "@mui/icons-material/Star";
// import StarBorderIcon from "@mui/icons-material/StarBorder";

// // Custom Select Styles
// const customSelectStyles = {
//   control: (provided) => ({
//     ...provided,
//     borderColor: "#d1d5db",
//     boxShadow: "none",
//     "&:hover": { borderColor: "#4f46e5" },
//     backgroundColor: "#ffffff",
//     borderRadius: "8px",
//     padding: "2px",
//   }),
//   menu: (provided) => ({
//     ...provided,
//     zIndex: 1000,
//     position: "absolute",
//     borderRadius: "8px",
//     boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
//   }),
// };
// const FilterContainer = styled(Box)(({ theme }) => ({
//   display: "flex",
//   flexWrap: "wrap",
//   gap: theme.spacing(2),
//   marginBottom: theme.spacing(3),
// }));

// const ModernPaper = styled(Paper)(({ theme }) => ({
//   borderRadius: 12,
//   boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//   padding: theme.spacing(3),
//   backgroundColor: "#ffffff",
// }));

// // Skill Distribution Section Component
// const SkillDistributionSection = ({ data , locations, 
//   department, 
//   manager }) => {
//   // Transform data for chart
//   const chartData = data.data.map((item) => ({
//     //old is gold
//     // name: item.skillName,
//     name: item.skillName || item.city || item.departmentName || item.managerName,
//     employees: item.count,
//     averageRating: item.averageRating ? item.averageRating.toFixed(2) : "N/A",
//   }));

//   return (
//     <Grid container spacing={3}>
//       {/* Table Section */}
//       <Grid item xs={12} md={6}>
//         <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
//           <Box display="flex" alignItems="center" mb={2}>
//             <WorkIcon sx={{ mr: 2, color: "primary.main" }} />
//             <Typography variant="h6" fontWeight="bold">
//               {/* //old is gold */}
//               {/* Skill Distribution */}
//               {locations ? Skills in ${locations} : 
//                department ? Skills in ${department} : 
//                manager ? Skills under ${manager} : 
//                "Skill Distribution"}

//             </Typography>
//           </Box>
//           <Typography variant="subtitle2" color="text.secondary" mb={2}>
//              {/* //old is gold */}
//             {/* Detailed breakdown of skills across the organization */}
//             Detailed breakdown of skills 
//             {locations ?  in ${locations} : 
//              department ?  in ${department} : 
//              manager ?  under ${manager} : 
//              " across the organization"}

//           </Typography>

//           <TableContainer component={Paper} variant="outlined">
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>
//                      {/* //old is gold */}
//                     {/* <Typography fontWeight="bold">Skill</Typography> */}

//                     <Typography fontWeight="bold">
//                       {locations ? "Skill" : 
//                        department ? "Skill" : 
//                        manager ? "Skill" : 
//                        "Skill"}
//                     </Typography>
//                   </TableCell>
//                   <TableCell align="center">
//                     <Typography fontWeight="bold">Employees</Typography>
//                   </TableCell>

//                   <TableCell align="right">
//                     <Typography fontWeight="bold">Average Rating</Typography>
//                   </TableCell>

//                   {/* <TableCell>
// //             <Box display="flex" alignItems="center">
// //               <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
// //               <Typography variant="body1" color="">
// //                 {item.count} Employees
// //               </Typography>
// //             </Box>
// //           </TableCell> */}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {data.data.map((item) => (
//                   <TableRow key={item.skillName}>
//                     <TableCell>{item.skillName}</TableCell>

//                     <TableCell align="center">
//                       <PeopleIcon sx={{ mr: 1, color: "primary.main" }} />
//                       {item.count}
//                     </TableCell>

//                     <TableCell align="right">
//                     <StarIcon sx={{ color: "gold", mr: 1 }} />
//                       {item.averageRating ? item.averageRating.toFixed(2) : 'N/A'}
//                     </TableCell>

//                     {/* <TableCell align="right">
//                       <Box
//                         display="flex"
//                         alignItems="center"
//                         justifyContent="flex-end"
//                       >
//                         {item.averageRating ? (
//                           <>
//                             <StarIcon sx={{ color: "gold", mr: 1 }} />
//                             {item.averageRating.toFixed(2)}
//                           </>
//                         ) : (
//                           <>
//                             <StarBorderIcon sx={{ color: "gray", mr: 1 }} />
//                             N/A
//                           </>
//                         )}
//                       </Box>
//                     </TableCell> */}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Paper>
//       </Grid>

//       {/* Chart Section */}
//       <Grid item xs={12} md={6}>
//         <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
//           <Box display="flex" alignItems="center" mb={2}>
//             <PieChartIcon sx={{ mr: 2, color: "primary.main" }} />
//             <Typography variant="h6" fontWeight="bold">
//               Skill Distribution Chart
//             </Typography>
//           </Box>
//           <Typography variant="subtitle2" color="text.secondary" mb={2}>
//             Visual representation of skill distribution
//           </Typography>

//           <ResponsiveContainer width="100%" height={400}>
//             <BarChart data={chartData}>
//               <XAxis dataKey="name" />
//               <YAxis />
//               {/* <Tooltip /> */}
//               <Tooltip
//                 formatter={(value, name, props) => {
//                   if (name === "employees") return [value, "Employees"];
//                   if (name === "averageRating") return [value, "Avg Rating"];
//                   return [value, name];
//                 }}
//               />
//               <Legend />
//               {/* <Bar dataKey="employees" fill="#8884d8" barSize={30} /> */}

//               <Bar
//                 dataKey="employees"
//                 fill="#8884d8"
//                 barSize={30}
//                 name="Employees"
//               />
//               <Bar
//                 dataKey="averageRating"
//                 fill="#82ca9d"
//                 barSize={30}
//                 name="Avg Rating"
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </Paper>
//       </Grid>
//     </Grid>
//   );
// };

// // Main SkillLookup Component
// const SkillLookup = () => {
//   // Context hooks
//   const { handleAlert } = useContext(TestContext);
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];

//   // URL Params
//   const { organisationId } = useParams();

//   // Local state for filters
//   const [skill, setSkill] = useState("");
//   const [rating, setRating] = useState([0, 5]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [ratingRange, setRatingRange] = useState(null);
//   const pageSize = 10;

//   // Use custom filter hook
//   const {
//     department,
//     setDepartment,
//     manager,
//     setManager,
//     locations,
//     setLocations,
//     Departmentoptions,
//     managerOptions,
//     locationOptions,
//   } = useSkillMatrixFilter(organisationId);

//   // Export handler
//   // Update export handler
//   const handleExport = () => {
//     const convertToCSV = (data) => {
//       const headers = ["Skill", "Employees", "Average Rating"];
//       const csvRows = data.map(
//         (item) =>
//           ${item.skillName},${item.count},${
//             item.averageRating ? item.averageRating.toFixed(2) : "N/A"
//           }
//       );
//       return [headers.join(","), ...csvRows].join("\n");
//     };

//     const csvData = convertToCSV(data.data);
//     const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);

//     link.setAttribute("href", url);
//     link.setAttribute("download", "skill_insights.csv");
//     link.style.visibility = "hidden";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Fetch skills data query
//   const fetchSkillsData = useCallback(async () => {
//     try {
//       console.log("Fetching skills data with filters:", {
//         skillName: skill,
//         departmentId: department,
//         managerId: manager,
//         city: locations,
//         ratingRange: ratingRange,
//         page: currentPage,
//         pageSize,
//       });

//       const response = await axios.get(
//         ${process.env.REACT_APP_API}/route/assessments/${organisationId}/getInsights,
//         {
//           headers: { Authorization: authToken },
//           params: {
//             skillName: skill || undefined,
//             departmentId: department || undefined,
//             managerId: manager || undefined,
//             city: locations || undefined,
//             ratingRange: ratingRange || undefined, // Pass rating range
//             page: currentPage,
//             pageSize,
//             includeDetails: true,
//             groupBy: locations ? 'city' : 
//                      department ? 'department' : 
//                      manager ? 'manager' : 'skill'

//           },
//         }
//       );

//       console.log("Skill data response:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching skills data:", error);
//       handleAlert(false, "error", "Failed to fetch skills data");
//       throw error;
//     }
//   }, [
//     skill,
//     department,
//     manager,
//     ratingRange,
//     locations,
//     currentPage,
//     organisationId,
//     authToken,
//     handleAlert,
//   ]);

//   // Use React Query for data fetching
//   const { data, isLoading, error, refetch } = useQuery(
//     [
//       "skillsData",
//       skill,
//       department,
//       manager,
//       locations,
//       ratingRange,
//       currentPage,
//     ],
//     fetchSkillsData,
//     {
//       keepPreviousData: true,
//       retry: 1,
//       onError: (error) => {
//         console.error("Query error:", error);
//         handleAlert(false, "error", error.message || "An error occurred");
//       },
//     }
//   );

//   const getRatingRangeLabel = (range) => {
//     switch (range) {
//       case "0-2":
//         return "Beginner (0-2)";
//       case "2-4":
//         return "Intermediate (2-4)";
//       case "4-5":
//         return "Expert (4-5)";
//       default:
//         return "";
//     }
//   };
//   // Search handler
//   const handleSearch = () => {
//     if (rating[0] > rating[1]) {
//       handleAlert(false, "warning", "Invalid rating range!");
//       return;
//     }
//     refetch();
//   };

//   // Reset handler
//   const handleReset = () => {
//     setSkill("");
//     setDepartment("");
//     setManager("");
//     setLocations("");
//     setRatingRange(null);
//     setCurrentPage(1);
//     refetch();
//   };

  

//   return (
//     <Box sx={{ padding: 3 }}>
//       <div className="flex justify-between items-center mb-6">
//         <div>
//         {/* h1.lg:text-2xl.sm:text-lg.text-base.!font-sans.leading-none.text- */}
//           <h1 className="text-2xl text-gray-700  font-semibold  ">Skill Lookup</h1>
//           <p className="mt-1 text-sm text-gray-500">
//             Analyze and track skill distribution across your organization
//           </p>
//         </div>
//         <div className="flex space-x-4">
//           <Button
//             variant="contained"
//             startIcon={<DownloadIcon />}
//             onClick={handleExport}
//           >
//             Export Data
//           </Button>
//         </div>
//       </div>
//       {/* Filters Grid */}
//       <ModernPaper>
//         {/* Filters */}

//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center space-x-2">
//             <TuneIcon className="h-5 w-5 text-gray-400" />
//             <h3 className="text-lg font-medium text-gray-900">Filters</h3>
//           </div>
//         </div>

//         <Box sx={{ flex: 1, minWidth: 200 }}>
//           <Typography
//             variant="subtitle2"
//             sx={{ mb: 1 }}
//             className="text-gray-800 "
//           >
//             Skills
//           </Typography>
//           <TextField
//             label="Search skills (eg.ReactJs, NodeJs)"
//             value={skill}
//             onChange={(e) => setSkill(e.target.value)}
//             fullWidth
//             size="small"
//             styles={customSelectStyles}
//             sx={{ mb: 1 }}
//             className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
//           />
//         </Box>

//         <FilterContainer sx={{ mb: 1 }}>
//           {/* Skill Filter */}

//           {/* Department Filter */}
//           <Box sx={{ flex: 1, minWidth: 200 }}>
//             <Typography variant="subtitle2" sx={{ mb: 1 }}>
//               Department
//             </Typography>
//             <Select
//               placeholder=" All Departments"
//               options={Departmentoptions}
//               value={
//                 department
//                   ? Departmentoptions?.find((opt) => opt.value === department)
//                   : null
//               }
//               onChange={(selectedOption) => {
//                 console.log("Ap Selected Department:", selectedOption);
//                 setDepartment(selectedOption ? selectedOption.value : "");
//               }}
//               styles={customSelectStyles}
//               isClearable={true}
//               noOptionsMessage={() => "No locations found"}
//             />
//           </Box>

//           {/* Manager Filter */}
//           <Box sx={{ flex: 1, minWidth: 200 }}>
//             <Typography variant="subtitle2" sx={{ mb: 1 }}>
//               Manager
//             </Typography>
//             <Select
//               placeholder=" All Managers"
//               options={managerOptions}
//               value={
//                 manager
//                   ? managerOptions?.find((opt) => opt.value === manager)
//                   : null
//               }
//               onChange={(selectedOption) => {
//                 console.log(" Ap Selected Manager:", selectedOption);
//                 setManager(selectedOption ? selectedOption.value : "");
//               }}
//               styles={customSelectStyles}
//               isClearable={true}
//               noOptionsMessage={() => "No locations found"}
//             />
//           </Box>

//           {/* Location Filter */}
//           <Box sx={{ flex: 1, minWidth: 200 }}>
//             <Typography variant="subtitle2" sx={{ mb: 1 }}>
//               Location
//             </Typography>
//             <Select
//               placeholder=" All  Locations"
//               options={locationOptions}
//               value={
//                 locations
//                   ? locationOptions?.find((opt) => opt.value === locations) ||
//                     null
//                   : null
//               }
//               onChange={(selectedOption) => {
//                 console.log("Selected Location:", selectedOption);

//                 // Log additional details for debugging
//                 console.log("Location Option Details:", {
//                   value: selectedOption?.value,
//                   label: selectedOption?.label,
//                   fullObject: selectedOption,
//                 });

//                 // Set locations with null check and fallback
//                 setLocations(selectedOption ? selectedOption.value : "");
//                 refetch();
//               }}
//               styles={customSelectStyles}
//               isClearable={true}
//               noOptionsMessage={() => "No locations found"}
//             />
//           </Box>

//           {/* Rating Slider or Range Filter */}
//           {/* slider */}
//           {/* Rating Filter */}
//           {/* <Grid item xs={12} sm={6} md={2}>
//  <Typography>Rating Range</Typography>
//  <Slider
//    value={rating}
//    onChange={(e, newValue) => setRating(newValue)}
//    min={0}
//    max={5}
//    step={0.1}
//    valueLabelDisplay="auto"
//  />
// </Grid> */}
//           <Box sx={{ flex: 1, minWidth: 200 }}>
//             <Typography variant="subtitle2" sx={{ mb: 1 }}>
//               Average Skill Rating
//             </Typography>
//             {/* <Select
//               placeholder="Select rating range"
//               options={[
//                 { value: "0-2", label: "Beginner (0-2)" },
//                 { value: "2-4", label: "Intermediate (2-4)" },
//                 { value: "4-5", label: "Expert (4-5)" },
//               ]}
//               styles={customSelectStyles}
//             /> */}

//             {/* // Update rating range select */}
//             <Select
//               placeholder="Select rating range"
//               options={[
//                 { value: "0-2", label: "Beginner (0-2)" },
//                 { value: "2-4", label: "Intermediate (2-4)" },
//                 { value: "4-5", label: "Expert (4-5)" },
//               ]}
//               value={
//                 ratingRange
//                   ? {
//                       value: ratingRange,
//                       label: getRatingRangeLabel(ratingRange),
//                     }
//                   : null
//               }
//               onChange={(selectedOption) => {
//                 setRatingRange(selectedOption ? selectedOption.value : null);
//                 refetch();
//               }}
//               styles={customSelectStyles}
//               isClearable={true}
//             />
//           </Box>
//         </FilterContainer>

//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           {/* <SearchButton variant="contained" startIcon={<SearchIcon />}>
//    Apply Filters
//  </SearchButton> */}

//           <Button
//             variant="outlined"
//             startIcon={<TuneIcon />}
//             onClick={handleReset}
//             disabled={isLoading}
//             sx={{ mt: 3 }}
//           >
//             Reset Filters
//           </Button>
//         </Box>
//       </ModernPaper>

//       {/* Loading State */}
//       {isLoading && (
//         <Box display="flex" justifyContent="center" my={4}>
//           <CircularProgress />
//         </Box>
//       )}

//       {/* Error State */}
//       {error && (
//         <Typography color="error" align="center" variant="h6">
//           {error.message || "An unexpected error occurred"}
//         </Typography>
//       )}

//       {/* Results Table
//       {data && data.success && (
//         <Box>
//           <TableContainer component={Paper} sx={{ mb: 3 }}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>
//                     <strong>Skill</strong>
//                   </TableCell>
//                   <TableCell>
//                     <strong>Count</strong>
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {data.data.map((item) => (
//                   <TableRow key={item.skillName}>
//                     <TableCell>{item.skillName}</TableCell>
//                     <TableCell>{item.count}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>

        
//           <Box display="flex" justifyContent="center">
//             <Pagination
//               count={Math.ceil(data.totalCount / pageSize)}
//               page={currentPage}
//               onChange={(event, page) => setCurrentPage(page)}
//               color="primary"
//             />
//           </Box>
//         </Box>
//       )} */}

//       {/* Skill Distribution Section */}
//       {data && data.success && (
//         <Box mt={4}>
//           <Divider sx={{ mb: 3 }}>
//             <Typography variant="h5" color="text.secondary">
//               Comprehensive Skill Insights
//             </Typography>
//           </Divider>

//           <SkillDistributionSection data={data} />
//         </Box>
//       )}


//        {data && data.metadata && (
//           <div className="mt-4 bg-white shadow rounded-lg p-4">
//             <h3 className="text-lg font-semibold mb-2">Insights Summary</h3>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <div className="bg-gray-100 p-3 rounded-lg">
//                 <p className="text-sm text-gray-600">Total Skills Analyzed</p>
//                 <p className="text-xl font-bold">{data.metadata.totalSkillsAnalyzed}</p>
//               </div>
//               <div className="bg-gray-100 p-3 rounded-lg">
//                 <p className="text-sm text-gray-600">Avg Overall Rating</p>
//                 <p className="text-xl font-bold">
//                   {data.metadata.averageOverallRating?.toFixed(2) || 'N/A'}
//                 </p>
//               </div>

//               {data.metadata.skillGapInsights && (
//                 <div className="bg-gray-100 p-3 rounded-lg">
//                   <p className="text-sm text-gray-600">Low Rated Skills</p>
//                   <p className="text-xl font-bold">
//                     {data.metadata.skillGapInsights.lowRatedSkillsCount}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )} 
//     </Box>


//   );
// };

// export default SkillLookup;