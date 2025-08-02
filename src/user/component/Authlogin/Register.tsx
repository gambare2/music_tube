import type { ChangeEvent, FormEvent, MouseEvent } from 'react';
import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
  Button,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import { Link, useNavigate } from 'react-router-dom';
import BlobsBackground from '../../design/BlobsBackground';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

interface FormData {
  name: string;
  username: string;
  DOB: string;
  email: string;
  password: string;
}

interface FormErrors {
  name?: string;
  username?: string;
  DOB?: string;
  email?: string;
  password?: string;
}

const defaultImage = "/profile_image.svg";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [value, setValue] = useState<dayjs.Dayjs | null>(null);
  const [form, setForm] = useState<FormData>({
    name: '',
    username: '',
    DOB: '',
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [profile, setProfile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>(defaultImage);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name) errors.name = 'Name is required';
    if (!form.username) errors.username = 'Username is required';
    if (!form.DOB) errors.DOB = 'Date of Birth is required';
    if (!form.email) errors.email = 'Email is required';
    else if (!emailRegex.test(form.email)) errors.email = 'Invalid email format';
    if (!form.password) errors.password = 'Password is required';
    else if (form.password.length < 6) errors.password = 'Password must be at least 6 characters';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const submitRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, form, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      setTimeout(() => navigate('/home'), 1000);
    } catch (error: any) {
      console.error('Error:', error.response || error.message);
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <BlobsBackground />
      <form onSubmit={submitRegister}>
        <div className="flex justify-center items-center min-h-screen px-4 py-8">
          <div className="bg-white border border-gray-300 rounded-xl shadow-md w-full max-w-md p-6">
            <div className="flex flex-col items-center gap-y-6">
              <div className="text-center">
                <p className="text-orange-400 text-xl font-semibold">User</p>
                <h1 className="text-3xl font-bold text-orange-800 flex items-center justify-center gap-2 mt-2">
                  <AppRegistrationOutlinedIcon sx={{ height: 36, width: 36 }} />
                  Register
                </h1>
              </div>

              {/* Profile Image Upload */}
              <div className="flex flex-col items-center gap-2">
                <label htmlFor="profile" className="cursor-pointer">
                  <div className="w-28 h-28 rounded-full border-2 border-gray-400 flex items-center justify-center overflow-hidden hover:border-orange-500">
                    {profilePreview ? (
                      <img
                        src={profilePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">Upload</span>
                    )}
                  </div>
                </label>
                <input
                  id="profile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Form Fields */}
              <div className="flex flex-col gap-4 w-full">
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  variant="outlined"
                  placeholder="Hritik Roshan"
                  onChange={handleChange}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                />
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  placeholder="hritik12"
                  onChange={handleChange}
                  error={!!formErrors.username}
                  helperText={formErrors.username}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="E-mail"
                  name="email"
                  placeholder="hr@gmail.com"
                  onChange={handleChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <OutlinedInput
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    onChange={handleChange}
                    error={!!formErrors.password}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                  {formErrors.password && (
                    <p className="text-red-600 text-sm mt-1">{formErrors.password}</p>
                  )}
                </FormControl>

                {/* Date Picker */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      label="Date of Birth"
                      value={value}
                      onChange={(newValue) => {
                        setValue(newValue);
                        setForm((prev) => ({
                          ...prev,
                          DOB: newValue ? newValue.format('YYYY-MM-DD') : '',
                        }));
                      }}
                      format="DD/MM/YYYY"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!formErrors.DOB,
                          helperText: formErrors.DOB,
                          placeholder: 'DD/MM/YYYY',
                        },
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>

              {/* Link to Login */}
              <div className="w-full text-right mt-2">
                <p className="text-sm">
                  Already have an account?{' '}
                  <Link to="/user/login" className="text-blue-600 hover:text-blue-800 underline">
                    Login
                  </Link>
                </p>
              </div>

              {/* Submit Button */}
              <Button
                variant="contained"
                type="submit"
                fullWidth
                sx={{ backgroundColor: 'slateblue', mt: 2 }}
              >
                Register
              </Button>
            </div>
          </div>
        </div>
      </form>

    </>
  );
};

export default Register;


