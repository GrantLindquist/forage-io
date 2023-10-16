// OpenAI & .env imports
const { Configuration, OpenAIApi } = require("openai");
// UUID import
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import env from '../../env.json'

// OpenAI API configuration
const configuration = new Configuration({
    apiKey: env['openAI-apiKey'],
});
const openai = new OpenAIApi(configuration);

// Service that handles recipe CRUD functionality
const recipeService = {

    // Checks if ingredients are safe to consume before attempting to generate recipe
    scrubIngredients: async (ingredients) => {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ 
                role: "system", 
                content: `You are a function that will return either 0 or 1. I provided you with an array of ingredients.
                Check each item in the array and ensure that it's safe for human consumption. Make sure to be inclusive of 
                cuisine from other cultures. If each item is safe, return 1. Otherwise, return 0.` 
            },
            {
                role: "user",
                content: `${ingredients}`
            }],
            temperature: .5
        });

        // Converts response into integer
        const response = Number(completion.data.choices[0].message.content);
        console.log(response);
        return response;
    },
    
    // Generates a recipe with GPT using the request parameter.
    generateRecipe: async (request, user) => {
        // Format context depending on input
        const messages = [];

         // If a baseRecipe is included in the request, then "remix" the recipe. 
        if(request.baseRecipe){
            messages.push({ 
                role: "user", 
                content: `Generate a ${request.description} in JSON format that is similar to this recipe and follows the same structure: 
                {
                    title: ${request.baseRecipe.Title},
                    servings: ${request.baseRecipe.Servings},
                    ingredients: ${request.baseRecipe.Ingredients},
                    instructions: ${request.baseRecipe.Instructions},
                    creationTime: ${request.baseRecipe.CreationTime},
                    budget: ${request.baseRecipe.Budget},
                }
                If applicable, include each ingredient from the model recipe in the generated recipe.
                Make sure that the ingredients and instructions values are simple arrays.`
            });
        }
        // Otherwise, generate new recipe
        else{
            messages.push({
                role: "user", 
                content: `Generate a ${request.description} in JSON format using the following model: 
                {
                    title: a creative name for the recipe,
                    servings: the number of servings this recipe will create,
                    ingredients: an array of each ingredient for the recipe,
                    instructions: an array of each step to make the recipe,
                    creationTime: the amount of time it takes to create the recipe in milliseconds,
                    budget: sum of approximate cost of ingredients (in xx.xx format)
                }
                Make sure that the ingredients and instructions values are simple arrays.`
            });
        }

        // If ingredients are either empty or approved by ChatGPT
        if(request.ingredients == [] || await recipeService.scrubIngredients(request.ingredients) == 1){
            // Make GPT request
            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: messages,
                temperature: .8
            });

            // Attempt to parse response
            try{
                const recipe = JSON.parse(completion.data.choices[0].message.content);
                
                // Place recipe into DB
                const response = await fetch(`${env['forageAPI-uri']}/recipes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        creatorId: user.id,
                        recipeId: uuidv4(),
                        baseRecipeId: request.baseRecipe ? request.baseRecipe.RecipeId : null,
                        isPublic: request.isPublic,
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
                return(response);
            }

            // If GPT responds with invalid recipe format, return error
            catch (e) {
                return {
                    ok: false,
                    error: e,
                    message: "There was an issue creating your recipe. Please try again."
                }
            }
        }
        else{
            return {
                ok: false,
                message: "We cannot generate a recipe using unsafe or inedible ingredients."
            }
        }
    },

    // Gets recipes that user has created
    getCreatedRecipes: async(userId) => {
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
    getSavedRecipes : async(recipeIds) => {
        // Loops through each saved recipe id and fetches it from DB
		var savedRecipeData = [];
		for(item of recipeIds){
			// Executes request
			const response = await fetch(`${env['forageAPI-uri']}/recipes/?recipeId=${item}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			// Pushes recipe JSON to list
            let data = await response.json();
			if(data.Items.length == 1){
				savedRecipeData.push(data.Items[0]);
			}
		}

        // Returns completed list
        return savedRecipeData;
    },

    // Gets well-liked recipes to display on communityRecipes component
    getCommunityRecipes : async(userId, searchTerm, tags) => {
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
    updateRecipeStars: async(userId, recipeId, value) => {
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
    deleteRecipe: async(userId, recipeId, saveRecord) => {
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
