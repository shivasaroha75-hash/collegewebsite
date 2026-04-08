import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";

function AdminDashboard() {





return (

<div className="admin-page">

<h1 className="admin-title">Admin Dashboard</h1>

<div className="admin-grid">

<Link to="/manage-notices" className="admin-card">
Manage Notices
</Link>

<Link to="/admissions" className="admin-card">
Manage Admissions
</Link>

<Link to="/manage-gallery" className="admin-card">
Manage Gallery
</Link>

<Link to="/faculty" className="admin-card">
Manage Faculty
</Link>

<Link to="/courses" className="admin-card">
Courses
</Link>

<Link to="/manage-calendar" className="admin-card">
  Manage Calendar
</Link>

{/* NEW */}
<Link to="/manage-student" className="admin-card">
  Manage Students
</Link>

</div>



</div>

);

}

export default AdminDashboard;
