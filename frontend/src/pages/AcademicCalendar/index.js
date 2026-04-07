import React, { useEffect, useState } from "react";
import { API } from "../../config/api";
import "./index.css";

function AcademicCalendar(){

const [events,setEvents] = useState([]);

useEffect(()=>{
fetch(`${API.BASE}/api/calendar`)
.then(res=>res.json())
.then(data=>setEvents(data));
},[]);

return(

<div className="calendar-page">

<h2 className="calendar-title">📅 Academic Calendar</h2>

<div className="timeline">

{events.map((ev,index)=>(

<div key={ev.id} className="timeline-item">

<div className="timeline-dot"></div>

<div className="timeline-content">

<h3>{ev.title}</h3>

<p className="date">{ev.date}</p>

<p>{ev.description}</p>

</div>

</div>

))}

</div>

</div>

);

}

export default AcademicCalendar;