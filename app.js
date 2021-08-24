const searchTerm = document.querySelector('#search-input');
const searchBtn = document.querySelector('.search__btn');

const fetchResults = async () => {
    try {
        const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
            params: {
                apiKey: 'dffc37a9c2f84d2099cc90956a95cbcd',
                maxFat: 25,
                query: searchTerm.value
            }
        })
        // return response.data.results;
        console.log(response.data.results);
        displayResults(response.data.results);
    }
    catch (err) {
        console.log(err);
    }
}

const resultsContainer = document.querySelector('.results__container')

const displayResults = (results) => {
    results.forEach(result => {
        const resultItem = document.createElement('li');
        resultItem.classList.add('result__item');
        resultItem.innerHTML = `
        <a href="#" class="result__link">
            <div class="result__img-container">
                <img src="${result.image}" alt="" class="result__img">
            </div>
            <div class="result__content">
                <h4 class="result__title">${result.title}</h4>
                <ul class="result__text">
                    <li class="result__protein">Protein: ${result.protein}</li>
                    <li class="result__cal">Calories: ${result.calories}</li>
                    <li class="result__carbs">Carbs: ${result.carbs}</li>
                    <li class="result__fat">Fat: ${result.fat}</li>
                </ul>
            </div>
        </a>
        `
        resultsContainer.append(resultItem);
    })
}



searchBtn.addEventListener('click', fetchResults);


