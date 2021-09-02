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

    removeClass(loader, 'hidden');

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
                instructionsRequired: true,
                number: 50
            }
        })
        displayResults(response.data.results);
    }
    catch (err) {
        console.log('Error:', err.message);
    }
}

// retrieve recipe ingredients data
const showIngredients = recipe => {
    const ingredientsContainer = document.createElement('div');
    addClass(ingredientsContainer, 'recipe__ingredients');
    ingredientsContainer.innerHTML = `
            <h3 class="recipe__section-title heading--3">Ingredients</h3>
            <ul class="recipe__ingredients-list"></ul>
        `
    recipeContainer.append(ingredientsContainer);

    const ingredientsList = document.querySelector('.recipe__ingredients-list');

    recipe.nutrition.ingredients.forEach(ingredient => {
        const ingredientItem = document.createElement('li');
        addClass(ingredientItem, 'recipe__ingredient-item');
        ingredientItem.textContent = ingredient.amount + ' ' + ingredient.unit + ' ' + ingredient.name;
        ingredientsList.append(ingredientItem);
    })
}


// retrieve recipe instructions data
const showInstructions = recipe => {
    const instructionsContainer = document.createElement('div');
    addClass(instructionsContainer, 'recipe__instructions');
    instructionsContainer.innerHTML = `
            <h3 class="recipe__section-title heading--3">Instructions</h3>
            <ol class="recipe__instructions-list"></ol>
        `
    recipeContainer.append(instructionsContainer);

    const instructionsList = document.querySelector('.recipe__instructions-list');
    if (recipe.analyzedInstructions[0] && recipe.analyzedInstructions[0].steps) {
        recipe.analyzedInstructions[0].steps.forEach(instruction => {
            const instructionItem = document.createElement('li');
            addClass(instructionItem, 'recipe__instruction-item');
            instructionItem.textContent = instruction.step;
            instructionsList.append(instructionItem);
        })
    }
    else {
        const errorMsg = document.createElement('p');
        addClass(errorMsg, 'recipe__instructions-err');
        errorMsg.textContent = 'Instructions are not available.';
        instructionsContainer.append(errorMsg);
    }
}

// fetch recipe taste data
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
        addClass(tasteVisual, 'recipe__taste');
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

// fetch nutrition data
const showNutritions = async (recipeId) => {
    try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget`, {
            params: {
                apiKey,
                defaultCss: true
            }
        })

        // extract html and js from response.data 
        const nutritionResponse = response.data.split(/\<script\s*.*\>|\<\/script\>/);

        const nutritionHtml = nutritionResponse[0];
        const nutritionJs = nutritionResponse[1];

        const nutritionVisual = document.createElement('div');
        addClass(nutritionVisual, 'recipe__nutritions');
        nutritionVisual.innerHTML = `<h3 class="recipe__section-title heading--3">Nutritions</h3>` + nutritionHtml;

        // <script> cannot execute directly in innerHTML
        const nutritionScript = document.createElement('script');
        nutritionScript.setAttribute('type', 'text/javascript');
        nutritionScript.text = nutritionJs;

        nutritionVisual.append(nutritionScript)
        recipeContainer.append(nutritionVisual);
    }
    catch (err) {
        console.log('Error:', err.message);
    }
}

// fetch data for recipe summary links
const fetchSummaryLinks = (links) => {
    links.forEach(link => {
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            // retrieve recipe Id
            const linkArr = link.href.split('-')
            const linkRecipeId = linkArr[linkArr.length - 1];
            const response = await axios.get(`https://api.spoonacular.com/recipes/${linkRecipeId}/information`, {
                params: {
                    apiKey,
                    includeNutrition: true
                }
            })
            recipeDetails(response.data);
        })
    })
}
