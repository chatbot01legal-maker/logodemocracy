function renderGlobalHeader(activeModule){

return `

<header class="topbar">

<a href="https://logodemocracy.tech"
class="brand">

LOGODEMOCRACY

</a>

<nav class="module-nav">

<a href="/pages/academy.html"
class="module-link ${activeModule==="academia"?"active":""}">
Academia
</a>

<a href="/pages/aletheia.html"
class="module-link ${activeModule==="aletheia"?"active":""}">
Aletheia
</a>

<a href="/pages/logos.html"
class="module-link ${activeModule==="logos"?"active":""}">
Logos
</a>

<a href="/pages/rey-filosofo.html"
class="module-link ${activeModule==="rey"?"active":""}">
Rey Filósofo
</a>

<a href="/pages/sophia.html"
class="module-link ${activeModule==="sophia"?"active":""}">
Sophia
</a>

</nav>

<div class="topbar-right">

<a href="#"
class="user-menu"
id="userLabel">

⌂ Invitado

</a>

<a href="#"
class="auth-btn"
id="authButton">

Log in

</a>

<div class="lang">

ES | EN

</div>

</div>

</header>

`;

}
