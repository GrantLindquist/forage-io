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
    
    // Generates a recipe with GPT using the request parameter.
    generateRecipe: async (request, user) => {

        console.log(request)
        // Make GPT request
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
            { 
                role: "system", 
                content: `You are an assistant that generates recipes in JSON format. 
                You may only respond in JSON format. The only exception is if the recipe contains inedible
                or unsafe ingredients. In this case, you must respond with a message explaining why it's unsafe to eat.` 
            },
            // If a baseRecipe is included in the request, then "remix" the recipe. Otherwise, generate new recipe
            request.baseRecipe ? { 
                role: "assistant", 
                content: `Generate a recipe in JSON format that is similar to this recipe and follows the same structure: 
                {
                    title: ${request.baseRecipe.Title},
                    servings: ${request.baseRecipe.Servings},
                    ingredients: ${request.baseRecipe.Ingredients},
                    instructions: ${request.baseRecipe.Instructions},
                    creationTime: ${request.baseRecipe.CreationTime},
                    budget: ${request.baseRecipe.Budget},
                }
                Make sure that the ingredients and instructions values are simple arrays.`
            } : {
                role: "assistant", 
                content: `Generate recipes in JSON format using the following model: 
                {
                    title: a creative name for the recipe,
                    servings: the number of servings this recipe will create,
                    ingredients: an array of each ingredient for the recipe,
                    instructions: an array of each step to make the recipe,
                    creationTime: the amount of time it takes to create the recipe (in xh xxm format),
                    budget: sum of approximate cost of ingredients (in xx.xx format)
                }`
            },
            {
                role: "user",
                content: `generate a ${request.description}.`
            }],
            temperature: .8
        });
        
        // Attempt to parse response
        try{
            // console.log(completion.data.choices[0].message.content)
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
            console.error(e);
            return {
                ok: false,
                error: e,
                message: completion.data.choices[0].message.content
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
    deleteRecipe: async(userId, recipeId) => {
        // Executes request
		const response = await fetch(`${env['forageAPI-uri']}/recipes?creatorId=${userId}&recipeId=${recipeId}`, {
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
