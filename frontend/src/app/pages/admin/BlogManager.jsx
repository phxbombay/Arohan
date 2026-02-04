import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Stack,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import api from '../../../services/api';
import { format } from 'date-fns';

export function BlogManager() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await api.get('/blog?status=all&limit=100');
            if (response.data.success) {
                setBlogs(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching blogs:', err);
            setError('Failed to load blog posts');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this blog post?')) {
            return;
        }

        try {
            await api.delete(`/blog/${id}`);
            fetchBlogs(); // Reload list
            alert('Blog post deleted successfully');
        } catch (err) {
            console.error('Error deleting blog:', err);
            alert('Failed to delete blog post');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'published':
                return 'success';
            case 'draft':
                return 'warning';
            case 'scheduled':
                return 'info';
            default:
                return 'default';
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" fontWeight="bold">
                    Blog Manager
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/admin/blog/new')}
                    sx={{ borderRadius: 2 }}
                >
                    Create New Post
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.100' }}>
                            <TableCell><strong>Title</strong></TableCell>
                            <TableCell><strong>Category</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Views</strong></TableCell>
                            <TableCell><strong>Published</strong></TableCell>
                            <TableCell align="right"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {blogs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        No blog posts found. Create your first post!
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            blogs.map((blog) => (
                                <TableRow key={blog._id} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="medium">
                                            {blog.title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            /{blog.slug}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={blog.category} size="small" />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={blog.status}
                                            size="small"
                                            color={getStatusColor(blog.status)}
                                        />
                                    </TableCell>
                                    <TableCell>{blog.viewCount || 0}</TableCell>
                                    <TableCell>
                                        <Typography variant="caption">
                                            {format(new Date(blog.publishDate), 'MMM dd, yyyy')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
                                                title="View"
                                            >
                                                <ViewIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="info"
                                                onClick={() => navigate(`/admin/blog/edit/${blog._id}`)}
                                                title="Edit"
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDelete(blog._id)}
                                                title="Delete"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}
