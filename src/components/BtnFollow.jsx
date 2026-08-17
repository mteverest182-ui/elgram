import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore";
import customAPI from "../config/axios";

const BtnFollow = ({ selectedUser }) => {
  const [isFollow, setIsFollow] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user, token } = useAuthStore((state) => state);

  const isFollowUser = async () => {
    setLoading(true);

    try {
      const { data } = await customAPI.get(`/follow/${selectedUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsFollow(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (id) => {
    setLoading(true);
    try {
      await customAPI.delete(`/follow/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      isFollowUser();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (id) => {
    setLoading(true);

    try {
      await customAPI.post(
        "/follow",
        {
          followUserId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      isFollowUser();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    isFollowUser();
  }, []);

  return (
    <>
      {loading ? (
        <span className="loading loading-sm loading-spinner"></span>
      ) : (
        <>
          {isFollow ? (
            <button
              className="btn btn-md btn-ghost text-error"
              onClick={() => handleUnfollow(selectedUser.id)}
            >
              unfollow
            </button>
          ) : (
            <button
              className="btn btn-md btn-ghost text-primary"
              onClick={() => handleFollow(selectedUser.id)}
            >
              follow
            </button>
          )}
        </>
      )}
    </>
  );
};

export default BtnFollow;
