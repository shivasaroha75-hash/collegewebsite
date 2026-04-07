import Navbar from "../../components/Navbar";
import HeroSection from "../../components/HeroSection";
import GalleryCarousel from "../../components/GalleryCarousel";
import FacultySection from "../../components/FacultySection";
import PrincipalSection from "../../components/PrincipalSection";
import ProfessionalCourses from "../../components/ProfessionalCourses";
import CollegeCourses from "../../components/CollegeCourses";
import NoticeSection from "../../components/NoticeSection";
import AdmissionSection from "../../components/AdmissionSection";
import HomeExtras from "../../components/HomeExtras";
import { Link } from "react-router-dom";

import "./index.css";

function Home(){

return(

<div>

<Navbar/>

<HeroSection/>


<GalleryCarousel/>
<HomeExtras/>

<FacultySection/>

<PrincipalSection/>

<CollegeCourses/>

<ProfessionalCourses/>

<NoticeSection/>

<AdmissionSection/>

{/* WAVE SEPARATOR */}

<div className="wave-container">

<svg viewBox="0 0 1440 120" preserveAspectRatio="none">

<path
d="M0,64L60,69.3C120,75,240,85,360,85.3C480,85,600,75,720,64C840,53,960,43,1080,42.7C1200,43,1320,53,1380,58.7L1440,64L1440,120L0,120Z"
fill="#f97316"
/>

</svg>

</div>

<footer className="footer">

<div className="footer-container">

<div className="footer-col">

<h3>Chaudhary Charan Singh Rajkiya Mahavidyalaya Chhaparauli</h3>

<p>Baghpat, Uttar Pradesh</p>

</div>

<div className="footer-col">

<h4>Contact</h4>

<p>Phone: +918650853958</p>

<p>Email: ccsgdc.chhaprauli@gmail.com</p>

</div>

<div className="footer-col2">

<h4>Quick Links</h4>
<Link to="/">Home</Link>
<Link to="/calendar" >Calendar</Link>
<Link to="/courses" >Courses</Link>
<Link to="/faculty">Faculty</Link>
<Link to="/notices" >Notices</Link>
<Link to="/admissions">Admissions</Link>
<Link to="/student">Student</Link>

</div>

</div>

<div className="footer-bottom">

© 2025 Chaudhary Charan Singh Rajkiya Mahavidyalaya Chhaparauli (Baghpat)

</div>

</footer>

</div>

);

}

export default Home;