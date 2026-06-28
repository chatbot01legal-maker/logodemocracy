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

<strong>Zona proximal</strong>

89

</div>

<div class="metric">

<strong>Comprensión</strong>

85

</div>

<div class="metric">

<strong>Metacognición</strong>

94

</div>

<div class="metric">

<strong>Profundidad conceptual</strong>

88

</div>

`;

};

}

);
