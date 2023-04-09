









// Add dynamic for menu items

const linksMenu = document.querySelectorAll('.nav-link');
const dynamicMenu = () => (e) => {
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
};

addListener(linksMenu, "click", dynamicMenu());





// i18n functions

const langList = document.querySelectorAll('.dropdown-lang .dropdown-item');
const changeLang = () => (e) => {
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
};

addListener(langList, "click", changeLang());





// Show More buttons

const showMores = document.querySelectorAll('.showMore');
const addShowMore = () => (e) => {
    e.target.classList.add('d-none');
    const parentElement = e.target.closest('.card-body');

    parentElement.querySelector('.card-text').classList.toggle('show');
};

addListener(showMores, "click", addShowMore());




// Click on buttons in card

const cardButton = document.querySelectorAll('.card-footer .btn');
const modalLogin = new bootstrap.Modal('#singInModal');
const clickButtonsInCard = () => (e) => {
    e.preventDefault();
    e.stopPropagation();
    modalLogin.show();
};

addListener(cardButton, "click", clickButtonsInCard());




// change themes dark / light

const changeTheme = document.querySelectorAll('.changeTheme');
let themeDark = false;
const changeThemeHandler = (changeTheme) => (e) => {
    changeTheme.forEach(item => {
        item.classList.toggle('dark');
    });

    themeDark = !themeDark;

    let navFull = document.querySelectorAll('.navbar-light');
    let bgFull = document.querySelectorAll('.bg-light');
    let cardFull = document.querySelectorAll('.card');
    let textFull = document.querySelectorAll('.card-title, .card-text, .showMore, .card .btn, .bi-search');

    document.querySelector('body').classList.toggle('bg-secondary');

    toggleItemsClass(navFull, 'navbar-dark');
    toggleItemsClass(bgFull, 'bg-dark');
    toggleItemsClass(cardFull, 'bg-secondary');
    toggleItemsClass(textFull, 'text-white');
};

addListener(changeTheme, "click", changeThemeHandler(changeTheme));




// Content changes

// Change limits

const itemLimitFull = document.querySelectorAll('.dataLimit .dropdown-item');
const urlSet = new URL(window.location);
let url = new URLSearchParams(window.location.search),
    limit = Number(url.get("limit")) || 10,
    numberPage = Number(url.get("page")) || 1;

const changeLimitHandler = () => (e) => {
    let clickItem = e.target;
    document.querySelector('.dataLimitActive').innerHTML = clickItem.innerHTML;
    limit = Number(clickItem.innerHTML)
    removeItemsClass(itemLimitFull, 'disabled');
    clickItem.classList.add('disabled');

    urlSet.searchParams.set('limit', limit);
    window.history.pushState(null, null, urlSet);

    getNewData(limit, numberPage);
}

const getNewData = (limit, page) => {
    fetch('https://picsum.photos/v2/list?page='+page+'&limit='+limit)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            document.querySelector('.cards-content').innerHTML = generateListContent(data);
            addListener(document.querySelectorAll('.showMore'), "click", addShowMore());
            addListener(document.querySelectorAll('a[data-number-page]'), "click", handlerPagination());
            addListener(document.querySelectorAll('.card-footer .btn'), "click", clickButtonsInCard());
            const element = document.querySelector('main');
            element.scrollIntoView({
                behavior: 'smooth'
            });
        });
}

getNewData(limit, numberPage);

const generateListContent = (List) => {
    let fullContent = '';

    List.forEach(item => {
        fullContent += generateCard(item);
    });

    fullContent += generatePagination(numberPage);

    return fullContent;
};

const generateCard = (item) => {
    return `<article id="${'card' + item.id}">
                    <div class="card ${ themeDark ? 'bg-secondary' : '' }">
                        <img src="${item.download_url}" class="card-img-top" alt="${item.author}">
                        <div class="card-body pb-1">
                            <h4 class="card-title ${ themeDark ? 'text-white' : '' }">${item.author}</h4>
                            <p class="card-text ${ themeDark ? 'text-white' : '' }">
                                Width: ${item.width}<br />
                                Height: ${item.height}<br />
                                <a href="${item.url}" target="_blank">Download</a>
                            </p>
                            <span class="showMore ${ themeDark ? 'text-white' : '' }">Show more...</span>
                        </div>
                        <div class="card-footer">
                            <a href="#"
                               class="btn btn-primary mb-2 w-lg-auto mb-md-2 mb-sm-0 me-sm-3 w-100 w-md-100 w-sm-auto mb-lg-0 ${ themeDark ? '' : 'text-white' }">
                               Save to collection
                               </a>
                            <a href="#" class="btn btn-outline-secondary w-100 w-sm-auto w-md-100 w-lg-auto ${ themeDark ? 'text-white' : '' }">Share</a>
                        </div>
                    </div>
                </article>`;
}

const generatePagination = (page) => {
    let bodyPagination = `<nav class="w-100 mt-5" aria-label="Page navigation">
              <ul class="pagination justify-content-center">
                <li class="page-item ${page > 1 ? '' : 'disabled'}">
                    <a class="page-link ${ themeDark ? 'bg-dark' : 'bg-light' }" data-number-page="${ page - 1}" href="#">Previous</a>
                </li>`;

    if (page > 2) {
        bodyPagination += `<li class="page-item"><a class="page-link ${ themeDark ? 'bg-dark' : 'bg-light' }" href="#">...</a></li>`
    }

    let n = 0

    for ( n ; n <= page + 1; n++ ) {
        if (n >= page - 1 && n > 0) {
            bodyPagination += `<li class="page-item"><a class="page-link ${ n == page ? 'active' : themeDark ? 'bg-dark' : 'bg-light' }" data-number-page="${ n }" href="#">${ n }</a></li>`
        }
    }

    bodyPagination += `<li class="page-item"><a class="page-link ${ themeDark ? 'bg-dark' : 'bg-light' }" href="#">...</a></li>
                <li class="page-item">
                  <a class="page-link ${ themeDark ? 'bg-dark' : 'bg-light' }" data-number-page="${ page + 1 }" href="#">Next</a>
                </li>
              </ul>
            </nav>`

    return bodyPagination;
};

addListener(document.querySelectorAll('.dataLimit .dropdown-item'), "click", changeLimitHandler());

const handlerPagination = () => (e) => {
    e.preventDefault();
    e.stopPropagation();
    let clickItemPagination = e.target;
    numberPage = Number(clickItemPagination.getAttribute('data-number-page'));
    removeItemsClass(document.querySelectorAll('a[data-number-page]'), 'active');
    clickItemPagination.classList.add('active');

    urlSet.searchParams.set('page', numberPage);
    window.history.pushState(null, null, urlSet);

    getNewData(limit, numberPage);
}


// Functions global

function addListener(items, event, callBack) {
    items.forEach(item => {
        item.addEventListener(event, function(e){
            callBack(e);
        });
    });
}

function toggleItemsClass(items, classToggle) {
    items.forEach(item => {
        item.classList.toggle(classToggle);
    })
};

function removeItemsClass(items, className) {
    items.forEach(item => {
        item.classList.remove(className);
    })
};