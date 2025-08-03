import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FormControl, OutlinedInput, InputLabel, Button } from '@mui/material';
import BlobsBackground from '../../design/BlobsBackground';
import { toast } from 'react-toastify';

function Login() {
  const navigate = useNavigate();
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
        // "http://localhost:5000/api/auth/login",
        `${import.meta.env.VITE_API_URL}/auth/login`,
        form,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setTimeout(() => navigate('/home'), 1000);
    } catch (error) {
      toast.error("Username/Email or Password is wrong");
    }
  };

  return (
    <>
      <BlobsBackground />
      <form onSubmit={handleForm}>
        <div className="container mx-auto flex justify-center items-center min-h-screen px-4">
          <div className="border border-slate-300 bg-slate-100 w-full md:w-2/5 rounded-xl shadow-md p-6">
            <h1 className="text-4xl font-bold text-center text-teal-500 mb-8">Login</h1>

            <div className="flex flex-col items-center gap-y-6">
              <FormControl fullWidth>
                <InputLabel htmlFor="usernameOrEmail">Username / Email</InputLabel>
                <OutlinedInput
                  id="usernameOrEmail"
                  placeholder="Enter your username or email"
                  name="usernameOrEmail"
                  label="Username / Email"
                  onChange={handleChange}
                  value={form.usernameOrEmail}
                />
              </FormControl>

              <FormControl fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  name="password"
                  label="Password"
                  onChange={handleChange}
                  value={form.password}
                />
              </FormControl>

              <div className="w-full text-right">
                <Link
                  to="/forgot-password"
                  className="text-blue-700 text-sm hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button type="submit" variant="contained" fullWidth>
                Login
              </Button>

              <p className="text-sm">
                Not registered?{" "}
                <Link
                  to="/user/register"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default Login;



 {/* <span className='border-b-2 border-slate-600 w-1/2 md:my-3 '></span>
              <Button
                sx={{
                  backgroundColor: 'white',
                  margin: 2
                }}
                variant='outlined'
                onClick={handlelogin}
              >
                <span className='text-black font7 font-extralight'>Login with Google</span>
                <img src="icons8-google.svg" alt=""
                  className='size-5 md:ml-1' />
              </Button>
              <Button
                sx={{
                  backgroundColor: 'white',

                }}
                variant='outlined'
                onClick={handlelogin}
              >
                <span className='text-black font7 font-extralight'>Login with facebook</span>
                <img src="icons8-facebook.svg" alt=""
                  className='md:ml-1 size-5' />
              </Button> */}
