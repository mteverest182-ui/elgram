import {
  FaHeart,
  FaPaperPlane,
  FaRegBookmark,
  FaRegComments,
} from "react-icons/fa";
import { data, Link } from "react-router";
import { useAuthStore } from "../stores/authStore";
import { useEffect, useState } from "react";
import customAPI from "../config/axios";
import formatDateAndTime from "../config/date";
import { FaTrash } from "react-icons/fa";
import DetailFeed from "../components/DetailFeed";
import ListUser from "../components/ListUser";
import BtnLike from "../components/BtnLike";
import BtnBookmark from "../components/BtnBookmark";
import UserProfile from "../assets/user.png";

const HomeView = () => {
  const [loading, setLoading] = useState(false);
  const [feeds, setFeeds] = useState([]);
  const { user, token } = useAuthStore((state) => state);
  const [selectedPost, setSelectedPost] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const getAllFeeds = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await customAPI.get(`/feed?page=${page}&limit=5`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFeeds((prev) => [...prev, ...res.data.data]);
      setTotalPage(res.data.totalPage);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are You Sure ?");
    if (confirm) {
      await customAPI.delete(`/feed/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      return;
    }
  };

  useEffect(() => {
    getAllFeeds();
  }, [page]);

  useEffect(() => {
    const HandleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

      if (bottom && !loading && page < totalPage) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", HandleScroll);

    return () => window.removeEventListener("scroll", HandleScroll);
  }, [loading, page, totalPage]);

  return (
    <>
      <main className="flex-1 flex justify-center pb-16 md:pb-0">
        {feeds.length ? (
          <div className="w-full max-w-xl">
            {feeds.map((item, key) => (
              <div className="border-b" key={`feed-${key}`}>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-10 rounded-full">
                        <Link to={`/${item.user.username}`}>
                          <img
                            src={
                              item.user.image ? item.user.image : UserProfile
                            }
                            alt=""
                          />
                        </Link>
                      </div>
                    </div>
                    <span className="font-semibold text-sm">
                      {item.user.username}
                    </span>
                  </div>
                  <span className="cursor-pointer">
                    {user.id === item.user.id ? (
                      <FaTrash
                        className="text-red-500"
                        onClick={() => handleDelete(item.id)}
                      />
                    ) : null}
                  </span>
                </div>
                {/* Image */}
                <img
                  src={item.image}
                  alt=""
                  className="w-full cursor-pointer"
                  onClick={() => setSelectedPost(item)}
                />
                {/* Action */}
                <div className="flex justify-between px-4 py-3">
                  <div className="flex gap-4 text-xl">
                    <BtnLike postId={item.id} />
                    <FaRegComments
                      className="cursor-pointer"
                      onClick={() => setSelectedPost(item)}
                    />
                    <FaPaperPlane className="cursor-pointer" />
                  </div>
                  <BtnBookmark postId={item.id} />
                </div>
                {/* Caption */}
                <div className="px-4 pb-4 text-sm">
                  <p className="font-semibold">{item.likeCount}likes</p>
                  <p className="">
                    <span className="font-bold">{item.user.username}</span>{" "}
                    {item.caption.substring(0, 100)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDateAndTime(item.createAt)}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-center py-6">
                <div className="loading loading-spinner loading-md"></div>
              </div>
            )}

            {page === totalPage && (
              <p className="text-center text-gray-400 py-6">
                Semua Feed Sudah Tampil
              </p>
            )}
          </div>
        ) : (
          <div className="w-full">
            {/* info current user */}
            <div className="flex flex-col gap-4 my-50 mx-auto p-30 w-2xl bg-base-100">
              <ListUser />
            </div>
          </div>
        )}
        {/* Tempat Buat Modal Pop Up */}
        {selectedPost && (
          <DetailFeed
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
          />
        )}
      </main>
      <aside className="hidden lg:flex w-80 px-6 py-7 sticky top-0 h-screen flex-col">
        <div className="avatar">
          <img className="w-15 rounded-full " src={user.image} />
        </div>
        <div>
          <p className="font-semibold text-sm">{user.fullname}</p>
          <p className="text-xs text-gray-500">{user.username}</p>
        </div>

        {/* Suggest User */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm font-semibold text-gray-500">
            Suggested for you
          </p>
        </div>
        {/* List Suggest User */}
        <ListUser />
      </aside>
    </>
  );
};

export default HomeView;
