/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */

// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
// import { useQuery, useQueryClient } from "react-query";
// import { useParams } from "react-router-dom";
// import useAuthToken from "../../../hooks/Token/useAuth";

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
// const Directory = () => {
//   const [groupedSkills, setGroupedSkills] = useState({});
//   const { organisationId } = useParams();
//   const authToken = useAuthToken();
//   const queryClient = useQueryClient();

//   // Fetch skills grouped by groupName and subGroupName
//   const fetchSkills = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching skills:", error);
//       return { data: [] };
//     }
//   };

//   const { data, isLoading, isError } = useQuery("skills", fetchSkills, {
//     refetchOnWindowFocus: false,
//   });

//   useEffect(() => {
//     if (data && data.success && Array.isArray(data.data)) {
//       // Group skills by groupName and subGroupName
//       const skillsByGroup = data.data.reduce((acc, skill) => {
//         const group = skill.groupName || "Ungrouped";
//         const subGroup = skill.subGroupName || "No Subgroup";
//         acc[group] = acc[group] || {};
//         acc[group][subGroup] = acc[group][subGroup] || [];
//         acc[group][subGroup].push(skill);
//         return acc;
//       }, {});
//       setGroupedSkills(skillsByGroup);
//     } else {
//       setGroupedSkills({});
//     }
//   }, [data]);

//   // Update the skill hierarchy after drag-and-drop
//   const updateSkills = async (updatedSkills) => {
//     try {
//       await axios.put(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills/reorder`,
//         { skills: updatedSkills },
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       queryClient.invalidateQueries("skills");
//     } catch (error) {
//       console.error("Error updating skills hierarchy:", error);
//     }
//   };

//   const onDragEnd = (result) => {
//     const { source, destination } = result;
//     if (!destination) return;
//     // Extract groupName and subGroupName from droppableId
//     const [sourceGroupName, sourceSubGroupName] = source.droppableId.split("-");
//     const [destGroupName, destSubGroupName] =
//       destination.droppableId.split("-");

//     const sourceGroup = groupedSkills[sourceGroupName];
//     const destGroup = groupedSkills[destGroupName];

//     // Ensure the group and subgroup exist
//     if (!sourceGroup || !destGroup) return;

//     let updatedSourceGroup = [...sourceGroup[sourceSubGroupName]];
//     let updatedDestGroup = [...destGroup[destSubGroupName]];

//     // Moving within the same group
//     if (source.droppableId === destination.droppableId) {
//       const [movedSkill] = updatedSourceGroup.splice(source.index, 1);
//       updatedSourceGroup.splice(destination.index, 0, movedSkill);

//       setGroupedSkills((prev) => ({
//         ...prev,
//         [sourceGroupName]: {
//           ...prev[sourceGroupName],
//           [sourceSubGroupName]: updatedSourceGroup,
//         },
//       }));
//     } else {
//       // Moving between different groups
//       const [movedSkill] = updatedSourceGroup.splice(source.index, 1);
//       updatedDestGroup.splice(destination.index, 0, movedSkill);

//       setGroupedSkills((prev) => ({
//         ...prev,
//         [sourceGroupName]: {
//           ...prev[sourceGroupName],
//           [sourceSubGroupName]: updatedSourceGroup,
//         },
//         [destGroupName]: {
//           ...prev[destGroupName],
//           [destSubGroupName]: updatedDestGroup,
//         },
//       }));
//     }

//     // Prepare updated skills list to be sent to the backend
//     const updatedSkills = [
//       ...updatedSourceGroup.map((skill, index) => ({
//         ...skill,
//         position: index,
//         groupName: sourceGroupName,
//         subGroupName: sourceSubGroupName,
//       })),
//       ...updatedDestGroup.map((skill, index) => ({
//         ...skill,
//         position: index,
//         groupName: destGroupName,
//         subGroupName: destSubGroupName,
//       })),
//     ];

//     // Call the backend to update skill order
//     updateSkills(updatedSkills);
//   };

