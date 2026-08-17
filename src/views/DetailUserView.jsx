import { useEffect, useState } from "react";
import { FaBookmark, FaCog, FaTh } from "react-icons/fa";
import customAPI from "../config/axios";
import { useParams } from "react-router";
import userProfile from "../assets/user.png";
import { useAuthStore } from "../stores/authStore";
import DetailFeed from "../components/DetailFeed";
import { Link } from "react-router";
import BtnFollow from "../components/BtnFollow";

const DetailUserView = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPost, setIsPost] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  const params = useParams();

  const { user } = useAuthStore((state) => state);

  const getUserProfile = async () => {
    setLoading(true);

    try {
      const { data } = await customAPI.get(`/user/${params.username}`);
      setUserData(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center w-full">
          <span className="loading loading-spinner loading-x1"></span>
        </div>
      ) : (
        <main className="flex-1 flex justify-center pb-16 md:pb-0">
          <div className="flex justify-center bg-base-100 min-h-screen">
            <div className="w-full max-w-4xl px-4">
              {/* Profile Header*/}
              <div className="flex flex-col md:flex-row gap-8 py-10">
                {/* Avatar  */}
                <div className="flex justify-center md:w-1/3">
                  <div className="avatar">
                    <div className="w-36 rounded-full">
                      <Link to={`/${user.username}`}>
                        <img
                          src={
                            userData && userData.image
                              ? userData.image
                              : userProfile
                          }
                        />
                      </Link>
                    </div>
                  </div>
                </div>
                {/* Info */}
                <div className="flex-1 space-y-4">
                  {/* Username */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <h2 className="text-xl font-light">{userData?.fullname}</h2>
                    {user && userData && user.id === userData.id ? (
                      <Link to={"/setting"}>
                        <FaCog className="text-xl cursor-pointer" />
                      </Link>
                    ) : (
                      <BtnFollow selectedUser={userData} />
                    )}
                  </div>
                  {/* Stats */}
                  <div className="flex gap-6 text-sm">
                    <p>
                      <span className="font-bold">{userData?.postCount}</span>{" "}
                      Post
                    </p>
                    <p>
                      <span className="font-bold">
                        {userData?.followerCount}
                      </span>{" "}
                      Followers
                    </p>
                    <p>
                      <span className="font-bold">
                        {userData?.followingCount}
                      </span>{" "}
                      Following
                    </p>
                  </div>
                  {/* Biodata */}
                  <div className="text-sm">
                    <p className="font-semibold">{userData?.username}</p>
                    <p>
                      {userData && userData.bio
                        ? userData.bio
                        : "Belum ada biodata"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="divider"></div>
              {/* Tab Menu */}
              <div className="flex justify-center gap-10 text-sm uppercase tracking-widest">
                <button
                  className={`${isPost ? "border-b-2 border-white" : "text-gray-400"}py-3 flex items-center gap-2`}
                  onClick={() => setIsPost(true)}
                >
                  <FaTh /> Post
                </button>
                <button
                  className={`${!isPost ? "border-b-2 border-white" : "text-gray-400"}py-3 flex items-center gap-2 cursor-pointer`}
                  onClick={() => setIsPost(false)}
                >
                  <FaBookmark /> Bookmark
                </button>
              </div>
              {/* Post Grid */}
              <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-1 mt-4">
                {isPost ? (
                  <>
                    {userData && userData.post && userData.post.length ? (
                      <>
                        {userData.post.map((post, key) => (
                          <div
                            key={key}
                            className="aspect-square overflow-hidden cursor-pointer"
                          >
                            <img
                              src={post.image}
                              className="w-full h-full object-cover hover:scale-110 transition"
                              onClick={() => setSelectedPost(post)}
                            />
                          </div>
                        ))}
                      </>
                    ) : (
                      <h1 className="text-xl text-center font-semibold">
                        Belum ada Post
                      </h1>
                    )}
                  </>
                ) : (
                  <>
                    {userData &&
                    userData.bookmarks &&
                    userData.bookmarks.length ? (
                      <>
                        {userData.bookmarks.map((book, key) => (
                          <div
                            key={key}
                            className="aspect-square overflow-hidden cursor-pointer"
                          >
                            <img
                              src={book.post.image}
                              className="w-full h-full object-cover hover:scale-110 transition"
                              onClick={() => setSelectedPost(book.post)}
                            />
                          </div>
                        ))}
                      </>
                    ) : (
                      <h1 className="text-xl text-center font-semibold">
                        Belum ada Bookmarks
                      </h1>
                    )}
                  </>
                )}
              </div>
            </div>
            {selectedPost && (
              <DetailFeed
                post={selectedPost}
                onClose={() => setSelectedPost(null)}
              />
            )}
          </div>
        </main>
      )}
    </>
  );
};

export default DetailUserView;
