import React, { useEffect, useState } from "react";
import { API } from "../../config/api";
import "./index.css";

function PrincipalSection() {

  const [principal, setPrincipal] = useState(null);

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadPrincipal();
  }, []);

  const loadPrincipal = () => {

    fetch(`${API.BASE}/api/principal`)
      .then(res => res.json())
      .then(data => {

        setPrincipal(data);

        if(data){
          setName(data.name);
          setMessage(data.message);
        }

      });

  };

  const handleSave = async (e) => {

    e.preventDefault();

    const formData = new FormData();

    formData.append("name",name);
    formData.append("message",message);

    if(photo){
      formData.append("photo",photo);
    }

    await fetch(`${API.BASE}/api/principal`,{
      method:"POST",
      headers:{
        Authorization:`Bearer ${token}`
      },
      body:formData
    });

    alert("Principal Updated");

    loadPrincipal();

  };

  return (

    <div className="principal-section">

      <h2>Principal Message</h2>

      {principal && (

        <div className="principal-card">

          <div className="principal-image">

            <img
              src={`${API.BASE}/uploads/principal/${principal.photo}`}
              alt=""
            />

          </div>

          <div className="principal-text">

            <h3>{principal.name}</h3>

            <p>{principal.message}</p>

          </div>

        </div>

      )}

      {token && (

        <form className="principal-form" onSubmit={handleSave}>

          <input
            value={name}
            placeholder="Principal Name"
            onChange={(e)=>setName(e.target.value)}
          />

          <textarea
            value={message}
            placeholder="Principal Message"
            onChange={(e)=>setMessage(e.target.value)}
          />

          <input
            type="file"
            onChange={(e)=>setPhoto(e.target.files[0])}
          />

          <button>Save</button>

        </form>

      )}

    </div>

  );

}

export default PrincipalSection;