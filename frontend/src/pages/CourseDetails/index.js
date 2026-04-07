import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "../../config/api";
import "./index.css";

function CourseDetails(){

const { id } = useParams();
const [course,setCourse] = useState(null);

useEffect(()=>{

fetch(`${API.BASE}/api/college-courses/${id}`)
.then(res=>res.json())
.then(data=>setCourse(data));

},[id]);

if(!course){
return <p style={{textAlign:"center"}}>Loading...</p>;
}

/* SPLIT SEMESTERS */

const semesters = course.subjects
? course.subjects.split("\n")
: [];

return(

<div className="course-details-page">

<div className="course-details-card">

<h1>{course.course_name}</h1>

<p className="duration">
Duration: {course.duration}
</p>

<p className="description">
{course.description}
</p>

<h3>Subjects (Semester Wise)</h3>

<div className="semester-container">

{semesters.map((sem,i)=>{

const parts = sem.split(":");
const semester = parts[0];
const subjects = parts[1] ? parts[1].split(",") : [];

return(

<div key={i} className="semester-box">

<h4>{semester}</h4>

<ul>

{subjects.map((sub,index)=>(
<li key={index}>{sub}</li>
))}

</ul>

</div>

);

})}

</div>

<h3>Syllabus</h3>

<p className="syllabus">
{course.syllabus}
</p>

</div>

</div>

);

}

export default CourseDetails;