# Lodya
## Monthly dietary meal planning for multiple people

### Assumptions
A Person subscribes to a month-long Diet.
The Diet is broken up into phases, like "Fist Week", "Second Week" and "Weeks 3 and 4"
The Diet is broken up into Days which have their own requirements (number of meals, number of protein-rich dishes, etc)
The dishes of the Diet come from a known cookbook of Recipes.
Each Recipie is defined by its Theme Ingredient (a meat or a vegetable).
So that the person is not bored with the diet, the Theme Ingredients should not repeat.
Ideally, the Theme Ingredients should not repeat for 2 days.
A Person also has Preferences which alter the meal: limit on number of desserts, disallowed Ingredients, preferred Ingredients, etc)

Multiple People subscribe to this Diet at different times and for different lengths of time.

The Meal Planner (>You) needs to create the following:
- Meal Plan for any given day, today or in the future, with the Persons' info, dishes they need, and preparation instructions for those dishes
- A Shopping List for any given date range

### Major Components

####All Dishes For Day
Given a Person and today's date, returns all the dishes that could be prepared for them

####Restrictions
Given a Person and today's date, returns all the restrictions (can't have Theme Ingredient X, Preference for less salt, etc)

####Planner
Given all the dishes that could be prepared for all People, and all restrictions, return a day's meal plan - a full set of Recipes for each Person

####Shopping List Formatter
Given a full set of Recipes for each Person, return all ingredients and their quantities

####Cooking Instructions Formatter
Given a full set of Recipes for each Person, return a formatted for display or formatted for print set of instructions