import { Meal, Recipe } from "../types";
import { recipes } from "../data";

export const allRecipes = async (): Promise<Array<Recipe>> => {
  return await Promise.resolve(recipes);
};

export const recipesByIds = async (
  ids: Array<string>
): Promise<Array<Recipe>> => {
  const recipesWithMatchingIds = recipes.filter(({ id }) => ids.includes(id));
  return Promise.resolve(recipesWithMatchingIds);
};

export const recipesForMeal = async (meal: Meal): Promise<Array<Recipe>> => {
  const recipes = await allRecipes();
  const forGivenMealRecipes = recipes.filter((recipe) => {
    return recipe.meal.includes(meal);
  });
  return forGivenMealRecipes;
};

export const recipesByMeal = async () => {
  const mealRecipeMap: Record<Meal, Array<Recipe>> = {
    BREAKFAST: await recipesForMeal("BREAKFAST"),
    LUNCH: await recipesForMeal("LUNCH"),
    DINNER: await recipesForMeal("DINNER"),
    SNACK: await recipesForMeal("SNACK"),
    DRINK: await recipesForMeal("DRINK"),
  };
  return mealRecipeMap;
};
