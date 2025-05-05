import {
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Switch,
  Button,
  Avatar,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import React, { useState } from "react";
import BasicButton from "../../components/BasicButton";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";

const Space = () => {
  const [spaceModal, setSpaceModal] = useState(false);
  const [step, setStep] = useState(1); // Step tracker
  const [spaceName, setSpaceName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [workflow, setWorkflow] = useState("starter"); // Default workflow selection
  const [spaces, setSpaces] = useState([
    {
      id: 1,
      name: "Marketing",
      description: "Marketing Team",
      private: false,
      workflow: "starter",
    },
    {
      id: 2,
      name: "Engineering",
      description: "Engineering Dept",
      private: true,
      workflow: "project",
    },
    {
      id: 3,
      name: "HR",
      description: "Human Resources",
      private: false,
      workflow: "management",
    },
  ]); // Dummy space records

  const handleCreateSpace = () => {
    setSpaceModal(true);
  };

  const handleCloseDialog = () => {
    setSpaceModal(false);
    setStep(1);
    setSpaceName("");
    setDescription("");
    setIsPrivate(false);
    setWorkflow("starter");
  };

  const handleContinue = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleCreate = () => {
    const newSpace = {
      id: spaces.length + 1,
      name: spaceName,
      description,
      private: isPrivate,
      workflow,
    };
    setSpaces([...spaces, newSpace]);
    handleCloseDialog();
  };

  return (
    <div>
      {/* Header and Create Space Button */}
      <Grid
        container
        sm={12}
        sx={{ alignItems: "center", justifyContent: "space-between", mb: 2 }}
      >
        <Grid item xs={12} sm={6}>
          <HeadingOneLineInfo
            heading="Space"
            info="Here you can create a space"
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <BasicButton title="Create Space" onClick={handleCreateSpace} />
        </Grid>
      </Grid>

      {/* Table for Displaying Spaces */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Private</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Workflow</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {spaces.map((space) => (
              <TableRow key={space.id}>
                <TableCell>{space.id}</TableCell>
                <TableCell>{space.name}</TableCell>
                <TableCell>{space.description}</TableCell>
                <TableCell>{space.private ? "Yes" : "No"}</TableCell>
                <TableCell>{space.workflow}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Creating a Space */}
      <Dialog
        open={spaceModal}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        {step === 1 ? (
          <>
            <DialogTitle sx={{ fontWeight: "bold", fontSize: 20 }}>
              Create a Space
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                A Space represents teams, departments, or groups, each with its
                own Lists, workflows, and settings.
              </Typography>

              <Grid container alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <Grid item>
                  <Avatar sx={{ bgcolor: "#E0E0E0", width: 40, height: 40 }}>
                    M
                  </Avatar>
                </Grid>
                <Grid item xs>
                  <TextField
                    fullWidth
                    label="Space Name"
                    placeholder="e.g. Marketing, Engineering, HR"
                    value={spaceName}
                    onChange={(e) => setSpaceName(e.target.value)}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="Description (optional)"
                placeholder="Enter a short description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                margin="normal"
                multiline
                rows={3}
              />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: 1,
                }}
              >
                <Typography variant="body2">Make Private</Typography>
                <Switch
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
              </Box>
              <Typography variant="caption" color="textSecondary">
                Only you and invited members have access.
              </Typography>
            </DialogContent>

            <DialogActions sx={{ justifyContent: "space-between", padding: 2 }}>
              <Button variant="text">Use Templates</Button>
              <Button
                variant="contained"
                onClick={handleContinue}
                sx={{ bgcolor: "#845EF7" }}
              >
                Continue
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle sx={{ fontWeight: "bold", fontSize: 20 }}>
              Define your workflow
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Choose a pre-configured solution or customize your workflow with
                advanced options.
              </Typography>

              <ToggleButtonGroup
                value={workflow}
                exclusive
                onChange={(event, newWorkflow) => setWorkflow(newWorkflow)}
                sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}
              >
                <ToggleButton
                  value="starter"
                  sx={{ justifyContent: "flex-start", p: 2 }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      Starter
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      For everyday tasks
                    </Typography>
                  </Box>
                </ToggleButton>
                <ToggleButton
                  value="marketing"
                  sx={{ justifyContent: "flex-start", p: 2 }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      Marketing Teams
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Run effective campaigns
                    </Typography>
                  </Box>
                </ToggleButton>
              </ToggleButtonGroup>
            </DialogContent>

            <DialogActions sx={{ justifyContent: "space-between", padding: 2 }}>
              <Button variant="outlined" onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreate}
                sx={{ bgcolor: "#845EF7" }}
              >
                Create Space
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default Space;
