// OpenAI & .env imports
import OpenAI from 'openai';
// UUID import
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import env from '../../env.json'

// OpenAI API configuration
const openai = new OpenAI({
    apiKey: env['openAI-apiKey'],
});

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

    return `Ensure that the ingredients and instructions values are simple arrays.
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
                        instructions: an array of each step to make the recipe,
                        creationTime: the amount of time it takes to create the recipe in milliseconds,
                        budget: sum of approximate cost of ingredients (in xx.xx format)
                    }
                    ${extraInstructions(request.tags)}`
                }
            ]
        })
        const recipe = JSON.parse(completion.choices[0].message.content);

        // Place recipe into DB
        const response = await fetch(`${env['forageAPI-uri']}/recipes`, {
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
                servings: recipe.servings
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
                    content: `Generate a ${request.description} in JSON format that is similar to this recipe: 
                    ${JSON.stringify(baseRecipe)}
                    Ensure that the JSON format is the same as the example recipe.
                    ${extraInstructions(request.tags)}`
                }
            ]
        })
        const recipe = JSON.parse(completion.choices[0].message.content);

        // Place recipe into DB
        const response = await fetch(`${env['forageAPI-uri']}/recipes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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
                servings: recipe.Servings
            })
        });
        // Return response
        console.log(response)
        return (response);
    },

    // Gets recipes that user has created
    getCreatedRecipes: async (userId) => {
        // Executes request
        const response = await fetch(`${env['forageAPI-uri']}/recipes/user?creatorId=${userId}`, {
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
            const response = await fetch(`${env['forageAPI-uri']}/recipes/?recipeId=${item}`, {
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
        const response = await fetch(`${env['forageAPI-uri']}/recipes/community?creatorId=${userId}&searchTerm=${searchTerm}&tags=${tags}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // Returns recipe JSON
        let data = await response.json();
        return data.Items;
    },

    // Adds or removes a "star" from a recipe
    updateRecipeStars: async (userId, recipeId, value) => {
        // Executes request
        const response = await fetch(`${env['forageAPI-uri']}/recipes?creatorId=${userId}&recipeId=${recipeId}&value=${value}`, {
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
        const response = await fetch(`${env['forageAPI-uri']}/recipes?creatorId=${userId}&recipeId=${recipeId}&saveRecord=${saveRecord}`, {
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
