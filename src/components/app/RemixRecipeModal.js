import { useState, useRef } from 'react';
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, TextInput, Button, IconButton, Checkbox, ActivityIndicator, Snackbar } from 'react-native-paper';
import IngredientTag from './IngredientTag'
import BudgetSlider from './BudgetSlider';
import TagSearch from './TagSearch';
import recipeService from '../../services/recipeService';
import { useUser } from '@clerk/clerk-expo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RecipeTag from "./RecipeTag";
import colors from '../../../colors.json';
import { useNavigation, useRoute } from '@react-navigation/native';

// Contains UI components that must be rendered on the highest z-index (modals, dialogs, etc.)
export default function RemixRecipeModal(props) {

	// States for tracking parameters passed to route
	const route = useRoute();
	const { user } = useUser();
	const { recipe } = route.params;
	const navigation = useNavigation()

	// State that tracks whether or not recipe is being actively generated
	const [isGeneratingRecipe, setGeneratingRecipe] = useState(false);

	// State that tracks snackbar status
	const [infoSnackbarVisible, setInfoSnackbarVisible] = useState(false);
	const [errorSnackbarVisible, setErrorSnackbarVisible] = useState(false);

	// List states that track filter categories
	const [selectedFilters, setSelectedFilters] = useState(recipe.Tags);
	const [selectedIngredients, setSelectedIngredients] = useState([]);

	// State for tracking active ingredient input
	const [ingredientInput, setIngredientInput] = useState('');

	// State for tracking budget
	const budget = useRef(recipe.Budget);

	// State for tracking checkbox status
	const [isPublicChecked, setPublicChecked] = useState(true);

	// Creates a recipe based off of a different recipe
	const handleRemixRecipe = async() => {
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

		// Create recipe description & tags
		let recipeDescription = '';
		let recipeTags = [];
		for(let filter of selectedFilters){
			recipeDescription = recipeDescription.concat(filter + " ");
			recipeTags.push(filter);
		}
		recipeDescription = recipeDescription.concat(`recipe${ingredientString}${budgetString} that is similar to ${recipe.Title}`); 

		// DTO object for prompting GPT
		let recipeDTO = {
			description: recipeDescription,
			tags: recipeTags,
			isPublic: isPublicChecked ? 1 : 0,
			baseRecipeId: recipe.RecipeId
		}

		// Set loading state to true
		setGeneratingRecipe(true);
		
		// Confirm recipe completion and change state back to false once recipe is complete
		const response = await recipeService.generateRecipe(recipeDTO, user);
		setGeneratingRecipe(false);

		// Display snackbar depending on service response
		if(response.ok){
			setInfoSnackbarVisible(true);
			setSelectedIngredients([]);

			// Refreshes recipeMenu component so user can see updated recipe list
			props.refreshCreatedRecipes();
			navigation.navigate("Menu");
		}
		else{
			setErrorSnackbarVisible(true);

			// Clear ingredients state of faulty input
			setSelectedIngredients([]);
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

	// Sub-component that lists a tag component for each recipe tag
	const recipeTags = recipe.Tags.map((tag) => {
		return(
			<RecipeTag key={tag} title={tag} immutable={true} />
		)
	});

	return (
	<View style={{backgroundColor: colors['background2'], height: '100%'}}>
		<View style={styles.container}>
			{!isGeneratingRecipe ?
			<>
				<ScrollView>
					<Text variant="bodySmall"><MaterialCommunityIcons name="account" size={14} /> {recipe.CreatorUsername.toUpperCase()}</Text>
					<Text style={styles.recipeTitle}>{recipe.Title}</Text>
					<View style={{ marginTop: 15,  flexDirection: 'row'}}>
						<View style={{alignItems: 'center', width: '33%'}}>
							<Text variant="bodyLarge">Serves</Text>
							<Text variant="headlineLarge">{recipe.Servings}</Text>
						</View>
						<View style={{alignItems: 'center' , borderColor: '#7A5DE1', borderLeftWidth: '1', borderRightWidth: '1', width: '33%'}}>
							<Text variant="bodyLarge">Time</Text>
							<Text variant="headlineLarge">{recipe.CreationTime}</Text>
						</View>
						<View style={{alignItems: 'center', width: '33%'}}>
							<Text variant="bodyLarge">Budget</Text>
							<Text variant="headlineLarge">{recipe.Budget}</Text>
						</View>
					</View>
					<View style={{ marginTop: 15, flexWrap: 'wrap', flexDirection: 'row'}}>
						{recipeTags}
					</View>

					<Text style={styles.categoryTitle}>Remix recipe!</Text>
					<TagSearch updateSelectedTags={(tags) => setSelectedFilters(tags)} closeTagSearch={() => console.log('this is bad design. fix this.')}/>
				
					<View style={{flexDirection: 'row'}}>
						<TextInput style={styles.addIngredients} value={ingredientInput} mode='outlined' onChangeText={(val) => setIngredientInput(val)}/>
						<IconButton style={styles.addIngredientButton} size={20} mode={'outlined'} icon={'plus'} onPress={() => addIngredient(ingredientInput)}/>
					</View>

					<ScrollView style={{paddingVertical:8}} horizontal={true}>
						{ingredientTags}
					</ScrollView>

					<BudgetSlider handleValueChange={(val) => budget.current = val}/>

					<View style={{flexDirection: 'row'}}>
						<Text variant='bodyLarge'>Make recipe public</Text>
						<Checkbox.Android 
							status={isPublicChecked ? "checked" : "unchecked"}
							onPress={() => {
								setPublicChecked(!isPublicChecked);
							}}
						/>
					</View>
				</ScrollView>
				<Button onPress={handleRemixRecipe}>REMIX RECIPE</Button>
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
	</View>
	);	
};

const styles = StyleSheet.create({
	container: {
		margin: 20,
	},
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
	recipeTitle: {
		// fontFamily: 'Roboto',
		fontSize: 36,
		fontWeight: 700
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