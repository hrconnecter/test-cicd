import React, { useContext, useState } from "react";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BasicButton from "../../components/BasicButton";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";
import { useQuery, useQueryClient } from "react-query";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
} from "@mui/material";
import {
    EditOutlined as EditOutlinedIcon,
    DeleteOutline as DeleteOutlineIcon,
} from "@mui/icons-material";
import { TestContext } from "../../State/Function/Main";

const MrOpenJobVacancyList = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { organisationId } = useParams();
    const [open, setOpen] = useState(false);
    const [selectedVacancy, setSelectedVacancy] = useState(null);
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const { handleAlert } = useContext(TestContext);

    // Add Vacancy Handler
    const handleAddVacancy = () => {
        navigate(`/organisation/${organisationId}/manager-create-job-position`);
    };

    // Fetch job vacancies for the manager using React Query
    const { data, isLoading } = useQuery(
        ["JobVacancy", organisationId],
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/manager/vacancies`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response.data.data;
        }
    );

    // Edit Vacancy Handler
    const editVacancy = (vacancyId) => {
        navigate(`/organisation/${organisationId}/manager-create-job-position/edit/${vacancyId}`);
    };

    // Confirm Delete Vacancy
    const confirmDeleteVacancy = (vacancyId) => {
        setSelectedVacancy(vacancyId);
        setOpen(true);
    };

    const handleShortList = (vacancyId) => {
        navigate(`/organisation/${organisationId}/hr-shortlisted/${vacancyId}`)
    };

    // Handle Delete Vacancy
    const handleDelete = async () => {
        try {
            await axios.delete(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/manager/vacancy/${selectedVacancy}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );

            setOpen(false);
            setSelectedVacancy(null);
            handleAlert(true, "success", "Job vacancy deleted successfully.");
            queryClient.invalidateQueries(["JobVacancy", organisationId]);
        } catch (err) {
            alert("Failed to delete vacancy.");
        }
    };



    return (
        <div>
            {/* Header Section */}
            <Grid container sm={12} sx={{ alignItems: "center", justifyContent: "space-between" }}>
                <Grid item xs={12} sm={6}>
                    <HeadingOneLineInfo
                        heading="Job Vacancy List"
                        info="Here manager can see job vacancy list"
                    />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <BasicButton title="Add Job Vacancy" onClick={handleAddVacancy} />
                </Grid>
            </Grid>

            {/* Content Section */}
            <div className="overflow-auto  bg-white  mt-2">
                {isLoading ? (
                    <div
                        className="h-[70vh] flex flex-col items-center justify-center"
                        style={{ textAlign: "center", padding: "20px" }}
                    >
                        <CircularProgress />
                        <p>Loading...</p>
                    </div>
                ) : data && data.length > 0 ? (
                    <table className="min-w-full bg-white text-left text-sm font-light">
                        <thead className="border-b bg-gray-200 font-medium">
                            <tr>
                                <th className="pl-8 py-3">Sr. No</th>
                                <th className="pl-8 py-3">Job Title</th>
                                <th className="pl-8 py-3">Job Role</th>
                                <th className="pl-8 py-3">Department</th>
                                <th className="pl-8 py-3">Assign HR</th>
                                <th className="whitespace-nowrap pl-8 py-3">Actions</th>
                                <th className="pl-8 py-3">Shortlist</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((vacancy, index) => (
                                <tr key={vacancy._id} className="border-b hover:bg-gray-100">
                                    <td className="pl-8 py-3">{index + 1}</td>
                                    <td className="pl-8 py-3">{vacancy?.jobTitle}</td>
                                    <td className="pl-8 py-3">{vacancy?.jobRole}</td>
                                    <td className="pl-8 py-3">{vacancy?.department?.departmentName}</td>
                                    <td className="pl-8 py-3">{vacancy.hrAssigned?.email || "-"}</td>
                                    <td className="whitespace-nowrap pl-5">
                                        <IconButton onClick={() => editVacancy(vacancy._id)} color="primary">
                                            <EditOutlinedIcon />
                                        </IconButton>
                                        <IconButton onClick={() => confirmDeleteVacancy(vacancy._id)} color="error">
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </td>
                                    <td className="pl-8 py-3">
                                        <BasicButton variant="outlined" title="shortlist" onClick={() => handleShortList(vacancy._id)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: "20px" }}>
                        Job vacancy not found.
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this job vacancy?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} variant="outlined" size="small">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} variant="contained" size="small" color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default MrOpenJobVacancyList;
