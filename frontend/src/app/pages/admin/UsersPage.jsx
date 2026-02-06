import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import {
    Box,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Grid,
    IconButton
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';
import { toast } from 'sonner';

export function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        role: 'patient',
        phone_number: '',
        address: '',
        gender: '',
        date_of_birth: ''
    });

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            const data = response.data.data;
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch users", error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateUser = async () => {
        if (!formData.full_name || !formData.email || !formData.password) {
            toast.error("Please fill required fields (Name, Email, Password)");
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/admin/users', formData);
            toast.success("User created successfully");
            setOpen(false);
            setFormData({
                full_name: '',
                email: '',
                password: '',
                role: 'patient',
                phone_number: '',
                address: '',
                gender: '',
                date_of_birth: ''
            });
            fetchUsers();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to create user");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
    );

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">User Management</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                >
                    Add User
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={1}>
                <Table>
                    <TableHead sx={{ bgcolor: 'grey.50' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Joined</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.user_id} hover>
                                <TableCell sx={{ fontWeight: 'medium' }}>{user.full_name}</TableCell>
                                <TableCell color="text.secondary">{user.email}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.role}
                                        size="small"
                                        color={user.role === 'admin' ? 'secondary' : user.role === 'doctor' ? 'primary' : 'success'}
                                        sx={{ textTransform: 'capitalize' }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.is_active ? 'Active' : 'Inactive'}
                                        size="small"
                                        color={user.is_active ? 'success' : 'error'}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell color="text.secondary">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add User Modal */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Add New User
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpen(false)}
                        sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.500' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12}>
                            <TextField
                                name="full_name"
                                label="Full Name"
                                fullWidth
                                required
                                value={formData.full_name}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="email"
                                label="Email"
                                type="email"
                                fullWidth
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="password"
                                label="Password"
                                type="password"
                                fullWidth
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="role"
                                label="Role"
                                select
                                fullWidth
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <MenuItem value="patient">Patient</MenuItem>
                                <MenuItem value="doctor">Doctor</MenuItem>
                                <MenuItem value="caregiver">Caregiver</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="gender"
                                label="Gender"
                                select
                                fullWidth
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="phone_number"
                                label="Phone Number"
                                fullWidth
                                value={formData.phone_number}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="date_of_birth"
                                label="Date of Birth"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={formData.date_of_birth}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="address"
                                label="Address"
                                multiline
                                rows={2}
                                fullWidth
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleCreateUser}
                        variant="contained"
                        disabled={submitting}
                    >
                        {submitting ? 'Creating...' : 'Create User'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
