import { useEffect, useState } from "react";
import { API, FILES } from "../../config/api";   // 👈 IMPORTANT
import "./index.css";

function StudentSection(){

const [data,setData] = useState([]);
const [activeTab,setActiveTab] = useState("syllabus");

useEffect(()=>{
fetch(`${API.BASE}/api/student-resources`)
.then(res=>res.json())
.then(setData);
},[]);

const filtered = data.filter(d => d.type === activeTab);

return(

<div className="student-bg">

<div className="student-wrapper">

<h2>🎓 Student Resources</h2>

{/* TABS */}
<div className="tabs">

<button
className={activeTab==="syllabus" ? "active" : ""}
onClick={()=>setActiveTab("syllabus")}
>
📚 Syllabus
</button>

<button
className={activeTab==="timetable" ? "active" : ""}
onClick={()=>setActiveTab("timetable")}
>
📅 Examination
</button>

</div>

{/* LIST */}
<div className="list-container">

{filtered.length === 0 ? (
<p className="empty">No data available</p>
) : (

filtered.map(item => (

<div key={item.id} className="list-item">

<div className="left">
<h4>{item.title}</h4>
</div>

{/* ✅ FIXED LIKE LATEST NOTICE */}
<a
href={`${FILES.STUDENTS}/${item.file}`}   // 🔥 IMPORTANT FIX
target="_blank"
rel="noreferrer"
className="action-btn"
>
📄 Open
</a>

</div>

))

)}

</div>

</div>

</div>

);

}

export default StudentSection;
