import { useState } from 'react'
import React from 'react'
import axios from 'axios'
import { Link, useNavigate} from 'react-router-dom'
import { FormControl, OutlinedInput, InputLabel, Button } from '@mui/material'
import BlobsBackground from '../../user/design/BlobsBackground'
import {toast} from 'react-toastify'

  function Login() {
    const navigate = useNavigate();
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' })

  const handleChange= (e: React.ChangeEvent<HTMLInputElement>) =>setForm({
    ...form, [e.target.name]: e.target.value
  });
  
  // const handlelogin = async(provider) => {
  //     window.location.href = `http://localhost:5000/auth/${provider}`
  // }

const handleForm = async(e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  try {
    const res = await axios.post('http://localhost:5000/auth/login', form);
    toast.success(res.data.message);
    setTimeout(() => {
      navigate('/admin/dashboard');
    }, 1000);
  } catch (error) {
    alert("Username/Email or Password is wrong")
  }
}
  return (
    <>
      <form onSubmit={handleForm}>
      <BlobsBackground/>

        <div className='container md-auto flex justify-center relative top-14 login-container '>
          <div className='border border-slate-500 bg-slate-200 w-2/5'>
          <h1 className='font-bold font8 text-center md:mx-4 text-4xl text-teal-400 '>
            Login
          </h1>
          <div className='flex flex-wrap justify-center items-center md:py-10 flex-col'>
            <FormControl
            sx={{ mt: 4 }}>
              <InputLabel htmlFor="component-outlined">Username</InputLabel>
              <OutlinedInput
                id="component-outlined"
                defaultValue=""
                placeholder='Username / E-mail'
                label="username"
                name=' usernameOrEmail'
                aria-describedby="component-error-text"
                onChange={handleChange}
                />
            </FormControl>
            <FormControl sx={{ mt: 4 }}>
              <InputLabel htmlFor="component-outlined">Password</InputLabel>
              <OutlinedInput
                id="component-outlined"
                defaultValue=""
                placeholder='pass12@'
                label="Password"
                name='password'
                aria-describedby="component-error-text"
                onChange={handleChange}
                />
            </FormControl>
            <div className='relative left-14 md:mb-4'>

            <Link 
            className='text-blue-700 md:mx-3 text-sm  '
            to={'/forgot-password'}>Forget Password ?</Link>
            </div>
            <Button 
            type='submit'
            variant='outlined'>
                <span className='text-black'>Login</span>
            </Button>
            <span>Not Register |
              <Link to={'/admin/register'}
            className='text-blue-600 md:mx-3 transition-all duration-500 ease-in-out hover:text-blue-800'>
            Create account
            </Link>
            </span>
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
           className='size-5 md:ml-1'/>
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
            className='md:ml-1 size-5'/>
           </Button> */}

          </div>

             </div>
        </div>
      </form>
    </>
  )
}
   
export default Login
