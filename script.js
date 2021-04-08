let searchInput = document.querySelector('.getRepositories-form__search');
let autocompleteList = document.querySelector('.getRepositories-autocomplete');
let getRepositoriesResult = document.querySelector('.getRepositories-result');
let newArr = [];

const debounce = (fn, debounceTime) => {
    let time;
    
    return function () {
        const call = () => {
            fn.apply(this, arguments)
        }
        clearTimeout(time);
        time = setTimeout(call, debounceTime);
    }
};

async function fethGitHub(value) {
    ////Поиск элементов и работа с ними
    let GitHubRepositories = await fetch(`https://api.github.com/search/repositories?q=${value}&per_page=5`)
        .then(arrReposit => {
            if (arrReposit.ok) {
                return arrReposit.json();
            };
        });
    newArr = newArrRepositories(GitHubRepositories);
    console.log(newArr)
    autocomplete(newArr);
    
};

function newArrRepositories(arrApiRepositories) {
    ////Новый масив из 5 элиментов, с нужными свойствами
    return  arrApiRepositories.items.map(item => ({'name': item.name, 'owner': item.owner.login, 'stars': item.stargazers_count}));
}

function autocomplete(arrIsAutocomplite) {
    //////Создаём и добовляем элементы в автокомплит
    arrIsAutocomplite.forEach((element, index) => {
        let newElement = document.createElement('button');
        newElement.classList.add('getRepositories-autocomplete__item');
        newElement.id = index;
        newElement.innerText = element.name;
        autocompleteList.appendChild(newElement);
        newElement.addEventListener('click', function (event) {
            //Добовляем элемент и очищаем инпут
            searchInput.value = element.name;
            setTimeout(() => {
                autocompleteList.innerHTML = '';
                searchInput.value = '';
                itemAdd(newElement.id)
            }, 400);
        });
    });
}

function itemAdd(id) {
    //Новая карточка
    let obj = newArr[id];

    let card = document.createElement('div');
    card.classList.add('getRepositories-result__item');

    let cardName = document.createElement('p');
    cardName.classList.add('getRepositories-result__name');
    cardName.innerHTML = `Name: ${obj.name}`;
    let cardOwner = document.createElement('p');
    cardOwner.classList.add('getRepositories-result__owner');
    cardOwner.innerHTML = `Name: ${obj.owner}`;
    let cardStars = document.createElement('p');
    cardStars.classList.add('getRepositories-result__stars');
    cardStars.innerHTML = `Name: ${obj.stars}`;
    let btn = document.createElement('span');
    btn.classList.add('getRepositories-result__close');
    btn.addEventListener('click', function() {
        //Событие на кнопке для удаление карточки
        card.remove();
    })
    
    card.appendChild(cardName);
    card.appendChild(cardOwner);
    card.appendChild(cardStars);
    card.appendChild(btn);
    getRepositoriesResult.appendChild(card);
};


fethGitHub = debounce(fethGitHub, 500);

searchInput.addEventListener('keyup', function() {
////событие по кнопке через инпут
    autocompleteList.innerHTML = '';
    if (searchInput.value) {
        fethGitHub(searchInput.value);
    }
});

