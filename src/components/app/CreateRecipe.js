import { useState, useRef } from 'react';
import { View, ScrollView, KeyboardAvoidingView, StyleSheet } from "react-native";
import { Text, TextInput, Button, IconButton, Checkbox, ActivityIndicator } from 'react-native-paper';
import RecipeTag from './RecipeTag';
import IngredientTag from './IngredientTag'
import filters from '../../../filters.json'
import BudgetSlider from './BudgetSlider';
import FilterSelection from './FilterSelection';
import generateRecipe from '../../services/gptCreateRecipeService';
import { useUser } from '@clerk/clerk-expo';

// Contains UI components that must be rendered on the highest z-index (modals, dialogs, etc.)
export default function CreateRecipeModal(props) {

	// Gets user from Clerk
	const { user } = useUser(); 

	// State that tracks whether or not recipe is being actively generated
	const [isGeneratingRecipe, setGeneratingRecipe] = useState(false);

	// List states that track filter categories
	const [selectedMealTypeFilters, setSelectedMealTypeFilters] = useState([]);
	const [selectedCuisineFilters, setSelectedCuisineFilters] = useState([]);
	const [selectedDietFilters, setSelectedDietFilters] = useState([]);
	const [selectedFlavorFilters, setSelectedFlavorFilters] = useState([]);
	const [selectedIngredients, setSelectedIngredients] = useState([]);

	// State for tracking active ingredient input
	const [ingredientInput, setIngredientInput] = useState('');

	// States for tracking whether or not to apply a budget to a recipe
	const [budgetActive, setBudgetActive] = useState(false);
	const budget = useRef(-1);

	// Creates a recipe using user-specified filters
	const handleCreateRecipe = async() => {
		// String for describing ingredients for recipe
		let ingredientString = '';
		let i = 0;
		// List ingredients if ingredient list state is not empty
		if(selectedIngredients.length > 0){
			ingredientString = ' that contains';
			for(item of selectedIngredients){
				// Adds a comma if there are more ingredients remaining in list
				ingredientString = ingredientString + ' ' + item + (selectedIngredients.length == i+1 ? "" : ",");
				i++;
			}
		}

		// String for describing recipe budget
		let budgetString = '';
		if(budgetActive && budget.current != -1){
			budgetString = ' with a budget of under $' + budget.current;
		}

		// Create recipe description 
		let recipeDescription = `${selectedFlavorFilters[0] != undefined ? selectedFlavorFilters[0] + ' ' : ''}${selectedDietFilters[0] != undefined ? selectedDietFilters[0] + ' ' : ''}${selectedCuisineFilters[0] != undefined ? selectedCuisineFilters[0] + ' ' : ''}${selectedMealTypeFilters[0] != undefined ? selectedMealTypeFilters[0] + ' ' : ''}recipe${ingredientString}${budgetString}.`; 
		// Set loading state to true
		setGeneratingRecipe(true);
		// Confirm recipe completion and change state back to false once recipe is complete
		await generateRecipe(recipeDescription, user);
		setGeneratingRecipe(false)
		// Dismiss modal and refresh parent component
		props.dismissModal();
	}

	// Updates a filter using specified parameters
	const updateFilter = (filter, filterList, setFilter) => {
		let newFilterList = [];
		// Checks if filter already exists in list
		if (filterList.includes(filter)){
			// Removes item if already exists in list
			newFilterList = filterList.filter(item => item !== filter && item);
			setFilter(newFilterList);
		}
		else{
			// Append filter if doesn't already exist
			newFilterList = filterList;
			newFilterList.push(filter);
			setFilter(newFilterList);
		}
	}

	// Appends ingredient to ingredient list state
	const addIngredient = (value) => {
		// Adds ingredient to state and updates
		let newIngredientList = [];
		for(item of selectedIngredients){
			newIngredientList.push(item);
		}
		newIngredientList.push(value);
		setSelectedIngredients(newIngredientList);
	}

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
	const ingredientTags = selectedIngredients.map((item) => {
		return(
			<IngredientTag key={item}>{item}</IngredientTag>
		)
	});

	return (
	<KeyboardAvoidingView behavior='position'>
		<View>
			{!isGeneratingRecipe ?
			<>
				<ScrollView>
					<View style={{margin: 20}}>
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
						<Text variant='headlineSmall'>Ingredients</Text>
						<View style={{flexDirection: 'row'}}>
							<TextInput style={{height: 40, width: '85%'}} onChangeText={(val) => setIngredientInput(val)}/>
							<IconButton size={20} mode={'outlined'} icon={'plus'} onPress={() => addIngredient(ingredientInput)}/>
						</View>
						<ScrollView style={{paddingVertical:8}} horizontal={true}>
							{ingredientTags}
						</ScrollView>
						<View style={{flexDirection: 'row'}}>
							<Text variant='headlineSmall'>Budget</Text>
							<Checkbox.Android status={budgetActive ? 'checked' : 'unchecked'} onPress={() => setBudgetActive(!budgetActive)}/>
						</View>
						<BudgetSlider active={budgetActive} handleValueChange={(val) => budget.current = val}/>
					</View>
				</ScrollView>
				<Button style={{marginBottom: 20}} onPress={handleCreateRecipe}>Create</Button>
			</>
			: <View style={styles.loadingScreen}>
				<ActivityIndicator size={"large"} animating={true}></ActivityIndicator>
			</View>}
		</View>	
	</KeyboardAvoidingView>
	);	
};

const styles = StyleSheet.create({
	container: {
		margin: 30,
	},
	loadingScreen:{
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	}
});