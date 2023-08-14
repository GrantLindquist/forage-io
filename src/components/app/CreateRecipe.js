import { useState, useRef } from 'react';
import { View, ScrollView, KeyboardAvoidingView, StyleSheet } from "react-native";
import { Text, TextInput, Button, IconButton, Checkbox, ActivityIndicator, Snackbar } from 'react-native-paper';
import IngredientTag from './IngredientTag'
import BudgetSlider from './BudgetSlider';
import TagSearch from './TagSearch';
import generateRecipe from '../../services/gptCreateRecipeService';
import { useUser } from '@clerk/clerk-expo';

// Contains UI components that must be rendered on the highest z-index (modals, dialogs, etc.)
export default function CreateRecipe(props) {

	// Gets user from Clerk
	const { user } = useUser(); 

	// State that tracks whether or not recipe is being actively generated
	const [isGeneratingRecipe, setGeneratingRecipe] = useState(false);

	// State that tracks snackbar status
	const [infoSnackbarVisible, setInfoSnackbarVisible] = useState(false);
	const [errorSnackbarVisible, setErrorSnackbarVisible] = useState(false);

	// List states that track filter categories
	const [selectedFilters, setSelectedFilters] = useState([]);
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
		let recipeDescription = '';
		for(let filter of selectedFilters){
			recipeDescription = recipeDescription.concat(filter + " ");
		}
		recipeDescription = recipeDescription.concat(`recipe${ingredientString}${budgetString}`); 
		console.log(recipeDescription);

		// Set loading state to true
		setGeneratingRecipe(true);
		
		// Confirm recipe completion and change state back to false once recipe is complete
		let response = await generateRecipe(recipeDescription, user);
		setGeneratingRecipe(false);

		// Display snackbar depending on service response
		if(response.ok){
			setInfoSnackbarVisible(true);
		}
		else{
			setErrorSnackbarVisible(true);
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

	const ingredientTags = selectedIngredients.map((item) => {
		return(
			<IngredientTag key={item}>{item}</IngredientTag>
		)
	});

	return (
	<KeyboardAvoidingView behavior='position'>
		<View style={{margin: 20}}>
			{!isGeneratingRecipe ?
			<>
				<ScrollView>
					<Text variant='headlineSmall'>Add Tags</Text>
					<TagSearch updateSelectedTags={(tags) => setSelectedFilters(tags)} closeTagSearch={() => console.log('this is bad design. fix this.')}/>
									
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
				</ScrollView>
				<Button style={{marginBottom: 20}} onPress={handleCreateRecipe}>Create</Button>
			</>
			: <View style={styles.loadingScreen}>
				<ActivityIndicator size={"large"} animating={true}></ActivityIndicator>
			</View>}
		</View>	
		
		{/* Info snackbar */}
		<Snackbar
       		visible={infoSnackbarVisible}
        	onDismiss={() => setInfoSnackbarVisible(false)}
			action={{
          		label: 'View',
         	 	onPress: () => {},
        	}}>
        	Recipe was successfully generated!
      	</Snackbar>
		
		{/* Error snackbar */}
		<Snackbar
       		visible={errorSnackbarVisible}
        	onDismiss={() => setErrorSnackbarVisible(false)}
			action={{
          		label: 'Why?',
         	 	onPress: () => {},
        	}}>
			Recipe failed to generate.
      	</Snackbar>
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