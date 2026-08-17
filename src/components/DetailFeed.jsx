import { useEffect, useState } from "react";
import { FaPaperPlane, FaHeart, FaTrash } from "react-icons/fa";
import customAPI from "../config/axios";
import { useAuthStore } from "../stores/authStore";
import userProfil from "../assets/user.png";
import { Navigate, useNavigate } from "react-router";
import { Link } from "react-router";
import formatDateAndTime from "../config/date";
import BtnLike from "./BtnLike";
import BtnBookmark from "./BtnBookmark";

const DetailFeed = ({ post, onClose }) => {
  if (!post) return null;

  const [postData, setPostData] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [content, setContent] = useState("");
  const [disabled, setDisabled] = useState(false);

  const { user, token } = useAuthStore((state) => state);

  const getPostDetail = async () => {
    setLoading(true);

    try {
      const { data } = await customAPI.get(`/feed/${post.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPostData(data.data);
      console.log("Detail Feed", data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await customAPI.delete(`/comment/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getPostDetail();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading: false;
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    setDisabled(true);
    try {
      await customAPI.post(
        "/comment",
        {
          postId: post.id,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setContent("");
      getPostDetail();
    } catch (error) {
      console.log(error);
    } finally {
      setDisabled(false);
    }
  };

  const MyComponent = () => {
    const navigate = useNavigate();
  };

  useEffect(() => {
    getPostDetail();
  }, []);

  useEffect(() => {
    if (!post) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown, handleKeyDown);

    return () => {
      window.addEventListener("keydown", handleKeyDown);
    };
  }, [post, onClose]);

  if (!post) return null;

  return (
    <div className="modal modal-open">
      {loading ? (
        <div className="flex justify-center items-center w-full">
          <span className="loading loading-spinner loading-x1"></span>
        </div>
      ) : (
        <>
          <div className="modal-box max-w-6xl p-0">
            <div className="flex h-[80vh] md:flex-row">
              {/* Left Img */}
              <div className="w-1/2 bg-black flex items-center justify-center">
                <img
                  src={post.image ? post.image : userProfil}
                  className="max-h-full object-contain"
                />
              </div>
              {/* Right Detail */}
              <div className="w-1/2 flex flex-col">
                {/* Header Gaes */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-3">
                    <Link to={`/${user.username}`}>
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img
                            src={
                              post && post.user && post.user.image
                                ? post.user.image
                                : userProfil
                            }
                            alt=""
                          />
                        </div>
                      </div>
                    </Link>
                    <Link to={`/${user.username}`}>
                      <div className="font-semibold text-sm">
                        {post.user?.username}
                      </div>
                    </Link>
                  </div>
                </div>
                {/* Caption  */}
                <div className="p-4 text-sm">
                  <span className="font-semibold">{post.user?.username}</span>{" "}
                  {post.caption}
                </div>
                {/* Comments */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
                  {postData.Comments && postData.Comments.length ? (
                    <>
                      {postData.Comments.map((item, key) => (
                        <div className="flex justify-betweeen" key={key}>
                          <div className="flex gap-x-2">
                            <div className="flex items-center gap-4 mb-6">
                              <div className="avatar">
                                <div className="w-10 rounded-full">
                                  <img
                                    src={
                                      item.user.image
                                        ? item.user.image
                                        : userProfil
                                    }
                                    alt=""
                                  />
                                </div>
                              </div>
                              <div className="px-4 pb-4 text-small">
                                <p>
                                  <span className="font-bold">
                                    {item.user.username}
                                  </span>{" "}
                                  {item.content}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDateAndTime(item.createAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div>
                            {item.user.id === user.id && (
                              <button
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      "Apakah Anda yakin ingin menghapus comment ini ?",
                                    )
                                  ) {
                                    handleDelete(item.id);
                                  }
                                }}
                              >
                                <FaTrash className="text-error cursor-pointer" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <h5 className="text-lg font-semibold">Belum ada Comment</h5>
                  )}
                </div>
                {/* Action */}
                <div className="p-3">
                  <div className="flex justify-between px-4 py-3">
                    <div className="flex gap-4 text-xl">
                      <div className="flex gap-x-2 items-center">
                        <BtnLike postId={postData.id} />
                        <span>{post.likeCount}</span>
                      </div>
                      <div className="flex items-center">
                        <BtnBookmark
                          postId={postData.id}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* INPUT */}
                <form className="p-3 flex gap-2" onSubmit={handleComment}>
                  <input
                    type="text"
                    placeholder="Add a Comment..."
                    className="input input-base-300 w-full text-sm"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <button
                    className="btn btn-primary text-sm"
                    type="submit"
                    disabled={disabled}
                  >
                    Post
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop" onClick={onClose}>
            <button>close</button>
          </div>
        </>
      )}
    </div>
  );
};

export default DetailFeed;
