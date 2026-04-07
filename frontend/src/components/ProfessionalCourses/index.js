import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../../config/api";
import "./index.css";

function ProfessionalCourses() {

const [courses, setCourses] = useState([]);
const [teachers, setTeachers] = useState([]);
const [itTech, setItTech] = useState([]);
const [animationTech, setAnimationTech] = useState([]);

const token = localStorage.getItem("token");

useEffect(() => {

fetch(`${API.BASE}/api/professional-courses`)
.then(res => res.json())
.then(data => setCourses(data));

fetch(`${API.BASE}/api/course-teachers`)
.then(res => res.json())
.then(data => setTeachers(data));

fetch(`${API.BASE}/api/it-technologies`)
.then(res => res.json())
.then(data => setItTech(data));

fetch(`${API.BASE}/api/animation-technologies`)
.then(res => res.json())
.then(data => setAnimationTech(data));

}, []);

const deleteTeacher = async (id) => {

if (!window.confirm("Delete teacher?")) return;

await fetch(`${API.BASE}/api/course-teachers/${id}`, {
method: "DELETE",
headers: {
Authorization: `Bearer ${token}`
}
});

window.location.reload();

};

const isManagePage = window.location.pathname === "/manage-teachers";

return (

<div className="professional-page">

<div className="bg1"></div>
<div className="bg2"></div>

<section className="professional-section">

<h2 className="section-title">Professional Courses</h2>

<div className="course-grid">

{courses
.filter(course =>
course.course_name.toLowerCase().includes("it") ||
course.course_name.toLowerCase().includes("animation")
)
.map(course => {

const isIT = course.course_name.toLowerCase().includes("it");

return (

<div key={course.id} className="course-card">

<div className="card-content">

<h3>{course.course_name}</h3>

<p className="course-desc">{course.description}</p>

<h4>Technologies</h4>

<ul className="tech-list">

{(isIT ? itTech : animationTech).map(t => (

<li key={t.id}>
<b>{t.tech_name}</b> — {t.description}
</li>

))}

</ul>

<h4>Course Teachers</h4>

<div className="teacher-grid">

{teachers
.filter(t => t.course_type === (isIT ? "IT" : "Animation"))
.map(t => (

<div key={t.id} className="teacher-card">

<img
src={`${API.BASE}/uploads/course-teachers/${t.photo}`}
alt=""
/>

<h5>{t.name}</h5>

<p>{t.designation}</p>

<span>{t.experience}</span>

{isManagePage && (

<button
className="delete-btn"
onClick={() => deleteTeacher(t.id)}
>
Delete
</button>

)}

</div>

))}

</div>

</div>

{/* ✅ BUTTON ALWAYS BOTTOM */}
<Link
to={`/professional-course/${course.id}`}
className="details-btn bottom-btn"
>
View Details
</Link>

</div>

);

})}

</div>

</section>

</div>

);

}

export default ProfessionalCourses;