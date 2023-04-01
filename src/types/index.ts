// these cannot repeat within a single meal:
// a beef and a chicken dish for dinner is OK
// but a beef and a beef dish for dinner is NOT
export type NonRepeatableWithinMeals =
  | "BEEF"
  | "CHICKEN"
  | "PORK"
  | "SHRIMP"
  | "SILKIE";

// these cannot repeat between days
export type NonRepeatableBetweenDays = "NR1" | "NR2" | "NR3" | "NR4" | "NR5";

export enum MealEnum {
  BREAKFAST = "BREAKFAST",
  LUNCH = "LUNCH",
  DINNER = "DINNER",
  SNACK = "SNACK",
  DRINK = "DRINK",
}
// this is equivalent to
// type Meal = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK" | "DRINK";
export type Meal = keyof typeof MealEnum;

export type Recipe = {
  id: string;
  title: string;
  nonRepeatableWithinMeals: Array<NonRepeatableWithinMeals>;
  nonRepeatableBetweenDays: Array<NonRepeatableBetweenDays>;
  meal: Array<Meal>;
};

export type DietDay = {
  totalRecipes: number;
  meals: Record<
    Meal,
    {
      totalRecipes: number;
      recipeIds: Array<string>;
    }
  >;
};

export type Diet = {
  id: string;
  title: string;
  duration: number;
  mealsByDay: Array<DietDay>;
};

export type DaysOfTheWeek =
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

export type DietSchedule = Record<DaysOfTheWeek, boolean>;

export type HistoryNode = {
  id: string;
  personId: string;
  previousHistoryNodeId: string | null;
  date: string;
  dietDay: DietDay | null;
};

export type Person = {
  id: string;
  name: string;
  startDate: string; // "YYYY-MM-DD"
  dietId: string;
};
