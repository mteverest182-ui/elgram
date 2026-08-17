import { useState } from "react";
import { Link, useNavigate } from "react-router";
import customAPI from "../config/axios";
import { useAuthStore } from "../stores/authStore";

const RegisterView = () => {
  const [errorMessage, setErrormessage] = useState("");
  const [disable, setDisable] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
  });

  //Store
  const { setTokenData } = useAuthStore();

  //Navigasi
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await customAPI.post("/auth/register", formData);

      setTokenData(data.data, data.token);
      navigate("/");
    } catch (error) {
      console.log(error.response);
      const errorMsg = error.response.data.message;
      const errorData = Array.isArray(errorMsg) ? errorMsg[0] : errorMsg;
      setErrormessage(errorData);
    } finally {
      setDisable(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto group">
      {/* Rainbow border / glow */}
      <div
        className="
      absolute
      -inset-px
      rounded-1xl
      bg-[conic-gradient(from_0deg,#ff0000,#ff7a00,#ffff00,#00ff00,#00ffff,#0080ff,#8000ff,#ff00ff,#ff0000)]
      animate-spin-slow
      blur-sm
      opacity-80
      group-hover:opacity-100
      transition-opacity
    "
      />

      {/* Register Card */}
      <div className="relative rounded-2xl bg-base-100 p-6">
        <form>
          <div className="text-center">
            <h1 className="font-logo text-5xl">El - Gram</h1>

            <p className="font-semibold mt-3 leading-7">
              Sign up to see Photos and videos from your friends.
            </p>
          </div>

          {errorMessage && (
            <p className="text-error text-center my-2">{errorMessage}</p>
          )}

          <div className="divider"></div>

          <input
            type="email"
            placeholder="Email"
            className="w-full bg-base-300 input input-bordered mb-3"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-base-300 input input-bordered mb-3"
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Fullname"
            className="w-full bg-base-300 input input-bordered mb-3"
            value={formData.fullname}
            onChange={(e) =>
              setFormData({
                ...formData,
                fullname: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Username"
            className="w-full bg-base-300 input input-bordered"
            value={formData.username}
            onChange={(e) =>
              setFormData({
                ...formData,
                username: e.target.value,
              })
            }
          />

          <button
            className="btn btn-info w-full my-4"
            type="submit"
            disabled={disable}
          >
            {disable ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="divider">OR</div>

        <div className="card bg-base-100 border border-info-content">
          <div className="card-body py-4 text-center text-sm">
            Have an Account?{" "}
            <Link to="/login">
              <span className="link no-underline link-primary font-semibold cursor-pointer">
                Log In
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;
