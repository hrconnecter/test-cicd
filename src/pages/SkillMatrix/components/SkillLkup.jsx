// import {
//   Box,
//   Button,
//   CircularProgress,
//   Grid,
//   Typography,
//   Slider,
//   TextField,
//   Stack,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   LinearProgress,
// } from "@mui/material";
// import axios from "axios";
// import React, { useContext, useState } from "react";
// import { useQuery } from "react-query";
// import { TestContext } from "../../../State/Function/Main";
// import { UseContext } from "../../../State/UseState/UseContext";
// import { useParams } from "react-router-dom";
// const SkillLookup = () => {
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { handleAlert } = useContext(TestContext);
//   const { organisationId } = useParams();

//   // Filters
//   const [skill, setSkill] = useState("");
//   const [city, setCity] = useState("");
//   const [managerId, setManagerId] = useState("");
//   const [departmentId, setDepartmentId] = useState("");
//   const [rating, setRating] = useState([0, 5]);
//   const [selectedSkill, setSelectedSkill] = useState("");
//   const [selectedCity, setSelectedCity] = useState("");
//   const [selectedDepartment, setSelectedDepartment] = useState("");
//   const [selectedManager, setSelectedManager] = useState("");
  

//   // Fetch skills data
//   const { data, isLoading, refetch } = useQuery(
//     ["skillsData", city, skill, managerId, departmentId, rating],
//     async () => {

//       console.log('Sending filters:', {
//         city,
//         managerId,
//         departmentId,
//         skillName: skill,
//         minRating: rating[0],
//         maxRating: rating[1],
//         clickedSkill: selectedSkill,
//         clickedDepartment: selectedDepartment,
//         clickedCity: selectedCity,
//         clickedManager: selectedManager
//       });
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/assessments`,
//         {
//           headers: { Authorization: authToken },
//           params: {
//             city,
//             managerId,
//             departmentId,
//             skillName: skill,
//             minRating: rating[0],
//             maxRating: rating[1],
//             // clickedSkill: selectedSkill, 
//             // clickedDepartment: selectedDepartment, // Pass specific clicked department
//             // clickedCity: selectedCity, // Pass specific clicked city
//             // clickedManager: selectedManager, // Pass specific clicked manager
//             filterType: "skill",  // Filter by skill, department, manager, or city
//           },
//         }
//       );
//       console.log('Backend response:', response.data);
//       return response.data;
      
//     },
//     { enabled: true }
//   );

//   const handleSearch = () => {
//     console.log("Refetching with filters:", { skill, city, managerId, departmentId, rating });
//     refetch();
//   };

//     const fetchManagerId = async (managerName) => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/employee/getAllManager/${organisationId}`,
//         {
//           headers: { Authorization: authToken },
//           params: { managerName }
//         }
//       );
//       if (response.data.success && response.data.managers.length > 0) {
//         setManagerId(response.data.managers[0]._id);
//       }
//     } catch (error) {
//       console.error("Error fetching manager ID:", error);
//     }
//   };
  
//   // Fetch Department IDs
//   const fetchDepartmentId = async (departmentName) => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/location/getOrganizationLocations/${organisationId}`,
//         {
//           headers: { Authorization: authToken },
//           params: { departmentName }
//         }
//       );
//       if (response.data.success && response.data.departments.length > 0) {
//         setDepartmentId(response.data.departments[0]._id);
//       }
//     } catch (error) {
//       console.error("Error fetching department ID:", error);
//     }
//   };

//  useEffect(() => {
//   fetchManagerId(),
//   fetchDepartmentId(),
   
//   }, [organisationId]);

//   return (
//     <Box sx={{ padding: 3 }}>
//       <Typography variant="h5" sx={{ mb: 2 }}>
//         Skill Lookup
//       </Typography>

