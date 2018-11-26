import axios from 'axios';

async function getResults(query) {
  const key = '813e28f5069bc003206ad25b59237660';
  try {
    const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${query}`);
    const recipes = res.data.recipes;
    console.log(recipes);
  } catch(e) {
    console.log(e)
  }
}

getResults('pizza');