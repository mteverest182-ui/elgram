import { useState } from "react";
import customAPI from "../config/axios";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router";

const CreateFeedView = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [disabled, setDisabled] = useState("false");
  const [preview, setPreview] = useState("false");

  const { token } = useAuthStore();
  const navigate = useNavigate();

  const OnFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("caption", caption);
    if (image) formData.append("image", image);

    setDisabled(true);
    try {
      await customAPI.post("/feed", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setDisabled(false);
    }
  };
  return (
    <main className="my-10 w-full mx-15 p-16 mb:pb-0">
      <fieldset className="fieldset border-none w-full w-max-3x1 p-4">
        <form onSubmit={handleCreatePost}>
          <h1 className="text-info text-3xl font-bold mb-2">Create Post</h1>
          <div className="divider"></div>
          <input
            type="file"
            className="file-input mb-2 file-input-info"
            onChange={OnFileChange}
          />
          {preview && <img src={preview} className="w-100 h-[30vh]" />}
          <textarea
            className="textarea w-full mb-2"
            placeholder="Masukkan Caption Postingan Anda"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          ></textarea>
          <input
            type="submit"
            className="btn btn-primary"
            value={"Create Post"}
          />
        </form>
      </fieldset>
    </main>
  );
};

export default CreateFeedView;
