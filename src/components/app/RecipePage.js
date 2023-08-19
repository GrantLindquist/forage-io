import { useRoute } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';
import { ScrollView, View , StyleSheet} from "react-native";
import { Text, Button, Portal, FAB } from "react-native-paper";
import { useUser } from "@clerk/clerk-expo";
import env from '../../../env.json';
import RecipeTag from "./RecipeTag";
import { useState } from "react";

// Detailed page for a recipe that contains ingredients, instructions, etc.
export default function RecipePage(props) {

	// State that provides navigation property
	const navigation = useNavigation();

	// States for tracking parameters passed to route
	const route = useRoute();
	const { user } = useUser();
	const { recipe } = route.params;

	// State for interacting with FAB group
	const [fabOpen, setFabOpen] = useState(false);

	// Deletes recipe from DB
	const handleDeleteRecipe = async() => {
		// Executes request
		const response = await fetch(`${env['forageAPI-uri']}/recipes/?recipeId=${recipe.RecipeId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		
		// Redirects user
		navigation.goBack();

		// Refreshes createdRecipes.js
		props.refreshCreatedRecipes();

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

		// Refreshes savedRecipes.js
		props.refreshSavedRecipes();
		
		console.log(savedRecipeIds);
		return response;
	}

	// Sub-component that lists a tag component for each recipe tag
	const tags = recipe.Tags.map((tag) => {
		return(
			<RecipeTag key={tag} title={tag} immutable={true} color={'red'}/>
		)
	});

	// Renders each ingredient 
	const ingredients = recipe.Ingredients.map((ingredient) => {
		return(
			<Text key={ingredient}>- {ingredient}</Text>
		)
	});

	// Renders each step of instructions 
	var stepCounter = 0;
	const instructions = recipe.Instructions.map((instruction) => {
		stepCounter++;
		return(
			<Text key={"instruction" + stepCounter}>{stepCounter}. {instruction}</Text>
		)
	});

	return (
		<>
			<ScrollView style={{backgroundColor: '#1D1B20'}}>
				<View style={styles.container}>
					<Text variant='headlineLarge'>{recipe.Title}</Text>
					<View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
						{tags}
					</View>
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
			<FAB.Group
				open={fabOpen}
				visible
				icon={fabOpen ? 'calendar-today' : 'plus'}
				actions={[
					{ icon: 'plus', onPress: () => console.log('Pressed add') },
					{
					icon: 'star',
					label: 'Star',
					onPress: () => console.log('Pressed star'),
					},
					{
					icon: 'email',
					label: 'Email',
					onPress: () => console.log('Pressed email'),
					},
					{
					icon: 'bell',
					label: 'Remind',
					onPress: () => console.log('Pressed notifications'),
					},
				]}
				onStateChange={() => setFabOpen(!fabOpen)}
				onPress={() => {
					if (fabOpen) {
					// do something if the speed dial is open
					}
				}}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 20,
		marginTop: 0
	},
});