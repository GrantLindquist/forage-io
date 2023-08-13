import env from '../../env.json';

// Service for interacting with recipe objects
const recipeService = {

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
    getCommunityRecipes : async(userId) => {
        // Executes request
		const response = await fetch(`${env['forageAPI-uri']}/recipes/community?creatorId=${userId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		// Returns recipe JSON
		let data = await response.json();
		return data.Items;
    }
}

export default recipeService;