//   if (isLoading) return <p>Loading...</p>;
//   if (isError) return <p>Error loading skills.</p>;

//   return (
//     <Box sx={{ padding: 3 }}>
//       <div className=" mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Skill Directory</h1>
//         <p className="mt-1 text-sm text-gray-500">
//           Manage skills Directories and hierarchy
//         </p>
//       </div>
//       <div>
//         <DragDropContext onDragEnd={onDragEnd}>
//           {Object.keys(groupedSkills).map((group) => (
//             <div key={group} style={{ marginBottom: "20px" }}>
//               <h3 style={{ fontSize: "1.5rem", color: "#333" }}>{group}</h3>
//               {Object.keys(groupedSkills[group]).map((subGroup) => (
//                 <Droppable key={subGroup} droppableId={`${group}-${subGroup}`}>
//                   {(provided) => (
//                     <div
//                       style={{
//                         padding: "10px",
//                         border: "1px solid #ddd",
//                         borderRadius: "5px",
//                         backgroundColor: "#f9f9f9",
//                       }}
//                       ref={provided.innerRef}
//                       {...provided.droppableProps}
//                     >
//                       <h4 style={{ fontSize: "1.2rem", color: "#555" }}>
//                         {subGroup}
//                       </h4>
//                       <ul
//                         style={{
//                           listStyle: "none",
//                           padding: 0,
//                           margin: 0,
//                         }}
//                       >
//                         {groupedSkills[group][subGroup].map((skill, index) => (
//                           <Draggable
//                             key={skill._id}
//                             draggableId={skill._id}
//                             index={index}
//                           >
//                             {(provided) => (
//                               <li
//                                 ref={provided.innerRef}
//                                 {...provided.draggableProps}
//                                 {...provided.dragHandleProps}
//                                 style={{
//                                   padding: "8px",
//                                   margin: "4px 0",
//                                   backgroundColor: "#f0f0f0",
//                                   borderRadius: "4px",
//                                   cursor: "move",
//                                   ...provided.draggableProps.style,
//                                 }}
//                               >
//                                 {skill.skillName}
//                               </li>
//                             )}
//                           </Draggable>
//                         ))}
//                         {provided.placeholder}
//                       </ul>
//                     </div>
//                   )}
//                 </Droppable>
//               ))}
//             </div>
//           ))}
//         </DragDropContext>
//       </div>
//     </Box>
//   );
// };

// export default Directory;

// import React, { useEffect, useState } from "react";
// import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
// import { useQuery, useQueryClient } from "react-query";
// import { useParams } from "react-router-dom";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import axios from "axios";

// import {
//   Box,
//   Typography,
//   Paper,
//   Grid,
//   IconButton,
//   Tooltip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   TextField,
//   Button,
// } from "@mui/material";
// import {
//   Add as AddIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   DragHandle as DragHandleIcon,
// } from "@mui/icons-material";

// const Directory = () => {
//   const [groupedSkills, setGroupedSkills] = useState({});
//   const [openAddGroupModal, setOpenAddGroupModal] = useState(false);
//   const [newGroupName, setNewGroupName] = useState("");

//   const { organisationId } = useParams();
//   const authToken = useAuthToken();
//   const queryClient = useQueryClient();

//   const fetchSkills = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills`,
//         { headers: { Authorization: authToken } }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching skills:", error);
//       return { data: [], success: false };
//     }
//   };

//   const { data, isLoading, isError } = useQuery("skills", fetchSkills, {
//     refetchOnWindowFocus: false,
//   });

//   useEffect(() => {
//     if (data && data.success && Array.isArray(data.data)) {
//       const skillsByGroup = data.data.reduce((acc, skill) => {
//         const group = skill.groupName || "Ungrouped";
//         const subGroup = skill.subGroupName || "No Subgroup";

//         // Ensure the group and subgroup exist
//         if (!acc[group]) acc[group] = {};
//         if (!acc[group][subGroup]) acc[group][subGroup] = [];

