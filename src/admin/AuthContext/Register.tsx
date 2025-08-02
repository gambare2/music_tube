import React, { useState } from 'react';
import type { ChangeEvent, FormEvent, MouseEvent } from 'react';
import axios from 'axios';
import {
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
  Button
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
import { Dayjs } from 'dayjs';
import { Link } from 'react-router';
import BlobsBackground from '../../user/design/BlobsBackground';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [value, setValue] = useState<Dayjs | null>(null);
  const [form, setForm] = useState<FormData>({
    name: '',
    username: '',
    DOB: '',
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

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
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1000);
    } catch (error: any) {
      console.error('Error:', error.response || error.message);
      alert('Error: ' + (error.response?.data?.message || 'Request failed'));
    }
  };

  return (
    <form onSubmit={submitRegister}>
      <BlobsBackground/>
      <div className="flex justify-center items-center md:my-10 login-container ">
        <div className="border  border-slate-600 bg-slate-200 w-2/5">
          <div className="flex gap-5 items-center flex-col md:mb-10">
          <span className="flex justify-center font8 font-bold text-2xl relative top-4 text-orange-300">User</span>
            <span className="flex justify-center md:mb-4 font8 font-bold text-4xl text-orange-800">
              <AppRegistrationOutlinedIcon sx={{ height: 42, width: 47, color: 'slateorange' }} />
              Register
            </span>

            {/* Full Name */}
            <TextField
              sx={{ width: 260 }}
              label="Full Name"
              type="text"
              name="name"
              placeholder="Hritik Roshan"
              onChange={handleChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
            />

            {/* Username */}
            <TextField
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
                )
              }}
              variant="outlined"
            />

            {/* Date of Birth */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker
                  label="Date of Birth"
                  value={value}
                  onChange={(newValue) => {
                    setValue(newValue);
                    setForm((prev) => ({
                      ...prev,
                      DOB: newValue ? newValue.format('YYYY-MM-DD') : ''
                    }));
                  }}
                  format='DD/MM/YYYY'
                  slotProps={{
                    textField: {
                      error: !!formErrors.DOB,
                      helperText: formErrors.DOB,
                      placeholder:'DD/MM/YYYY'
                    }
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>

            {/* Email */}
            <TextField
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
                )
              }}
              variant="outlined"
            />

            {/* Password */}
            <FormControl variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                onChange={handleChange}
                error={!!formErrors.password}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
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
            <div className='flex justify-end md:mb-4'>
              <span>Already have an account ? 
              <Link to={'/user/login'} className='text-blue-600 md:mx-3 transition-all duration-500 ease-in-out hover:text-blue-800'>Login</Link>
              </span>
              
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                variant="contained"
                sx={{ width: 147, backgroundColor: 'slateblue' }}
                type="submit"
              >
                Register
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Register;


