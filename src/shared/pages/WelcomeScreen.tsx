
import { Link } from 'react-router-dom'
import AnimatedBackground from '../../user/design/AnimatedBackground'

function WelcomeScreen() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center relative px-4">
        <AnimatedBackground />
      
        <div className="z-10 text-center">
          {/* Welcome Header */}
          <h1 className="text-3xl md:text-5xl font8 font-bold text-orange-800 mb-2">🙏🏻 Welcome</h1>
      
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 text-2xl md:text-3xl font-bold font2 text-orange-800 py-2">
            <img src="/Music_tube.svg" alt="Logo" className="w-10 md:w-12" />
            Pritube
          </div>
      
          {/* Subtitle */}
          <p className="text-base md:text-xl font8 font-bold text-gray-700 mb-4">
            Choose your preference to continue
          </p>
      
          {/* Instructions */}
          <ul className="text-sm md:text-base text-left list-disc list-inside mx-auto max-w-md mb-6">
            <li>To listen to music, register first as a user.</li>
            <li>To manage and upload music, register as an admin.</li>
          </ul>
      
          {/* Buttons */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <Link
              to="/user/register"
              className="text-xl md:text-2xl font-bold font1 text-orange-600 bg-gray-100 border-2 border-orange-800 rounded-md px-10 py-4 hover:bg-orange-100 hover:underline hover:text-orange-800 w-full md:w-auto text-center"
            >
              User
            </Link>
            <Link
              to="/admin/register"
              className="text-xl md:text-2xl font-bold font1 text-orange-600 bg-gray-100 border-2 border-orange-800 rounded-md px-10 py-4 hover:bg-orange-100 hover:underline hover:text-orange-800 w-full md:w-auto text-center"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
      
    )
}

export default WelcomeScreen
