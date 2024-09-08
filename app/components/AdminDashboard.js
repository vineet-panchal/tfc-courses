"use client";

import React, { useState, useEffect } from "react";

import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tabs,
  Tab,
  Grid,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { createClient } from "../utils/supabase/client";
// Mock data for courses
const initialCourses = [
  { id: 1, title: "Introduction to React", students: 150, status: "Active", for: ["Staff", "Fellow"] },
  { id: 2, title: "Advanced JavaScript", students: 120, status: "Active", for: ["Staff"] },
  { id: 3, title: "Python for Beginners", students: 200, status: "Inactive", for: ["Fellow"] },
];

// Mock data for users
const initialUsers = [
  { id: 1, firstName: "John", lastName: "Doe", email: "john@example.com", role: "None" },
  { id: 2, firstName: "Jane", lastName: "Smith", email: "jane@example.com", role: "Instructor" },
  { id: 3, firstName: "Bob", lastName: "Johnson", email: "bob@example.com", role: "Staff" },
];

// Mock data for access control
const initialAccessControl = [
  {
    role: "Guest",
    dashboard: false,
    myLearning: false,
    discussion: false,
    community: false,
    profilePage: false,
    instructorPage: false,
  },
  {
    role: "Fellow",
    dashboard: true,
    myLearning: false,
    discussion: false,
    community: false,
    profilePage: true,
    instructorPage: false,
  },
  {
    role: "Instructor",
    dashboard: true,
    myLearning: true,
    discussion: false,
    community: false,
    profilePage: true,
    instructorPage: true,
  },
  {
    role: "Staff",
    dashboard: true,
    myLearning: true,
    discussion: true,
    community: true,
    profilePage: true,
    instructorPage: true,
  },
];

// Mock Google Analytics data
const mockAnalyticsData = {
  pageViews: 10000,
  uniqueVisitors: 5000,
  averageSessionDuration: "00:03:45",
  bounceRate: "45%",
};

const AdminDashboard = ({ onEdit, editingRow }) => {
  const [courses, setCourses] = useState(initialCourses);
  const [users, setUsers] = useState(initialUsers);
  const [tabValue, setTabValue] = useState(0);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [accessControl, setAccessControl] = useState(initialAccessControl);
  const [editingRole, setEditingRole] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [openCourseDelete, setOpenCourseDelete] = useState(false); // State for course deletion dialog
  const [courseIdToDelete, setCourseIdToDelete] = useState(null); // State to track which course to delete
  const supabase = createClient();

  useEffect(() => {
    // Simulating API call to Google Analytics
    const fetchAnalyticsData = async () => {
      // In a real application, you would make an API call to Google Analytics here
      // For this example, we'll use the mock data after a short delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalyticsData(mockAnalyticsData);
    };

    fetchAnalyticsData();
  }, []);
  useEffect(() => {
    const fetchUsers = async () => {
      console.log("fetching users");
      const { data, error } = await supabase.from("users").select("*").limit(10);
      if (error) {
        console.error("Error fetching users:", error);
      } else {
        console.log("Users:", data);
        setUsers(data);
      }
    };

    fetchUsers();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAccessControlChange = (role, permission) => {
    if (editingRole === role) {
      setAccessControl(accessControl.map(ac => (ac.role === role ? { ...ac, [permission]: !ac[permission] } : ac)));
    }
  };

  const handleEditRole = role => {
    if (editingRole === role) {
      // Save changes
      setEditingRole(null);
      // Here you would typically save the changes to your backend
      console.log("Saving changes for role:", role);
    } else {
      // Enter edit mode
      setEditingRole(role);
    }
  };

  const handleEditClick = user => {
    setEditedUser({ ...user });
    onEdit(user.id);
  };

  const handleSave = () => {
    if (editedUser) {
      setUsers(prevUsers => prevUsers.map(user => (user.id === editedUser.id ? editedUser : user)));
      setEditedUser(null);
    }
  };

  const handleDeleteOpen = id => {
    setUserIdToDelete(id);
    setOpen(true);
  };

  const handleDeleteClose = () => {
    setOpen(false);
  };

  const handleDeleteConfirm = () => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userIdToDelete));
    setOpen(false);
    setUserIdToDelete(null);
  };

  const handleCourseDeleteOpen = id => {
    setCourseIdToDelete(id); // Set the course ID to delete
    setOpenCourseDelete(true); // Open the confirmation dialog
  };

  const handleCourseDeleteClose = () => {
    setOpenCourseDelete(false); // Close the confirmation dialog
  };

  const handleCourseDeleteConfirm = () => {
    setCourses(prevCourses => prevCourses.filter(course => course.id !== courseIdToDelete)); // Delete the course
    setOpenCourseDelete(false); // Close the dialog after deletion
    setCourseIdToDelete(null); // Clear the course ID
  };

  return (
    <Box sx={{ padding: 3 }}>
      {tabValue === 2 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Analytics
          </Typography>
          {analyticsData ? (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h6">{analyticsData.pageViews}</Typography>
                  <Typography variant="body2">Page Views</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h6">{analyticsData.uniqueVisitors}</Typography>
                  <Typography variant="body2">Unique Visitors</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h6">{analyticsData.averageSessionDuration}</Typography>
                  <Typography variant="body2">Avg. Session Duration</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h6">{analyticsData.bounceRate}</Typography>
                  <Typography variant="body2">Bounce Rate</Typography>
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <Typography>Loading analytics data...</Typography>
          )}
        </Paper>
      )}
      {tabValue === 3 && (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Role</TableCell>
                  <TableCell>Dashboard/Home</TableCell>
                  <TableCell>Dashboard/My Learning</TableCell>
                  <TableCell>Dashboard/Discussion</TableCell>
                  <TableCell>Dashboard/Community</TableCell>
                  <TableCell>Profile Page</TableCell>
                  <TableCell>Instructor Page</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accessControl.map(ac => (
                  <TableRow key={ac.role}>
                    <TableCell>{ac.role}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={ac.dashboard}
                        onChange={() => handleAccessControlChange(ac.role, "dashboard")}
                        disabled={editingRole !== ac.role}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={ac.myLearning}
                        onChange={() => handleAccessControlChange(ac.role, "myLearning")}
                        disabled={editingRole !== ac.role}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={ac.discussion}
                        onChange={() => handleAccessControlChange(ac.role, "discussion")}
                        disabled={editingRole !== ac.role}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={ac.community}
                        onChange={() => handleAccessControlChange(ac.role, "community")}
                        disabled={editingRole !== ac.role}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={ac.profilePage}
                        onChange={() => handleAccessControlChange(ac.role, "profilePage")}
                        disabled={editingRole !== ac.role}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={ac.instructorPage}
                        onChange={() => handleAccessControlChange(ac.role, "instructorPage")}
                        disabled={editingRole !== ac.role}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        startIcon={editingRole === ac.role ? <SaveIcon /> : <EditIcon />}
                        onClick={() => handleEditRole(ac.role)}
                      >
                        {editingRole === ac.role ? "Save" : "Edit"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      <Dialog open={open} onClose={handleDeleteClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* Confirmation Dialog for Course Deletion */}
      <Dialog open={openCourseDelete} onClose={handleCourseDeleteClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this course? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCourseDeleteClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCourseDeleteConfirm} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