//         acc[group][subGroup].push(skill);
//         return acc;
//       }, {});

//       // Ensure at least one subgroup exists for each group
//       Object.keys(skillsByGroup).forEach((group) => {
//         if (Object.keys(skillsByGroup[group]).length === 0) {
//           skillsByGroup[group]["No Subgroup"] = [];
//         }
//       });

//       setGroupedSkills(skillsByGroup);
//     } else {
//       setGroupedSkills({});
//     }
//   }, [data]);

//   const onDragEnd = (result) => {
//     const { source, destination } = result;
//     if (!destination) return;

//     const [sourceGroupName, sourceSubGroupName] = source.droppableId.split("-");
//     const [destGroupName, destSubGroupName] =
//       destination.droppableId.split("-");

//     // Create a deep copy of groupedSkills to avoid direct mutation
//     const updatedGroupedSkills = JSON.parse(JSON.stringify(groupedSkills));

//     // Ensure source and destination groups and subgroups exist
//     if (!updatedGroupedSkills[sourceGroupName]) return;
//     if (!updatedGroupedSkills[sourceGroupName][sourceSubGroupName]) return;
//     if (!updatedGroupedSkills[destGroupName]) return;
//     if (!updatedGroupedSkills[destGroupName][destSubGroupName]) return;

//     const sourceSkills =
//       updatedGroupedSkills[sourceGroupName][sourceSubGroupName];
//     const destSkills = updatedGroupedSkills[destGroupName][destSubGroupName];

//     const [movedSkill] = sourceSkills.splice(source.index, 1);
//     destSkills.splice(destination.index, 0, movedSkill);

//     setGroupedSkills(updatedGroupedSkills);
//   };

//   const handleAddGroup = () => {
//     if (newGroupName.trim()) {
//       setGroupedSkills((prev) => ({
//         ...prev,
//         [newGroupName]: { "No Subgroup": [] },
//       }));
//       setNewGroupName("");
//       setOpenAddGroupModal(false);
//     }
//   };

//   if (isLoading) return <Typography>Loading skills...</Typography>;
//   if (isError)
//     return <Typography color="error">Error loading skills</Typography>;

//   return (
//     <Box sx={{ padding: 3 }}>
//       <Box
//         sx={{
//           marginBottom: 3,
//         }}
//       >
//         <div className=" mb-6">
//           {" "}
//           <h1 className="text-2xl font-bold text-gray-900">
//             Skill Directory
//           </h1>{" "}
//           <p className="mt-1 text-sm text-gray-500">
//             Manage skills Directories and hierarchy{" "}
//           </p>{" "}
//         </div>

//         <Tooltip title="Add New Skill Group">
//           <IconButton
//             color="primary"
//             onClick={() => setOpenAddGroupModal(true)}
//           >
//             <AddIcon />
//           </IconButton>
//         </Tooltip>
//       </Box>

//       <DragDropContext onDragEnd={onDragEnd}>
//         <Grid container spacing={3}>
//           {Object.keys(groupedSkills).map((group) => (
//             <Grid item xs={12} md={4} key={group}>
//               <Paper
//                 elevation={3}
//                 sx={{
//                   padding: 2,
//                   borderRadius: 2,
//                   backgroundColor: "#f9f9f9",
//                 }}
//               >
//                 <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
//                   {group}
//                 </Typography>

//                 {Object.keys(groupedSkills[group]).map((subGroup) => (
//                   <Droppable
//                     key={`${group}-${subGroup}`}
//                     droppableId={`${group}-${subGroup}`}
//                   >
//                     {(provided) => (
//                       <Box
//                         ref={provided.innerRef}
//                         {...provided.droppableProps}
//                         sx={{ mb: 2 }}
//                       >
//                         {subGroup !== "No Subgroup" && (
//                           <Typography
//                             variant="subtitle2"
//                             color="text.secondary"
//                             sx={{ mb: 1 }}
//                           >
//                             {subGroup}
//                           </Typography>
//                         )}

