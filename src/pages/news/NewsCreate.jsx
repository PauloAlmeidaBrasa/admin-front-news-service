import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
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
  Paper,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useCategory } from '../../context/CategoryContext';
import { useAddNews } from "../../hooks/useNews"


const NewsCreate = () => {

  const { categories, categoriesLoading } = useCategory();

  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    title: '',
    subtitle: '',
    text: '',
    status: 'draft',
    published_at: '',
    category: ''
  });
  const [errors, setErrors] = React.useState({});

   const {mutate: addNews, isLoading} = useAddNews({
    onSuccess: () => {
      navigate('/news');
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
  const handleChangeCategory = (e) => {
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
    if (!formData.text.trim()) newErrors.content = 'Content is required';
    if (!formData.category) newErrors.category = 'category is required';

    console.log(newErrors)
    if (Object.keys(newErrors).length > 0) {
      console.log('ljkdla')
      setErrors(newErrors);
      return;
    }

    // Prepare data for API
    const submitData = {
      ...formData,
      published_at: formData.published_at || null,
    };

    addNews(submitData);
  };

  const handleBack = () => {
    navigate('/news');
  };

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
        <Typography variant="h4" component="h1" gutterBottom>
          Create News Article
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Add a new news article to your website
        </Typography>
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
                      label="Sub-title"
                      name="subtitle"
                      value={formData.subtitle}
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
                      name="text"
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

        {/* Sidebar - Settings */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Settings
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
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChangeCategory}
                    helperText="Select a category"
                    required
                    error={!!errors.content}
                    disabled={categoriesLoading}
                  >
                    {categoriesLoading ? (
                      <MenuItem disabled>Loading...</MenuItem>
                    ) : (
                      categories.data.category.map(cat => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </MenuItem>
                      ))
                    )}
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
                      disabled={isLoading}
                      startIcon={
                        isLoading ? 
                        <CircularProgress size={20} /> : 
                        <SaveIcon />
                      }
                    >
                      {isLoading ? 'Creating...' : 'Create News'}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      size="large"
                      fullWidth
                      onClick={handleBack}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card sx={{ mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Tips
              </Typography>
              <Typography variant="body2" color="textSecondary" component="div">
                <ul style={{ paddingLeft: 16, margin: 0 }}>
                  <li>Use a clear and descriptive title</li>
                  <li>Write a compelling excerpt to attract readers</li>
                  <li>Use proper formatting in the content</li>
                  <li>Set to "Draft" if you're not ready to publish</li>
                  <li>Schedule publication for optimal timing</li>
                </ul>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NewsCreate;