import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollManager(){

const location = useLocation();


// save scroll
useEffect(()=>{
return ()=>{
sessionStorage.setItem(location.pathname, window.scrollY);
};
},[location.pathname]);


// restore scroll AFTER load
useEffect(()=>{

const saved = sessionStorage.getItem(location.pathname);

if(saved){

// 🔥 delay important
setTimeout(()=>{
window.scrollTo(0, parseInt(saved));
},500);   // 👈 500ms delay

}

},[location.pathname]);

return null;
}

export default ScrollManager;