// OpenAI & .env imports
import OpenAI from 'openai';
// UUID import
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

// OpenAI API configuration
const openai = new OpenAI({
    apiKey: process.env.EXPO_PUBLIC_OPENAI_KEY
});
const stage = __DEV__ ? "dev" : "prod";

// Extra instructions for recipe generation
const extraInstructions = (tags) => {
    console.log(tags);

    // Adds instructions for dietary restrictions
    let dietaryInstructions = "";
    switch (tags) {
        case (tags.includes("vegan")):
            dietaryInstructions = dietaryInstructions.concat("This is a vegan recipe, either exclude or substitute all non-vegan ingredients. ");
            break;
        case (tags.includes("vegetarian")):
            dietaryInstructions = dietaryInstructions.concat("This is a vegetarian recipe, either exclude or substitute all non-vegetarian ingredients. ");
            break;
        case (tags.includes("paleo")):
            dietaryInstructions = dietaryInstructions.concat("This is a paleo recipe, either exclude or substitute all non-paleo ingredients. ");
            break;
        case (tags.includes("pescetarian")):
            dietaryInstructions = dietaryInstructions.concat("This is a pescetarian recipe, either exclude or substitute all non-pescetarian ingredients. ");
            break;
        case (tags.includes("keto")):
            dietaryInstructions = dietaryInstructions.concat("This is a keto recipe, either exclude or substitute all non-keto ingredients. ");
            break;
        case (tags.includes("dairy-free")):
            dietaryInstructions = dietaryInstructions.concat("This is a dairy-free recipe, either exclude or substitute all ingredients containing dairy. ");
            break;
        case (tags.includes("gluten-free")):
            dietaryInstructions = dietaryInstructions.concat("This is a gluten-free, either exclude or substitute all ingredients containing gluten. ");
            break;
    }

    console.log(dietaryInstructions)

    return `
    Take your time to evaluate and ensure that you provide an answer that adheres to the following instructions:
    Ensure that the ingredients and instructions values are simple arrays.
    Please make sure that all ingredients are edible. Do not create inedible or dangerous recipes. 
    Please make sure that creation time is calculated in milliseconds.
    ${dietaryInstructions}`
}

