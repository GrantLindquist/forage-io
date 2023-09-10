import { useState, useRef } from 'react';
import { View, ScrollView, KeyboardAvoidingView, StyleSheet } from "react-native";
import { Text, TextInput, Button, IconButton, Checkbox, ActivityIndicator, Snackbar } from 'react-native-paper';
import IngredientTag from './IngredientTag'
import BudgetSlider from './BudgetSlider';
import TagSearch from './TagSearch';
import generateRecipe from '../../services/gptCreateRecipeService';
import { useUser } from '@clerk/clerk-expo';
import TimeSlider from './TimeSlider';

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

	// State for tracking budget
	const budget = useRef(-1);
	// State for tracking time needed to create recipe
	const time = useRef(-1);

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
		if(budget.current != -1){
			budgetString = ' with a budget of under $' + budget.current;
		}

		// String for describing amount of time needed to make recipe
		let timeString = '';
		if(time.current != -1){
			let hours = Math.floor(time.current / 60);
			let minutes = time.current % 60;
			if(minutes == 0){
				timeString = ` that takes ${hours} hours to make`;
			}
			else if (hours == 0){
				timeString = ` that takes ${minutes} minutes to make`;
			}
			else{
				timeString = ` that takes ${hours} hours & ${minutes} minutes to make`;
			} 
		}

		// Create recipe description & tags
		let recipeDescription = '';
		let recipeTags = [];
		for(let filter of selectedFilters){
			recipeDescription = recipeDescription.concat(filter + " ");
			recipeTags.push(filter);
		}
		recipeDescription = recipeDescription.concat(`recipe${ingredientString}${budgetString}${timeString}`); 

		// DTO object for prompting GPT
		recipeDTO = {
			description: recipeDescription,
			tags: recipeTags
		}
		console.log(recipeDTO);

		// Set loading state to true
		setGeneratingRecipe(true);
		
		// Confirm recipe completion and change state back to false once recipe is complete
		let response = await generateRecipe(recipeDTO, user);
		setGeneratingRecipe(false);

		// Display snackbar depending on service response
		if(response.ok){
			setInfoSnackbarVisible(true);
			setSelectedIngredients([]);

			// Refreshes recipeMenu component so user can see updated recipe list
			props.refreshCreatedRecipes();
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
		setIngredientInput('');
	}

	// List of ingredients that user wants to add to recipe
	const ingredientTags = selectedIngredients.map((item) => {
		return(
			<IngredientTag key={item}>{item}</IngredientTag>
		)
	});

	return (
	<>
		<View style={{margin: 20}}>
			{!isGeneratingRecipe ?
			<>
				<ScrollView>
					<Text style={styles.categoryTitle}>Add some tags!</Text>
					<TagSearch updateSelectedTags={(tags) => setSelectedFilters(tags)} closeTagSearch={() => console.log('this is bad design. fix this.')}/>
									
					<Text style={styles.categoryTitle}>Add some ingredients!<Text style={styles.categorySubtitle}> (optional)</Text></Text>
					<View style={{flexDirection: 'row'}}>
						<TextInput style={styles.addIngredients} value={ingredientInput} mode='outlined' onChangeText={(val) => setIngredientInput(val)}/>
						<IconButton style={styles.addIngredientButton} size={20} mode={'outlined'} icon={'plus'} onPress={() => addIngredient(ingredientInput)}/>
					</View>

					<ScrollView style={{paddingVertical:8}} horizontal={true}>
						{ingredientTags}
					</ScrollView>

					<Text style={styles.categoryTitle}>Misc.<Text style={styles.categorySubtitle}> (optional)</Text></Text>
					<BudgetSlider handleValueChange={(val) => budget.current = val}/>
					<TimeSlider handleValueChange={(val) => time.current = val}/>
				
				</ScrollView>
				<Button onPress={handleCreateRecipe}>GENERATE RECIPE</Button>
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
	</>
	);	
};

const styles = StyleSheet.create({
	categoryTitle: {
		// fontFamily: 'Roboto',
		fontSize: 22,
		fontWeight: 700,
		marginVertical: 15
	},
	categorySubtitle: {
		// fontFamily: 'Roboto',
		fontSize: 12,
		fontWeight: 700,
		color: '#666666'
	},
	loadingScreen:{
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	addIngredients: {
		height: 35,
		width: '85%',
	},
	addIngredientButton: {
		borderRadius: '5',
		borderWidth: 0,
		backgroundColor: '#7A5DE1',
		marginBottom: 0,
		marginRight: 0,
		marginLeft: 10
	},
});