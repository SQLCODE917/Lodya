import {
  DietDay,
  Meal,
  MealEnum,
  NonRepeatableBetweenDays,
  NonRepeatableWithinMeals,
  Recipe,
} from "../types";
import { recipesByIds } from "./recipe";

export const repetitionWithinMeals = async (
  dietDay: DietDay,
  meal: Meal
): Promise<number> => {
  const baseMeal = dietDay.meals[meal];
  const baseRecipeIds: Array<string> = baseMeal.recipeIds;
  if (baseMeal.totalRecipes < baseRecipeIds.length) {
    return Promise.resolve(baseMeal.totalRecipes - baseRecipeIds.length);
  } else if (baseRecipeIds.length === 0 && baseMeal.totalRecipes === 0) {
    return Promise.resolve(1);
  }
  const baseRecipes: Array<Recipe> = await recipesByIds(baseRecipeIds);

  // NonRepeatableWithinMeals Arrays for all recipes: [[from recipe1], [from recipe2],...,[from recipeN]]
  const nonRepeatableWithinMealsArrays: NonRepeatableWithinMeals[][] =
    baseRecipes.map(({ nonRepeatableWithinMeals }) => nonRepeatableWithinMeals);

  // O(n^2) YOLO
  const repeatedNonRepeatables = nonRepeatableWithinMealsArrays.reduce(
    (repetitionAccumulator, comparisonArray, comparisonIndex) => {
      const repetitions = nonRepeatableWithinMealsArrays.reduce(
        (currentAccumulator, currentArray, currentIndex) => {
          if (comparisonIndex !== currentIndex) {
            const currentRepetitions = currentArray.filter(
              (nonRepeatableWithinMeals) =>
                comparisonArray.indexOf(nonRepeatableWithinMeals) !== -1
            );
            currentAccumulator.push(...currentRepetitions);
          }
          return currentAccumulator;
        },
        []
      );
      repetitionAccumulator.push(...repetitions);
      return repetitionAccumulator;
    },
    []
  );

  if (repeatedNonRepeatables.length) {
    const weight = 0 - repeatedNonRepeatables.length;
    console.log(`\tRepetition within meals, weight: ${weight}`);
    return Promise.resolve(weight);
  } else {
    return Promise.resolve(1);
  }
};

export const repetitionBetweenDays = async (
  previousDietDay: DietDay,
  currentDietDay: DietDay,
  meal: Meal
): Promise<number> => {
  const previousMeal = previousDietDay.meals[meal];
  const currentMeal = currentDietDay.meals[meal];
  const previousRecipes: Array<Recipe> = await recipesByIds(
    previousMeal.recipeIds
  );
  const currentRecipes: Array<Recipe> = await recipesByIds(
    currentMeal.recipeIds
  );

  // type the Reduce to avoid the accumulator being an Array<never>, lol@typescript
  const previousNonRepeatables = previousRecipes.reduce<
    Array<NonRepeatableBetweenDays>
  >((accumulator, { nonRepeatableBetweenDays }) => {
    accumulator.push(...nonRepeatableBetweenDays);
    return accumulator;
  }, []);

  const currentNonRepeatables = currentRecipes.reduce<
    Array<NonRepeatableBetweenDays>
  >((accumulator, { nonRepeatableBetweenDays }) => {
    accumulator.push(...nonRepeatableBetweenDays);
    return accumulator;
  }, []);

  const repeatedNonRepeatables = currentNonRepeatables.filter(
    (nonRepeatable) => previousNonRepeatables.indexOf(nonRepeatable) !== -1
  );

  if (repeatedNonRepeatables.length) {
    const weight = 0 - repeatedNonRepeatables.length;
    console.log(`\tRepetition Between Days, weight ${weight}`);
    return Promise.resolve(weight);
  } else {
    return Promise.resolve(1);
  }
};

export const recipeQuantityLimit = (currentDietDay: DietDay, meal: Meal) => {
  const daysMeal = currentDietDay.meals[meal];
  if (daysMeal.totalRecipes < daysMeal.recipeIds.length) {
    const weight = daysMeal.totalRecipes - daysMeal.recipeIds.length;
    console.log(
      `\trecipeQuantityLimit totalRecipes less than recipeIds like ${weight}`
    );
    return weight;
  } else if (daysMeal.totalRecipes === 0 && daysMeal.recipeIds.length === 0) {
    return 1;
  } else if (daysMeal.totalRecipes === daysMeal.recipeIds.length) {
    return 1;
  } else {
    const weight = daysMeal.recipeIds.length - daysMeal.totalRecipes;
    console.log(`\trecipeQuantityLimit else weight ${weight}`);
    return weight;
  }
};

export const restrictionBasedValue = async (
  previousDietDay: DietDay,
  currentDietDay: DietDay,
  meal: Meal
): Promise<number> => {
  const recipeQuantityValue = recipeQuantityLimit(currentDietDay, meal);
  if (recipeQuantityValue === 1) {
    return Promise.resolve(1);
  }
  const repetitionWithinMealsValue = await repetitionWithinMeals(
    currentDietDay,
    meal
  );
  const repetitionBetweenDaysValue = await repetitionBetweenDays(
    previousDietDay,
    currentDietDay,
    meal
  );
  if (
    recipeQuantityValue === 1 &&
    repetitionWithinMealsValue === 1 &&
    repetitionBetweenDaysValue === 1
  ) {
    return Promise.resolve(1);
  } else {
    const weight =
      recipeQuantityValue +
      repetitionBetweenDaysValue +
      repetitionWithinMealsValue;
    return Promise.resolve(weight);
  }
};

export const restrictionBasedValueForWholeDay = async (
  previousDietDay: DietDay,
  currentDietDay: DietDay
): Promise<number> => {
  const meals: Array<Meal> = Object.values(MealEnum);
  const values = await Promise.all(
    meals.map((meal: Meal) => {
      return restrictionBasedValue(previousDietDay, currentDietDay, meal);
    }, [])
  );
  const total = values.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);
  return Promise.resolve(total);
};
