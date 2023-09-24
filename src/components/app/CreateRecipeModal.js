import { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image } from "react-native";
import { Text, TextInput, Button, IconButton, Checkbox, ActivityIndicator, Snackbar, ProgressBar, Portal, Dialog } from 'react-native-paper';
import IngredientTag from './IngredientTag'
import BudgetSlider from './BudgetSlider';
import TagSearch from './TagSearch';
import recipeService from '../../services/recipeService';
import { useUser } from '@clerk/clerk-expo';
import colors from '../../../colors.json';
import { useNavigation } from '@react-navigation/native';

// Contains UI components that must be rendered on the highest z-index (modals, dialogs, etc.)
export default function CreateRecipeModal(props) {

	// Gets user from Clerk
	const { user } = useUser(); 

	// Navigation object
	const navigation = useNavigation();

	// State that tracks whether or not recipe is being actively generated
	const [isGeneratingRecipe, setGeneratingRecipe] = useState(false);

	// State that tracks snackbar status
	const [infoSnackbarVisible, setInfoSnackbarVisible] = useState(false);
	const [errorSnackbarVisible, setErrorSnackbarVisible] = useState(false);

	// List states that track filter categories
	const [selectedFilters, setSelectedFilters] = useState([]);
	const [selectedIngredients, setSelectedIngredients] = useState([]);

	// State for tracking recipe charge progress bar
	const [recipeCharges, setRecipeCharges] = useState(10 - user.unsafeMetadata.recipeCharges.length);

	// State for tracking dialogs
	const [errorDialogVisible, setErrorDialogVisible] = useState(false);
	const [errorDialogContent, setErrorDialogContent] = useState("");

	// State for tracking active ingredient input
	const [ingredientInput, setIngredientInput] = useState('');

	// State for tracking budget
	const budget = useRef(-1);

	// State for tracking checkbox status
	const [isPublicChecked, setPublicChecked] = useState(true);

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

		// Create recipe description & tags
		let recipeDescription = '';
		let recipeTags = [];
		for(let filter of selectedFilters){
			recipeDescription = recipeDescription.concat(filter + " ");
			recipeTags.push(filter);
		}
		recipeDescription = recipeDescription.concat(`recipe${ingredientString}${budgetString}`); 

		// DTO object for prompting GPT
		let recipeDTO = {
			description: recipeDescription,
			tags: recipeTags,
			isPublic: isPublicChecked ? 1 : 0
		}
		console.log(recipeDTO);

		// Set loading state to true
		setGeneratingRecipe(true);

		// Add charge to user object
		var recipeCharges = user.unsafeMetadata.recipeCharges;
		recipeCharges.push(Date.now());
		await user.update({
			unsafeMetadata: { 
				savedRecipeIds: user.unsafeMetadata.savedRecipeIds,
				recipeCharges: recipeCharges,
			}
		});

		// Update charge in UI
		setRecipeCharges(10 - user.unsafeMetadata.recipeCharges.length);
		
		// Confirm recipe completion and change state back to false once recipe is complete
		const response = await recipeService.generateRecipe(recipeDTO, user);
		setGeneratingRecipe(false);

		// Display snackbar depending on service response
		if(response.ok){
			setInfoSnackbarVisible(true);
			setSelectedIngredients([]);

			// Refreshes recipeMenu component so user can see updated recipe list
			props.refreshCreatedRecipes();
		}
		else{
			// Display error UI components
			setErrorSnackbarVisible(true);
			setErrorDialogContent(response.message);

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

	return (
	<View style={{backgroundColor: colors['background1'], height: '100%'}}>
		<ProgressBar progress={recipeCharges/10} color={colors['pink']} />
		<View>
			<View style={{ flexDirection: 'row', marginHorizontal: 20, marginTop: 10}}>
				<Image 
					source={require('../../../assets/icons/charge.png')}
					style={{width: 18, height: 18}}
				/>
				<Text style={{color: 'grey'}}>{recipeCharges}/10  </Text>
				<Text style={{color: colors['pink'], fontWeight: 700}}>Get more charges</Text>
				<IconButton style={{marginLeft: 'auto', margin: 0}} icon={"information-outline"}></IconButton>
			</View>
			{!isGeneratingRecipe ?
			<View style={{margin: 20, marginTop: 0}}>
				<Text style={styles.categoryTitle}>Add some tags!</Text>
				<TagSearch updateSelectedTags={(tags) => setSelectedFilters(tags)} closeTagSearch={() => console.log('this is bad design. fix this.')}/>
									
				<Text style={styles.categoryTitle}>Add some ingredients!</Text>
				<View style={{flexDirection: 'row'}}>
					<TextInput style={styles.addIngredients} value={ingredientInput} mode='outlined' onChangeText={(val) => setIngredientInput(val)}/>
					<IconButton style={styles.addIngredientButton} size={20} mode={'outlined'} icon={'plus'} onPress={() => addIngredient(ingredientInput)}/>
				</View>

				<ScrollView style={{paddingVertical:8}} horizontal={true}>
					{ingredientTags}
				</ScrollView>

				<Text style={styles.categoryTitle}>More options</Text>
				<BudgetSlider handleValueChange={(val) => budget.current = val}/>

				<View style={{flexDirection: 'row'}}>
					<Text variant='bodyLarge'>Make recipe public</Text>
					<Checkbox.Android 
						color={colors['blue']}
						status={isPublicChecked ? "checked" : "unchecked"}
						onPress={() => {
							setPublicChecked(!isPublicChecked);
						}}
					/>
				</View>
				<Button disabled={recipeCharges == 0 ? true : false} textColor={colors['pink']} onPress={handleCreateRecipe}>GENERATE RECIPE</Button>
			</View>
			: <View style={styles.loadingScreen}>
				<ActivityIndicator size={"large"} animating={true}></ActivityIndicator>
			</View>}
		</View>	

		<Portal>
			{/* Info dialog */}
			<Dialog visible={false}>
				<Dialog.Title>Alert</Dialog.Title>
				<Dialog.Content>
					<Text variant="bodyMedium">Are you sure you want to delete your account?</Text>
					<Text variant="bodyMedium">This action is irreversible.</Text>
				</Dialog.Content>
				<Dialog.Actions>
					<Button>No way!</Button>
					<Button>Yes, delete my account.</Button>
				</Dialog.Actions>
			</Dialog>

			{/* Warning dialog */}
			<Dialog visible={errorDialogVisible} onDismiss={() => setErrorDialogVisible(false)}>
				<Dialog.Content>
					<Text variant="bodyMedium">{errorDialogContent}</Text>
				</Dialog.Content>
				<Dialog.Actions>
					<Button onPress={() => setErrorDialogVisible(false)}>OK</Button>
				</Dialog.Actions>
			</Dialog>
        </Portal>
		
		{/* Info snackbar */}
		<Snackbar
       		visible={infoSnackbarVisible}
        	onDismiss={() => setInfoSnackbarVisible(false)}
			action={{
          		label: 'View',
         	 	onPress: () => navigation.navigate('Main'),
        	}}>
        	Recipe was successfully generated!
      	</Snackbar>
		
		{/* Error snackbar */}
		<Snackbar
       		visible={errorSnackbarVisible}
        	onDismiss={() => setErrorSnackbarVisible(false)}
			action={{
          		label: 'Why?',
         	 	onPress: () => setErrorDialogVisible(true),
        	}}>
			Recipe failed to generate.
      	</Snackbar>
	</View>
	
	);	
};

const styles = StyleSheet.create({
	categoryTitle: {
		// fontFamily: 'Roboto',
		fontSize: 22,
		fontWeight: 700,
		marginBottom: 5,
		marginTop: 10
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
		backgroundColor: colors['green'],
		marginBottom: 0,
		marginRight: 0,
		marginLeft: 10
	},
});