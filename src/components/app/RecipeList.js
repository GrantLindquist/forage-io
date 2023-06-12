import { useState } from 'react';
import { StyleSheet, View, Pressable } from "react-native";
import { Searchbar } from "react-native-paper";
import RecipeCard from './RecipeCard';
import { useNavigation } from '@react-navigation/native';

// Allows user to key-search through a collection of items.
export default function RecipeList(props) {

	// State that provides navigation property
	const navigation = useNavigation();

	// State for tracking items in recipe list - if list is undefined default to empty array
	const [recipes, setRecipes] = useState(props.recipes != undefined ? props.recipes : []);

	// State for tracking user search input
	const [searchQuery, setSearchQuery] = useState('');

	// Maps recipes into RecipeCard components
	const renderedList = recipes.map((recipe) => {
		if(recipe.title.toLowerCase().includes(searchQuery.toLowerCase())){
			return (
				<Pressable key={recipe.id} onPress={() => navigation.navigate('Recipe', {
						recipe: recipe
					})}>
					<RecipeCard recipe={recipe}/>
				</Pressable>
			)
		}
	});

	return (
		<View>
			<Searchbar
				style={styles.searchbar}
				showDivider={false}
				mode={'view'}
				onChangeText={query => setSearchQuery(query)}
				value={searchQuery}
			/>
			{renderedList}
		</View>
	);
};

const styles = StyleSheet.create({
	searchbar: {
		height: 35,
		marginVertical: 5
	},
});