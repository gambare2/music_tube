
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface User {
  name: string;
  username: string;
  email: string;
  DOB?: string;
  profile?: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        withCredentials: true,
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to load profile");
      });
  }, []);

  if (!user) {
    return <div className="text-center mt-10">Loading profile...</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border">
      <div className="flex flex-col items-center">
        <img
          src={user.profile || "/default-avatar.png"}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-gray-200"
        />
        <h2 className="mt-4 text-2xl font-semibold">{user.name}</h2>
        <p className="text-gray-500">@{user.username}</p>
      </div>

      <div className="mt-6 space-y-3">
        <p>
          <span className="font-medium">Email:</span> {user.email}
        </p>
        {user.DOB && (
          <p>
            <span className="font-medium">DOB:</span> {user.DOB}
          </p>
        )}
      </div>

      <div className="mt-6 text-center">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={() => toast.info("Edit profile feature coming soon")}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}

