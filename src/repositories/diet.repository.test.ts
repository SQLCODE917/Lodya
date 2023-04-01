import * as DietRepository from "./diet";
import { dietDay, NullDietDay } from "../data";
import { recipesByMeal } from "./recipe";
import { Meal, MealEnum } from "../types";

describe("Diet Repository", () => {
  describe("getDietDayIndex", () => {
    it("should return 0 for same dates", () => {
      const startDateString = "2012-12-12";
      const todaysDateString = "2012-12-12";
      const expected = 0;
      const actual = DietRepository.getDietDayIndex(
        startDateString,
        todaysDateString
      );
      expect(actual).toEqual(expected);
    });
  });

  describe("getDietDay", () => {
    it("should return today's DietDay object", async () => {
      const personId = "person1";
      const actual = await DietRepository.getDietDay(personId);
      expect(actual).toEqual(dietDay);
    });
  });

  describe("getFirstNotFullMeal", () => {
    it("should return the first not full meal", () => {
      const actualMeal: Meal | undefined =
        DietRepository.getFirstNotFullMeal(NullDietDay);
      expect(actualMeal).toEqual("BREAKFAST");
    });
  });

  describe("getRandom", () => {
    it("should take a random element from an array", () => {
      const items = [1, 2, 3, 4, 5];
      const { item, remainder } = DietRepository.getRandom(items);
      expect(items.includes(item)).toBe(true);
      expect(remainder.length).toEqual(items.length - 1);
      expect(remainder.includes(item)).toBe(false);
    });
  });

  describe("knapSack", () => {
    it("handles the happy path of starting with null", async () => {
      const recipes = await recipesByMeal();
      const actualDietDay = await DietRepository.knapSack(
        NullDietDay,
        NullDietDay,
        recipes
      );
      console.log(JSON.stringify(actualDietDay));
      expect(actualDietDay).not.toBeNull();

      const meals: Array<Meal> = Object.values(MealEnum);
      meals.forEach((meal) => {
        const createdMeal = actualDietDay.meals[meal];
        expect(createdMeal.totalRecipes).toEqual(createdMeal.recipeIds.length);
        const uniqueRecipeIds = [...new Set(createdMeal.recipeIds)];
        expect(createdMeal.recipeIds.length).toEqual(uniqueRecipeIds.length);
      });
    });
  });
});
