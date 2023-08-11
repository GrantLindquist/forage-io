import { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import RecipeList from './RecipeList';
import { useUser } from '@clerk/clerk-expo';
import recipeService from '../../services/recipeService'

// Collection of recipes created or saved by the user
export default function UserRecipes() {

	// User object
	const { user } = useUser(); 

	// State for refreshing component
	const [refresh, setRefresh] = useState(true);

	// States for listing recipes
	const [createdRecipes, setCreatedRecipes] = useState([]);
	const [savedRecipes, setSavedRecipes] = useState([]);

	// Gets recipes that user has created and sets state to response
	const loadCreatedRecipes = async() => {
		// Gets response from recipeService
		let response = await recipeService.getCreatedRecipes(user.id);
		setCreatedRecipes(response);
	}

	// Gets recipes that user has saved and sets state to response
	const loadSavedRecipes = async() => {
		// Gets response from recipeService
		let response = await recipeService.getSavedRecipes(user.unsafeMetadata.savedRecipeIds);
		setSavedRecipes(response);
	}

	// Renders recipes on component load
	useEffect(() => {
		loadCreatedRecipes();
		loadSavedRecipes();
		console.log('loaded userRecipes.js');
	}, [refresh]);

	return (
		<View style={{minHeight: '100%'}}>
			<ScrollView>
				<View style={styles.container}>
					<Text variant='headlineLarge'>Your Recipes</Text>
					<RecipeList recipes={createdRecipes}/>
				</View>
				<View style={styles.container}>
					<Text variant='headlineLarge'>Saved Recipes</Text>
					<RecipeList recipes={savedRecipes}/>
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 20,
		marginTop: 0
	},
});