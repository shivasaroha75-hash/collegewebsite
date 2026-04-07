import { useEffect, useState } from "react";
import { API, FILES } from "../../config/api";   // 👈 IMPORTANT
import "./index.css";

function GalleryCarousel(){

const [images,setImages] = useState([]);
const [current,setCurrent] = useState(0);
const [lightbox,setLightbox] = useState(false);


// 🔥 FETCH IMAGES
useEffect(()=>{

fetch(`${API.BASE}/api/gallery`)   // 👈 updated
.then(res=>res.json())
.then(data=>setImages(data));

},[]);


// 🔥 AUTO SLIDE
useEffect(()=>{

if(images.length === 0) return;

const interval = setInterval(()=>{
setCurrent(prev => (prev + 1) % images.length);
},7000);

return ()=>clearInterval(interval);

},[images]);


// 🔥 CONTROLS
const nextSlide = ()=>{
setCurrent(prev => (prev + 1) % images.length);
};

const prevSlide = ()=>{
setCurrent(prev => prev === 0 ? images.length - 1 : prev - 1);
};


// 🔥 LOADING
if(!images.length){
return <h2 className="gallery-loading">Loading...</h2>;
}


return(

<div className="gallery-container">

<div className="gallery-layout">

{/* LEFT TEXT */}

<div className="gallery-info">

<h2>Campus Life</h2>

<p>
Chaudhary Charan Singh Rajkiya Mahavidyalaya Chhaparauli provides a vibrant
and supportive campus environment for students.
</p>

<p>
Our campus encourages creativity, learning and collaboration.
</p>

<a href="/gallery" className="gallery-btn">
View Full Gallery
</a>

</div>


{/* RIGHT SLIDER */}

<div className="gallery-slide">

<img
className="gallery-image"
src={`${FILES.GALLERY}/${images[current].image}`}  // 👈 updated
alt=""
onClick={()=>setLightbox(true)}
/>

<div className="gallery-caption">
<h2>{images[current].title}</h2>
</div>

<button className="gallery-arrow left" onClick={prevSlide}>❮</button>
<button className="gallery-arrow right" onClick={nextSlide}>❯</button>

<div className="gallery-dots">

{images.map((_,index)=>(

<span
key={index}
className={current === index ? "dot active":"dot"}
onClick={()=>setCurrent(index)}
></span>

))}

</div>

</div>

</div>


{/* LIGHTBOX */}

{lightbox && (

<div className="lightbox" onClick={()=>setLightbox(false)}>

<img
src={`${FILES.FACULTY.replace("faculty","gallery")}/${images[current].image}`}  // 👈 updated
alt=""
/>

</div>

)}

</div>

);

}

export default GalleryCarousel;