import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";

import NoticeSection from "./components/NoticeSection";
import AdmissionSection from "./components/AdmissionSection";
import FacultySection from "./components/FacultySection";
import ManageGallery from "./components/ManageGallery";

import Login from "./pages/Login";
import Courses from "./pages/Courses";
import GalleryPage from "./pages/GalleryPage";
import CourseDetails from "./pages/CourseDetails";
import FacultyDetails from "./pages/FacultyDetails";

import ProfessionalCourseDetails from "./pages/ProfessionalCourseDetails";
import AcademicCalendar from "./pages/AcademicCalendar";
import ManageCalendar from "./pages/ManageCalendar";
import Navbar from "./components/Navbar";
import StudentSection from "./pages/StudentSection";
import ManageStudentResources from "./pages/ManageStudentResources";



function App() {

  return (
<>

    <BrowserRouter>

      <Navbar />
     
      <Routes>

        <Route path="/" element={<Home/>}/>

        <Route path="/login" element={<Login/>}/>
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/course/:id" element={<CourseDetails/>} />
        <Route path="/courses" element={<Courses/>}/>
        <Route path="/professional-course/:id" element={<ProfessionalCourseDetails/>}/>
        <Route path="/manage-calendar" element={<ManageCalendar/>}/>
        <Route path="/student" element={<StudentSection/>}/>
<Route path="/manage-student" element={<ManageStudentResources/>}/>
        
<Route path="/calendar" element={<AcademicCalendar/>}/>
        
<Route path="/faculty/:id" element={<FacultyDetails/>}/>
<Route path="dashboard" element={<AdminDashboard/>}/>

        <Route path="/notices" element={<NoticeSection />} />
        <Route path="/admissions" element={<AdmissionSection />} />
        <Route path="/faculty" element={<FacultySection />} />

        <Route path="/manage-gallery" element={<ManageGallery/>}/>

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-notices"
          element={
            <ProtectedRoute>
              <NoticeSection />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
</>
  );

}

export default App;