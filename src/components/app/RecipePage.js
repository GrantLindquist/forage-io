import { useRoute } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';
import { ScrollView, View , StyleSheet} from "react-native";
import { Text, Button } from "react-native-paper";
import { useUser } from "@clerk/clerk-expo";

// Detailed page for a recipe that contains ingredients, instructions, etc.
export default function RecipePage() {

	// State that provides navigation property
	const navigation = useNavigation();

	// States for tracking parameters passed to route
	const route = useRoute();
	const { user } = useUser();
	const { recipe } = route.params;

	// Deletes recipe from DB
	const handleDeleteRecipe = async() => {
		// Executes request
		const response = await fetch(`https://oongvnk9o0.execute-api.us-east-1.amazonaws.com/test/recipes/?recipeId=${item}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		
		// Redirects user
		navigation.goBack();

		// Returns response
		let data = await response.json();
		return data;
	}

	// Appends or removes recipe id to/from user's saved recipe ids
	const handleSaveRecipe = async () => {
		const prevSavedRecipeIds = user.unsafeMetadata.savedRecipeIds;
		var savedRecipeIds = [];
		var savingRecipe = true;

		// If user has any saved recipes, loop through and place into new id list
		if(prevSavedRecipeIds){
			for(item of prevSavedRecipeIds){
				// Unsave recipe if recipe is already saved
				if(item == recipe.RecipeId)
				{
					savingRecipe = false;
				}
				// Append id otherwise
				else{
					savedRecipeIds.push(item);
				}
			}
		}

		// Place newly handled recipe id into list if recipe id hasn't already been removed
		if(savingRecipe){
			savedRecipeIds.push(recipe.RecipeId);
		}

		// Update user with new list of ids
		const response = await user.update({
			unsafeMetadata: { savedRecipeIds }
		});
		console.log(savedRecipeIds);
		return response;
	}

	// Renders each ingredient 
	const ingredients = recipe.Ingredients.map((ingredient) => {
		return(
			<Text>- {ingredient}</Text>
		)
	});

	// Renders each step of instructions 
	var stepCounter = 0;
	const instructions = recipe.Instructions.map((instruction) => {
		stepCounter++;
		return(
			<Text>{stepCounter}. {instruction}</Text>
		)
	});

	return (
		<ScrollView style={{backgroundColor: '#1D1B20'}}>
			<View style={styles.container}>
				<Text variant='headlineLarge'>{recipe.Title}</Text>
				<Text variant='headlineSmall'>Ingredients</Text>
				{ingredients}
				<Text variant='headlineSmall'>Instructions</Text>
				{instructions}
				{/* Displays recipe options if user is the creator of recipe */}
				{user.id == recipe.CreatorId ? 
				<Button 
					textColor="red"
					onPress={handleDeleteRecipe}
				>Delete</Button> : 
				<Button 
					onPress={handleSaveRecipe}
				>Save</Button>}
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 20,
		marginTop: 0
	},
});