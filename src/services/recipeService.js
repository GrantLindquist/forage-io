// Active stage
const stage = __DEV__ ? "dev" : "prod";

// Service that handles recipe CRUD functionality
const recipeService = {

    // Generates a recipe with GPT using the request parameter.
    generateRecipe: async (request, user, baseRecipe) => {
        try {
            // Place recipe into DB
            const response = await fetch(`${process.env.EXPO_PUBLIC_FORAGE_URI}${stage}/recipes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: request.description,
                    tags: request.tags,
                    ingredients: request.ingredients,
                    baseRecipe: baseRecipe ? baseRecipe : "",
                    user: user
                })
            });
            // Return response
            if (response.statusCode != 200) {
                throw new Error("There was an error from AWS");
            }
            else {
                return (response);
            }
        }
        catch (e) {
            console.error(e.message);
            throw new Error("There was an error from AWS: " + e.message)
        }

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
    getProfileStatistics: async (userId) => {
        const response = await recipeService.getCreatedRecipes(userId);

        // Total created recipes
        var totalCreatedRecipes = response.length;

        // Total recipe stars
        var totalRecipeStars = 0;
        for (let recipe of response) {
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
