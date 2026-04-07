import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "../../config/api";
import "./index.css";

function ProfessionalCourseDetails(){

const { id } = useParams();
const [course,setCourse] = useState(null);

useEffect(()=>{

fetch(`${API.BASE}/api/professional-courses/${id}`)
.then(res=>res.json())
.then(data=>setCourse(data));

},[id]);

if(!course){
return <p className="loading">Loading...</p>;
}

const lines = course.details ? course.details.split("\n") : [];

return(

<div className="course-details-page">

<div className="course-container">

<h1>{course.course_name}</h1>

<p className="desc">{course.description}</p>

<hr/>

{lines.map((line,i)=>{

// Heading (1. 2. 3.)
if(/^\d+\./.test(line)){
return <h2 key={i}>{line}</h2>;
}

// Bullet (•)
if(line.startsWith("•")){
return <li key={i} className="bullet">{line.replace("•","")}</li>;
}

// Normal text
return <p key={i}>{line}</p>;

})}

</div>

</div>

);

}

export default ProfessionalCourseDetails;