// Service that handles recipe CRUD functionality
const recipeService = {

    // Generates a recipe with GPT using the request parameter.
    generateRecipe: async (request, user) => {
        // Send recipe request to GPT
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-1106',
            response_format: { type: "json_object" },
            messages: [
                {
                    role: 'user',
                    content: `Generate a ${request.description} in JSON format using the following model: 
                    {
                        title: a creative, simple name for the recipe--please exclude any inedible/dangerous ingredients from the recipe name,
                        servings: the number of servings this recipe will create,
                        ingredients: an array of each ingredient for the recipe,
                        instructions: an array of each step to make the recipe. Do not include instruction step numbers,
                        creationTime: the amount of time it takes to create the recipe in milliseconds,
                        budget: sum of approximate cost of ingredients (in xx.xx format)
                        nutritionFacts: {
                            calories: estimated number of calories per serving,
                            totalFat: estimated number of grams of fat per serving,
                            saturatedFat: estimated number of grams of saturated fat per serving,
                            transFat: estimated number of grams of trans fat per serving,
                            cholesterol: estimated number of milligrams of cholesterol per serving,
                            sodium: estimated number of milligrams of sodium per serving,
                            totalCarbohydrates: estimated number of grams of carbohydrates per serving,
                            dietaryFiber: estimated number of grams of fiber per serving,
                            totalSugars: estimated number of grams of sugar per serving,
                            addedSugars: estimated number of grams of added sugar per serving
                            protein: estimated number of grams of protein per serving
                        }
                        tips: an array containing anywhere between 0-3 recipe tips/pointers related to the recipe. 
                        Tips can relate to the ingredients used, ingredient substitutes, appliances that make creating the recipe easier, or methods to make the recipe better.
                        Avoid generating tips related to leftover ingredient user--try to focus on the current recipe.
                        Avoid generating tips that are obvious (e.g. make your recipe sweeter by adding sugar!)
                        Here's a good example: Apply pressure to your lemons to increase their flavor! (for a recipe containing lemons)
                    }
                    ${extraInstructions(request.tags)}`
                }
            ]
        })
        const recipe = JSON.parse(completion.choices[0].message.content);

        // Place recipe into DB
        const response = await fetch(`${process.env.EXPO_PUBLIC_FORAGE_URI}${stage}/recipes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                creatorId: user.id,
                recipeId: uuidv4(),
                title: recipe.title,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions,
                tags: request.tags,
                creatorUsername: user.username,
                budget: recipe.budget,
                creationTime: recipe.creationTime,
                servings: recipe.servings,
                nutritionFacts: recipe.nutritionFacts,
                tips: recipe.tips
            })
        });
        // Return response
        return (response);
    },

    // Generates a recipe with GPT that is similar to another existing recipe
    remixRecipe: async (request, user, baseRecipe) => {

        // Send recipe request to GPT
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-1106',
            response_format: { type: "json_object" },
            messages: [
                {
                    role: 'user',
                    content: `Analyze the following recipe: 
                    ${JSON.stringify(baseRecipe)}
                    Now, take this recipe and change a few ingredients until it becomes a ${request.description}.
                    Ensure that the new recipe still resembles the example recipe.
                    Ensure that the JSON format is the same as the example recipe.
                    ${extraInstructions(request.tags)}`
                }
            ]
        })
        const recipe = JSON.parse(completion.choices[0].message.content);

        // Place recipe into DB
        const response = await fetch(`${process.env.EXPO_PUBLIC_FORAGE_URI}${stage}/recipes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Remember to capitalize the values from the recipe const!
            body: JSON.stringify({
                creatorId: user.id,
                recipeId: uuidv4(),
                baseRecipe: baseRecipe.RecipeId,
                title: recipe.Title,
                ingredients: recipe.Ingredients,
                instructions: recipe.Instructions,
                tags: request.tags,
                creatorUsername: user.username,
                budget: recipe.Budget,
                creationTime: recipe.CreationTime,
                servings: recipe.Servings,
                nutritionFacts: recipe.NutritionFacts,
                tips: recipe.Tips
            })
        });
        // Return response
        return (response);
    },

    // Gets recipes that user has created
    getCreatedRecipes: async (userId) => {
        // Executes request
        const response = await fetch(`${process.env.EXPO_PUBLIC_FORAGE_URI}${stage}/recipes/user?creatorId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // Returns recipe JSON
        let data = await response.json();
        return data.Items;
    },

    // Gets recipes that user has saved - NOTE: only accepts list of recipeIds extracted from user.unsafeMetadata
    getSavedRecipes: async (recipeIds) => {
        // Loops through each saved recipe id and fetches it from DB
        var savedRecipeData = [];
        for (item of recipeIds) {
            // Executes request
            const response = await fetch(`${process.env.EXPO_PUBLIC_FORAGE_URI}${stage}/recipes/?recipeId=${item}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // Pushes recipe JSON to list
            let data = await response.json();
            if (data.Items.length == 1) {
                savedRecipeData.push(data.Items[0]);
            }
        }

        // Returns completed list
        return savedRecipeData;
    },

    // Gets well-liked recipes to display on communityRecipes component
    getCommunityRecipes: async (userId, searchTerm, tags) => {
        // Executes request
        const response = await fetch(`${process.env.EXPO_PUBLIC_FORAGE_URI}${stage}/recipes/community?creatorId=${userId}&searchTerm=${searchTerm}&tags=${tags}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // Returns recipe JSON
        let data = await response.json();
        return data.Items;
    },
    getProfileStatistics: async(userId) => {
        const response = await recipeService.getCreatedRecipes(userId);

        // Total created recipes
        var totalCreatedRecipes = response.length;

        // Total recipe stars
        var totalRecipeStars = 0;
        for(let recipe of response){
            totalRecipeStars += recipe.Stars;
        }

        return [totalCreatedRecipes, totalRecipeStars]
    },
    // Adds or removes a "star" from a recipe
    updateRecipeStars: async (userId, recipeId, value) => {
        // Executes request
        const response = await fetch(`${process.env.EXPO_PUBLIC_FORAGE_URI}${stage}/recipes?creatorId=${userId}&recipeId=${recipeId}&value=${value}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Return response
        let data = await response.json();
        return data;
    },

    // Deletes recipe from user's catalog
    deleteRecipe: async (userId, recipeId, saveRecord) => {
        // Executes request
        const response = await fetch(`${process.env.EXPO_PUBLIC_FORAGE_URI}${stage}/recipes?creatorId=${userId}&recipeId=${recipeId}&saveRecord=${saveRecord}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Returns response
        return response;
    }
}
export default recipeService;
