import React, { useEffect, useState } from "react";
import { API, FILES } from "../../config/api";
import "./index.css";

function AdmissionSection(){

const [admissions,setAdmissions] = useState([]);

const [title,setTitle] = useState("");
const [description,setDescription] = useState("");
const [pdf,setPdf] = useState(null);

const token = localStorage.getItem("token");


// 🔥 LOAD DATA
useEffect(()=>{
loadAdmissions();
},[]);

const loadAdmissions = ()=>{

fetch(`${API.BASE}/api/admissions`)
.then(res=>res.json())
.then(data=>setAdmissions(data));

};


// ➕ ADD
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

await fetch(`${API.BASE}/api/admissions`,{

method:"POST",
headers:{
Authorization:`Bearer ${token}`
},
body:formData

});

alert("Admission Notice Added");

setTitle("");
setDescription("");
setPdf(null);

loadAdmissions();

};


// ❌ DELETE
const handleDelete = async(id)=>{

if(!window.confirm("Delete admission notice?")) return;

await fetch(`${API.BASE}/api/admissions/${id}`,{

method:"DELETE",
headers:{
Authorization:`Bearer ${token}`
}

});

loadAdmissions();

};


return(

<div className="admission-section">

<h2>Admissions</h2>


{/* ADMIN FORM */}
{token &&(

<form className="admission-form" onSubmit={handleAdd}>

<input
placeholder="Title"
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

<button>Add Admission Notice</button>

</form>

)}


{/* LIST */}
<div className="admission-list">

{admissions.map((ad)=>(

<div key={ad.id} className="admission-card">

<div className="admission-left">

<span className="admission-icon">📄</span>

<div>

<h4>{ad.title}</h4>
<p>{ad.description}</p>

</div>

</div>

<div className="admission-right">

{/* ✅ FIXED PDF LINK */}
{ad.pdf_file && (
<a
href={`${FILES.ADMISSIONS}/${ad.pdf_file}`}
target="_blank"
rel="noreferrer"
>
View PDF
</a>
)}

{token &&(

<button
className="delete-admission"
onClick={()=>handleDelete(ad.id)}
>
Delete
</button>

)}

</div>

</div>

))}

</div>

</div>

);

}

export default AdmissionSection;