//       {/* Filters */}
//       <Grid container spacing={2} sx={{ mb: 3 }}>
//         <Grid item xs={12} sm={6} md={2}>
//           <TextField
//             label="Skill"
//             value={skill}
//             onChange={(e) => setSkill(e.target.value)}
//             fullWidth
//             size="small"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <TextField
//             label="City"
//             value={city}
//             onChange={(e) => setCity(e.target.value)}
//             fullWidth
//             size="small"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <TextField
//             label="Manager"
//             value={selectedManager}
//             onChange={(e) => setSelectedManager(e.target.value)}
//             fullWidth
//             size="small"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <TextField
//             label="Department"
//             value={selectedDepartment}
//             onChange={(e) => setSelectedDepartment(e.target.value)}
//             fullWidth
//             size="small"
//           />
// {/* 
// <TextField
//     label="Department"
//     select
//     value={selectedDepartment}
//     onChange={(e) => {
//       setSelectedDepartment(e.target.value);
//       // Assuming department is an object like { _id: '123', name: 'HR' }
//       handleSelectDepartment(e.target.value);
//     }}
//     fullWidth
//     size="small"
//     SelectProps={{
//       native: true,
//     }}
//   >
//     {data?.data.map((item) => 
//       item.departments.map((dept) => (
//         <option key={dept._id} value={dept._id}>
//           {dept.name}
//         </option>
//       ))
//     )}
//   </TextField> */}

