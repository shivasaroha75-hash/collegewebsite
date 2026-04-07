import { useState } from "react";
import { API } from "../../config/api";   // 👈 IMPORTANT

function GalleryUpload() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file");
      return;
    }

    const token = localStorage.getItem("token"); // 👈 token localStorage se

    if (!token) {
      alert("Please login first");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", file);

    try {
      const response = await fetch(`${API.BASE}/api/gallery`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        alert("Upload Successful");
        setTitle("");
        setFile(null);
      } else {
        alert(data.message || "Upload Failed");
      }

    } catch (error) {
      console.error(error);
      alert("Upload Failed");
    }
  };

  return (
    <div style={{ marginTop: "50px", textAlign: "center" }}>
      <h2>Upload Gallery Image</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <br /><br />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <br /><br />

        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default GalleryUpload;