const body = document.querySelector('body');
const resultsContainer = document.querySelector('.results-container');
const searchResultsContainer = document.querySelector('.search-results');
const recipeContainer = document.querySelector('.recipe');
const searchBtn = document.querySelector('.search__btn');
const appHeading = document.querySelector('.app-text__heading');
const appIntro = document.querySelector('.app-text__intro');
const searchBlock = document.querySelector('.search');
const headContainer = document.querySelector('.head-container');
const searchAdvanced = document.querySelector('.search__advanced');
const hideSearchResults = document.querySelector('.hide')
const hideIcon = document.querySelector('.hide__icon');

const advancedToggle = document.querySelector('.search__advanced-toggle');
const advancedSearchBlock = document.querySelector('.search__advanced');
const annotationIconMin = document.querySelector('.search__label-icon--min');
const annotationMin = document.querySelector('.search__annotation-box--min');
const annotationIconMax = document.querySelector('.search__label-icon--max');
const annotationMax = document.querySelector('.search__annotation-box--max');
const annotationBoxMin = document.querySelector('.search__annotation-box--min');
const annotationBoxMax = document.querySelector('.search__annotation-box--max');
const searchColumnMin = document.querySelector('.search__column--min')
const searchColumnMax = document.querySelector('.search__column--max')

const loader = document.querySelector('.loader');
// display search results on left sidebar
// each search result display as a card
const displayResults = (results) => {

    clearContainer(searchResultsContainer);
    clearContainer(recipeContainer);

    results.forEach(result => {
        const nutritionArr = result.nutrition.nutrients;
        const resultItem = document.createElement('li');
        addClass(resultItem, 'card');
        const requiredNutritionArr = filterArr(nutritionArr, ['Calories', 'Fat', 'Carbohydrates', 'Protein'], 'name');

        resultItem.innerHTML = `
        <a href="#" class="card__link">
            <div class="card__img-container">
                <img src="${result.image}" alt="" class="card__img">
            </div>
            <div class="card__content">
                <h4 class="card__title heading--4">${result.title}</h4>
                <ul class="card__nutrition-overview"></ul>
            </div>
        </a>
        `
        searchResultsContainer.append(resultItem);

        addClass(loader, 'hidden');
        removeClass(hideSearchResults, 'hidden');

        // print nutrition summary list
        // need to use "resultItem" rather than "document" to select the corresponding ".card__nutrition-overview" element
        const nutritionOverview = resultItem.querySelector('.card__nutrition-overview');
        const nutritionList = printResults(requiredNutritionArr);
        nutritionList.forEach(item => nutritionOverview.append(item));

        // resultItem.addEventListener('click', () => recipeDetails(result));
        resultItem.addEventListener('click', () => {
            searchResultsContainer.childNodes.forEach(child => removeClass(child, 'selected'));
            addClass(resultItem, 'selected')
            recipeDetails(result)
        });
    })

    recipeDetails(results[0]); // display the first recipe details from the search results
    addClass(searchResultsContainer.firstChild, 'selected')
}

// search result card is clickable to show recipe details
const recipeDetails = async (recipe) => {
    clearContainer(recipeContainer);

    // scroll recipe section to the top before rendering the recipe content
    recipeContainer.scrollTo(0, 0);

    const recipeHeading = document.createElement('div');
    addClass(recipeHeading, 'recipe__heading');

    const imageUrl = imgResize(recipe.image);
    // render recipe heading
    recipeHeading.innerHTML =
        `<div class="recipe__img-container">
            <img src="${imageUrl}" alt="" class="recipe__img">
        </div>
        <h2 class="recipe__name heading--2">${recipe.title}</h2>
        <p class="recipe__summary">${recipe.summary ? recipe.summary : ''}</p>
        <div class="recipe__stats-container">
            <div class="recipe__stats">
                <p><i class="recipe__stats-icon fas fa-user"></i></p>
                <h4 class="recipe__stats-heading heading--4">Servings</h4>
                <p class="recipe__servings">${recipe.servings ? recipe.servings : 'N/A'}</p>
            </div>
            <div class="recipe__stats">
                <p><i class="recipe__stats-icon fas fa-clock"></i></p>
                <h4 class="recipe__stats-heading heading--4">Cooking Time</h4>
                <p class="recipe__cooking-time">${recipe.readyInMinutes ? recipe.readyInMinutes : 'N/A'}min</p>
            </div>
            <div class="recipe__stats">
                <p><i class="recipe__stats-icon fas fa-star"></i></p>
                <h4 class="recipe__stats-heading heading--4">Healthy Score</h4>
                <p class="recipe__health-score">${recipe.healthScore ? recipe.healthScore : 'N/A'}</p>
            </div>
        </div>`
    recipeContainer.append(recipeHeading)

    // insert link to recipe summary links
    const summaryLinks = document.querySelectorAll('.recipe__summary a');
    fetchSummaryLinks(summaryLinks);

    showIngredients(recipe);
    showInstructions(recipe);
    await showTaste(recipe.id);
    await showNutritions(recipe.id)
}

// trigger search, and change page layout
searchBtn.addEventListener('click', () => {
    fetchResults();
    addClass(advancedSearchBlock, 'hidden');
    removeClass(body, 'background-color');
    addClass(body, 'body__layout--navi');
    addClass(resultsContainer, 'results-container--navi');
    addClass(appHeading, 'hidden');
    addClass(appIntro, 'hidden');
    addClass(headContainer, 'head-container--navi');
    addClass(searchBlock, 'search--navi');
    addClass(searchAdvanced, 'search__advanced--navi');
    addClass(searchBtn, 'search__btn--navi');
    addClass(advancedToggle, 'search__advanced-toggle--navi');
});

// hide icon to hide search results
hideSearchResults.addEventListener('click', () => {
    toggleClass(searchResultsContainer, 'hidden');
    toggleClass(hideIcon, 'hide__icon--expand');
    toggleClass(resultsContainer, 'results-container--collapse');
})

// advanced search button to toggle the additional criteria
advancedToggle.addEventListener('click', () => toggleClass(advancedSearchBlock, 'hidden'));

// toggle min and max icon to show annotation
annotationIconMin.addEventListener('click', () => toggleClass(annotationMin, 'hidden'));
annotationIconMax.addEventListener('click', () => toggleClass(annotationMax, 'hidden'));

// close the annotation when clicking outside the box
document.addEventListener('click', (event) => closeElement(event, searchColumnMin, annotationBoxMin));
document.addEventListener('click', (event) => closeElement(event, searchColumnMax, annotationBoxMax));


