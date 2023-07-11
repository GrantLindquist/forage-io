import { useState } from 'react';
import { StyleSheet, View, Pressable } from "react-native";
import { Searchbar, Button, ActivityIndicator } from "react-native-paper";
import RecipeCard from './RecipeCard';
import RecipeTag from './RecipeTag';
import FilterSelection from './FilterSelection';
import filters from '../../../filters.json'
import { useNavigation } from '@react-navigation/native';

// Allows user to key-search through a collection of items.
export default function RecipeList(props) {

	// State that provides navigation property
	const navigation = useNavigation();

	// State that handles filter display
	const [filtersVisible, setFiltersVisible] = useState(false);
	// State for tracking user search input
	const [searchQuery, setSearchQuery] = useState('');

	// Sub-component that displays a recipe tag for each available meal-type filter
	const mealTypeFilterTags = filters.mealTypeFilters.map((item) => {
		return(
			<RecipeTag key={item.title} handleSelect={()=>{updateFilter(item.title, selectedMealTypeFilters, setSelectedMealTypeFilters)}} >{item.title}</RecipeTag>
		)
	});
	// Sub-component that displays a recipe tag for each available cuisine filter
	const cuisineFilterTags = filters.cuisineFilters.map((item) => {
		return(
			<RecipeTag key={item.title} handleSelect={()=>{updateFilter(item.title, selectedCuisineFilters, setSelectedCuisineFilters)}} >{item.title}</RecipeTag>
		)
	});
	// Sub-component that displays a recipe tag for each available dietary filter
	const dietTags = filters.dietFilters.map((item) => {
		return(
			<RecipeTag key={item.title} handleSelect={()=>{updateFilter(item.title, selectedDietFilters, setSelectedDietFilters)}} >{item.title}</RecipeTag>
		)
	});
	// Sub-component that displays a recipe tag for each available meal-type filter
	const flavorTags = filters.flavorFilters.map((item) => {
		return(
			<RecipeTag key={item.title} handleSelect={()=>{updateFilter(item.title, selectedFlavorFilters, setSelectedFlavorFilters)}} >{item.title}</RecipeTag>
		)
	});

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
				<View>
					<FilterSelection title={"Meal Type"}>
						{mealTypeFilterTags}
					</FilterSelection>
					<FilterSelection title={"Cuisine"}>
						{cuisineFilterTags}
					</FilterSelection>
					<FilterSelection title={"Diet"}>
						{dietTags}
					</FilterSelection>
					<FilterSelection title={"Flavor"}>
						{flavorTags}
					</FilterSelection>
				</View> 
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