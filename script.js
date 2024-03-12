/*=============== SHOW MENU ===============*/
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
        nav = document.getElementById(navId)

    toggle.addEventListener('click', () =>{
        // Add show-menu class to nav menu
        nav.classList.toggle('show-menu')

        // Add show-icon to show and hide the menu icon
        toggle.classList.toggle('show-icon')
    })
}

showMenu('nav-toggle','nav-menu')

window.addEventListener('DOMContentLoaded', (event) => {
    smokeEffect();
});


function scrollDown() {
    // Smooth scrolling to the content section
    document.querySelector('#services').scrollIntoView({
        behavior: 'smooth'
    });
}


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


window.addEventListener('scroll', function() {
    const scrollDown2 = document.querySelector('.scroll-down');
    if (window.scrollY > 0) {
        scrollDown2.style.display = 'none';
    } else {
        scrollDown2.style.display = 'block';
    }
});