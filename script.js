const recipeContainer = document.querySelector('.recipe-container');
const searchBox = document.querySelector('.searchBox');
const searchButton = document.querySelector('.searchButton');
const recipeDetails = document.querySelector('.recipe-details');
const recipeDetailContent = document.querySelector('.recipe-detail-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');

const fetchRecipes = async (searchData) => {
    recipeContainer.innerHTML = "<h2>Fetching recipes...</h2>";
    try{
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchData}`);
    const response = await data.json();
    recipeContainer.innerHTML = ""; 
    response.meals.forEach((meal) => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');
        recipeDiv.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
            <p><span>${meal.strArea}</span> Dish</p>
            <p>Belong to <span>${meal.strCategory}</span> Category</p>
        `;
        const button=document.createElement('button');
        button.textContent = "View Recipe";
        recipeDiv.appendChild(button);
        //add event listener to button
        button.addEventListener('click', () => {
           openRecipePopup(meal);
        });
        recipeContainer.appendChild(recipeDiv);
    });
    }catch(error) {
        console.error("Error in fetching recipes:", error);
        recipeContainer.innerHTML = "<h2>Sorry, no recipes found. Please try again.</h2>";
    }
};
//Function to fetch ingredients and measurements
const fetchIngredients = (meal) => {
    let ingredientsList= "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measurement = meal[`strMeasure${i}`];
        if (ingredient) {
            ingredientsList+= `<li>${measurement} - ${ingredient}</li>`;
        }
        else break;
    }
    return ingredientsList;
}
const openRecipePopup=(meal)=>{
       recipeDetailContent.innerHTML=`
       <h2 class="recipeName">${meal.strMeal}</h2>
       <h3>Ingredients:</h3>
       <ul class="ingrediantList">${fetchIngredients(meal)}</ul>
       <div class="recipeInstructions">
          <h3>Instructions:</h3>
          <p>${meal.strInstructions}</p>
       </div>
       
       `;
       recipeDetailContent.parentElement.style.display="block";
}
recipeCloseBtn.addEventListener('click', () => {
    recipeDetailContent.parentElement.style.display="none";
});
searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    const searchTerm = searchBox.value.trim();
    if(!searchTerm) {
        recipeContainer.innerHTML = "<h2>Please enter your meal</h2>";
        return;
    }
    fetchRecipes(searchTerm);
});
