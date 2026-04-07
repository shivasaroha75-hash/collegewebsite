import React, { useEffect, useState } from "react";
import { API } from "../../config/api";
import "./index.css";

function CoursesSection() {

  const [courses, setCourses] = useState([]);

  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = () => {

    fetch(`${API.BASE}/api/courses`)
      .then(res => res.json())
      .then(data => setCourses(data));

  };

  const handleAdd = async (e) => {

    e.preventDefault();

    await fetch(`${API.BASE}/api/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name,
        duration,
        description
      })
    });

    setName("");
    setDuration("");
    setDescription("");

    loadCourses();

  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete course?")) return;

    await fetch(`${API.BASE}/api/courses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    loadCourses();

  };

  return (

    <div className="courses-section">

      <h2>Our Courses</h2>

      {token && (

        <form className="course-form" onSubmit={handleAdd}>

          <input
            placeholder="Course Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button>Add Course</button>

        </form>

      )}

      <div className="courses-list">

        {courses.map((course) => (

          <div key={course.id} className="course-item">

            <h4>{course.name}</h4>

            <p><b>Duration:</b> {course.duration}</p>

            <p>{course.description}</p>

            {token && (

              <button
                className="delete-btn"
                onClick={() => handleDelete(course.id)}
              >
                Delete
              </button>

            )}

          </div>

        ))}

      </div>

    </div>

  );

}

export default CoursesSection;