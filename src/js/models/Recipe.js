import axios from 'axios';
import { key } from '../config.js';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.img_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (e) {
      console.log(e);
    }
  }

  calcTime() {
    //rough estimate that we need 15 mins for each 3 ingredients
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
    const units = [...unitsShort, 'kg', 'g']

    const newIngredients = this.ingredients.map(el => {
      //uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      })

      //remove ()
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      //parse ingredients into count, unit and ing..
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

      let objIng;
      
      if(unitIndex > -1) {
        //there is a unit
        // 4 1/2 cups. arrCount = [4, 1/2]
        // 4 cups . arrCOunt = [4]

        const arrCount = arrIng.slice(0, unitIndex);
        let count;

        if(arrCount.length === 1) {
          count = eval(arrCount[0].replace('-', '+'));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+')); 
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' ')
        }

      } else if(parseInt(arrIng[0], 10)) {
        //there is no unit, but 1st element is number..
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' ')
        }

      } else if(unitIndex === -1 ) {
        //there is no unit and no number
        objIng = {
          count: 1,
          unit: '',
          ingredient 
        }

      }

      return objIng;
    })
    this.ingredients = newIngredients;
  }
}
