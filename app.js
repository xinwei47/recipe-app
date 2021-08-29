// advanced search button to toggle the additional criteria
const advancedToggle = document.querySelector('.search__advanced-toggle');
const advancedSearchBlock = document.querySelector('.search__advanced');

advancedToggle.addEventListener('click', () => {
    advancedSearchBlock.classList.toggle('hidden');
})

// fetch basic search and advanced search results, including nutrition information
const fetchResults = async () => {

    const searchTerm = document.querySelector('#search-input').value;
    const ingredients = document.querySelector('#ingredients');
    const minFat = parseFloat(document.querySelector('#min-fat').value);
    const maxFat = parseFloat(document.querySelector('#max-fat').value);
    const minCalories = parseFloat(document.querySelector('#min-cal').value);
    const maxCalories = parseFloat(document.querySelector('#max-cal').value);
    const minCarbs = parseFloat(document.querySelector('#min-carbs').value);
    const maxCarbs = parseFloat(document.querySelector('#max-carbs').value);
    const minProtein = parseFloat(document.querySelector('#min-protein').value);
    const maxProtein = parseFloat(document.querySelector('#max-protein').value);

    try {
        const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
            params: {
                apiKey,
                query: searchTerm,
                includeIngredients: ingredients,
                ...(minFat ? { minFat } : {}),
                ...(maxFat ? { maxFat } : {}),
                ...(minCalories ? { minCalories } : {}),
                ...(maxCalories ? { maxCalories } : {}),
                ...(minCarbs ? { minCarbs } : {}),
                ...(maxCarbs ? { maxCarbs } : {}),
                ...(minProtein ? { minProtein } : {}),
                ...(maxProtein ? { maxProtein } : {}),
                addRecipeNutrition: true,
                instructionsRequired: true
            }
        })
        console.log(response.data.results);
        displayResults(response.data.results);
    }
    catch (err) {
        console.log('Error:', err.message);
    }
}

