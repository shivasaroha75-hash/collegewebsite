import { useEffect, useState } from "react";
import { API } from "../../config/api";   // 👈 IMPORTANT
import "./index.css";

function HomeExtras(){

const [facultyCount,setFacultyCount] = useState(0);
const [courseCount,setCourseCount] = useState(0);

useEffect(()=>{

fetch(`${API.BASE}/api/faculty`)
.then(res=>res.json())
.then(data=>setFacultyCount(data.length));

fetch(`${API.BASE}/api/college-courses`)
.then(res=>res.json())
.then(data=>setCourseCount(data.length));

},[]);

return(

<div>

{/* ABOUT */}
<section className="about">

<h2>About College</h2>

<p>
Chaudhary Charan Singh Rajkiya Mahavidyalaya, Chhaparauli (Baghpat) is a reputed government institution dedicated to providing quality higher education, skill development, and empowering students for a successful future.
</p>

</section>

{/* STATS */}
<section className="stats">

<div className="stat-card">
<h3>400+</h3>
<p>Students</p>
</div>

<div className="stat-card">
<h3>{courseCount}+</h3>
<p>Courses</p>
</div>

<div className="stat-card">
<h3>{facultyCount}+</h3>
<p>Faculty</p>
</div>

</section>

</div>

);

}

export default HomeExtras;