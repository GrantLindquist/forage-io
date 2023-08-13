import { useState } from 'react';
import { StyleSheet, View, Pressable } from "react-native";
import { Searchbar, Button } from "react-native-paper";
import RecipeCard from './RecipeCard';
import { useNavigation } from '@react-navigation/native';
import TagSearch from './TagSearch';

// Allows user to key-search through a collection of items.
export default function RecipeList(props) {

	// State that provides navigation property
	const navigation = useNavigation();

	// State that handles filter display
	const [filtersVisible, setFiltersVisible] = useState(false);
	// State for tracking user search input
	const [searchQuery, setSearchQuery] = useState('');

	// Maps recipes into RecipeCard components
	const renderedList = props.recipes.map((recipe) => {
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

	return (
		<View>
			{filtersVisible ? 
				<TagSearch closeTagSearch={() => setFiltersVisible(false)}/>
			: 
			<View style={{flexDirection:'row'}}>
				<Searchbar
					style={props.filters ? styles.searchbarShort : styles.searchbarLong }
					placeholder={"search recipes"}
					placeholderTextColor={"grey"}
					inputStyle={{paddingLeft: 0, alignSelf: 'center'}}
					showDivider={false}
					mode={'view'}
					onChangeText={query => setSearchQuery(query)}
					value={searchQuery}
				/>
				{/* If props.filters is true then display filter options */}
				{props.filters ? <Button 
					style={{width: '25%'}}
					contentStyle={{paddingTop: 3}}
					onPress={() => setFiltersVisible(!filtersVisible)}
				>Filters</Button> : <></>}
			</View>
			}
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