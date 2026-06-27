document.addEventListener("DOMContentLoaded",()=>{

const sidebar=document.querySelector(".sidebar");

const toggle=document.querySelector(".sidebar-toggle");

if(sidebar&&toggle){

toggle.addEventListener("click",()=>{

const collapsed=

sidebar.classList.toggle(

"collapsed"

);

toggle.textContent=

collapsed

?

"▸"

:

"◂";

});

}

});
