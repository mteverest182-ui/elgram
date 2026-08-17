import {
  FaHome,
  FaPlusSquare,
  FaSearch,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { Outlet, Link, useNavigate, Navigate } from "react-router";
import { useAuthStore } from "../stores/authStore";

const HomeLayout = () => {
  const { removeTokenData, isAuthentication } = useAuthStore();
  const navigate = useNavigate();

  const { user } = useAuthStore((state) => state);

  const handleLogout = () => {
    removeTokenData();
    navigate("/login");
  };
  return isAuthentication ? (
    <div className="flex min-h-screen bg-base-200">
      {/* Sidebar Desktop*/}
      <aside className="hidden bg-base-100 lg:flex w-64 px-6 py-6 flex-col justify-between sticky top-0 h-screen overflow-hidden">
        <div>
          <h1 className="text-5xl font-logo mb-10">El - Gram</h1>
          <ul className="menu gap-3 text-base">
            <li className="text-3xl">
              <Link to={"/"}>
                <FaHome /> Home
              </Link>
            </li>
            <li className="text-xl">
              <Link to="/search">
                <FaSearch /> Search
              </Link>
            </li>
            <li className="text-xl">
              <Link to={"/create"}>
                <FaPlusSquare /> Create
              </Link>
            </li>
            <li className="text-xl">
              <Link to={`/${user.username}`}>
                <FaUserCircle /> Profile
              </Link>
            </li>
          </ul>
        </div>
        <button className="btn btn-outline btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </aside>
      {/* Sidebar Tablet */}
      <aside className="hidden md:flex bg-base-100 lg:hidden w-20 shadow-md flex-col items-center py-6 gap-8 sticky top-0 h-screen overflow-hidden">
        <Link to={"/"}>
          <FaHome className="text-2xl cursor-pointer" />
        </Link>
        <Link to="/search">
          <FaSearch className="text-2xl cursor-pointer" />
        </Link>
        <Link to={"/create"}>
          <FaPlusSquare className="text-2xl cursor-pointer" />
        </Link>
        <Link to={`/${user.username}`}>
          <FaUserCircle className="text-2xl cursor-pointer" />
        </Link>
        <FaSignOutAlt
          className="text-2xl cursor-pointer text-error"
          onClick={handleLogout}
        />
      </aside>
      {/* Main */}
      <Outlet />
      <nav className="fixed bottom-0 left-0 right-0 bg-base-300 flex justify-around py-3 md:hidden">
        <Link to={"/"}>
          <FaHome className="text-xl" />
        </Link>
        <Link to="/search">
          <FaSearch className="text-xl" />
        </Link>
        <Link to={"/create"}>
          <FaPlusSquare className="text-xl" />
        </Link>
        <Link to={`/${user.username}`}>
          <FaUserCircle className="text-xl" />
        </Link>
        <FaSignOutAlt className="text-xl text-error" onClick={handleLogout} />
      </nav>
    </div>
  ) : (
    <Navigate to={"/login"} replace />
  );
};

export default HomeLayout;
