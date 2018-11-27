import { elements, renderLoader, clearLoader } from './views/base';
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';

//Search obj, current recipe obj, shopping list obj, liked obj
const state = {};

const controlSearch = async () => {
  // get query from view
  const query = searchView.getInput();

  if (query) {
    //new search obj and add to state
    state.search = new Search(query);

    //prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchBox);

    try {
      //search for recipes
      await state.search.getResults();

      //render results on UI
      clearLoader();
      searchView.renderResults(state.search.results);
    } catch (e) {
      console.log(e);
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});


elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const gotToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.results, gotToPage);
  }
});

const controlRecipe = async () => {
  const id = window.location.hash.replace('#', '');

  if (id) {
    //prepare UI for changes

    //create new recipe object
    state.recipe = new Recipe(id);

    try {
      //get recipe data and parse ing.
      await state.recipe.getRecipe();

      state.recipe.parseIngredients();

      //calculate servings and time
      state.recipe.calcServings();
      state.recipe.calcTime();

      //render recipe
      console.log(state.recipe);
    } catch (e) {
      console.log(e);
    }
  }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