//                         {groupedSkills[group][subGroup].map((skill, index) => (
//                           <Draggable
//                             key={skill._id}
//                             draggableId={skill._id}
//                             index={index}
//                           >
//                             {(provided) => (
//                               <Paper
//                                 ref={provided.innerRef}
//                                 {...provided.draggableProps}
//                                 elevation={2}
//                                 sx={{

//                                   padding: 1,
//                                   marginBottom: 1,
//                                   backgroundColor: "white",
//                                 }}
//                               >
//                                 <Box
//                                   {...provided.dragHandleProps}
//                                   sx={{ marginRight: 2 }}
//                                 >
//                                   <DragHandleIcon color="action" />
//                                 </Box>
//                                 <Typography flex={1}>
//                                   {skill.skillName}
//                                 </Typography>
//                               </Paper>
//                             )}
//                           </Draggable>
//                         ))}
//                         {provided.placeholder}
//                       </Box>
//                     )}
//                   </Droppable>
//                 ))}
//               </Paper>
//             </Grid>
//           ))}
//         </Grid>
//       </DragDropContext>

//       {/* Add Group Modal */}
//       <Dialog
//         open={openAddGroupModal}
//         onClose={() => setOpenAddGroupModal(false)}
//       >
//         <DialogTitle>Add New Skill Group</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Group Name"
//             fullWidth
//             value={newGroupName}
//             onChange={(e) => setNewGroupName(e.target.value)}
//           />
//           <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
//             <Button
//               onClick={() => setOpenAddGroupModal(false)}
//               color="secondary"
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleAddGroup}
//               color="primary"
//               variant="contained"
//             >

//               Add Group
//             </Button>
//           </Box>
//         </DialogContent>
//       </Dialog>
//     </Box>
//   );
// };

// export default Directory;

import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import useAuthToken from "../../../hooks/Token/useAuth";
import axios from "axios";

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragHandle as DragHandleIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";

