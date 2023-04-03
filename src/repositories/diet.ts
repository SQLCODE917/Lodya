import moment from "moment";
import { Diet, DietSchedule, DietDay, Meal, MealEnum, Recipe } from "../types";
import { dietDay as BaseDietDay, diets, dietSchedule } from "../data";
import { personById } from "./person";
import { restrictionBasedValueForWholeDay } from "./restrictions";

export const getDiet = async (id: string): Promise<Diet | null> => {
  const diet = diets[id];
  if (diet) {
    return await Promise.resolve(diet);
  } else {
    return await Promise.resolve(null);
  }
};

export const getDietSchedule = async (
  personId: string,
  dietId: string
): Promise<DietSchedule> => {
  return await Promise.resolve(dietSchedule);
};

export const getDietDayIndex = (
  startDateString: string,
  todaysDateString: string
): number => {
  const todaysDateMoment = moment(todaysDateString);
  const startDateMoment = moment(startDateString);
  return todaysDateMoment.diff(startDateMoment, "days");
};

export const getDietDay = async (
  personId: string,
  dateString: string = moment().format("YYYY-MM-DD")
): Promise<DietDay | null> => {
  try {
    const person = await personById(personId);
    const { dietId, startDate } = person;
    const diet = await getDiet(dietId);
    if (!diet) {
      return Promise.reject(null);
    }
    const { mealsByDay } = diet;
    const dietDayIndex = getDietDayIndex(startDate, dateString);
    const dietDay = mealsByDay[dietDayIndex];
    return Promise.resolve(dietDay);
  } catch (e) {
    return Promise.reject(null);
  }
};

export const getRandom = <T>(
  items: Array<T>
): { item: T; remainder: Array<T> } => {
  const randomIndex = Math.floor(Math.random() * items.length);
  const item = items[randomIndex];
  const remainder = [...items];
  remainder.splice(randomIndex, 1);
  return { item, remainder };
};

export const getFirstNotFullMeal = (
  currentDietDay: DietDay
): Meal | undefined => {
  const meals: Array<Meal> = Object.values(MealEnum);

  return meals.find((meal) => {
    const currentMeal = currentDietDay.meals[meal];
    return currentMeal.totalRecipes > currentMeal.recipeIds.length;
  });
};

export const targetWeight = (
  currentDietDay: DietDay
): Record<Meal | "total", number> => {
  const { BREAKFAST, LUNCH, DINNER, SNACK, DRINK } = currentDietDay.meals;
  const breakfastTarget = BREAKFAST.totalRecipes - BREAKFAST.recipeIds.length;
  const lunchTarget = LUNCH.totalRecipes - LUNCH.recipeIds.length;
  const dinnerTarget = DINNER.totalRecipes - DINNER.recipeIds.length;
  const snackTarget = SNACK.totalRecipes - SNACK.recipeIds.length;
  const drinkTarget = DRINK.totalRecipes - DRINK.recipeIds.length;
  const total =
    breakfastTarget + lunchTarget + dinnerTarget + snackTarget + drinkTarget;

  return {
    total,
    BREAKFAST: breakfastTarget,
    LUNCH: lunchTarget,
    DINNER: dinnerTarget,
    SNACK: snackTarget,
    DRINK: drinkTarget,
  };
};
export const getRecipesRemaining = (
  recipesByMeal: Record<Meal, Array<Recipe>>
): number => {
  let total = 0;
  let meal: Meal;
  for (meal in MealEnum) {
    const mealKey = MealEnum[meal];
    const numberOfRecipes = recipesByMeal[mealKey].length;
    total = total + numberOfRecipes;
  }
  return total;
};

export const knapSack = async (
  previousDietDay: DietDay,
  currentDietDay: DietDay,
  recipesByMeal: Record<Meal, Array<Recipe>>
): Promise<DietDay> => {
  const target = targetWeight(currentDietDay);
  const recipesRemaining = getRecipesRemaining(recipesByMeal);

  // base cases = we are either full or out of options
  if (target.total <= 0 || recipesRemaining === 0) {
    return Promise.resolve(currentDietDay);
  }

  // pick an item and recur for remaining items
  // WARNING: we are not checking for the number of recipes available for the meal
  // assumption that we will always have more recipes per meal than a meal's totalRecipes requirement
  const firstNotFullMeal: Meal | undefined =
    getFirstNotFullMeal(currentDietDay);

  // strange case - no not full meals found,
  // which should not happen since we already checked the targetWeight
  if (!firstNotFullMeal) {
    return Promise.resolve(currentDietDay);
  }

  // defining the alternative:
  // random recipe taken from the recipe record
  // and added to a proposed alternative diet day.
  // the values are calculated and we recur with either the highest or newest
  const recipesToFillTheMeal = [...recipesByMeal[firstNotFullMeal]];
  const { item: randomRecipe, remainder: remainingRecipes } =
    getRandom(recipesToFillTheMeal);
  const alternativeCurrentDietDay: DietDay = {
    ...currentDietDay,
    meals: {
      ...currentDietDay.meals,
      [firstNotFullMeal]: {
        totalRecipes: currentDietDay.meals[firstNotFullMeal].totalRecipes,
        recipeIds: [
          ...currentDietDay.meals[firstNotFullMeal].recipeIds,
          randomRecipe.id,
        ],
      },
    },
  };
  const alternativeRecipesByMeal: Record<Meal, Array<Recipe>> = {
    ...recipesByMeal,
    [firstNotFullMeal]: remainingRecipes,
  };

  const currentMealsValue = await restrictionBasedValueForWholeDay(
    previousDietDay,
    currentDietDay
  );
  const alternativeMealsValue = await restrictionBasedValueForWholeDay(
    previousDietDay,
    alternativeCurrentDietDay
  );

  if (currentMealsValue > alternativeMealsValue) {
    return knapSack(previousDietDay, currentDietDay, recipesByMeal);
  } else {
    return knapSack(
      previousDietDay,
      alternativeCurrentDietDay,
      alternativeRecipesByMeal
    );
  }
};
