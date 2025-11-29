import React, { useEffect, useState } from 'react';
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
import { useCategoryById, useUpdateCategory } from "../../hooks/useCategory"


const CategoryEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: category, isLoading } = useCategoryById(id);

  const [error, setErrors] = useState(null);


  const [formData, setFormData] = useState({
    category_ID: '',
    name: '',
    description: ''
  });


  // Update form when data is loaded
  useEffect(() => {
    let categoryData = category?.data?.data?.category
    console.log(category)
    if (categoryData) {

      setFormData({
        category_ID: categoryData[0].id,
        name: categoryData[0].name || '',
        description: categoryData[0].description || '',
        created_at: categoryData[0].created_at 
          ? new Date(categoryData[0].created_at).toISOString().slice(0, 16)
          : '',
      });
    }
  }, [category]);

  const updateCategory = useUpdateCategory({
    onSuccess: () => {
      navigate('/category');
    },
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.name.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.text = 'Content is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log(formData)
    const submitData = {
      ...formData,
      created_at: formData.published_at || null,
      _method: 'PATCH'
    };

    updateCategory.mutate({
      id,
      payload: submitData,
    });
  };

  const handleBack = () => {
    navigate('/category');
  };
  console.log(error)
console.log(category)
   const originalCategory = category?.data?.data?.category
   console.log(originalCategory)
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading news category...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load news category: {error}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back to category
        </Button>
      </Container>
    );
  }

  if (!originalCategory) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          News Categoty not found
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back to category
        </Button>
      </Container>
    );
  }

 

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back to Categories
        </Button>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Edit News category
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Update the news category details
            </Typography>
          </Box>
          
          {/* <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip 
              label={`ID: ${id}`} 
              variant="outlined" 
              size="small" 
            />
            <Chip 
              label={originalCategory.status} 
              color={originalCategory.status === 'published' ? 'success' : 'default'}
              size="small" 
            />
          </Box> */}
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {console.log(error)}

      <Grid container spacing={4}>
        {/* Main Form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Box component="form" 
              // onSubmit={handleSubmit} 
              noValidate>
                <Grid container spacing={3}>
                  {/* Title */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Category name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={!!error?.message}
                      helperText={error?.message}
                      required
                      placeholder="Enter a compelling title for your news category"
                    />
                  </Grid>

                  {/* TextField */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Category description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      error={!!error?.message}
                      helperText={error?.message || "Brief summary of the news article category (optional)"}
                      multiline
                      rows={3}
                      placeholder="Provide a short summary that will appear in news listings..."
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
                {/* <Grid item xs={12}>
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
                      {isLoading ? 'Updating...' : 'Update Category'}
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
        </Grid>
      </Grid>
    </Container>
  );s
};

export default CategoryEdit;