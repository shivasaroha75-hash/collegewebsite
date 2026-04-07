import { useEffect, useState } from "react";
import { API } from "../../config/api";
import "./index.css";

function ManageStudentResources(){

const [data,setData] = useState([]);
const [title,setTitle] = useState("");
const [type,setType] = useState("syllabus");
const [file,setFile] = useState(null);

const token = localStorage.getItem("token");

/* LOAD */
const loadData = ()=>{
fetch(`${API.BASE}/api/student-resources`)
.then(res=>res.json())
.then(setData);
};

useEffect(()=>{
loadData();
},[]);

/* ADD */
const handleAdd = async(e)=>{
e.preventDefault();

if(!file){
alert("Select file");
return;
}

const formData = new FormData();
formData.append("title",title);
formData.append("type",type);
formData.append("file",file);

const res = await fetch(`${API.BASE}/api/student-resources`,{
method:"POST",
headers:{ Authorization:`Bearer ${token}` },
body:formData
});

if(res.ok){
alert("Added Successfully");
setTitle("");
setFile(null);
loadData();
}else{
alert("Error adding");
}
};

/* DELETE */
const handleDelete = async(id)=>{
if(!window.confirm("Delete?")) return;

await fetch(`${API.BASE}/api/student-resources/${id}`,{
method:"DELETE",
headers:{ Authorization:`Bearer ${token}` }
});

loadData();
};

return(

<div className="student-admin">

<h2>Manage Student Resources</h2>

<form className="student-form" onSubmit={handleAdd}>

<input
placeholder="Title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
required
/>

<select
value={type}
onChange={(e)=>setType(e.target.value)}
>
<option value="syllabus">Syllabus</option>
<option value="timetable">Examination</option>
</select>

<input
type="file"
onChange={(e)=>setFile(e.target.files[0])}
required
/>

<button>Add</button>

</form>

<div className="student-list">

{data.map(item=>(
<div key={item.id} className="student-card">

<h4>{item.title}</h4>

<p className="type">{item.type}</p>

<a
href={`${API.BASE}/uploads/resources/${item.file}`}
target="_blank"
rel="noreferrer"
className="view-btn"
>
View
</a>

<button
className="delete-btn"
onClick={()=>handleDelete(item.id)}
>
Delete
</button>

</div>
))}

</div>

</div>

);

}

export default ManageStudentResources;