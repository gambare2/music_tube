import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FormControl, TextField, Button, Card, Typography, Container, Box } from '@mui/material';
import { resetPassword } from '../../../api/authApi';
import BlobsBackground from '../../design/BlobsBackground';
import { toast } from 'react-toastify';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PinOutlinedIcon from '@mui/icons-material/Pin';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ResetPassword: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Prepopulate email and pin if sent from Forgot Password screen
  useEffect(() => {
    if (location.state) {
      const state = location.state as { email?: string; pin?: string };
      if (state.email) setEmail(state.email);
      if (state.pin) setPin(state.pin);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !pin.trim() || !newPassword.trim()) {
      toast.error('All fields are required');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword({
        email: email.trim(),
        pin: pin.trim(),
        newPassword: newPassword.trim(),
      });
      toast.success(res.message || 'Password updated successfully! Please log in.');
      setTimeout(() => {
        navigate('/user/login');
      }, 1500);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to reset password';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BlobsBackground />
      <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
        <Card className="login-container" sx={{
          width: '100%',
          p: 4,
          borderRadius: '16px',
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.2)',
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.3s ease'
        }}>
          <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold" sx={{ color: 'primary.main', mb: 1 }}>
                Reset Password
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Enter the verification code and set your new password.
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} width="100%" display="flex" flexDirection="column" gap={3}>
              <FormControl fullWidth>
                <TextField
                  label="Email Address"
                  variant="outlined"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <EmailOutlinedIcon sx={{ color: 'text.secondary', mr: 1 }} />
                    ),
                  }}
                />
              </FormControl>

              <FormControl fullWidth>
                <TextField
                  label="Verification PIN"
                  variant="outlined"
                  type="text"
                  placeholder="123456"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <PinOutlinedIcon sx={{ color: 'text.secondary', mr: 1 }} />
                    ),
                  }}
                />
              </FormControl>

              <FormControl fullWidth>
                <TextField
                  label="New Password"
                  variant="outlined"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <LockOutlinedIcon sx={{ color: 'text.secondary', mr: 1 }} />
                    ),
                  }}
                />
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  bgcolor: 'primary.main',
                  color: 'background.default',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                {loading ? 'Updating Password...' : 'Reset Password'}
              </Button>
            </Box>

            <Box mt={1} width="100%" textAlign="center">
              <Link to="/user/login" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
                <ArrowBackIcon sx={{ fontSize: 16 }} />
                <span>Back to Login</span>
              </Link>
            </Box>
          </Box>
        </Card>
      </Container>
    </>
  );
};

export default ResetPassword;
