import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import PasswordField from '../../components/PasswordField'
import { useAddUser } from '../../hooks/useUser';


const UserCreate = () => {

  const [password, setPassword] = React.useState("");

  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: ''
    // status: 'draft',
  });
  const [errors, setErrors] = React.useState({});

   const {mutate: addUser, isLoading} = useAddUser({
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
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.name.trim()) newErrors.title = 'Name is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    formData.password = password
    const submitData = {
      ...formData
    };


    addUser(submitData);
  };

  const handleBack = () => {
    navigate('/user');
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
          Back to users
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Create News User
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Add user to manage the news
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
                  {/* Name */}
                  {/* <Grid item xs={12}>
              
                  </Grid> */}

                  {/* Email */}
                  <Grid item xs={12}>

                    <TextField
                      fullWidth
                      label="User Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={!!errors.name}
                      helperText={errors.name}
                      required
                      placeholder="Enter a name to user"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                    />

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

        {/* Sidebar - Settings */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              {/* <Typography variant="h6" gutterBottom>
                Settings
              </Typography> */}
              
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
                </Grid> */}
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
                      {isLoading ? 'Creating...' : 'Create Users'}
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
  );
};

export default UserCreate;