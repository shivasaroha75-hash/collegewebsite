import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../../config/api";
import "./index.css";

function CollegeCourses(){

const [courses,setCourses] = useState([]);
const [filtered,setFiltered] = useState([]);
const [category,setCategory] = useState("ALL");

const [courseName,setCourseName] = useState("");
const [duration,setDuration] = useState("");
const [description,setDescription] = useState("");
const [subjects,setSubjects] = useState("");
const [syllabus,setSyllabus] = useState("");

const token = localStorage.getItem("token");

useEffect(()=>{
loadCourses();
},[]);

const loadCourses = ()=>{

fetch(`${API.BASE}/api/college-courses`)
.then(res=>res.json())
.then(data=>{
setCourses(data);
setFiltered(data);
});

};

/* FILTER */

useEffect(()=>{

if(category === "ALL"){
setFiltered(courses);
}
else if(category === "UG"){
setFiltered(courses.filter(c => c.course_name.startsWith("B")));
}
else if(category === "PG"){
setFiltered(courses.filter(c => c.course_name.startsWith("M")));
}

},[category,courses]);

/* ADD COURSE */

const handleAddCourse = async(e)=>{

e.preventDefault();

await fetch(`${API.BASE}/api/college-courses`,{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body:JSON.stringify({
course_name:courseName,
duration:duration,
description:description,
subjects:subjects,
syllabus:syllabus
})
});

setCourseName("");
setDuration("");
setDescription("");
setSubjects("");
setSyllabus("");

loadCourses();

};

/* DELETE COURSE */

const handleDelete = async(id)=>{

const confirmDelete = window.confirm("Delete course?");

if(!confirmDelete) return;

await fetch(`${API.BASE}/api/college-courses/${id}`,{
method:"DELETE",
headers:{
Authorization:`Bearer ${token}`
}
});

loadCourses();

};

return(

<div className="courses-page">

<div className="courses-section">

<h2>College Courses</h2>

{token && (

<form className="course-form" onSubmit={handleAddCourse}>

<input
type="text"
placeholder="Course Name"
value={courseName}
onChange={(e)=>setCourseName(e.target.value)}
required
/>

<input
type="text"
placeholder="Duration"
value={duration}
onChange={(e)=>setDuration(e.target.value)}
required
/>

<input
type="text"
placeholder="Description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
required
/>

<input
type="text"
placeholder="Subjects (comma separated)"
value={subjects}
onChange={(e)=>setSubjects(e.target.value)}
required
/>

<textarea
placeholder="Syllabus"
value={syllabus}
onChange={(e)=>setSyllabus(e.target.value)}
required
/>

<button type="submit">
Add Course
</button>

</form>

)}

<div className="course-filter">

<button onClick={()=>setCategory("ALL")}>All</button>
<button onClick={()=>setCategory("UG")}>UG Courses</button>
<button onClick={()=>setCategory("PG")}>PG Courses</button>

</div>

<div className="courses-grid">

{filtered.map(course=>(

<div key={course.id} className="course-card">

<div className="course-icon">🎓</div>

<h3>{course.course_name}</h3>

<p className="duration">
Duration: {course.duration}
</p>

<p className="description">
{course.description}
</p>

<Link
to={`/course/${course.id}`}
className="course-btn"
>
View Details
</Link>

{token && (
<button
className="delete-course"
onClick={()=>handleDelete(course.id)}
>
Delete
</button>
)}

</div>

))}

</div>

</div>

</div>

);

}

export default CollegeCourses;