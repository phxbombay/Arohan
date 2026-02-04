import { useState, useMemo } from 'react';
import { Search as SearchIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import {
    Box,
    Container,
    Grid,
    Typography,
    Button,
    Card,
    CardContent,
    CardMedia,
    CardActionArea,
    TextField,
    InputAdornment,
    Chip,
    Stack,
    Divider
} from '@mui/material';
import { blogPosts } from '../../data/blog-data';

export function Blog() {
    const [visibleCount, setVisibleCount] = useState(4);

    // Transform blog data to match existing component structure
    const allArticles = useMemo(() => blogPosts.map(post => ({
        category: post.category,
        title: post.title,
        excerpt: post.excerpt,
        date: new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: '5 min read',
        link: post.link || `/blog/${post.slug}`,
        image: post.image
    })), []);

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: { xs: 6, md: 10 }, textAlign: 'center' }}>
                <Container maxWidth="lg">
                    <Typography variant="h2" fontWeight="800" gutterBottom sx={{ letterSpacing: -1 }}>
                        Resources & Insights
                    </Typography>
                    <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 500 }}>
                        Expert advice on aging, health, and technology.
                    </Typography>
                </Container>
            </Box>

            <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'grey.50', flexGrow: 1 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} justifyContent="center">
                        {allArticles.slice(0, visibleCount).map((article, index) => {
                            const isExternal = article.link.startsWith('http');
                            return (
                                <Grid item xs={12} md={6} lg={4} key={index}>
                                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-12px)', boxShadow: 16 }, borderRadius: 4 }}>
                                        <CardActionArea
                                            component={isExternal ? 'a' : Link}
                                            to={isExternal ? undefined : article.link}
                                            href={isExternal ? article.link : undefined}
                                            target={isExternal ? '_blank' : undefined}
                                            rel={isExternal ? 'noopener noreferrer' : undefined}
                                            sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', textAlign: 'center' }}
                                        >
                                            <CardMedia
                                                component="img"
                                                height="220"
                                                image={article.image}
                                                alt={article.title}
                                                sx={{ bgcolor: 'grey.200' }}
                                            />
                                            <CardContent sx={{ flexGrow: 1, width: '100%', p: 3 }}>
                                                <Chip
                                                    label={article.category}
                                                    size="small"
                                                    color="secondary"
                                                    sx={{ mb: 2, textTransform: 'uppercase', fontWeight: 'bold' }}
                                                />
                                                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ lineHeight: 1.3, mb: 2 }}>
                                                    {article.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                    {article.excerpt}
                                                </Typography>
                                            </CardContent>
                                            <Box sx={{ p: 3, pt: 0, width: '100%' }}>
                                                <Divider sx={{ mb: 2 }} />
                                                <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                                                    <Typography variant="caption" fontWeight="bold" color="text.secondary">{article.date}</Typography>
                                                    <Typography variant="caption" color="text.secondary">•</Typography>
                                                    <Typography variant="caption" fontWeight="bold" color="text.secondary">{article.readTime}</Typography>
                                                </Stack>
                                            </Box>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>

                    {visibleCount < allArticles.length && (
                        <Box sx={{ textAlign: 'center', mt: 8 }}>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => setVisibleCount(prev => prev + 2)}
                                sx={{ py: 1.5, px: 5, borderRadius: 8, fontSize: '1.1rem', fontWeight: 'bold', border: '2px solid' }}
                            >
                                Load More Articles
                            </Button>
                        </Box>
                    )}
                </Container>
            </Box>
        </Box>
    );
}
