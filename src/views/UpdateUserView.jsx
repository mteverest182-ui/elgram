import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { Await } from "react-router";
import customAPI from "../config/axios";

const UpdateUserView = () => {
  const { user, token } = useAuthStore((state) => state);

  const { setTokenData } = useAuthStore();

  const [bio, setBio] = useState(user.bio);
  const [username, setUsername] = useState(user.username);
  const [fullname, setFullname] = useState(user.fullname);
  const [errorMsg, setErrorMsg] = useState("");
  const [disabled, setDisabled] = useState(false);

  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [isUpdatePhoto, setIsUpdatePhoto] = useState(false);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdatePhoto = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (image) formData.append("image", image);

    setDisabled(true);
    try {
      const { data } = await customAPI.put(
        "/user/update-photo-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTokenData(data.data, token);
      alert("Berhasil Update Photo Profile");
    } catch (error) {
      console.log(error);
    } finally {
      setDisabled(false);
      setIsUpdatePhoto(false);
      setIsUpdatePhoto("");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setDisabled(true);
    setErrorMsg("");
    try {
      const { data } = await customAPI.put(
        "/user/update-user",
        {
          bio,
          username,
          fullname,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTokenData(data.data, token);

      alert("Berhasil Update Profile");
    } catch (error) {
      const message = error.response.data.message;
      const errorMessage = Array.isArray(message) ? message[0] : message;

      setErrorMsg(errorMessage);
    } finally {
      setDisabled(false);
      setIsUpdatePhoto(false);
      setIsUpdatePhoto("");
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full p-4 my-10">
      <h1 className="text-2xl text-info font-bold mb-8 text-center">
        Update profile
      </h1>
      <div className="card bg-base-200 shadow">
        <div className="card-body gap-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-20 rounded-full">
                  <img src={user.image} alt="" />
                </div>
              </div>
              <div>
                {/* Biodata */}
                <p className="font-semibold text-lg">{user.fullname}</p>
                <p className=" text-sm text-gray-500">{user.username}</p>
                <p className="text-sm text-gray-500">
                  {user.bio ? user.bio : "Belum ada biodata"}
                </p>
                {/* Nanti di gass */}
                {!isUpdatePhoto && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setIsUpdatePhoto(true)}
                  >
                    Update Photo Profile
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* Form */}
          {isUpdatePhoto ? (
            <form className="grid gap-3" onSubmit={handleUpdatePhoto}>
              {errorMsg && <p className="text-error">{errorMsg}</p>}
              <div className="form-control">
                <input
                  type="file"
                  className="file-input mb-2 file-input-info"
                  onChange={onFileChange}
                />
              </div>
              {preview && (
                <div>
                  <p>Photo Profile</p>
                  <img src={preview} className="w-100 h-[30vh]" />
                </div>
              )}
              <div className="flex gap-x-2">
                <button
                  className="btn btn-primary "
                  type="submit"
                  disabled={disabled}
                >
                  Update
                </button>
                <button
                  className="btn btn-error "
                  type="button"
                  onClick={() => setIsUpdatePhoto(false)}
                  disabled={disabled}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <form className="grid gap-4" onSubmit={handleUpdateUser}>
              {errorMsg && <p className="text-error">{errorMsg}</p>}
              <div className="form-control">
                <label className="label">Username</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">Fullname</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Fullname"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">Biodata</label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="Biodata"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
              </div>
              {/* Action */}
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={disabled}
              >
                Update
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateUserView;
