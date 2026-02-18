import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Stack,
    CircularProgress,
    Alert
} from '@mui/material';
import { Save as SaveIcon, Publish as PublishIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { safeDate } from '../../../utils/date-utils';

export function BlogEditor() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        featuredImage: '',
        category: 'Healthcare',
        tags: [],
        status: 'draft',
        publishDate: new Date().toISOString().split('T')[0]
    });

    const [tagInput, setTagInput] = useState('');

    const categories = ['Healthcare', 'Technology', 'Product Updates', 'Research', 'Elder Care', 'Wellness'];

    useEffect(() => {
        if (isEditMode) {
            fetchBlog();
        }
    }, [id]);

    const fetchBlog = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/blog/${id}`);
            if (response.data.success) {
                const blog = response.data.data;
                setFormData({
                    title: blog.title,
                    slug: blog.slug,
                    content: blog.content,
                    excerpt: blog.excerpt || '',
                    featuredImage: blog.featuredImage || '',
                    category: blog.category,
                    tags: blog.tags || [],
                    status: blog.status,
                    publishDate: safeDate(blog.publishDate).toISOString().split('T')[0]
                });
            }
        } catch (err) {
            console.error('Error fetching blog:', err);
            setError('Failed to load blog post');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Auto-generate slug from title
        if (name === 'title' && !isEditMode) {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setFormData({ ...formData, title: value, slug });
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData({
                ...formData,
                tags: [...formData.tags, tagInput.trim()]
            });
            setTagInput('');
        }
    };

    const handleDeleteTag = (tagToDelete) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter((tag) => tag !== tagToDelete)
        });
    };

    const handleSubmit = async (status = 'draft') => {
        try {
            setLoading(true);
            setError('');
            setSuccess('');

            const dataToSubmit = {
                ...formData,
                status
            };

            let response;
            if (isEditMode) {
                response = await axios.put(`${import.meta.env.VITE_API_URL}/blog/${id}`, dataToSubmit);
            } else {
                response = await axios.post(`${import.meta.env.VITE_API_URL}/blog`, dataToSubmit);
            }

            if (response.data.success) {
                setSuccess(`Blog post ${status === 'published' ? 'published' : 'saved'} successfully!`);
                setTimeout(() => {
                    navigate('/admin/blog');
                }, 1500);
            }
        } catch (err) {
            console.error('Error saving blog:', err);
            setError(err.response?.data?.message || 'Failed to save blog post');
        } finally {
            setLoading(false);
        }
    };

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['blockquote', 'code-block'],
            [{ color: [] }, { background: [] }],
            ['link', 'image'],
            ['clean']
        ]
    };

    if (loading && isEditMode) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Button
                startIcon={<BackIcon />}
                onClick={() => navigate('/admin/blog')}
                sx={{ mb: 3 }}
            >
                Back to Blog Manager
            </Button>

            <Typography variant="h4" fontWeight="bold" gutterBottom>
                {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
                <Grid container spacing={3}>
                    {/* Title */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Title *"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            variant="outlined"
                        />
                    </Grid>

                    {/* Slug */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Slug (URL-friendly) *"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            required
                            variant="outlined"
                            helperText="Auto-generated from title, but you can customize it"
                        />
                    </Grid>

                    {/* Content */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom>
                            Content *
                        </Typography>
                        <Box sx={{ bgcolor: 'white', borderRadius: 1 }}>
                            <ReactQuill
                                theme="snow"
                                value={formData.content}
                                onChange={(value) => setFormData({ ...formData, content: value })}
                                modules={quillModules}
                                style={{ height: '400px', marginBottom: '50px' }}
                            />
                        </Box>
                    </Grid>

                    {/* Excerpt */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Excerpt (Optional)"
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            variant="outlined"
                            multiline
                            rows={3}
                            helperText="Short summary (max 300 characters)"
                            inputProps={{ maxLength: 300 }}
                        />
                    </Grid>

                    {/* Featured Image */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Featured Image URL"
                            name="featuredImage"
                            value={formData.featuredImage}
                            onChange={handleChange}
                            variant="outlined"
                            placeholder="https://example.com/image.jpg"
                        />
                    </Grid>

                    {/* Category */}
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Category *</InputLabel>
                            <Select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                label="Category *"
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Tags */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom>
                            Tags
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                            {formData.tags.map((tag) => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    onDelete={() => handleDeleteTag(tag)}
                                    color="primary"
                                    variant="outlined"
                                />
                            ))}
                        </Stack>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                size="small"
                                placeholder="Add a tag"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                            />
                            <Button variant="outlined" onClick={handleAddTag}>
                                Add Tag
                            </Button>
                        </Box>
                    </Grid>

                    {/* Publish Date */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Publish Date"
                            name="publishDate"
                            type="date"
                            value={formData.publishDate}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    {/* Actions */}
                    <Grid item xs={12}>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="outlined"
                                startIcon={<SaveIcon />}
                                onClick={() => handleSubmit('draft')}
                                disabled={loading}
                                size="large"
                            >
                                Save as Draft
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<PublishIcon />}
                                onClick={() => handleSubmit('published')}
                                disabled={loading}
                                size="large"
                            >
                                {loading ? <CircularProgress size={24} /> : 'Publish Now'}
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}
