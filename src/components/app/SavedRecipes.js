import { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Pressable } from "react-native";
import { Searchbar, Button } from "react-native-paper";
import RecipePage from './RecipePage';
import { useNavigation } from '@react-navigation/native';
import RecipeCard from './RecipeCard';
import { useUser } from '@clerk/clerk-expo';
import recipeService from '../../services/recipeService'

// Collection of recipes created or saved by the user
export default function SavedRecipes() {

	// User object
	const { user } = useUser(); 

	// State that provides navigation property
	const navigation = useNavigation();

	// State for refreshing component
	const [refresh, setRefresh] = useState(true);

	// State for listing recipes
	const [savedRecipes, setSavedRecipes] = useState([]);

	// State for tracking user search input
	const [searchQuery, setSearchQuery] = useState('');

	// Maps recipes into RecipeCard components
	const renderedList = savedRecipes.map((recipe) => {
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

	// Gets recipes that user has saved and sets state to response
	const loadSavedRecipes = async() => {
		// Gets response from recipeService
		let response = await recipeService.getSavedRecipes(user.unsafeMetadata.savedRecipeIds);
		setSavedRecipes(response);
	}

	// Renders recipes on component load
	useEffect(() => {
		loadSavedRecipes();
		console.log('loaded savedRecipes.js');
	}, [refresh]);

	return (
		<View style={{minHeight: '100%'}}>
			<ScrollView>
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