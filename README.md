# Lodya
## Monthly dietary meal planning for multiple people

### Build and Run

```
npm run build
npm run dev
```

### Swagger Doc

http://localhost:8000/docs/

### Assumptions
A Person subscribes to a month-long Diet.
The Diet is broken up into phases, like "Fist Week", "Second Week" and "Weeks 3 and 4"
The Diet is broken up into Days which have their own requirements (number of meals, number of protein-rich dishes, etc)
A Person can subscribe to any part of the Diet (starting with the "Second Week", starting on "Day 3", etc - Diet start date does not always align with the Person's start date)
The dishes of the Diet come from a known cookbook of Recipes.
Each Recipie is defined by its Theme Ingredient (a meat or a vegetable).
So that the person is not bored with the diet, the Theme Ingredients should not repeat.
Ideally, the Theme Ingredients should not repeat for 2 days.
A Person also has Preferences which alter the meal: limit on number of desserts, disallowed Ingredients, preferred Ingredients, etc)
The Diet has rules for what dishes should be had on what days, with a mix of dishes that must be had daily with those that could be chosen from a list.

Multiple People subscribe to this Diet at different times and for different lengths of time.

A Person might not choose to stick to the Diet assiduously - to follow it every day - they can skip arbitrary days.
In that case, the skipped days do not roll over - they simply get skipped.
This could be called a Person's Diet Schedule.

The Meal Planner (>You) needs to create the following:
- Meal Plan for any given day, today or in the future, with the Persons' info, dishes they need, and preparation instructions for those dishes
- A Shopping List for any given date range

### Major Components

#### All Dishes For Day

Given a Person and today's date, returns all the dishes that could be prepared for them.

Person
- start date // could be back-dated if the Person wants to start their Diet not it's Day 1
- diet

Recipe
- theme ingredients
- meal type // breakfast, lunch/dinner, snack, drink 

Diet
- duration in days
- recipies by day by category 

Diet Schedule
- 7 toggles for days of the week

History
- Given a Person and a date (default today), returns today's and last time's Recipes

#### Restrictions

Given a Person and today's date, returns all the restrictions (can't have Theme Ingredient X, Preference for less salt, etc).
Everyone begins with 1 Restriction - no repeated Theme Ingredients between meals of the day.

Every week there are Week-Specific Dishes - as long as these don't repeat between yesterday and today
  this is better handled by hard-coding recipes per day
Within meals, protein doesn't repeat
Same recipe cannot be had 2 days in a row


#### Planner

Given all the dishes that could be prepared for all People, and all restrictions, return a day's meal plan - a full set of Recipes for each Person.
Dimensionality reduction - choose to minimize the number of unique dishes while satisfying the constraints.


#### Shopping List Formatter

Given a full set of Recipes for each Person, return all ingredients and their quantities


#### Cooking Instructions Formatter

Given a full set of Recipes for each Person, return a formatted for display or formatted for print set of instructions

### Types

enum ThemeIngredient
* "BEEF"
* "CHICKEN"
* "SHRIMP"

Recipe
* title: String
* themeIngredients: [ThemeIngredient]

Diet
* id: String //UUID
* title: String
* duration: int // recipesByDay length
* recipesByDay: [{[Meal]:}]

enum DaysOfTheWeek
* "SUNDAY"
* "MONDAY"
* ...
* "SATURDAY"

DietSchedule
* daysActive: {DaysOfTheWeek: boolean}

HistoryNode
* recipes: () => [Recipe]
* previous: () => HistoryNode

History: (personID:String, Date=[today's date as "YYYY-MM-DD"]) => HistoryNode

Restriction: ([Recipe]) => [Recipe]

Person
* id: String //UUID
* name: String
* startDate: "YYYY-MM-DD"
* dietId: String //UUID

DayPlan:[{[PersonID:String]: [Recipe]}]

Planner:
* getPlanForDate: ([personID:String], date:String like "YYYY-MM-DD") => {[date:String like "YYYY-MM-DD"]: DayPlan }
* getPlanForDateRange: ([personID:String], startDate:String like "YYYY-MM-DD", endDate:String like "YYYY-MM-DD") => {[date:String like "YYYY-MM-DD"]: DayPlan}
