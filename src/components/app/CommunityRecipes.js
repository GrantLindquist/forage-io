import { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Pressable } from "react-native";
import { Searchbar, Button } from "react-native-paper";
import TagSearch from './TagSearch';
import { useNavigation } from '@react-navigation/native';
import RecipeCard from './RecipeCard';
import { useUser } from '@clerk/clerk-expo';
import recipeService from '../../services/recipeService'

// Collection of recipes created by other users
export default function CommunityRecipes() {

	// User object
	const { user } = useUser(); 
	
	// State that provides navigation property
	const navigation = useNavigation();

	// State for handling modal visibility
	const [communityRecipes, setCommunityRecipes] = useState([]);

	// State for refreshing component
	const [refresh, setRefresh] = useState(true);

	// State that handles filter display
	const [filtersVisible, setFiltersVisible] = useState(false);

	// State for tracking user search input
	const [searchQuery, setSearchQuery] = useState('');

	// Gets a collection of 50 recipes that the user has not created
	const loadCommunityRecipes = async() => {
		// Gets response from recipeService
		let response = await recipeService.getCommunityRecipes(user.id);
		setCommunityRecipes(response);
	}

	// Maps recipes into RecipeCard components
	const renderedList = communityRecipes.map((recipe) => {
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
		loadCommunityRecipes();
		console.log('loaded communityRecipes.js');
	}, [refresh]);

	return (
		<ScrollView>
			<View style={styles.container}>
				{/* Recipe list */}
				{filtersVisible ? 
					<TagSearch closeTagSearch={() => setFiltersVisible(false)}/>
				: 
				<View style={{flexDirection:'row'}}>
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
					<Button 
						style={{width: '25%'}}
						contentStyle={{paddingTop: 3}}
						onPress={() => setFiltersVisible(!filtersVisible)}
					>Filters</Button>
				</View>
				}
				{renderedList}
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 20,
	},
	searchbar: {
		height: 35,
		width: '75%',
		marginVertical: 5
	},
});