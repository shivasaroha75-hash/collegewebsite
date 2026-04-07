import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "../../config/api";
import "./index.css";

function FacultyDetails(){

const { id } = useParams();
const [faculty,setFaculty] = useState(null);

useEffect(()=>{

fetch(`${API.BASE}/api/faculty/${id}`)
.then(res=>res.json())
.then(data=>setFaculty(data));

},[id]);

if(!faculty){
return <p className="loading">Loading...</p>;
}

return(

<div className="faculty-details-page">

<div className="faculty-profile">

<div className="faculty-photo">

<img
src={`${API.BASE}/uploads/faculty/${faculty.photo}`}
alt={faculty.name}
/>

</div>

<div className="faculty-info">

<h1>{faculty.name}</h1>

<p>
<span>Department</span>
{faculty.department}
</p>

<p>
<span>Designation</span>
{faculty.designation}
</p>

<p>
<span>Qualification</span>
{faculty.qualification}
</p>

<p>
<span>Experience</span>
{faculty.experience}
</p>

</div>

</div>

</div>

);

}

export default FacultyDetails;