import moment from "moment";
import { Diet, DietDay, DietSchedule, Person } from "../types";
import { recipes } from "./recipes";

export { recipes };

/*
BREAKFAST has 1 mandatory dish, reset need to be derived
*/
export const dietDay: DietDay = {
  totalRecipes: 15,
  meals: {
    BREAKFAST: {
      totalRecipes: 2,
      recipeIds: ["recipe845"],
    },
    LUNCH: {
      totalRecipes: 5,
      recipeIds: [],
    },
    DINNER: {
      totalRecipes: 5,
      recipeIds: [],
    },
    SNACK: {
      totalRecipes: 2,
      recipeIds: [],
    },
    DRINK: {
      totalRecipes: 1,
      recipeIds: [],
    },
  },
};

export const diets: Record<string, Diet> = {
  diet1: {
    id: "diet1",
    title: "30day",
    duration: 30,
    mealsByDay: [
      dietDay,
      dietDay,
      dietDay,
      dietDay,
      dietDay,
      dietDay,
      dietDay,
      dietDay,
      dietDay,
      dietDay,
      dietDay,
      dietDay,
      dietDay,
      dietDay,
      dietDay,
      dietDay,
      dietDay,
      dietDay,
      dietDay,
      dietDay,
      dietDay,
      dietDay,
      dietDay,
      dietDay,
      dietDay,
      dietDay,
      dietDay,
      dietDay,
      dietDay,
      dietDay,
    ],
  },
};

export const dietSchedule: DietSchedule = {
  SUNDAY: false,
  MONDAY: true,
  TUESDAY: true,
  WEDNESDAY: true,
  THURSDAY: true,
  FRIDAY: true,
  SATURDAY: true,
};

export const personStartingToday: Person = {
  id: "person1",
  name: "Persons Name",
  startDate: moment().format("YYYY-MM-DD"),
  dietId: "diet1",
};

/*
Null Object to represent a Person's last day of meals if they have had none so far
*/
export const NullDietDay: DietDay = {
  totalRecipes: 15,
  meals: {
    BREAKFAST: {
      totalRecipes: 2,
      recipeIds: [],
    },
    LUNCH: {
      totalRecipes: 5,
      recipeIds: [],
    },
    DINNER: {
      totalRecipes: 5,
      recipeIds: [],
    },
    SNACK: {
      totalRecipes: 2,
      recipeIds: [],
    },
    DRINK: {
      totalRecipes: 1,
      recipeIds: [],
    },
  },
};
