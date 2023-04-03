import { NullDietDay } from "../data";
import { MealEnum } from "../types";
import { repetitionBetweenDays, repetitionWithinMeals } from "./restrictions";

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
});
