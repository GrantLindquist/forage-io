import { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Pressable } from "react-native";
import { Searchbar, Button } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import RecipeCard from './RecipeCard';
import { useUser } from '@clerk/clerk-expo';
import recipeService from '../../services/recipeService'
import { createStackNavigator } from '@react-navigation/stack';

// Collection of recipes created or saved by the user
export default function CreatedRecipes() {

	// User object
	const { user } = useUser(); 
	
	// State that provides navigation property
	const navigation = useNavigation();

	// State for refreshing component
	const [refresh, setRefresh] = useState(true);

	// State for tracking user search input
	const [searchQuery, setSearchQuery] = useState('');

	// States for listing recipes
	const [createdRecipes, setCreatedRecipes] = useState([]);

	// Gets recipes that user has created and sets state to response
	const loadCreatedRecipes = async() => {
		// Gets response from recipeService
		let response = await recipeService.getCreatedRecipes(user.id);
		setCreatedRecipes(response);
	}

	// Maps recipes into RecipeCard components
	const renderedList = createdRecipes.map((recipe) => {
		if(recipe.Title.toLowerCase().includes(searchQuery.toLowerCase())){
			return (
				<Pressable key={recipe.RecipeId} onPress={() => navigation.navigate('Recipe', {
						recipe: recipe
					})}>
					<RecipeCard recipe={recipe}/>
				</Pressable>
			)
		}
	});

	// Renders recipes on component load
	useEffect(() => {
		loadCreatedRecipes();
		console.log('loaded createdRecipes.js');
	}, [refresh]);

	return (
		<View style={{minHeight: '100%'}}>
			<ScrollView >
				<View style={styles.container}>
					<Searchbar
						style={styles.searchbar}
						placeholder={"search recipes"}
						placeholderTextColor={"grey"}
						inputStyle={{paddingLeft: 0, alignSelf: 'center'}}
						showDivider={false}
						mode={'view'}
						onChangeText={query => setSearchQuery(query)}
						value={searchQuery}
					/>
					{renderedList}
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 20,
	},
	searchbar: {
		height: 35,
		width: '100%',
		marginVertical: 5
	},
});