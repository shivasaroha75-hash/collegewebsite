import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";

import "./index.css";


function Navbar(){

const navigate = useNavigate();
const token = localStorage.getItem("token");

const handleLogout = ()=>{
localStorage.removeItem("token");
navigate("/login");
};


const [menuOpen,setMenuOpen] = useState(false);

return(

<header className="navbar-wrapper">

<div className="navbar">

<div className="logo">
<img
className="logo-img"
src="https://res.cloudinary.com/devapktnu/image/upload/v1773380028/clg_logo_wlituv.png"
alt="College Logo"
/>
</div>

<div
className="menu-icon"
onClick={()=>setMenuOpen(!menuOpen)}
>
☰
</div>

<nav className={`nav-links ${menuOpen ? "active":""}`}>

<Link to="/" onClick={()=>setMenuOpen(false)}>Home</Link>
<Link to="/calendar" onClick={()=>setMenuOpen(false)}>Calendar</Link>
<Link to="/courses" onClick={()=>setMenuOpen(false)}>Courses</Link>
<Link to="/faculty" onClick={()=>setMenuOpen(false)}>Faculty</Link>
<Link to="/notices" onClick={()=>setMenuOpen(false)}>Notices</Link>
<Link to="/admissions" onClick={()=>setMenuOpen(false)}>Admissions</Link>
<Link to="/student">Student</Link>
{token && (
    <Link to="/dashboard" onClick={()=>setMenuOpen(false)}>
    Dashboard
    </Link>
)

}

{token ? (
<button onClick={handleLogout} className="login-btn">
Logout
</button>
) : (
<Link to="/login" className="login-btn">
Login
</Link>
)}

</nav>

</div>

</header>

);

}

export default Navbar;