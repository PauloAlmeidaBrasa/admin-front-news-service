import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Update as UpdateIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { newsAPI } from '../../services/api/api-admin';

const NewsEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = React.useState({
    title: '',
    excerpt: '',
    content: '',
    status: 'draft',
    published_at: '',
  });
  const [errors, setErrors] = React.useState({});

  // Fetch news data
  const { data: news, isLoading, error } = useQuery({
    queryKey: ['news', id],
    queryFn: () => newsAPI.getById(id),
    enabled: !!id,
  });

  // Update form when data is loaded
  React.useEffect(() => {
    if (news?.data) {
      const newsData = news.data;
      setFormData({
        title: newsData.title || '',
        excerpt: newsData.excerpt || '',
        content: newsData.content || '',
        status: newsData.status || 'draft',
        published_at: newsData.published_at 
          ? new Date(newsData.published_at).toISOString().slice(0, 16)
          : '',
      });
    }
  }, [news]);

  const updateMutation = useMutation({
    mutationFn: (data) => newsAPI.update(id, data),
    onSuccess: () => {
      navigate('/news');
    },
    onError: (error) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Failed to update news article' });
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare data for API
    const submitData = {
      ...formData,
      published_at: formData.published_at || null,
      _method: 'PUT' // For Laravel form method spoofing if needed
    };

    updateMutation.mutate(submitData);
  };

  const handleBack = () => {
    navigate('/news');
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading news article...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load news article: {error.message}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back to News
        </Button>
      </Container>
    );
  }

  if (!news?.data) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          News article not found
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back to News
        </Button>
      </Container>
    );
  }

  const originalNews = news.data;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back to News
        </Button>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Edit News Article
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Update the news article details
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip 
              label={`ID: ${id}`} 
              variant="outlined" 
              size="small" 
            />
            <Chip 
              label={originalNews.status} 
              color={originalNews.status === 'published' ? 'success' : 'default'}
              size="small" 
            />
          </Box>
        </Box>
      </Box>

      {/* Error Alert */}
      {errors.general && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.general}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Main Form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={3}>
                  {/* Title */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="News Title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      error={!!errors.title}
                      helperText={errors.title}
                      required
                      placeholder="Enter a compelling title for your news article"
                    />
                  </Grid>

                  {/* Excerpt */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Excerpt"
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleChange}
                      error={!!errors.excerpt}
                      helperText={errors.excerpt || "Brief summary of the news article (optional)"}
                      multiline
                      rows={3}
                      placeholder="Provide a short summary that will appear in news listings..."
                    />
                  </Grid>

                  {/* Content */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Content"
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      error={!!errors.content}
                      helperText={errors.content}
                      required
                      multiline
                      rows={12}
                      placeholder="Write the full content of your news article here..."
                    />
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar - Settings & Info */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Publication Settings
              </Typography>
              
              <Grid container spacing={3}>
                {/* Status */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    helperText="Choose whether to publish now or save as draft"
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                  </TextField>
                </Grid>

                {/* Publish Date */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="Publish Date & Time"
                    name="published_at"
                    value={formData.published_at}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    helperText="Schedule publication for a specific date and time"
                  />
                </Grid>

                {/* Action Buttons */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={handleSubmit}
                      disabled={updateMutation.isLoading}
                      startIcon={
                        updateMutation.isLoading ? 
                        <CircularProgress size={20} /> : 
                        <SaveIcon />
                      }
                    >
                      {updateMutation.isLoading ? 'Updating...' : 'Update News'}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      size="large"
                      fullWidth
                      onClick={handleBack}
                      disabled={updateMutation.isLoading}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Article Information Card */}
          <Card sx={{ mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Article Information
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Created
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon fontSize="small" />
                    {originalNews.created_at ? new Date(originalNews.created_at).toLocaleString() : 'N/A'}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Last Updated
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <UpdateIcon fontSize="small" />
                    {originalNews.updated_at ? new Date(originalNews.updated_at).toLocaleString() : 'N/A'}
                  </Typography>
                </Box>

                {originalNews.published_at && (
                  <>
                    <Divider />
                    <Box>
                      <Typography variant="caption" color="textSecondary" display="block">
                        Originally Published
                      </Typography>
                      <Typography variant="body2">
                        {new Date(originalNews.published_at).toLocaleString()}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card sx={{ mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Editing Tips
              </Typography>
              <Typography variant="body2" color="textSecondary" component="div">
                <ul style={{ paddingLeft: 16, margin: 0 }}>
                  <li>Update the title if the focus has changed</li>
                  <li>Keep the excerpt concise and engaging</li>
                  <li>Review content for accuracy and clarity</li>
                  <li>Change status to control visibility</li>
                  <li>Update publication date for re-publishing</li>
                </ul>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NewsEdit;