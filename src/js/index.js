import { elements, renderLoader, clearLoader } from './views/base';
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

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
    recipeView.clearRecipe();

    renderLoader(elements.recipe);

    //highlight selected item
    if (state.search) searchView.highlightSelected(id);

    //create new recipe object
    state.recipe = new Recipe(id);

    try {
      //get recipe data and parse ing.
      await state.recipe.getRecipe();
      // console.log(state.recipe);

      state.recipe.parseIngredients();

      //calculate servings and time
      state.recipe.calcServings();
      state.recipe.calcTime();

      //render recipe
      // console.log(state.recipe);
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (e) {
      console.log(e);
    }
  }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

const controlList = () => {
  // create a new list if there is not yet
  if (!state.list) state.list = new List();

  // add each ingredient to the list and UI
  state.recipe.ingredients.forEach(el => {
    const { count, unit, ingredient } = el;
    const item = state.list.addItem(count, unit, ingredient);
    listView.renderItem(item);
  });
};

// handle delete and update list item events
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    state.list.deleteItem(id);

    listView.deleteItem(id);
  } else if (e.target.matches('.shopping__count-value, .shopping__count-value *')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});


const controlLike = () => {
  if(!state.likes) state.likes = new Likes();

  const currentId = state.recipe.id;

  if(!state.likes.isLiked(currentId)) {
    const newLike = state.likes.addLike(
      currentId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );

    likesView.toggleLikeBtn(true);

    likesView.renderLike(newLike);

  } else {

    state.likes.deleteLike(currentId);

    likesView.toggleLikeBtn(false);

    likesView.deleteLike(currentId);

  }
  likesView.toggleLikeMenu(state.likes.getNumLikes())
}

window.addEventListener('load', () => {
  state.likes = new Likes();

  state.likes.readStorage();
  
  likesView.toggleLikeMenu(state.likes.getNumLikes())

  state.likes.likes.forEach(like => likesView.renderLike(like));
})

//handling recipe button clicks
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    controlLike();
  }
});
