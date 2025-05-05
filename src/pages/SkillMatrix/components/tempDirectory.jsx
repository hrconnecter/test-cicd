import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import useAuthToken from "../../../hooks/Token/useAuth";
import { Tabs, Tab } from "@mui/material";

const Directory = () => {
  const [groupedSkills, setGroupedSkills] = useState({});
  const [activeTab, setActiveTab] = useState("hierarchy"); // Track active tab
  const { organisationId } = useParams();
  const authToken = useAuthToken();
  const queryClient = useQueryClient();

  // Fetch skills grouped by groupName and subGroupName
  const fetchSkills = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching skills:", error);
      return { data: [] };
    }
  };

  const { data, isLoading, isError } = useQuery("skills", fetchSkills, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data && data.success && Array.isArray(data.data)) {
      // Group skills by groupName and subGroupName
      const skillsByGroup = data.data.reduce((acc, skill) => {
        const group = skill.groupName || "Ungrouped";
        const subGroup = skill.subGroupName || "No Subgroup";
        acc[group] = acc[group] || {};
        acc[group][subGroup] = acc[group][subGroup] || [];
        acc[group][subGroup].push(skill);
        return acc;
      }, {});
      setGroupedSkills(skillsByGroup);
    } else {
      setGroupedSkills({});
    }
  }, [data]);

  const updateSkills = async (updatedSkills) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills/reorder`,
        { skills: updatedSkills },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      queryClient.invalidateQueries("skills");
    } catch (error) {
      console.error("Error updating skills hierarchy:", error);
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const [sourceGroupName, sourceSubGroupName] = source.droppableId.split("-");
    const [destGroupName, destSubGroupName] = destination.droppableId.split("-");

    const sourceGroup = groupedSkills[sourceGroupName];
    const destGroup = groupedSkills[destGroupName];

    if (!sourceGroup || !destGroup) return;

    let updatedSourceGroup = [...sourceGroup[sourceSubGroupName]];
    let updatedDestGroup = [...destGroup[destSubGroupName]];

    if (source.droppableId === destination.droppableId) {
      const [movedSkill] = updatedSourceGroup.splice(source.index, 1);
      updatedSourceGroup.splice(destination.index, 0, movedSkill);

      setGroupedSkills((prev) => ({
        ...prev,
        [sourceGroupName]: {
          ...prev[sourceGroupName],
          [sourceSubGroupName]: updatedSourceGroup,
        },
      }));
    } else {
      const [movedSkill] = updatedSourceGroup.splice(source.index, 1);
      updatedDestGroup.splice(destination.index, 0, movedSkill);

      setGroupedSkills((prev) => ({
        ...prev,
        [sourceGroupName]: {
          ...prev[sourceGroupName],
          [sourceSubGroupName]: updatedSourceGroup,
        },
        [destGroupName]: {
          ...prev[destGroupName],
          [destSubGroupName]: updatedDestGroup,
        },
      }));
    }

    const updatedSkills = [
      ...updatedSourceGroup.map((skill, index) => ({
        ...skill,
        position: index,
        groupName: sourceGroupName,
        subGroupName: sourceSubGroupName,
      })),
      ...updatedDestGroup.map((skill, index) => ({
        ...skill,
        position: index,
        groupName: destGroupName,
        subGroupName: destSubGroupName,
      })),
    ];

    updateSkills(updatedSkills);
  };

  const renderSkillHierarchy = () => (
    <div>
      <h2>Skill Hierarchy</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.keys(groupedSkills).map((group) => (
          <div key={group} style={{ marginBottom: "20px" }}>
            <h3>{group}</h3>
            {Object.keys(groupedSkills[group]).map((subGroup) => (
              <Droppable key={subGroup} droppableId={`${group}-${subGroup}`}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <h4>{subGroup}</h4>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                      {groupedSkills[group][subGroup].map((skill, index) => (
                        <Draggable
                          key={skill._id}
                          draggableId={skill._id}
                          index={index}
                        >
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                padding: "8px",
                                margin: "4px 0",
                                backgroundColor: "#f0f0f0",
                                borderRadius: "4px",
                                cursor: "move",
                                ...provided.draggableProps.style,
                              }}
                            >
                              {skill.skillName}
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        ))}
      </DragDropContext>
    </div>
  );

  const renderSkillAssessment = () => (
    <div>
      <h2>Skill Assessment</h2>
      <p>Here, you can manage skill assessments.</p>
    </div>
  );

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading skills.</p>;

  return (
    <div>
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab value="hierarchy" label="Skill Hierarchy" />
        <Tab value="assessment" label="Skill Assessment" />
      </Tabs>
      <div style={{ marginTop: "20px" }}>
        {activeTab === "hierarchy" && renderSkillHierarchy()}
        {activeTab === "assessment" && renderSkillAssessment()}
      </div>
    </div>
  );
};

export default Directory;






