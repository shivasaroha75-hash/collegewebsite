import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../../config/api";
import "./index.css";

function FacultySection() {

const [faculty,setFaculty] = useState([]);

const [name,setName] = useState("");
const [department,setDepartment] = useState("");
const [designation,setDesignation] = useState("");
const [qualification,setQualification] = useState("");
const [experience,setExperience] = useState("");
const [photo,setPhoto] = useState(null);

const [editId,setEditId] = useState(null);

const token = localStorage.getItem("token");

useEffect(()=>{
loadFaculty();
},[]);

const loadFaculty = ()=>{
fetch(`${API.BASE}/api/faculty`)
.then(res=>res.json())
.then(data=>setFaculty(data));
};

/* ADD / UPDATE */

const handleAddFaculty = async(e)=>{
e.preventDefault();

const formData = new FormData();
formData.append("name",name);
formData.append("department",department);
formData.append("designation",designation);
formData.append("qualification",qualification);
formData.append("experience",experience);
if(photo) formData.append("photo",photo);

const url = editId
? `${API.BASE}/api/faculty/${editId}`
: `${API.BASE}/api/faculty`;

const method = editId ? "PUT" : "POST";

await fetch(url,{
method:method,
headers:{ Authorization:`Bearer ${token}` },
body:formData
});

setName("");
setDepartment("");
setDesignation("");
setQualification("");
setExperience("");
setPhoto(null);
setEditId(null);

loadFaculty();
};

/* DELETE */

const handleDelete = async(id)=>{

if(!window.confirm("Delete faculty?")) return;

await fetch(`${API.BASE}/api/faculty/${id}`,{
method:"DELETE",
headers:{ Authorization:`Bearer ${token}` }
});

loadFaculty();
};

/* EDIT */

const handleEdit = (member)=>{
setEditId(member.id);
setName(member.name);
setDepartment(member.department);
setDesignation(member.designation);
setQualification(member.qualification || "");
setExperience(member.experience || "");
};

return(

<div className="faculty-page">

<div className="faculty-section">

<h2 className="faculty-title">Our Faculty</h2>

{/* ADMIN FORM */}

{token && (

<form className="faculty-form" onSubmit={handleAddFaculty}>

<input
type="text"
placeholder="Faculty Name"
value={name}
onChange={(e)=>setName(e.target.value)}
required
/>

<input
type="text"
placeholder="Department"
value={department}
onChange={(e)=>setDepartment(e.target.value)}
required
/>

<input
type="text"
placeholder="Designation"
value={designation}
onChange={(e)=>setDesignation(e.target.value)}
required
/>

<input
type="text"
placeholder="Qualification"
value={qualification}
onChange={(e)=>setQualification(e.target.value)}
/>

<input
type="text"
placeholder="Experience"
value={experience}
onChange={(e)=>setExperience(e.target.value)}
/>

<input
type="file"
onChange={(e)=>setPhoto(e.target.files[0])}
/>

<button type="submit">
{editId ? "Update Faculty" : "Add Faculty"}
</button>

</form>

)}

{/* FACULTY LIST */}

<div className="faculty-list">

{faculty.map((member)=>(

<div key={member.id} className="faculty-card">

<Link to={`/faculty/${member.id}`} 
onClick={()=>{
sessionStorage.setItem("scrollPos", window.scrollY);
}} className="faculty-link">

<img
src={`${API.BASE}/uploads/faculty/${member.photo}`}
alt={member.name}
/>

<h3>{member.name}</h3>

<p className="dept">{member.department}</p>

<p className="designation">{member.designation}</p>

{member.experience && (
<span className="exp">{member.experience} experience</span>
)}

</Link>

{token && (

<div className="faculty-admin-btns">

<button
className="edit-btn"
onClick={()=>handleEdit(member)}
>
Edit
</button>

<button
className="delete-btn"
onClick={()=>handleDelete(member.id)}
>
Delete
</button>

</div>

)}

</div>

))}

</div>

</div>

</div>

);

}

export default FacultySection;