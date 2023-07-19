import { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import RecipeList from './RecipeList';
import { useUser } from '@clerk/clerk-expo';

// Collection of recipes created by other users
export default function CommunityRecipes() {

	// User object
	const { user } = useUser(); 

	// State for handling modal visibility
	const [communityRecipes, setCommunityRecipes] = useState([]);

	// Gets a collection of 50 recipes that the user has not created
	const loadCommunityRecipes = async() => {
		// Executes request
		const response = await fetch(`https://oongvnk9o0.execute-api.us-east-1.amazonaws.com/test/recipes/community?creatorId=${user.id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		// Returns recipe JSON
		let data = await response.json();
		setCommunityRecipes(data.Items);
	}

	// Renders recipes on component load
	useEffect(() => {
		loadCommunityRecipes();
	});

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
		margin: 20
	},
});