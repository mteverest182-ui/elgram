import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import customAPI from "../config/axios";
import userProfile from "../assets/user.png";
import { Link } from "react-router";
import BtnFollow from "../components/BtnFollow";

const SearchView = () => {
  const [query, setQuery] = useState("");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disable, setDisabled] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = async (q) => {
    setDisabled(true);
    setLoading(true);

    try {
      const { data } = await customAPI.get(`user/search?username=${q}`);
      setUsers(data.data);
      setError(null);
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setLoading(false);
      setDisabled(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto w-full p-4 my-10">
      <h1 className="text-lg font-semibold mb-4 text-info">Searching</h1>
      {/* input form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchUser(query);
        }}
      >
        <div className="input input-bordered flex items-center gap-2 w-full">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            className="grow"
            placeholder="Searching User..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={disable}
          >
            Search
          </button>
        </div>
      </form>
      {/* Output */}
      <div>
        <div className="flex flex-col gap-3">
          {users.map((item) => {
            return (
              <div
                className="flex items-center justify-between p-3 rounded-xl hover:bg-base-200 cursor-pointer"
                key={item.id}
              >
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-12 rounded-full">
                      <img src={item.image ? item.image : userProfile} alt="" />
                    </div>
                  </div>
                  <div>
                    <Link
                      className="font-semibold text-info text-sm"
                      to={`/${item.username}`}
                    >
                      {item.username}
                    </Link>
                    <p className="text-xs text-gray-500">{item.fullname}</p>
                  </div>
                </div>
                <BtnFollow selectedUser={item} />
              </div>
            );
          })}
          {error && (
            <p className="text-center text-xl text-gray-500 mt-8">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchView;