const Directory = () => {
  const [groupedSkills, setGroupedSkills] = useState({});
  const [openAddGroupModal, setOpenAddGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [expandedGroups, setExpandedGroups] = useState({});

  const { organisationId } = useParams();
  const authToken = useAuthToken();
  const queryClient = useQueryClient();

  const fetchSkills = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills`,
        { headers: { Authorization: authToken } }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching skills:", error);
      return { data: [], success: false };
    }
  };

  const { data, isLoading, isError } = useQuery("skills", fetchSkills, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data && data.success && Array.isArray(data.data)) {
      const skillsByGroup = data.data.reduce((acc, skill) => {
        const group = skill.groupName || "Ungrouped";
        const subGroup = skill.subGroupName || "No Subgroup";

        if (!acc[group]) acc[group] = {};
        if (!acc[group][subGroup]) acc[group][subGroup] = [];

        acc[group][subGroup].push(skill);
        return acc;
      }, {});

      Object.keys(skillsByGroup).forEach((group) => {
        if (Object.keys(skillsByGroup[group]).length === 0) {
          skillsByGroup[group]["No Subgroup"] = [];
        }
      });

      setGroupedSkills(skillsByGroup);

      const initialExpandedState = Object.keys(skillsByGroup).reduce(
        (acc, group) => {
          acc[group] = false;
          return acc;
        },
        {}
      );
      setExpandedGroups(initialExpandedState);
    } else {
      setGroupedSkills({});
      setExpandedGroups({});
    }
  }, [data]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const [sourceGroupName, sourceSubGroupName] = source.droppableId.split("-");
    const [destGroupName, destSubGroupName] =
      destination.droppableId.split("-");

    const updatedGroupedSkills = JSON.parse(JSON.stringify(groupedSkills));

    if (!updatedGroupedSkills[sourceGroupName]) return;
    if (!updatedGroupedSkills[sourceGroupName][sourceSubGroupName]) return;
    if (!updatedGroupedSkills[destGroupName]) return;
    if (!updatedGroupedSkills[destGroupName][destSubGroupName]) return;

    const sourceSkills =
      updatedGroupedSkills[sourceGroupName][sourceSubGroupName];
    const destSkills = updatedGroupedSkills[destGroupName][destSubGroupName];

    const [movedSkill] = sourceSkills.splice(source.index, 1);
    destSkills.splice(destination.index, 0, movedSkill);

    setGroupedSkills(updatedGroupedSkills);
  };

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      setGroupedSkills((prev) => ({
        ...prev,
        [newGroupName]: { "No Subgroup": [] },
      }));

      setExpandedGroups((prev) => ({
        ...prev,
        [newGroupName]: false,
      }));

      setNewGroupName("");
      setOpenAddGroupModal(false);
    }
  };

  const handleGroupToggle = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  if (isLoading)
    return <div className="text-center text-gray-500">Loading skills...</div>;
  if (isError)
    return <div className="text-center text-red-500">Error loading skills</div>;

  return (
    <div className="p-4 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Skill Directory</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage skills Directories and hierarchy
        </p>
      </div>

      {/* <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => setOpenAddGroupModal(true)}
          className="text-blue-500 hover:bg-blue-50 p-2 rounded-full transition-colors"
        >
          <AddIcon />
        </button>
      </div> */}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="space-y-4">
          {Object.keys(groupedSkills).map((group) => (
            <div
              key={group}
              className="bg-white border border-gray-200 rounded-lg"
            >
              <div
                className={`p-4 cursor-pointer flex justify-between items-center ${
                  expandedGroups[group] ? "bg-gray-100" : "bg-white"
                }`}
                onClick={() => handleGroupToggle(group)}
              >
                <h2 className="text-lg font-semibold text-gray-800">{group}</h2>
                <ExpandMoreIcon
                  className={`transform transition-transform ${
                    expandedGroups[group] ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>

              {expandedGroups[group] && (
                <div className="p-4">
                  {Object.keys(groupedSkills[group]).map((subGroup) => (
                    <Droppable
                      key={`${group}-${subGroup}`}
                      droppableId={`${group}-${subGroup}`}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="mb-4"
                        >
                          {subGroup !== "No Subgroup" && (
                            <h3 className="text-sm text-gray-600 mb-2">
                              {subGroup}
                            </h3>
                          )}

                          {groupedSkills[group][subGroup].map(
                            (skill, index) => (
                              <Draggable
                                key={skill._id}
                                draggableId={skill._id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    // className="flex items-center bg-gray-50 p-2 mb-2 rounded"
                                    className={`flex items-center p-2 mb-2 rounded transition-colors duration-200 ${
                                      snapshot.isDragging
                                        ? "bg-blue-100 border-2 border-blue-400 shadow-lg" // Active dragging state
                                        : "bg-gray-50 hover:bg-gray-100" // Normal state
                                    }`}
                                  >
                                    <div
                                      {...provided.dragHandleProps}
                                      // className="mr-2 cursor-move"
                                      className="mr-2 cursor-move hover:text-blue-500"
                                    >
                                      {/* <DragHandleIcon className="text-gray-500" /> */}
                                      <DragHandleIcon
                                        className={`text-gray-500 ${
                                          snapshot.isDragging
                                            ? "text-blue-500"
                                            : ""
                                        }`}
                                      />
                                    </div>
                                    <span className="flex-1 font-medium">
                                      {skill.skillName}
                                    </span>
                                    <br />
                                    {/* <span className="ml-8 mt-1 text-sm text-gray-600">
                                      {skill.skillDescription}
                                    </span> */}
                                    <div className="ml-8 mt-1 text-sm text-gray-600">
                                      {skill.skillDescription}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            )
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Add Group Modal (unchanged) */}
      {openAddGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Skill Group</h2>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded mb-4"
              placeholder="Group Name"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setOpenAddGroupModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddGroup}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Directory;

// hierarchy
