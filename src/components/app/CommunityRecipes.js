import { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import RecipeList from './RecipeList';
import { useUser } from '@clerk/clerk-expo';
import recipeService from '../../services/recipeService'

// Collection of recipes created by other users
export default function CommunityRecipes() {

	// User object
	const { user } = useUser(); 

	// State for handling modal visibility
	const [communityRecipes, setCommunityRecipes] = useState([]);

	// State for refreshing component
	const [refresh, setRefresh] = useState(true);

	// Gets a collection of 50 recipes that the user has not created
	const loadCommunityRecipes = async() => {
		// Gets response from recipeService
		let response = await recipeService.getCommunityRecipes(user.id);
		setCommunityRecipes(response);
	}

	// Renders recipes on component load
	useEffect(() => {
		loadCommunityRecipes();
		console.log('loaded communityRecipes.js');
	}, [refresh]);

	return (
		<ScrollView>
			<View style={styles.container}>
				<Text variant='headlineLarge'>Community Recipes</Text>
				<RecipeList recipes={communityRecipes} filters={true}/>
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