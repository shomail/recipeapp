import axios from 'axios';

export default class Search {
  constructor(query) {
    this.query = query;
  }
  async getResults() {
    const key = '813e28f5069bc003206ad25b59237660';
    try {
      const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.results = res.data.recipes;
      // console.log(this.recipes);
    } catch(e) {
      console.log(e)
    }
  }
}