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
    generateRecipe: async () => {
        // Make GPT request
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ "role": "system", "content": "You are a professional chef with decades of culinary experience." }, {
                role: "user",
                content: `generate a ${request.description}. place this recipe into a JSON-compatible string. the recipe name must be called \"title\", the ingredient list must be named \"ingredients\", the instructions list must be named \"instructions\", the time it takes to make (in xh xxm format) must be named \"creationTime\", the number of servings it creates must be named \"servings\", and the recipe budget in USD format must be named \"budget\".`
            }],
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
                    baseRecipeId: request.baseRecipeId ? request.baseRecipeId : null,
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
                error: e
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
		if(recipeIds){
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
				if(data.Item){
					savedRecipeData.push(data.Item);
				}
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
		console.log(data.Items);
		return data.Items;
	},

    // Deletes recipe from user's catalog
    deleteRecipe: async(userId, recipeId) => {
        // Executes request
		const response = await fetch(`${env['forageAPI-uri']}/recipes/?creatorId=${userId}&recipeId=${recipeId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});

        // Returns response
        let data = await response.json();
		return data;
    }
}
export default recipeService;
