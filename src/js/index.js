import { elements } from './views/base';
import Search from './models/Search';
import * as searchView from './views/searchView';

//Search obj, current recipe obj, shopping list obj, liked obj
const state = {}

const controlSearch = async () => {
  // get query from view
  const query = searchView.getInput();
  
  if(query) {
    //new search obj and add to state
    state.search = new Search(query);

    //prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    //search for recipes
    await state.search.getResults();

    //render results on UI
    searchView.renderResults(state.search.results);
  }
}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});