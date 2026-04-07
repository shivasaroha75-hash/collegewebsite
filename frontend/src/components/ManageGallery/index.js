import { useEffect, useState } from "react";
import { API } from "../../config/api";   // 👈 IMPORTANT

function ManageGallery(){

const [images,setImages] = useState([]);
const [title,setTitle] = useState("");
const [file,setFile] = useState(null);

const token = localStorage.getItem("token");

useEffect(()=>{
loadImages();
},[]);

const loadImages = ()=>{

fetch(`${API.BASE}/api/gallery`)
.then(res=>res.json())
.then(data=>setImages(data));

};

const handleUpload = async(e)=>{

e.preventDefault();

if(!file){
alert("Select image");
return;
}

const formData = new FormData();

formData.append("title",title);
formData.append("image",file);

await fetch(`${API.BASE}/api/gallery`,{

method:"POST",

headers:{
Authorization:`Bearer ${token}`
},

body:formData

});

setTitle("");
setFile(null);

loadImages();

};

const deleteImage = async(id)=>{

if(!window.confirm("Delete image?")) return;

await fetch(`${API.BASE}/api/gallery/${id}`,{

method:"DELETE",

headers:{
Authorization:`Bearer ${token}`
}

});

loadImages();

};

return(

<div style={{padding:"40px"}}>

<h2>Manage Gallery</h2>

<form onSubmit={handleUpload}>

<input
placeholder="Image title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
/>

<br/><br/>

<input
type="file"
onChange={(e)=>setFile(e.target.files[0])}
/>

<br/><br/>

<button>Upload Image</button>

</form>

<div style={{
display:"flex",
gap:"20px",
flexWrap:"wrap",
marginTop:"30px"
}}>

{images.map(img=>(

<div key={img.id} style={{
width:"200px",
textAlign:"center"
}}>

<img
src={`${API.BASE}/uploads/gallery/${img.image}`}
alt=""
style={{
width:"100%",
height:"120px",
objectFit:"cover",
borderRadius:"8px"
}}
/>

<p>{img.title}</p>

<button
style={{
background:"red",
color:"white",
border:"none",
padding:"5px 10px",
cursor:"pointer"
}}
onClick={()=>deleteImage(img.id)}
>
Delete
</button>

</div>

))}

</div>

</div>

);

}

export default ManageGallery;