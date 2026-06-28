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

<div class="metric">

<strong>Coherencia</strong>

87

</div>

<div class="metric">

<strong>Correspondencia</strong>

73

</div>

<div class="metric">

<strong>Justificación</strong>

91

</div>

<div class="metric">

<strong>Pluralidad epistemológica</strong>

82

</div>

`;

};

}

);
