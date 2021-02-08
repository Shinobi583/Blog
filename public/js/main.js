const menuBtn = document.querySelector(".menu-btn");
const burger = document.querySelector(".menu-btn-burger");
const nav = document.querySelector("nav");
const menuNav = document.querySelector(".menu-nav");
const navItems = document.querySelectorAll(".menu-nav-item");
const dropBtn = document.querySelector(".dropbtn");
const dropdown = document.querySelector("#dropdown");
const navForm = document.querySelector(".log-in");
let showMenu = false;


menuBtn.addEventListener("click", toggleMenu);
dropBtn.addEventListener("click", showDropdown);


function toggleMenu() {
    if (!showMenu) {
        burger.classList.add("open");
        nav.classList.add("open");
        menuNav.classList.add("open");
        navForm.classList.add("open");
        navItems.forEach(item => {
            item.classList.add("open");
        });
        showMenu = true;
    }
    else {
        burger.classList.remove("open");
        nav.classList.remove("open");
        menuNav.classList.remove("open");
        navForm.classList.remove("open");
        navItems.forEach(item => {
            item.classList.remove("open");
        });
        showMenu = false;
    }
}

function showDropdown() {
    dropdown.classList.toggle("show");
}