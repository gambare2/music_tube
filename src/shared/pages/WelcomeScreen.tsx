
import { Link } from 'react-router-dom'


function WelcomeScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-400/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-400/20 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-yellow-300/10 blur-[100px] rounded-full" />
      </div>
      <div className="max-w-6xl w-full">

        {/* Logo */}
        <div className="text-center relative z-10">

          <span className="px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-medium">
            Next Generation Music Platform
          </span>

          <h1 className="mt-3 text-6xl md:text-7xl font-black">
            <span className="text-gray-900">
              Welcome to
            </span>

            <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              PriTube
            </span>
          </h1>

          <p className="max-w-2xl mx-auto mt-3 text-xl text-gray-600">
            Discover trending songs, build playlists,
            upload your music, and connect with artists
            from around the world.
          </p>

        </div>
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 my-10">

          <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl">
            <h3 className="text-3xl font-bold">50K+</h3>
            <p>Songs Available</p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl">
            <h3 className="text-3xl font-bold">10K+</h3>
            <p>Active Users</p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl">
            <h3 className="text-3xl font-bold">5K+</h3>
            <p>Artists</p>
          </div>

        </div>

        {/* Registration Options */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* User Card */}
          <Link
            to="/user/register"
            className="group relative overflow-hidden bg-white/20 rounded-[32px] p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-200 rounded-full blur-3xl opacity-40" />
            <div className="relative z-10">
              <div className='flex flex-row gap-4'>
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-4xl">
                  <span>🎧</span>
                </div>
                <h2 className="text-3xl text-orange-500 font-bold mt-6">
                  Listener
                </h2>
              </div>
              <p className="mt-3 text-orange-400">
                Explore music, follow artists and enjoy
                personalized recommendations.
              </p>
              <div className="mt-6 font-semibold text-orange-600">
                Enter Listener Portal →
              </div>
            </div>
          </Link>
          {/* Admin Card */}
          <Link
            to="/admin/register"
            className="group bg-gradient-to-br from-orange-500 to-orange-700 text-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className='flex flex-row gap-4'>
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                🎵
              </div>
              <h3 className="text-3xl font-bold mt-4">
                Admin Account
              </h3>
            </div>
            <p className="my-3 text-orange-100">
              Manage artists, upload songs, monitor users,
              and control platform content.
            </p>
            <div className="mt-6 font-semibold">
              Register as Admin →
            </div>
          </Link>

        </div>

      </div>

    </div>

  )
}

export default WelcomeScreen
