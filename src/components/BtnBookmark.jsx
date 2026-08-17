import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import customAPI from "../config/axios";
import { useEffect } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

const BtnBookmark = ({ postId }) => {
  const [checkBookmark, setCheckBookmark] = useState(null);
  const [loading, setLoading] = useState(false);

  const { token } = useAuthStore((state) => state);

  const getCheckBookmark = async () => {
    try {
      setLoading(true);
      const { data } = await customAPI.get(`bookmark/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCheckBookmark(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCheckBookmark();
  }, []);

  const toggleBookmark = async () => {
    try {
      const { data } = await customAPI.post(
        `bookmark/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      getCheckBookmark();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {loading ? (
        <span className="loading loading-sm loading-spinner"></span>
      ) : (
        <>
          {checkBookmark ? (
            <FaBookmark
              className="cursor-pointer text-red-500 transition"
              onClick={() => toggleBookmark()}
            />
          ) : (
            <FaRegBookmark
              className="cursor-pointer transition"
              onClick={() => toggleBookmark()}
            />
          )}
        </>
      )}
    </>
  );
};

export default BtnBookmark;
