const API_BASE_URL = "https://collegewebsite-3i4j.onrender.com";

export const API = {
  BASE: API_BASE_URL,
  FACULTY: `${API_BASE_URL}/api/faculty`,
  NOTICES: `${API_BASE_URL}/api/notices`,
  STUDENT_RESOURCES: `${API_BASE_URL}/api/student-resources`,
};

export const FILES = {
  FACULTY: `${API_BASE_URL}/uploads/faculty`,
  NOTICES: `${API_BASE_URL}/uploads/notices`,
  RESOURCES: `${API_BASE_URL}/uploads/resources`,
  GALLERY: `${API_BASE_URL}/uploads/gallery`,   // 👈 ADD THIS
};
