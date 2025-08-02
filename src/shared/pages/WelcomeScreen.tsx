import React from 'react'
import { Link } from 'react-router-dom'
import AnimatedBackground from '../../user/design/AnimatedBackground'

function WelcomeScreen() {
    return (
        <div  >
            <AnimatedBackground/>
            <div className='flex flex-col justify-center h-screen'>
                <span className='flex flex-col items-center  justify-center'>
                <h1 className='text-5xl font8 font-bold text-orange-800'>🙏🏻Welcome
                </h1>
                <span className="flex flex-row text-3xl gap-2 font-bold font2 py-2 px-1">
                    <img src="/Music_tube.svg" alt="" className="size-12" 
                     /> Pritube
                </span>
                     </span>

                     <span className='text-xl flex justify-center  font-bold font8 '>
                        Choose your preference to continue
                     </span>
                     <span className='flex flex-col items-center justify-center'>
                      <ul className='text-sm   list-disc'>
                        <li >
                         To listen to music, you need to register first as a user.
                        </li>
                        <li>
                         To manage your music and upload, you need to register first as an admin.
                        </li>
                      </ul>
                     </span>
                    
                    
                
                <div className='flex flex-row gap-4 justify-center md:mt-6'>
                    
                    <Link to="/user/register"
                     className='text-2xl font-bold font1 text-orange-600 bg-gray-100  border-2 border-orange-800 rounded-md md:p-20 p-10
                      hover:bg-orange-100 hover:underline hover:text-orange-800'>
                         User</Link>
                    <Link to="/admin/register"
                     className='text-2xl font-bold font1 text-orange-600 bg-gray-100 border-2 border-orange-800 rounded-md p-20
                     hover:bg-orange-100 hover:underline hover:text-orange-800'>
                        Admin</Link>
                </div>
            </div>
        </div>
    )
}

export default WelcomeScreen
