const items = document.querySelectorAll('.nav-link');

items.forEach(item => {
    item.addEventListener("click", function(e){
        const menu = e.target.closest('.navbar-nav');
        if (!menu.classList.contains('not-active')) {
            menu.querySelectorAll('.nav-link').forEach(elem => {
                elem.classList.remove('active')
            })

            if (e.target.className == 'nav-link') {
                e.target.classList.add('active')
            } else {
                e.target.closest('.nav-link').classList.add('active')
            }
        }
    });
});

const langs = document.querySelectorAll('.dropdown-lang .dropdown-item');

langs.forEach(item => {
    item.addEventListener("click", function(e){
        for (const [key, value] of Object.entries(lang[e.target.hash.replace('#','')])) {
            if (typeof value == 'object' && value.type == 'class') {
                document.querySelectorAll('.'+key).forEach(item => {
                    item.innerHTML = value.text;
                })
            } else {
                document.getElementById(key).innerHTML = value;
            }
        }

        document.querySelector('.main-lang').innerHTML = e.target.text;
        document.querySelector('.dropdown-lang .dropdown-item.d-none').classList.remove('d-none');
        e.target.classList.add('d-none');
    });
});

const showMores = document.querySelectorAll('.showMore');

showMores.forEach( item => {
    item.addEventListener("click", function(e){
        e.target.classList.add('d-none');
        const parentElement = e.target.closest('.card-body');

        parentElement.querySelector('.card-text').classList.toggle('show');
    });
});

const cardButton = document.querySelectorAll('.card-footer .btn');
const modalLogin = new bootstrap.Modal('#singInModal');

cardButton.forEach( item => {
    item.addEventListener("click", function(e){
        e.preventDefault();
        e.stopPropagation();
        modalLogin.show();
    });
});

const changeTheme = document.querySelector('.changeTheme');

changeTheme.addEventListener("click", function(){
    changeTheme.classList.toggle('dark');

    let navFull = document.querySelectorAll('.navbar-light');
    let bgFull = document.querySelectorAll('.bg-light');
    let cardFull = document.querySelectorAll('.card');
    let textFull = document.querySelectorAll('.card-title, .card-text, .showMore, .card .btn, .bi-search');

    document.querySelector('body').classList.toggle('bg-secondary');

    changeThemeElements(navFull, 'navbar-dark');
    changeThemeElements(bgFull, 'bg-dark');
    changeThemeElements(cardFull, 'bg-secondary');
    changeThemeElements(textFull, 'text-white');
});

function changeThemeElements(items, classToggle) {
    items.forEach(item => {
        item.classList.toggle(classToggle);
    })
};