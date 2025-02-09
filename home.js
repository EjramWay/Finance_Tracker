const dropdown = document.getElementById("dropdown");
const menu = document.getElementById("dropdown-menu");
const profilemenu = document.getElementById("profile-menu")
const profilebutton = document.getElementById("profile-btn");
const navprofile = document.getElementById("nav-link-profile")

dropdown.addEventListener('click', () => {
    menu.classList.toggle('active')});

profilebutton.addEventListener('click', () => { 
    navprofile.classList.toggle('active')});