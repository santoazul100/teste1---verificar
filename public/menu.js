document.addEventListener("DOMContentLoaded", function () {
    const currentPage = window.location.pathname.split("/").pop();
    const menuLinks = document.querySelectorAll('.menu-items a');
    menuLinks.forEach(link => {
        
        link.classList.remove('active');

        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});