// clear container before displaying results
const clearContainer = container => {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

// display search results on left sidebar
// search result display as a card
const displayResults = (results) => {
    const searchResultsContainer = document.querySelector('.search-results')
    clearContainer(searchResultsContainer);

    results.forEach(result => {
        const nutritionArr = result.nutrition.nutrients;
        const resultItem = document.createElement('li');
        resultItem.classList.add('result__card');
        const requiredNutritionArr = filterArr(nutritionArr, ['Calories', 'Fat', 'Carbohydrates', 'Protein'], 'name');
        console.log(requiredNutritionArr);

        resultItem.innerHTML = `
        <a href="#" class="result__link">
            <div class="result__img-container">
                <img src="${result.image}" alt="" class="result__img">
            </div>
            <div class="result__content">
                <h4 class="result__title">${result.title}</h4>
                <ul class="result__nutrition-overview"></ul>
            </div>
        </a>
        `
        searchResultsContainer.append(resultItem);

        // print nutrition summary list
        // need to use "resultItem" rather than "document" to select the corresponding ".result__nutrition-overview" element
        const nutritionOverview = resultItem.querySelector('.result__nutrition-overview');
        const nutritionList = printResults(requiredNutritionArr);
        nutritionList.forEach(item => nutritionOverview.append(item));

        resultItem.addEventListener('click', () => {
            recipeDetails(result)
        });
    })
}

// filter out unneeded nutrition items
const filterArr = (lookupArr, lookupValueArr = [], lookupKey) => {
    return lookupArr.filter(item => {
        return lookupValueArr.includes(item[lookupKey]);
    })
}

// print nutrition lists
const printResults = (arr) => {
    return arr.map((item) => {
        const list = document.createElement('li');
        list.innerHTML = `<li>${item.name}: ${item.amount}${item.unit}</li>`;
        return list;
    })
}

// search result card is clickable to show recipe details
const recipeContainer = document.querySelector('.recipe');
const recipeDetails = recipe => {
    const recipeHeading = document.createElement('div');
    recipeHeading.classList.add('recipe__heading');

    clearContainer(recipeContainer);

    // render recipe heading
    recipeHeading.innerHTML =
        `<div class="recipe__heading">
            <div class="recipe__img-container">
                <img src="${recipe.image}" alt="" class="recipe__img">
            </div>
            <h2 class="recipe__name heading--2">${recipe.title}</h2>
            <p class="recipe__summary">${recipe.summary}</p>
            <div class="recipe__stats-container">
                <div class="recipe__stats">
                    <h4 class="recipe__stats-heading heading--4">Servings</h4>
                    <p class="recipe__servings">${recipe.servings}</p>
                </div>
                <div class="recipe__stats">
                    <h4 class="recipe__stats-heading heading--4">Cooking Time (min)</h4>
                    <p class="recipe__cooking-time">${recipe.readyInMinutes}</p>
                </div>
                <div class="recipe__stats">
                    <h4 class="recipe__stats-heading heading--4">Healthy Score</h4>
                    <p class="recipe__health-score">${recipe.healthScore}</p>
                </div>
            </div>
        </div>`
    recipeContainer.append(recipeHeading)


    showIngredients(recipe);
    showInstructions(recipe);
    showTaste(recipe.id);
}


// fetch recipe ingredients data
const showIngredients = recipe => {
    const ingredientsContainer = document.createElement('div');
    ingredientsContainer.classList.add('recipe__ingredients')
    ingredientsContainer.innerHTML = `
            <h3 class="recipe__section-title heading--3">Ingredients</h3>
            <ul class="recipe__ingredients-list"></ul>
        `
    recipeContainer.append(ingredientsContainer);

    const ingredientsList = document.querySelector('.recipe__ingredients-list');

    recipe.nutrition.ingredients.forEach(ingredient => {
        const ingredientItem = document.createElement('li');
        ingredientItem.classList.add('recipe__ingredient-item');
        ingredientItem.textContent = ingredient.amount + ' ' + ingredient.unit + ' ' + ingredient.name;
        ingredientsList.append(ingredientItem);
    })
}


// get recipe instructions data
const showInstructions = recipe => {
    const instructionsContainer = document.createElement('div');
    instructionsContainer.classList.add('recipe__instructions')
    instructionsContainer.innerHTML = `
            <h3 class="recipe__section-title heading--3">Instructions</h3>
            <ol class="recipe__instructions-list"></ol>
        `
    recipeContainer.append(instructionsContainer);

    const instructionsList = document.querySelector('.recipe__instructions-list');
    recipe.analyzedInstructions[0].steps.forEach(instruction => {
        const instructionItem = document.createElement('li');
        instructionItem.classList.add('recipe__instruction-item');
        instructionItem.textContent = instruction.step;
        instructionsList.append(instructionItem);
    })
}

// fetch recipe taste data
// GET https://api.spoonacular.com/recipes/{id}/nutritionWidget
const showTaste = async (recipeId) => {
    try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/tasteWidget`, {
            params: {
                apiKey
            }
        })
        // extract html and js from response.data 
        const tasteResponse = response.data.split(/\<script\>|\<\/script\>/);

        const tasteHtml = tasteResponse[0];
        const tasteJs = tasteResponse[1];

        const tasteVisual = document.createElement('div');
        tasteVisual.classList.add('recipe__taste');
        tasteVisual.innerHTML = `<h3 class="recipe__section-title heading--3">Taste</h3>` + tasteHtml;

        // <script> cannot execute directly in innerHTML
        const tasteScript = document.createElement('script');
        tasteScript.text = tasteJs;

        tasteVisual.append(tasteScript)
        recipeContainer.append(tasteVisual);
    }
    catch (err) {
        console.log('Error:', err.message);
    }
}

const searchBtn = document.querySelector('.search__btn');

searchBtn.addEventListener('click', fetchResults);