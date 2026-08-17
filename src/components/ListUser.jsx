import { useEffect, useState } from "react";
import customAPI from "../config/axios";
import { useAuthStore } from "../stores/authStore";
import userProfile from "../assets/user.png";
import { Link } from "react-router";
import BtnFollow from "./BtnFollow";
const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, token } = useAuthStore((state) => state);

  const getUserData = async () => {
    setLoading(true);

    try {
      const { data } = await customAPI.get("/follow/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center w-full">
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      ) : (
        <>
          {users.map((user) => (
            <div
              className="flex items-center justify-between mb-4"
              key={user.id}
            >
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img src={user.image ? user.image : userProfile} />
                  </div>
                </div>
                <div>
                  <Link
                    to={`/${user.username}`}
                    className="text-sm font-semibold"
                  >
                    {user.fullname}
                  </Link>
                  <p className="text-xs text-gray-500">{user.username}</p>
                </div>
              </div>
              <BtnFollow selectedUser={user} />
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default ListUser;
