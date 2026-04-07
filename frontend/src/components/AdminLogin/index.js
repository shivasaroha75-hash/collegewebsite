import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../config/api";   // 👈 IMPORTANT
import "./index.css";

function AdminLogin() {

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const navigate = useNavigate();


const handleLogin = async (e) => {

e.preventDefault();

if(!username || !password){
setError("Enter username & password");
return;
}

setLoading(true);
setError("");

try {

const res = await fetch(`${API.BASE}/api/admin/login`, {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({ username, password })
});

const data = await res.json();

if (res.ok && data.token) {

localStorage.setItem("token", data.token);

// ✅ success redirect
navigate("/admin");

} else {

setError(data.message || "Login Failed");

}

} catch (error) {

console.error(error);
setError("Server Error");

}

setLoading(false);

};


return (

<div className="admin-login-container">

<div className="admin-login-box">

<h2>Admin Login</h2>

<form onSubmit={handleLogin}>

<input
type="text"
placeholder="Username"
value={username}
onChange={(e) => setUsername(e.target.value)}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e) => setPassword(e.target.value)}
/>

<button type="submit">
{loading ? "Logging in..." : "Login"}
</button>

{error && <p className="error">{error}</p>}

</form>

</div>

</div>

);

}

export default AdminLogin;