import React, { useEffect, useState } from "react";
import { API } from "../../config/api";
import "./index.css";

function ManageCalendar(){

const [events,setEvents] = useState([]);
const [title,setTitle] = useState("");
const [date,setDate] = useState("");
const [description,setDescription] = useState("");

const token = localStorage.getItem("token");

useEffect(()=>{
loadEvents();
},[]);

const loadEvents = ()=>{
fetch(`${API.BASE}/api/calendar`)
.then(res=>res.json())
.then(data=>setEvents(data));
};

const addEvent = async(e)=>{
e.preventDefault();

await fetch(`${API.BASE}/api/calendar`,{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body:JSON.stringify({title,date,description})
});

setTitle("");
setDate("");
setDescription("");

loadEvents();
};

const deleteEvent = async(id)=>{
if(!window.confirm("Delete event?")) return;

await fetch(`${API.BASE}/api/calendar/${id}`,{
method:"DELETE",
headers:{
Authorization:`Bearer ${token}`
}
});

loadEvents();
};

return(

<div className="calendar-admin">

<h2>Manage Academic Calendar</h2>

<form onSubmit={addEvent} className="calendar-form">

<input
type="text"
placeholder="Event Title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
required
/>

<input
type="date"
value={date}
onChange={(e)=>setDate(e.target.value)}
required
/>

<textarea
placeholder="Description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
/>

<button type="submit">Add Event</button>

</form>

<div className="calendar-list">

{events.map(ev=>(
<div key={ev.id} className="calendar-item">

<h4>{ev.title}</h4>
<p>{ev.date}</p>
<p>{ev.description}</p>

<button onClick={()=>deleteEvent(ev.id)}>
Delete
</button>

</div>
))}

</div>

</div>

);

}

export default ManageCalendar;