import Search from './models/Search';

//Search obj, current recipe obj, shopping list obj, liked obj
const state = {}

const controlSearch = async () => {
  // get query from view
  const query = 'pizza';
  
  if(query) {
    //new search obj and add to state
    state.search = new Search(query);

    //prepare UI for results

    //search for recipes
    await state.search.getResults();

    //render results on UI
    console.log(state.search.results);
  }
}

document.querySelector('.search').addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});