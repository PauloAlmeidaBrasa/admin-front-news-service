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

  Grid,
  Alert,
  CircularProgress,

} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useUpdateUser, useUserById } from '../../hooks/useUser';
import PasswordField from '../../components/PasswordField';



const UserEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: user, isLoading } = useUserById(id);

  const [error, setErrors, password, setPassword] = React.useState(null);


  const [formData, setFormData] = useState({
    user_ID: '',
    name: '',
    email: '',
    password:''
  });


  useEffect(() => {
    let userData = user?.data?.data.users[0]

    if (userData) {

      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        password: password
      });
    }
  }, [user]);

  const updateuser = useUpdateUser({
    onSuccess: () => {
      navigate('/user');
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
    
    const userErrors = {};
    if (!formData.name.trim()) userErrors.name = 'Name is required';
    if (!formData.email.trim()) userErrors.email = 'Email is required';

    if (Object.keys(userErrors).length > 0) {
      setErrors(userErrors);
      return;
    }

    const submitData = {
      ...formData,
      _method: 'PATCH'
    };
    submitData.user_ID = id

    updateuser.mutate({
      id,
      payload: submitData,
    });
  };

  const handleBack = () => {
    navigate('/user');
  };


  const originalUser = user?.data?.data.users
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading news user...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load user: {error}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back to category
        </Button>
      </Container>
    );
  }

  if (!originalUser) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          News category not found
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
          Back to user
        </Button>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Edit user
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Update the user details
            </Typography>
          </Box>
          
          {/* <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip 
              label={`ID: ${id}`} 
              variant="outlined" 
              size="small" 
            />
            <Chip 
              label={originalUser.status} 
              color={originalUser.status === 'published' ? 'success' : 'default'}
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
                      label="User name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={!!error?.message}
                      helperText={error?.message}
                      required
                      placeholder="Enter the user name"
                    />
                  </Grid>

                  {/* TextField */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="User Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={!!error?.message}
                      helperText={error?.message || "password"}
                      multiline
                      rows={3}
                      placeholder="Provide a short summary that will appear in news listings..."
                    />
                  </Grid>
                   <Grid item xs={12}>
                    <PasswordField
                        label="User Password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                      {isLoading ? 'Updating...' : 'Update User'}
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

export default UserEdit;