//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Typography>Rating Range</Typography>
//           <Slider
//             value={rating}
//             onChange={(e, newValue) => setRating(newValue)}
//             min={0}
//             max={5}
//             step={0.1}
//             valueLabelDisplay="auto"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={1}>
//           <Button
//             variant="contained"
//             onClick={handleSearch}
//             fullWidth
//             sx={{ mt: 3 }}
//           >
//             Search
//           </Button>
//         </Grid>
//       </Grid>

      
//       {isLoading && <CircularProgress />}

    
//       {data && data.success && (
//         <Box>
//           <TableContainer component={Paper} sx={{ mb: 3 }}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>
//                     <strong>Category</strong>
//                   </TableCell>
//                   <TableCell>
//                     <strong>Employees</strong>
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {data.data.map((item) => (
//                   <TableRow key={item._id}>
//                     <TableCell>{item.key}</TableCell> {/* Skill/City/Department/Manager */}
//                     <TableCell>{item.count} People</TableCell> {/* Count */}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           {/* Skill Distribution Chart */}
//           <Box>
//             <Typography variant="h6">Skill Distribution</Typography>
//             {data.data.map((item) => (
//               <Box key={item.skill} sx={{ mb: 2 }}>
//                 <Typography>{item.skill}</Typography>
//                 <LinearProgress
//                   variant="determinate"
//                   value={(item.count / data.totalCount) * 100}
//                   sx={{ height: 10, borderRadius: 5 }}
//                 />
//                 <Typography variant="caption">
//                   {item.count} (
//                   {((item.count / data.totalCount) * 100).toFixed(1)}%)
//                 </Typography>
//               </Box>
//             ))}
//           </Box>
//         </Box>
//       )}

//       {/* Error State */}
//       {data && !data.success && (
//         <Typography color="error">{data.message}</Typography>
//       )}
//     </Box>
//   );
// };

// export default SkillLookup;

//eve1

// import {
//   Box,
//   Button,
//   CircularProgress,
//   Grid,
//   Typography,
//   Slider,
//   TextField,
//   Stack,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   LinearProgress,
// } from "@mui/material";
// import axios from "axios";
// import React, { useContext, useState, useEffect } from "react";
// import { useQuery } from "react-query";
// import { TestContext } from "../../../State/Function/Main";
// import { UseContext } from "../../../State/UseState/UseContext";
// import { useParams } from "react-router-dom";

// const SkillLookup = () => {
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { handleAlert } = useContext(TestContext);
//   const { organisationId } = useParams();

//   // Filters
//   const [skill, setSkill] = useState("");
//   const [city, setCity] = useState("");
//   const [managerId, setManagerId] = useState("");
//   const [departmentId, setDepartmentId] = useState("");
//   const [rating, setRating] = useState([0, 5]);

//   // Fetch skills data
//   const { data, isLoading, refetch } = useQuery(
//     ["skillsData", city, skill, managerId, departmentId, rating],
//     async () => {
//       console.log('Sending filters:', {
//         city,
//         managerId,
//         departmentId,
//         skillName: skill,
//         minRating: rating[0],
//         maxRating: rating[1],
//       });
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/assessments/${organisationId}/getInsights`,
//         {
//           headers: { Authorization: authToken },
//           params: {
//             // city,
//             // managerId,
//             departmentId,
//             skillName: skill,
//             // minRating: rating[0],
//             // maxRating: rating[1],
//             filterType: "skill",
//              // Filter by skill, department, manager, or city
//           },
//         }
//       );
//       console.log('Backend response:', response.data);
//       return response.data;
//     },
//   );

//   const handleSearch = () => {
//     console.log("Refetching with filters:", { skill, city, managerId, departmentId, rating });
//     refetch();
//   };

//   const fetchManagerId = async (managerName) => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/employee/getAllManager/${organisationId}`,
//         {
//           headers: { Authorization: authToken },
//           params: { managerName },
//         }
//       );
//       if (response.data.success && response.data.managers.length > 0) {
//         setManagerId(response.data.managers[0]._id);
//       }
//     } catch (error) {
//       console.error("Error fetching manager ID:", error);
//     }
//   };

//   // Fetch Department IDs
//   const fetchDepartmentId = async (departmentName) => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/location/getOrganizationLocations/${organisationId}`,
//         {
//           headers: { Authorization: authToken },
//           params: { departmentName },
//         }
//       );
//       if (response.data.success && response.data.departments.length > 0) {
//         setDepartmentId(response.data.departments[0]._id);
//       }
//     } catch (error) {
//       console.error("Error fetching department ID:", error);
//     }
//   };

//   // Fetch data on component mount or when `organisationId` changes
//   useEffect(() => {
//     fetchManagerId("");
//     fetchDepartmentId("");
//   }, [organisationId]);

//   return (
//     <Box sx={{ padding: 3 }}>
//       <Typography variant="h5" sx={{ mb: 2 }}>
//         Skill Lookup
//       </Typography>

//       {/* Filters */}
//       <Grid container spacing={2} sx={{ mb: 3 }}>
//         <Grid item xs={12} sm={6} md={2}>
//           <TextField
//             label="Skill"
//             value={skill}
//             onChange={(e) => setSkill(e.target.value)}
//             fullWidth
//             size="small"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <TextField
//             label="City"
//             value={city}
//             onChange={(e) => setCity(e.target.value)}
//             fullWidth
//             size="small"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <TextField
//             label="Manager"
//             value={managerId}
//             onChange={(e) => fetchManagerId(e.target.value)}
//             fullWidth
//             size="small"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           {/* Department Dropdown */}
//           <TextField
//             label="Department"
//             select
//             value={departmentId}
//             onChange={(e) => setDepartmentId(e.target.value)}
//             fullWidth
//             size="small"
//             SelectProps={{
//               native: true,
//             }}
//           >
//             {data?.data.map((item) =>
//               item.departments.map((dept) => (
//                 <option key={dept._id} value={dept._id}>
//                   {dept.departmentName}
//                 </option>
//               ))
//             )}
//           </TextField>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Typography>Rating Range</Typography>
//           <Slider
//             value={rating}
//             onChange={(e, newValue) => setRating(newValue)}
//             min={0}
//             max={5}
//             step={0.1}
//             valueLabelDisplay="auto"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={1}>
//           <Button variant="contained" onClick={handleSearch} fullWidth sx={{ mt: 3 }}>
//             Search
//           </Button>
//         </Grid>
//       </Grid>

//       {/* Loading state */}
//       {isLoading && <CircularProgress />}

//       {/* Display data if available */}
//       {data && data.success && (
//         <Box>
//           <TableContainer component={Paper} sx={{ mb: 3 }}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>
//                     <strong>Category</strong>
//                   </TableCell>
//                   <TableCell>
//                     <strong>Employees</strong>
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {data.data.map((item) => (
//                   <TableRow key={item._id}>
//                     <TableCell>{item.key}</TableCell> {/* Skill/City/Department/Manager */}
//                     <TableCell>{item.count} People</TableCell> {/* Count */}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           {/* Skill Distribution Chart */}
//           <Box>
//             <Typography variant="h6">Skill Distribution</Typography>
//             {data.data.map((item) => (
//               <Box key={item.skill} sx={{ mb: 2 }}>
//                 <Typography>{item.skill}</Typography>
//                 <LinearProgress
//                   variant="determinate"
//                   value={(item.count / data.totalCount) * 100}
//                   sx={{ height: 10, borderRadius: 5 }}
//                 />
//                 <Typography variant="caption">
//                   {item.count} ({((item.count / data.totalCount) * 100).toFixed(1)}%)
//                 </Typography>
//               </Box>
//             ))}
//           </Box>
//         </Box>
//       )}

//       {/* Error State */}
//       {data && !data.success && (
//         <Typography color="error">{data.message}</Typography>
//       )}
//     </Box>
//   );
// };

// export default SkillLookup;


//eve 2 
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Typography,
    Slider,
    TextField,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    LinearProgress,
    Pagination,
  } from "@mui/material";
  import axios from "axios";
  import React, { useContext, useState, useEffect } from "react";
  import { useQuery } from "react-query";
  import { TestContext } from "../../../State/Function/Main";
  import { UseContext } from "../../../State/UseState/UseContext";
  import { useParams } from "react-router-dom";
  
  const SkillLookup = () => {
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const { handleAlert } = useContext(TestContext);
    const { organisationId } = useParams();
  
    // Filters
    const [skill, setSkill] = useState("");
    const [city, setCity] = useState("");
    const [managerId, setManagerId] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [rating, setRating] = useState([0, 5]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // Number of rows per page
  
    // Fetch skills data
    const { data, isLoading, refetch, error } = useQuery(
      ["skillsData", skill, city, managerId, departmentId, rating, currentPage],
      async () => {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/assessments/${organisationId}/getInsights`,
          {
            headers: { Authorization: authToken },
            params: {
              skillName: skill || undefined,
              city: city || undefined,
              managerId: managerId || undefined,
              departmentId: departmentId || undefined,
              minRating: rating[0] || undefined,
              maxRating: rating[1] || undefined,
              page: currentPage,
              pageSize,
            },
          }
        );
        return response.data;
      },
      { keepPreviousData: true }
    );
  
    const handleSearch = () => {
      if (rating[0] > rating[1]) {
        handleAlert("Invalid rating range!");
        return;
      }
      refetch();
    };
  
    const handleReset = () => {
      setSkill("");
      setCity("");
      setManagerId("");
      setDepartmentId("");
      setRating([0, 5]);
      setCurrentPage(1);
      refetch();
    };
  
    const fetchManagerId = async (managerName) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/employee/getAllManager/${organisationId}`,
          {
            headers: { Authorization: authToken },
            params: { managerName },
          }
        );
        if (response.data.success && response.data.managers.length > 0) {
          setManagerId(response.data.managers[0]._id);
        }
      } catch (error) {
        console.error("Error fetching manager ID:", error);
      }
    };
  
    const fetchDepartmentId = async (departmentName) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/location/getOrganizationLocations/${organisationId}`,
          {
            headers: { Authorization: authToken },
            params: { departmentName },
          }
        );
        if (response.data.success && response.data.departments.length > 0) {
          setDepartmentId(response.data.departments[0]._id);
        }
      } catch (error) {
        console.error("Error fetching department ID:", error);
      }
    };
  
    useEffect(() => {
      fetchManagerId("");
      fetchDepartmentId("");
    }, [organisationId]);
  
    return (
      <Box sx={{ padding: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Skill Lookup
        </Typography>
  
        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="Skill"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="Manager"
              value={managerId}
              onChange={(e) => fetchManagerId(e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              label="Department"
              select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              fullWidth
              size="small"
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Select Department</option>
              {data?.departments?.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.departmentName}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography>Rating Range</Typography>
            <Slider
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
              min={0}
              max={5}
              step={0.1}
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={1}>
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={isLoading}
              fullWidth
              sx={{ mt: 3 }}
            >
              {isLoading ? <CircularProgress size={24} /> : "Search"}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" onClick={handleReset} fullWidth>
              Reset Filters
            </Button>
          </Grid>
        </Grid>
  
        {/* Loading state */}
        {isLoading && <CircularProgress />}
  
        {/* Error State */}
        {error && (
          <Typography color="error">
            Failed to fetch data: {error.message}
          </Typography>
        )}
  
        {/* Display data if available */}
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
  
            <Pagination
              count={Math.ceil(data.totalCount / pageSize)}
              page={currentPage}
              onChange={(event, page) => setCurrentPage(page)}
            />
          </Box>
        )}
      </Box>
    );
  };
  
  export default SkillLookup;
  
  
  
  
  // import {
  //   Box,
  //   Button,
  //   CircularProgress,
  //   Grid,
  //   Typography,
  //   Slider,
  //   TextField,
  //   Stack,
  //   Table,
  //   TableBody,
  //   TableCell,
  //   TableContainer,
  //   TableHead,
  //   TableRow,
  //   Paper,
  //   LinearProgress,
    
  // } from "@mui/material";
  // import { Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';
  // import axios from "axios";
  // import React, { useContext, useState } from "react";
  // import { useQuery } from "react-query";
  // import { TestContext } from "../../../State/Function/Main";
  // import { UseContext } from "../../../State/UseState/UseContext";
  
  // const SkillLookup = () => {
  //   const { cookies } = useContext(UseContext);
  //   const authToken = cookies["aegis"];
  //   const { handleAlert } = useContext(TestContext);
  
  //   // Filters
  //   const [skill, setSkill] = useState("");
  //   const [city, setCity] = useState(""); // Store the city
  //   const [managerId, setManagerId] = useState(""); // Store the manager ID
  //   const [departmentId, setDepartmentId] = useState(""); // Store the department ID
  //   const [rating, setRating] = useState([0, 5]);
  
  //   // Fetch skills data
  //   const { data, isLoading, refetch } = useQuery(
  //     ["skillsData", city, skill, managerId, departmentId, rating],
  //     async () => {
  //       const response = await axios.get(
  //         `${process.env.REACT_APP_API}/route/assessments`,
  //         {
  //           headers: { Authorization: authToken },
  //           params: {
  //             city, // Use the city (address) as a filter
  //             managerId, // Pass the managerId
  //             departmentId, // Pass the departmentId
  //             skillName: skill,
  //             minRating: rating[0],
  //             maxRating: rating[1],
  //             filterType: "skill",
  //           },
  //         }
  //       );
  //       return response.data;
  //     },
  //     { enabled: true }
  //   );
  
  //   // Handler for department selection
  //   const handleSelectDepartment = (department) => {
  //     setDepartmentId(department._id); // Set the department ID
  //   };
  
    
  //   const handleSelectCity = (city) => {
  //     console.log(city);
  //     setCity(city); 
  //   };
  
  
  //   const handleSelectManager = (managerId) => {
  //     setManagerId(managerId); 
  //   };
  
  //   const handleSearch = () => {
  //     refetch(); // Refetch data with the selected filters
  //   };
  
  //   return (
  //     <Box sx={{ padding: 3 }}>
  //       <Typography variant="h5" sx={{ mb: 2 }}>
  //         Skill Lookup
  //       </Typography>
  
  //       {/* Filters */}
  //       <Grid container spacing={2} sx={{ mb: 3 }}>
  //         {/* Skill filter */}
  //         <Grid item xs={12} sm={6} md={2}>
  //           <TextField
  //             label="Skill"
  //             value={skill}
  //             onChange={(e) => setSkill(e.target.value)}
  //             fullWidth
  //             size="small"
  //           />
  //         </Grid>
  
  //         {/* City filter */}
  //         <Grid item xs={12} sm={6} md={2}>
  //           <TextField
  //             label="City"
  //             value={city}
  //             onChange={(e) => handleSelectCity(e.target.value)} // Handle city selection
  //             fullWidth
  //             size="small"
  //           />
  //         </Grid>
  
  //         {/* Manager filter */}
  //         <Grid item xs={12} sm={6} md={2}>
  //           <TextField
  //             label="Manager"
  //             value={managerId}
  //             onChange={(e) => handleSelectManager(e.target.value)} 
  //             fullWidth
  //             size="small"
  //           />
  //         </Grid>
  
       
  //         <Grid item xs={12} sm={6} md={2}>
  //       <FormControl fullWidth size="small">
  //         <InputLabel>Department</InputLabel>
  //         <Select
  //           value={departmentId}
  //           onChange={(e) => handleSelectDepartment(e.target.value)} 
  //           label="Department"
  //         >
           
  //           {data?.data.map((item) =>
  //             item.departments.map((dept) => (
  //               <MenuItem key={dept._id} value={dept._id}>
  //                 {dept.departmentName}
  //               </MenuItem>
  //             ))
  //           )}
  //         </Select>
  //       </FormControl>
  //     </Grid>
  //         {/* Rating filter */}
  //         <Grid item xs={12} sm={6} md={3}>
  //           <Typography>Rating Range</Typography>
  //           <Slider
  //             value={rating}
  //             onChange={(e, newValue) => setRating(newValue)}
  //             min={0}
  //             max={5}
  //             step={0.1}
  //             valueLabelDisplay="auto"
  //           />
  //         </Grid>
  
  //         {/* Search Button */}
  //         <Grid item xs={12} sm={6} md={1}>
  //           <Button
  //             variant="contained"
  //             onClick={handleSearch}
  //             fullWidth
  //             sx={{ mt: 3 }}
  //           >
  //             Search
  //           </Button>
  //         </Grid>
  //       </Grid>
  
  //       {/* Loading State */}
  //       {isLoading && <CircularProgress />}
  
  //       {/* Display Results */}
  //       {data && data.success && (
  //         <Box>
  //           <TableContainer component={Paper} sx={{ mb: 3 }}>
  //             <Table>
  //               <TableHead>
  //                 <TableRow>
  //                   <TableCell>
  //                     <strong>Category</strong>
  //                   </TableCell>
  //                   <TableCell>
  //                     <strong>Employees</strong>
  //                   </TableCell>
  //                 </TableRow>
  //               </TableHead>
  //               <TableBody>
  //                 {data.data.map((item) => (
  //                   <TableRow key={item._id}>
  //                     <TableCell>{item.key}</TableCell> {/* Skill/City/Department/Manager */}
  //                     <TableCell>{item.count} People</TableCell> {/* Count */}
  //                   </TableRow>
  //                 ))}
  //               </TableBody>
  //             </Table>
  //           </TableContainer>
  //         </Box>
  //       )}
  
  //       {/* Error State */}
  //       {data && !data.success && (
  //         <Typography color="error">{data.message}</Typography>
  //       )}
  //     </Box>
  //   );
  // };
  
  // export default SkillLookup;
  

//   import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Search,
//   SlidersHorizontal,
//   Download,
//   BarChart2,
//   Users,
//   Award,
//   TrendingUp,
//   ChartPie,
//   Building2,
//   MapPin
// } from 'lucide-react';

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// const SkillInsights = () => {
//   const [filters, setFilters] = useState({
//     skillName: '',
//     departmentId: '',
//     managerId: '',
//     workLocationId: '',
//     rating: '',
//     overallRating: ''
//   });
  
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showAnalytics, setShowAnalytics] = useState(false);
  
//   // Mock data
//   const departments = [
//     { id: '1', name: 'Engineering' },
//     { id: '2', name: 'Design' },
//     { id: '3', name: 'Product' }
//   ];
  
//   const managers = [
//     { id: '1', name: 'John Doe' },
//     { id: '2', name: 'Jane Smith' }
//   ];
  
//   const locations = [
//     { id: '1', name: 'New York' },
//     { id: '2', name: 'London' },
//     { id: '3', name: 'Tokyo' }
//   ];

//   useEffect(() => {
//     fetchData();
//   }, [filters]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(${API_BASE_URL}/skills/insights/123, {
//         params: filters
//       });
//       setData(response.data.data);
//       setError(null);
//     } catch (err) {
//       setError(err?.response?.data?.message || 'An error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleExport = () => {
//     const csvContent = [
//       ['Skill Name', 'Employee Count', 'Average Rating', 'Department Distribution'],
//       ...data.map(item => [
//         item.skillName,
//         item.count,
//         (Math.random() * 2 + 3).toFixed(1),
//         Object.entries(item.distribution?.department || {})
//           .map(([dept, count]) => ${dept}: ${count})
//           .join('; ')
//       ])
//     ].map(row => row.join(',')).join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'skill-insights.csv';
//     a.click();
//   };

//   const renderAnalytics = () => {
//     const totalEmployees = data.reduce((sum, item) => sum + item.count, 0);
//     const avgRating = 4.2; // Mock value
//     const topSkills = data.slice(0, 5);

//     return (
//       <div className="space-y-6 mt-6">
//         {/* Analytics Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <div className="flex items-center">
//               <Users className="h-10 w-10 text-blue-500" />
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-500">Total Employees</p>
//                 <h3 className="text-2xl font-bold text-gray-900">{totalEmployees}</h3>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <div className="flex items-center">
//               <Award className="h-10 w-10 text-yellow-500" />
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-500">Average Rating</p>
//                 <h3 className="text-2xl font-bold text-gray-900">{avgRating}</h3>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <div className="flex items-center">
//               <ChartPie className="h-10 w-10 text-green-500" />
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-500">Unique Skills</p>
//                 <h3 className="text-2xl font-bold text-gray-900">{data.length}</h3>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <div className="flex items-center">
//               <TrendingUp className="h-10 w-10 text-purple-500" />
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-500">Growth Rate</p>
//                 <h3 className="text-2xl font-bold text-gray-900">+15%</h3>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Detailed Analytics */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Top Skills Chart */}
//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Top Skills Distribution</h3>
//             <div className="space-y-4">
//               {topSkills.map((skill, index) => (
//                 <div key={skill.skillName}>
//                   <div className="flex justify-between items-center mb-1">
//                     <div className="flex items-center">
//                       <span className="w-4 text-sm text-gray-600">{index + 1}.</span>
//                       <span className="ml-2 text-sm font-medium text-gray-600">
//                         {skill.skillName}
//                       </span>
//                     </div>
//                     <span className="text-sm text-gray-500">
//                       {((skill.count / totalEmployees) * 100).toFixed(1)}%
//                     </span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div
//                       className="bg-blue-500 h-2 rounded-full transition-all duration-500"
//                       style={{ width: ${(skill.count / totalEmployees) * 100}% }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Department Distribution */}
//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Department Distribution</h3>
//             <div className="space-y-4">
//               {departments.map((dept) => {
//                 const deptCount = Math.floor(Math.random() * totalEmployees);
//                 return (
//                   <div key={dept.id}>
//                     <div className="flex justify-between items-center mb-1">
//                       <span className="text-sm font-medium text-gray-600">{dept.name}</span>
//                       <span className="text-sm text-gray-500">
//                         {deptCount} employees
//                       </span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div
//                         className="bg-green-500 h-2 rounded-full transition-all duration-500"
//                         style={{ width: ${(deptCount / totalEmployees) * 100}% }}
//                       />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Location Distribution */}
//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">
//               Location Distribution
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {locations.map((location) => {
//                 const locationCount = Math.floor(Math.random() * totalEmployees);
//                 return (
//                   <div key={location.id} className="bg-gray-50 p-4 rounded-lg">
//                     <div className="flex items-center mb-2">
//                       <MapPin className="h-4 w-4 text-gray-400 mr-2" />
//                       <span className="text-sm font-medium text-gray-600">
//                         {location.name}
//                       </span>
//                     </div>
//                     <div className="text-2xl font-bold text-gray-900">
//                       {locationCount}
//                     </div>
//                     <div className="text-sm text-gray-500">employees</div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Skill Growth Trends */}
//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">
//               Skill Growth Trends
//             </h3>
//             <div className="space-y-4">
//               {topSkills.map((skill) => {
//                 const growth = Math.floor(Math.random() * 30);
//                 const isPositive = growth > 15;
//                 return (
//                   <div key={skill.skillName} className="flex items-center justify-between">
//                     <span className="text-sm font-medium text-gray-600">
//                       {skill.skillName}
//                     </span>
//                     <div className="flex items-center">
//                       {isPositive ? (
//                         <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
//                       ) : (
//                         <TrendingUp className="h-4 w-4 text-yellow-500 mr-1" />
//                       )}
//                       <span className={`text-sm font-medium ${
//                         isPositive ? 'text-green-500' : 'text-yellow-500'
//                       }`}>
//                         {growth}%
//                       </span>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Skill Insights</h1>
//           <p className="mt-1 text-sm text-gray-500">
//             Analyze and track skill distribution across your organization
//           </p>
//         </div>
        
//         <div className="flex space-x-4">
//           <button
//             onClick={handleExport}
//             className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//           >
//             <Download className="h-4 w-4 mr-2" />
//             Export
//           </button>
//           <button
//             onClick={() => setShowAnalytics(!showAnalytics)}
//             className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
//           >
//             <BarChart2 className="h-4 w-4 mr-2" />
//             {showAnalytics ? 'Hide Analytics' : 'View Analytics'}
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow-sm p-6">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center space-x-2">
//             <SlidersHorizontal className="h-5 w-5 text-gray-400" />
//             <h3 className="text-lg font-medium text-gray-900">Filters</h3>
//           </div>
//         </div>

//         <div className="space-y-4">
//           {/* Search Input */}
//           <div className="relative">
//             <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search skills..."
//               value={filters.skillName}
//               onChange={(e) => setFilters({ ...filters, skillName: e.target.value })}
//               className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {/* Department Filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Department
//               </label>
//               <select
//                 value={filters.departmentId}
//                 onChange={(e) => setFilters({ ...filters, departmentId: e.target.value })}
//                 className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
//               >
//                 <option value="">All Departments</option>
//                 {departments.map((dept) => (
//                   <option key={dept.id} value={dept.id}>
//                     {dept.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Manager Filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Manager
//               </label>
//               <select
//                 value={filters.managerId}
//                 onChange={(e) => setFilters({ ...filters, managerId: e.target.value })}
//                 className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
//               >
//                 <option value="">All Managers</option>
//                 {managers.map((manager) => (
//                   <option key={manager.id} value={manager.id}>
//                     {manager.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Location Filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Location
//               </label>
//               <select
//                 value={filters.workLocationId}
//                 onChange={(e) => setFilters({ ...filters, workLocationId: e.target.value })}
//                 className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
//               >
//                 <option value="">All Locations</option>
//                 {locations.map((location) => (
//                   <option key={location.id} value={location.id}>
//                     {location.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Rating Filters */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Minimum Rating
//               </label>
//               <select
//                 value={filters.rating}
//                 onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
//                 className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
//               >
//                 <option value="">Any Rating</option>
//                 {[1, 2, 3, 4, 5].map((rating) => (
//                   <option key={rating} value={rating}>
//                     {rating}+ Stars
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Overall Rating
//               </label>
//               <select
//                 value={filters.overallRating}
//                 onChange={(e) => setFilters({ ...filters, overallRating: e.target.value })}
//                 className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
//               >
//                 <option value="">Any Overall Rating</option>
//                 {[1, 2, 3, 4, 5].map((rating) => (
//                   <option key={rating} value={rating}>
//                     Up to {rating} Stars
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
//           <p className="text-sm text-red-600">{error}</p>
//         </div>
//       )}

//       {/* Results */}
//       <div className="mt-6">
//         {loading ? (
//           <div className="animate-pulse space-y-4">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="bg-gray-100 h-20 rounded-lg" />
//             ))}
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {data.map((item) => (
//               <div
//                 key={item.skillName}
//                 className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
//               >
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="text-lg font-medium text-gray-900">
//                       {item.skillName}
//                     </h3>
//                     <div className="mt-1 flex items-center text-sm text-gray-500">
//                       <Users className="h-4 w-4 mr-1" />
//                       <span>{item.count} employees</span>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <TrendingUp className="h-5 w-5 text-green-500" />
//                     <span className="text-sm font-medium text-green-500">
//                       +{Math.floor(Math.random() * 20)}%
//                     </span>
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div
//                       className="bg-blue-500 h-2 rounded-full transition-all duration-500"
//                       style={{
//                         width: ${Math.min((item.count / 100) * 100, 100)}%,
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Analytics View */}
//       {showAnalytics && renderAnalytics()}
//     </div>
//   );
// };

// export default SkillInsights;