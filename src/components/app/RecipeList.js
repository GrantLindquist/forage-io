import { useState } from 'react';
import { StyleSheet, View, Pressable } from "react-native";
import { Searchbar, Button, Text } from "react-native-paper";
import RecipeCard from './RecipeCard';
import { useNavigation } from '@react-navigation/native';

// Allows user to key-search through a collection of items.
export default function RecipeList(props) {

	// State that provides navigation property
	const navigation = useNavigation();

	// State that handles filter display
	const [filtersVisible, setFiltersVisible] = useState(false);

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
			<View style={{flexDirection:'row'}}>
				<Searchbar
					style={props.filters ? styles.searchbarShort : styles.searchbarLong }
					inputStyle={{paddingLeft: 0}}
					showDivider={false}
					mode={'view'}
					onChangeText={query => setSearchQuery(query)}
					value={searchQuery}
				/>
				{/* If props.filters is true then display filter options */}
				{props.filters ? <Button 
					contentStyle={{paddingTop: 3}}
					onPress={() => setFiltersVisible(!filtersVisible)}
				>Filters</Button> : <></>}
			</View>
			{filtersVisible ? 
				<Text>filter stuff lmao</Text> 
			: <></>}
			{renderedList}
		</View>
	);
};

const styles = StyleSheet.create({
	searchbarShort: {
		height: 35,
		width: '75%',
		marginVertical: 5
	},
	searchbarLong: {
		height: 35,
		width: '100%',
		marginVertical: 5
	},
});