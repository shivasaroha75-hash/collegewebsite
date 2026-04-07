import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../config/api";
import "./index.css";

function Login(){

const [email,setEmail] = useState("");
const [otp,setOtp] = useState("");
const [showOtp,setShowOtp] = useState(false);
const [loading,setLoading] = useState(false);
const [error,setError] = useState("");
const [timer,setTimer] = useState(0);

const navigate = useNavigate();


// ✅ already login check
useEffect(()=>{
const token = localStorage.getItem("token");
if(token){
navigate("/admin");
}
},[navigate]);


// ⏱ TIMER FUNCTION
const startTimer = ()=>{
setTimer(30);

const interval = setInterval(()=>{
setTimer(prev=>{
if(prev <= 1){
clearInterval(interval);
return 0;
}
return prev - 1;
});
},1000);
};


// 📩 SEND OTP
const handleSendOtp = async ()=>{

if(!email){
setError("Enter email");
return;
}

setError("");
setLoading(true);

try{

const res = await fetch(`${API.BASE}/api/send-otp-email`,{
method:"POST",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify({ email })
});

const data = await res.json();

if(res.ok){
setShowOtp(true);
startTimer();
}else{
setError(data.message || "Failed to send OTP");
}

}catch{
setError("Server error");
}

setLoading(false);
};


// 🔐 VERIFY OTP
const handleVerify = async ()=>{

if(!otp){
setError("Enter OTP");
return;
}

setError("");
setLoading(true);

try{

const res = await fetch(`${API.BASE}/api/verify-otp-email`,{
method:"POST",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify({ email, otp })
});

const data = await res.json();

if(res.ok){

// ✅ save token
localStorage.setItem("token",data.token);

// ✅ redirect
navigate("/admin");

}else{
setError(data.message || "Invalid OTP");
}

}catch{
setError("Server error");
}

setLoading(false);
};


return(

<div className="login-container">

<div className="login-box">

<h2>🔒 Secure Login</h2>

{/* EMAIL INPUT */}
<input
type="email"
placeholder="Enter your email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

{/* SEND OTP */}
{!showOtp && (
<button onClick={handleSendOtp}>
{loading ? "Sending..." : "Send OTP"}
</button>
)}

{/* OTP INPUT */}
{showOtp && (
<>
<input
type="text"
placeholder="Enter OTP"
value={otp}
onChange={(e)=>setOtp(e.target.value)}
/>

<button onClick={handleVerify}>
{loading ? "Verifying..." : "Verify & Login"}
</button>

{/* ⏱ RESEND */}
{timer > 0 ? (
<p className="timer">Resend in {timer}s</p>
) : (
<button className="resend" onClick={handleSendOtp}>
Resend OTP
</button>
)}

</>
)}

{/* ERROR */}
{error && <p className="error">{error}</p>}

</div>

</div>

);

}

export default Login;