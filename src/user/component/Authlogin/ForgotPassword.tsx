import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FormControl, TextField, Button, Alert, Card, Typography, Container, Box } from '@mui/material';
import { forgotPassword } from '../../../api/authApi';
import BlobsBackground from '../../design/BlobsBackground';
import { toast } from 'react-toastify';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword(email.trim());
      toast.success(res.message || 'Reset PIN generated!');
      if (res.pin) {
        setPin(res.pin);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to send password reset request';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToReset = () => {
    navigate('/reset-password', { state: { email, pin } });
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
                Forgot Password
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Enter your registered email address to receive your 6-digit verification PIN.
              </Typography>
            </Box>

            {!pin ? (
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
                  {loading ? 'Sending Request...' : 'Get Verification PIN'}
                </Button>
              </Box>
            ) : (
              <Box width="100%" display="flex" flexDirection="column" gap={3}>
                <Alert severity="success" sx={{ borderRadius: '8px' }}>
                  A verification code has been generated!
                </Alert>

                <Box textAlign="center" py={2} sx={{ bgcolor: 'action.hover', borderRadius: '8px', border: '1px dashed', borderColor: 'primary.main' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', tracking: 1.5 }}>
                    Your Verification Pin
                  </Typography>
                  <Typography variant="h3" fontWeight="bold" letterSpacing={6} sx={{ color: 'text.primary', mt: 1 }}>
                    {pin}
                  </Typography>
                </Box>

                <Typography variant="body2" textAlign="center" sx={{ color: 'text.secondary' }}>
                  Normally this PIN would be emailed to you, but for testing it is printed here and in the server logs. Click below to reset your password.
                </Typography>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleGoToReset}
                  sx={{
                    py: 1.5,
                    bgcolor: 'primary.main',
                    color: 'background.default',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                >
                  Continue to Reset Password
                </Button>
              </Box>
            )}

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

export default ForgotPassword;
