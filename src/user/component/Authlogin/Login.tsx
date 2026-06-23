import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FormControl, OutlinedInput, InputLabel, Button } from '@mui/material';
import BlobsBackground from '../../design/BlobsBackground';
import { toast } from 'react-toastify';
import { useAuth } from '../../../shared/context/Authcontext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    usernameOrEmail: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value.trim() });
  };

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        // "http://localhost:5000/auth/login",
        `${import.meta.env.VITE_API_URL}/auth/login`,
        form,
        { withCredentials: true }
      );
      toast.success(res.data.message);

      // Store token and role in context + localStorage
      if (res.data.token) {
        login(res.data.token, 'user');
      }

      setTimeout(() => navigate('/home'), 1000);
    } catch (error) {
      toast.error("Username/Email or Password is wrong");
    }
  };

  return (
    <>
      <BlobsBackground />
      <form onSubmit={handleForm}>
        <div className="min-h-screen flex">

          {/* LEFT SIDE */}
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
              <span className="bg-white/20 px-4 py-2 rounded-full text-sm backdrop-blur-md">
                Music Streaming Platform
              </span>

              <h1 className="text-6xl font-extrabold mt-6 leading-tight">
                Welcome Back
              </h1>

              <p className="mt-6 text-lg text-cyan-100">
                Continue your musical journey. Access your playlists,
                discover trending tracks, and connect with your favorite artists.
              </p>

              <div className="grid grid-cols-3 gap-4 mt-10">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                  <h3 className="text-3xl font-bold">10M+</h3>
                  <p className="text-sm">Songs</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                  <h3 className="text-3xl font-bold">1M+</h3>
                  <p className="text-sm">Artists</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                  <h3 className="text-3xl font-bold">500K+</h3>
                  <p className="text-sm">Playlists</p>
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

          {/* RIGHT SIDE */}
          <div className="w-full lg:w-1/2 flex items-center justify-center px-6 bg-slate-50">

            <div className="w-full max-w-md border border-slate-300 bg-white rounded-2xl shadow-xl p-8">

              <h1 className="text-4xl font-bold text-center text-teal-500 mb-2">
                Login
              </h1>

              <p className="text-center text-slate-500 mb-8">
                Sign in to continue to PriTube
              </p>

              <div className="flex flex-col gap-6">

                <FormControl fullWidth>
                  <InputLabel htmlFor="usernameOrEmail">
                    Username / Email
                  </InputLabel>

                  <OutlinedInput
                    id="usernameOrEmail"
                    name="usernameOrEmail"
                    label="Username / Email"
                    value={form.usernameOrEmail}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel htmlFor="password">
                    Password
                  </InputLabel>

                  <OutlinedInput
                    id="password"
                    type="password"
                    name="password"
                    label="Password"
                    value={form.password}
                    onChange={handleChange}
                  />
                </FormControl>

                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                >
                  Login
                </Button>

                <p className="text-center text-slate-600">
                  Not registered?{" "}
                  <Link
                    to="/user/register"
                    className="text-teal-600 font-semibold"
                  >
                    Create Account
                  </Link>
                </p>

              </div>
            </div>
          </div>

        </div>
      </form>
    </>
  );
}

export default Login;
