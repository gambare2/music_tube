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
import { Link, useNavigate } from 'react-router-dom';
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

const inputStyles = {
  "& .MuiInputBase-input": {
    color: "#000",
  },

  "& .MuiInputLabel-root": {
    color: "#000",
  },

  "& .MuiSvgIcon-root": {
    color: "#000",
  },

  "& .MuiInputAdornment-root": {
    color: "#000",
  },

  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#14b8a6",
  },

  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#14b8a6 !important",
  },

  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#14b8a6 !important",
  },
};


const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [value, setValue] = useState<dayjs.Dayjs | null>(null);
  const [form, setForm] = useState<FormData>({
    name: '',
    username: '',
    DOB: '',
    email: '',
    password: '',

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

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("username", form.username);
    formData.append("DOB", form.DOB);
    formData.append("email", form.email);
    formData.append("password", form.password);


    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res.data.message);
      setTimeout(() => navigate("/user/login"), 1000);

    } catch (error: any) {
      console.error("Error:", error.response || error.message);

      const { response } = error;
      if (response?.status === 409 && response.data?.redirectToLogin) {
        toast.warning(response.data.message); // show "User already exists. Please login."
        setTimeout(() => navigate("/user/login"), 1500);
      } else {
        toast.error(response?.data?.message || "Registration failed");
      }
    }
  };

  return (
    <>
      <form onSubmit={submitRegister}>
        <div className="min-h-screen flex bg-slate-50">
          {/* right side  */}
          <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-700 text-white p-12 flex-col justify-between">

            {/* Glow Effects */}
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-black/10 blur-3xl"></div>

            {/* Logo */}
            <div className="relative z-10">
              <h2 className="text-4xl font-bold">
                🎵 PriTube
              </h2>
            </div>

            {/* Hero */}
            <div className="relative z-10 max-w-lg">
              <span className="bg-white/20 px-4 py-2  rounded-full text-sm backdrop-blur-md">
                Music • Podcasts • Artists
              </span>

              <p className="mt-6 text-lg text-orange-100 leading-relaxed">
                Explore millions of songs, build playlists,
                follow artists, and enjoy a personalized
                music experience tailored just for you.
              </p>

              <div className="grid grid-cols-3 gap-5 mt-10">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
                  <h3 className="text-3xl font-bold">10M+</h3>
                  <p className="text-sm text-orange-100">Tracks</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
                  <h3 className="text-3xl font-bold">1M+</h3>
                  <p className="text-sm text-orange-100">Artists</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
                  <h3 className="text-3xl font-bold">500K+</h3>
                  <p className="text-sm text-orange-100">Playlists</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="relative z-10 space-y-4">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                🎧 Personalized Recommendations
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                ❤️ Save Unlimited Favorites
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                🎤 Follow Your Favorite Artists
              </div>
            </div>
          </div>

          {/* Left side  */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8">

              {/* Header */}
              <div className="text-center mb-8">

                <h2 className="text-4xl font-bold text-gray-800 mt-2">
                  Create Account
                </h2>

                <p className="text-gray-500 mt-2">
                  Start your musical journey today
                </p>
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
                  sx={{
                    "& .MuiInputBase-input": {
                      color: "#000",
                    },
                    "& .MuiInputLabel-root": {
                      color: "#000",
                    },
                  }}
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
                      <InputAdornment position="start" >
                        <AccountCircle sx={{ color: "#000" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputStyles}
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
                        <EmailOutlinedIcon sx={{ color: "#000" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiInputBase-input": {
                      color: "#000",
                    },
                    "& .MuiInputLabel-root": {
                      color: "#000",
                    },
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
                    sx={{
                      "& .MuiInputBase-input": {
                        color: "#000",
                      },
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                          sx={{ color: "#000" }}
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
                          error: !!formErrors.DOB,
                          helperText: formErrors.DOB,
                          placeholder: "DD/MM/YYYY",
                          InputLabelProps: {
                            shrink: true,
                          },
                          sx: {
                            "& .MuiInputBase-input": {
                              color: "#000",
                            },

                            "& .MuiSvgIcon-root": {
                              color: "#000",
                            },

                            "& .MuiInputLabel-root": {
                              color: "#14b8a6 !important",
                            },

                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "#14b8a6 !important",
                            },

                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#14b8a6 !important",
                              borderWidth: "2px",
                            },

                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#14b8a6 !important",
                            },

                            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#14b8a6 !important",
                            },
                          },
                        },
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>

              {/* Link to Login */}
              <div className="w-full text-right my-2">
                <p className="text-sm text-black">
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
                sx={{
                  background:
                    "linear-gradient(135deg, rgb(20 184 166), rgb(8 145 178), rgb(29 78 216))",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, rgb(15 118 110), rgb(14 116 144), rgb(30 64 175))",
                  },
                }}
              >
                <span className='text-white'>Register</span>
              </Button>
            </div>
          </div>
        </div>
        {/* <div className="flex justify-center items-center min-h-screen px-4 py-8">
        </div> */}
      </form>

    </>
  );
};

export default Register;


