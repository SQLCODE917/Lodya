import { NullDietDay } from "../data";
import { MealEnum } from "../types";
import {
  recipeQuantityLimit,
  repetitionBetweenDays,
  repetitionWithinMeals,
} from "./restrictions";

describe("restrictions repository", () => {
  describe("repetitionWithinMeals", () => {
    it("should penalize for adding more recipes per meal than asked for", async () => {
      const dietDay = {
        ...NullDietDay,
        meals: {
          ...NullDietDay.meals,
          [MealEnum.BREAKFAST]: {
            totalRecipes: 1,
            recipeIds: ["1", "2", "3"],
          },
        },
      };

      const actualValue = await repetitionWithinMeals(
        dietDay,
        MealEnum.BREAKFAST
      );
      expect(actualValue).toEqual(-2);
    });

    it("should return 1 when a Meal requires no recipes/is skipped", async () => {
      const dietDay = {
        ...NullDietDay,
        meals: {
          ...NullDietDay.meals,
          [MealEnum.BREAKFAST]: {
            totalRecipes: 0,
            recipeIds: [],
          },
        },
      };

      const actualValue = await repetitionWithinMeals(
        dietDay,
        MealEnum.BREAKFAST
      );
      expect(actualValue).toEqual(1);
    });

    it("should penalize going over the day's recipe limit", async () => {
      const dietDay = {
        ...NullDietDay,
        meals: {
          ...NullDietDay.meals,
          [MealEnum.BREAKFAST]: {
            totalRecipes: 1,
            recipeIds: ["0", "1", "2"],
          },
        },
      };
      const actualWeight = await repetitionWithinMeals(
        dietDay,
        MealEnum.BREAKFAST
      );
      expect(actualWeight).toEqual(-2);
    });
  });

  describe("repetitionBetweenDays", () => {
    it("should punish for repetition between days", async () => {
      const previousDietDay = {
        ...NullDietDay,
        meals: {
          ...NullDietDay.meals,
          [MealEnum.BREAKFAST]: {
            totalRecipes: 2,
            recipeIds: ["YJSO2E2DJY969RRQ"],
          },
        },
      };
      const currentDietDay = {
        ...NullDietDay,
        meals: {
          ...NullDietDay.meals,
          [MealEnum.BREAKFAST]: {
            totalRecipes: 2,
            recipeIds: ["YJSO2E2DJY969RRQ"],
          },
        },
      };

      const actualValue = await repetitionBetweenDays(
        previousDietDay,
        currentDietDay,
        MealEnum.BREAKFAST
      );
      const nullDayValue = await repetitionBetweenDays(
        NullDietDay,
        NullDietDay,
        MealEnum.BREAKFAST
      );

      expect(nullDayValue).toEqual(1);
      expect(actualValue).toEqual(-1);
    });
  });

  describe("recipeQuantityLimit", () => {
    it("should penalize for going over the daily recipe limit", () => {
      const currentDietDay = {
        ...NullDietDay,
        meals: {
          ...NullDietDay.meals,
          [MealEnum.BREAKFAST]: {
            totalRecipes: 2,
            recipeIds: ["1", "2", "3"],
          },
        },
      };
      const actualWeight = recipeQuantityLimit(
        currentDietDay,
        MealEnum.BREAKFAST
      );
      expect(actualWeight).toEqual(-1);
    });

    it("should return 1 if no recipes are needed for the meal", () => {
      const currentDietDay = {
        ...NullDietDay,
        meals: {
          ...NullDietDay.meals,
          [MealEnum.BREAKFAST]: {
            totalRecipes: 0,
            recipeIds: [],
          },
        },
      };
      const actualWeight = recipeQuantityLimit(
        currentDietDay,
        MealEnum.BREAKFAST
      );
      expect(actualWeight).toEqual(1);
    });
  });
});
