document.addEventListener(

"DOMContentLoaded",

()=>{

const btn=

document.querySelector(

".evaluate-btn"

);

const output=

document.getElementById(

"result"

);

btn.onclick=()=>{

output.innerHTML=

`

<div class="metric"><strong>Claridad</strong>

84

</div><div class="metric"><strong>Consistencia</strong>

91

</div><div class="metric"><strong>Evidencia</strong>

76

</div><div class="metric"><strong>Falacias</strong>

0

</div>`;

};

}

);
