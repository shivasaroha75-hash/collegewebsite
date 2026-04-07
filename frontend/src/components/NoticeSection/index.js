import React, { useEffect, useState } from "react";
import { API } from "../../config/api";   // 👈 IMPORTANT
import "./index.css";

function NoticeSection() {

const [data,setData] = useState([]);
const [title,setTitle] = useState("");
const [description,setDescription] = useState("");
const [pdf,setPdf] = useState(null);
const [important,setImportant] = useState(false);

const token = localStorage.getItem("token");

useEffect(()=>{
loadAllData();
},[]);

const loadAllData = ()=>{

Promise.all([
fetch(`${API.BASE}/api/notices`).then(res=>res.json()),
fetch(`${API.BASE}/api/calendar`).then(res=>res.json()),
fetch(`${API.BASE}/api/student-resources`).then(res=>res.json())
])
.then(([notices, calendar, students])=>{

const formatted = [

...notices.map(n => ({
id: n.id,
title: n.title,
desc: n.description,
date: n.created_at,
type: "Notice",
pdf: n.pdf_file,
important: n.important
})),

...calendar.map(c => ({
id: c.id,
title: c.title,
desc: c.description,
date: c.date,
type: "Event"
})),

...students.map(s => ({
id: s.id,
title: s.title,
desc: s.type,
date: "",
type: "Student",
pdf: s.file
}))

];

// 🔥 sort latest first
formatted.sort((a,b)=> new Date(b.date) - new Date(a.date));

setData(formatted);

});

};


// ➕ ADD NOTICE
const handleAdd = async(e)=>{

e.preventDefault();

if(!pdf){
alert("Select PDF file");
return;
}

const formData = new FormData();

formData.append("title",title);
formData.append("description",description);
formData.append("pdf",pdf);
formData.append("important",important);

const response = await fetch(`${API.BASE}/api/notices`,{

method:"POST",
headers:{
Authorization:`Bearer ${token}`
},
body:formData

});

if(response.ok){

alert("Notice Added");

setTitle("");
setDescription("");
setPdf(null);
setImportant(false);

loadAllData();

}

};


// ❌ DELETE (only notices)
const handleDelete = async(id)=>{

if(!window.confirm("Delete notice?")) return;

await fetch(`${API.BASE}/api/notices/${id}`,{

method:"DELETE",
headers:{
Authorization:`Bearer ${token}`
}

});

loadAllData();

};


return(

<div className="notice-page">

<div className="notice-section">

<div className="notice-header">
<h2>📢 Latest Notices</h2>
<p>Stay updated with all updates (Admissions, Events, Student)</p>
</div>

{/* ADMIN FORM */}
{token &&(

<form className="notice-form" onSubmit={handleAdd}>

<input
placeholder="Notice Title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
required
/>

<textarea
placeholder="Description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
required
/>

<input
type="file"
accept="application/pdf"
onChange={(e)=>setPdf(e.target.files[0])}
required
/>

<label className="important-check">
<input
type="checkbox"
checked={important}
onChange={(e)=>setImportant(e.target.checked)}
/>
Mark as Important
</label>

<button>Add Notice</button>

</form>

)}

{/* LIST */}
<div className="notice-list">

{data.map((item,i)=>(

<div
key={i}
className={`notice-card ${item.important ? "important":""}`}
>

<div className="notice-left">

<div className="notice-icon">📄</div>

<div className="notice-content">

<h4>

{/* 🔥 TYPE BADGE */}
<span className={`type ${item.type}`}>
{item.type}
</span>

{item.title}

{/* IMPORTANT */}
{item.important && (
<span className="badge">NEW</span>
)}

</h4>

<p>{item.desc}</p>

{item.date && (
<p className="notice-date">
📅 {new Date(item.date).toLocaleDateString()}
</p>
)}

</div>

</div>

<div className="notice-right">

{item.pdf && (
<a
className="view-btn"
href={`${API.BASE}/uploads/${item.pdf}`}
target="_blank"
rel="noreferrer"
>
View
</a>
)}

{/* delete only notice */}
{token && item.type==="Notice" &&(

<button
className="delete-notice"
onClick={()=>handleDelete(item.id)}
>
Delete
</button>

)}

</div>

</div>

))}

</div>

</div>

</div>

);

}

export default NoticeSection;