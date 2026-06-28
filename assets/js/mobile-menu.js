const btn = document.getElementById('mobileMenuBtn');

const nav = document.querySelector('.module-nav');

const right = document.querySelector('.topbar-right');


if(btn){

btn.addEventListener('click',()=>{

nav.classList.toggle('open');

right.classList.toggle('open');

});

}
