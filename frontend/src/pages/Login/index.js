import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../config/api";
import "./index.css";

function Login(){

const [username,setUsername] = useState("");
const [password,setPassword] = useState("");
const [showPassword,setShowPassword] = useState(false);
const [error,setError] = useState("");
const [loading,setLoading] = useState(false);

const navigate = useNavigate();

const handleLogin = async (e)=>{
e.preventDefault();

if(!username || !password){
setError("Enter username & password");
return;
}

setError("");
setLoading(true);

try{

const res = await fetch(`${API.BASE}/api/admin/login`,{
method:"POST",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify({ username, password })
});

const data = await res.json();

if(res.ok){
localStorage.setItem("token", data.token);
navigate("/admin");
}else{
setError(data.message || "Login failed");
}

}catch{
setError("Server error");
}

setLoading(false);
};

return(

<div className="login-container">

<div className="login-box">

<h2>🔐 Admin Login</h2>

{/* ❌ AUTOFILL OFF */}
<form onSubmit={handleLogin} autoComplete="off">

{/* USERNAME */}
<input
name="random-user"
type="text"
placeholder="Enter Username"
value={username}
onChange={(e)=>setUsername(e.target.value)}
autoComplete="off"
/>

{/* PASSWORD */}
<div className="password-box">

<input
name="random-pass"
type={showPassword ? "text":"password"}
placeholder="Enter Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
autoComplete="new-password"
/>

<span
className="toggle"
onClick={()=>setShowPassword(!showPassword)}
>
{showPassword ? "🙈":"👁"}
</span>

</div>

<button type="submit">
{loading ? "Logging in..." : "Login"}
</button>

{error && <p className="error">{error}</p>}

</form>

</div>

</div>

);

}

export default Login;